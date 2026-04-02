import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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

async function generateWebsite(business) {
  const { name, category, address, phone, websiteIssues } = business;
  const issuesText =
    websiteIssues && websiteIssues.length
      ? `\n\nAddress these issues: ${websiteIssues.join(", ")}`
      : "";

  const prompt = `Generate a complete, single-file HTML website for a ${category} business in Slovakia.

Business details:
- Name: ${name}
- Category: ${category}
- Address: ${address}
- Phone: ${phone}
${issuesText}

Requirements:
1. Complete, valid HTML5 with inline CSS and JavaScript
2. Mobile-responsive design (mobile-first approach)
3. Modern 2025 design aesthetic: clean, professional, contemporary
4. Dark or neutral color scheme with accent colors
5. All text in Slovak language
6. Sections: Hero/Header, About, Services, Contact, Footer
7. Contact form with phone and email options
8. No external dependencies except Google Fonts via CDN
9. Smooth scroll animations and transitions
10. Images use placeholder SVGs or data URIs

Make it production-ready, fast-loading, and optimized for mobile. Include schema.org JSON-LD for local business.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8000,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  let html = "";
  for (const block of response.content) {
    if (block.type === "text") {
      html = block.text;
    }
  }

  const codeMatch = html.match(/```html\n?([\s\S]*?)\n?```/);
  if (codeMatch) {
    html = codeMatch[1];
  }

  const sections = [
    "Navigation",
    "Hero Section",
    "About",
    "Services",
    "Contact",
    "Footer",
  ];

  return { html, sections };
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
    const { business } = req.body;

    if (!business || !business.name) {
      res.status(400).json({
        error: "Missing required field: business.name",
      });
      return;
    }

    const { html, sections } = await generateWebsite(business);

    res.status(200).json({
      success: true,
      html,
      sections,
      businessName: business.name,
    });
  } catch (error) {
    console.error("Generate error:", error);
    res.status(500).json({
      error: "Failed to generate website",
      message: error.message,
    });
  }
}
