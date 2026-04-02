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

function recommendPackage(websiteScore, websiteIssues) {
  if (!websiteScore || websiteScore === 0) {
    return {
      package: "Štandard",
      price: 800,
      recommendation: "New website creation needed",
    };
  }

  if (websiteScore < 40) {
    return {
      package: "Firemný",
      price: 1200,
      recommendation: "Complete redesign + premium features",
    };
  }

  if (websiteScore < 70) {
    return {
      package: "Štandard",
      price: 800,
      recommendation: "Modern redesign with improved UX",
    };
  }

  return {
    package: "Štandard (Management upgrade)",
    price: 60,
    period: "monthly",
    recommendation: "Maintenance and ongoing optimization",
  };
}

async function generateProposal(business) {
  const { name, category, websiteScore, websiteIssues } = business;
  const recommendation = recommendPackage(websiteScore, websiteIssues);

  const issuesText =
    websiteIssues && websiteIssues.length
      ? websiteIssues.join("\n- ")
      : "Outdated design, poor mobile responsiveness, missing modern features";

  const prompt = `Create a personalized business proposal in Slovak for "${name}" (${category}).

Website Assessment:
- Current score: ${websiteScore || 0}/100
- Issues:
  - ${issuesText}

Our Packages:
- Tvorba (Creation):
  - Starter: €450 (simple 1-page site)
  - Štandard: €800 (multi-page, professional)
  - Firemný: €1200+ (premium features, advanced design)
- Sprava (Management):
  - Základná: €45/mesiac
  - Štandard: €60/mesiac
- Doplnky (Extras):
  - Podstránky: €50
  - SEO audit: €100
  - Branding: €150

Recommended for this client: ${recommendation.package} - €${recommendation.price} ${recommendation.period ? `/${recommendation.period}` : ""}

Create a professional proposal that:
1. Opens with personalized greeting
2. References their specific situation and issues
3. Recommends the best package with clear justification
4. Lists included services
5. Shows total estimate with optional extras
6. Includes CTA to contact
7. Closes professionally

Use professional but friendly tone. Keep under 400 words.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  let proposal = "";
  for (const block of response.content) {
    if (block.type === "text") {
      proposal = block.text;
    }
  }

  const totalEstimate = recommendation.price;

  return {
    recommendation: recommendation.package,
    totalEstimate,
    proposal,
  };
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

    const { recommendation, totalEstimate, proposal } =
      await generateProposal(business);

    res.status(200).json({
      success: true,
      businessName: business.name,
      recommendedPackage: recommendation,
      totalEstimate,
      proposal,
    });
  } catch (error) {
    console.error("Proposal error:", error);
    res.status(500).json({
      error: "Failed to generate proposal",
      message: error.message,
    });
  }
}
