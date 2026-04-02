/**
 * API Configuration and Constants
 */

export const CONFIG = {
  // AI Models
  CLAUDE_MODEL: "claude-3-5-sonnet-20241022",
  GEMINI_MODEL: "gemini-2.0-flash",

  // API Limits
  MAX_SCAN_RESULTS: 15,
  MAX_EMAIL_LENGTH: 150,
  MAX_PROPOSAL_LENGTH: 400,

  // Timeouts (ms)
  SCAN_TIMEOUT: 30000,
  GENERATE_TIMEOUT: 45000,
  EMAIL_TIMEOUT: 10000,
  PROPOSAL_TIMEOUT: 15000,
  DB_TIMEOUT: 5000,

  // Pricing
  PACKAGES: {
    creation: {
      starter: { name: "Starter", price: 450 },
      standard: { name: "Štandard", price: 800 },
      premium: { name: "Firemný", price: 1200 },
    },
    management: {
      basic: { name: "Základná", price: 45, period: "monthly" },
      standard: { name: "Štandard", price: 60, period: "monthly" },
    },
    extras: {
      subpages: { name: "Podstránky", price: 50 },
      seoAudit: { name: "SEO audit", price: 100 },
      branding: { name: "Branding", price: 150 },
    },
  },

  // URLs
  PRICING_PAGE: "https://darkmaster9452.github.io/Dark-s-Imperium",
  PORTFOLIO_PAGE: "https://darkmaster9452.github.io/Dark-s-Imperium",

  // Website Scoring Thresholds
  WEBSITE_SCORE_THRESHOLDS: {
    NONE: 0,
    POOR_MIN: 1,
    POOR_MAX: 30,
    MODERATE_MIN: 31,
    MODERATE_MAX: 60,
    GOOD_MIN: 61,
    GOOD_MAX: 80,
    EXCELLENT_MIN: 81,
    EXCELLENT_MAX: 100,
  },

  // Slovak Language Markers
  SLOVAK_AREAS: [
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
  ],

  // Lead Statuses
  LEAD_STATUSES: ["new", "contacted", "proposal_sent", "deal", "rejected", "follow_up"],

  // Default Categories for Search
  DEFAULT_CATEGORIES: [
    "Construction",
    "Plumbing",
    "Electrical",
    "Retail",
    "Restaurant",
    "Services",
    "Healthcare",
    "Fitness",
    "Real Estate",
    "Automotive",
  ],

  // Error Messages
  ERRORS: {
    MISSING_API_KEY: "Missing required API key",
    INVALID_REQUEST: "Invalid request format",
    DATABASE_ERROR: "Database operation failed",
    TIMEOUT: "Request timeout - operation took too long",
    RATE_LIMITED: "Rate limit exceeded",
    SERVICE_ERROR: "AI service error",
  },
};

export const WEBSITE_QUALITY_LABELS = {
  0: "no website",
  10: "extremely poor",
  35: "poor",
  65: "decent",
  85: "professional",
  100: "excellent",
};

export const EMAIL_TONES = {
  friendly: "friendly, warm, and conversational",
  professional: "professional and direct",
  casual: "casual and approachable",
};

export const PACKAGE_RECOMMENDATIONS = {
  noWebsite: {
    package: "Štandard",
    reason: "New website creation needed",
  },
  poorWebsite: {
    package: "Firemný",
    reason: "Complete redesign with premium features",
  },
  decentWebsite: {
    package: "Štandard",
    reason: "Modern redesign with improved UX",
  },
  goodWebsite: {
    package: "Management",
    reason: "Ongoing maintenance and optimization",
  },
};
