import { GoogleGenerativeAI } from "@google/generative-ai";

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

async function draftOutreachEmail(business, tone = "friendly") {
  const { name, category, website, websiteScore, websiteIssues } = business;

  let issuesContext = "";
  if (!website) {
    issuesContext =
      "The business currently has no website - this is a key opportunity.";
  } else if (websiteScore && websiteScore < 50) {
    issuesContext = `Their current website (${website}) has issues: ${
      websiteIssues?.length ? websiteIssues.join(", ") : "outdated design"
    }. This is a modernization opportunity.`;
  } else {
    issuesContext = `Their website (${website}) could be improved with modernization and better optimization.`;
  }

  const toneMap = {
    friendly: "friendly, warm, and conversational",
    professional: "professional and direct",
    casual: "casual and approachable",
  };

  const toneDesc = toneMap[tone] || toneMap.friendly;

  const prompt = `Draft a cold outreach email in Slovak for a ${category} business called "${name}".

Context: ${issuesContext}

Requirements:
1. Tone: ${toneDesc}
2. Length: under 150 words
3. Personalized reference to their business/situation
4. Quick problem statement
5. Brief solution mention (modern website)
6. Link to pricing: https://darkmaster9452.github.io/Dark-s-Imperium
7. Clear CTA: meeting/call
8. Sign-off from Martin (web developer)

Return ONLY valid JSON with exactly two fields:
- "subject": email subject line
- "body": email body text

No markdown, no code blocks, just pure JSON.`;

  const model = gemini.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error("Failed to parse email response:", e);

    return {
      subject: `Moderná webová stránka pre ${name}`,
      body: `Ahoj,\n\nSom Martin, tvorca webových stránok. Vidím, že ${name} by mohla mať modernú webovú stránku.\n\nNajdenis ma na https://darkmaster9452.github.io/Dark-s-Imperium\n\nChcel by si sa stretnúť?\n\nMartin`,
    };
  }
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
    const { business, tone } = req.body;

    if (!business || !business.name) {
      res.status(400).json({
        error: "Missing required field: business.name",
      });
      return;
    }

    const { subject, body } = await draftOutreachEmail(business, tone);

    res.status(200).json({
      success: true,
      subject,
      body,
      businessName: business.name,
    });
  } catch (error) {
    console.error("Email draft error:", error);
    res.status(500).json({
      error: "Failed to draft email",
      message: error.message,
    });
  }
}
