/**
 * Utility functions for WebLead Scout API
 */

export function setCorsHeaders(res) {
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

export function handleCors(req, res) {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true;
  }
  return false;
}

export function validateMethod(req, res, allowedMethods) {
  if (!allowedMethods.includes(req.method)) {
    res.status(405).json({ error: `Method ${req.method} not allowed` });
    return false;
  }
  return true;
}

export function sendError(res, statusCode, error, message = null) {
  res.status(statusCode).json({
    error,
    message: message || error,
  });
}

export function sendSuccess(res, statusCode, data) {
  res.status(statusCode).json({
    success: true,
    ...data,
  });
}

export function isSlowakArea(area) {
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
    "rajecká",
    "rajec",
    "dolina",
    "bardejov",
    "stará ľubovňa",
  ];
  const lowerArea = area.toLowerCase();
  return slovakAreas.some((sk) => lowerArea.includes(sk));
}

export function scoreWebsite(hasWebsite, quality) {
  if (!hasWebsite) return 0;

  const scoreMap = {
    modern: 85,
    professional: 85,
    decent: 65,
    functional: 65,
    poor: 35,
    outdated: 35,
    missing: 0,
  };

  return scoreMap[quality] || 10;
}

export function extractJsonFromText(text) {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error("JSON extraction failed:", e);
  }
  return null;
}

export function getMarketingPackages() {
  return {
    creation: {
      starter: { name: "Starter", price: 450, description: "Simple 1-page site" },
      standard: {
        name: "Štandard",
        price: 800,
        description: "Multi-page professional website",
      },
      premium: {
        name: "Firemný",
        price: 1200,
        description: "Premium features, advanced design",
      },
    },
    management: {
      basic: {
        name: "Základná",
        price: 45,
        period: "monthly",
        description: "Basic maintenance",
      },
      standard: {
        name: "Štandard",
        price: 60,
        period: "monthly",
        description: "Standard maintenance and optimization",
      },
    },
    extras: {
      subpages: { name: "Podstránky", price: 50 },
      seoAudit: { name: "SEO audit", price: 100 },
      branding: { name: "Branding", price: 150 },
    },
  };
}

export function generateSlovakLocalBusinessSchema(business) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: `${business.category} - ${business.name}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address || "",
      addressCountry: "SK",
    },
    telephone: business.phone || "",
    url: business.website || "",
  };
}

export const PRICING_PAGE_URL =
  "https://darkmaster9452.github.io/Dark-s-Imperium";
