import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
}

function getSearchLanguage(area) {
  const slovakAreas = [
    "slovensko",
    "slovakia",
    "bratislava",
    "košice",
    "banská bystrica",
    "žilina",
    "prešov",
    "nitra",
    "trnava",
    "zvolen",
    "trenčín",
    "liptovský",
    "košická",
    "trenčianska",
    "banskobystrickej",
    "rajec",
    "považská",
    "martin",
    "ružomberok",
    "poprad",
    "spišská",
    "dolný kubín",
    "čadca",
    "kysucké",
    "rajecká",
  ];
  const lowerArea = area.toLowerCase();
  return slovakAreas.some((sk) => lowerArea.includes(sk))
    ? "slovak"
    : "english";
}

function scoreWebsite(hasWebsite, quality) {
  if (!hasWebsite) return 0;
  if (quality === "modern" || quality === "professional") return 85;
  if (quality === "decent" || quality === "functional") return 65;
  if (quality === "poor" || quality === "outdated") return 35;
  return 10;
}

async function searchWithClaude(area, categories, language) {
  const categoryStr = categories?.length
    ? ` focusing on: ${categories.join(", ")}`
    : "";
  const languageHint =
    language === "slovak"
      ? "Respond in Slovak. Search for businesses in Slovakia."
      : "";

  const prompt = `Find 5-10 local businesses in the ${area} area${categoryStr}. ${languageHint}

For each business, provide:
1. Business name
2. Category/industry
3. Address
4. Phone number
5. Website URL (or "none" if unavailable)
6. Brief assessment of website quality (if exists): modern, decent, poor, or missing

Format as JSON array.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    tools: [
      {
        type: "web_search_20250305",
        name: "web_search",
        max_uses: 5,
      },
    ],
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  let searchResults = [];
  for (const block of response.content) {
    if (block.type === "text") {
      try {
        const jsonMatch = block.text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          searchResults = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error("Failed to parse Claude response:", e);
      }
    }
  }

  return searchResults;
}

async function enrichWithGemini(businesses) {
  const model = gemini.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const businessesText = businesses
    .map(
      (b) =>
        `${b.name} (${b.category}) - Website: ${b.website || "none"}`
    )
    .join("\n");

  const prompt = `Validate and enrich these business listings. For each, verify the information is realistic and provide specific website issues if applicable. Return as JSON array with same structure plus websiteIssues array and hasWebsite boolean.

${businessesText}`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  try {
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error("Failed to parse Gemini response:", e);
  }

  return businesses;
}

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { area, categories } = req.body;

    if (!area) {
      res.status(400).json({ error: "Missing required field: area" });
      return;
    }

    const language = getSearchLanguage(area);

    let businesses = await searchWithClaude(area, categories, language);

    const enriched = await enrichWithGemini(businesses);

    const leads = enriched.map((b) => ({
      name: b.name || "Unknown",
      category: b.category || "Uncategorized",
      address: b.address || "",
      phone: b.phone || "",
      website: b.website === "none" ? null : b.website || null,
      hasWebsite: b.website && b.website !== "none" ? true : false,
      websiteScore:
        b.websiteScore !== undefined
          ? b.websiteScore
          : scoreWebsite(
              b.hasWebsite || (b.website && b.website !== "none"),
              b.quality
            ),
      websiteIssues: b.websiteIssues || [],
      quality: b.quality || (b.website && b.website !== "none" ? "unknown" : "missing"),
    }));

    res.status(200).json({
      success: true,
      count: leads.length,
      area,
      leads,
    });
  } catch (error) {
    console.error("Scan error:", error);
    res.status(500).json({
      error: "Failed to scan for leads",
      message: error.message,
    });
  }
}
