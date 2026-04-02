# WebLead Scout Backend API

A full-stack serverless API for discovering local businesses with poor/missing websites and generating personalized outreach, proposals, and website solutions.

**Deployed on:** Vercel Serverless Functions
**Database:** Neon PostgreSQL
**AI Services:** Claude (Anthropic), Gemini (Google)

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Copy `.env.example` to `.env.local` and fill in your API keys:

```bash
cp .env.example .env.local
```

Required:
- `ANTHROPIC_API_KEY` — from https://console.anthropic.com
- `GEMINI_API_KEY` — from https://aistudio.google.com
- `DATABASE_URL` — Neon PostgreSQL connection string

### 3. Run locally
```bash
npm run dev
```

The API will be available at `http://localhost:3000/api/*`.

### 4. Deploy to Vercel
```bash
npm run deploy
```

---

## API Endpoints

### POST `/api/scan`
**Find leads in a geographic area**

Request:
```json
{
  "area": "Bratislava",
  "categories": ["Construction", "Plumbing"]
}
```

Response:
```json
{
  "success": true,
  "count": 8,
  "area": "Bratislava",
  "leads": [
    {
      "name": "Stavebne Prace Baranek",
      "category": "Construction",
      "address": "Rajecká dolina 45",
      "phone": "+421 XXX XXX XXX",
      "website": null,
      "hasWebsite": false,
      "websiteScore": 0,
      "websiteIssues": [],
      "quality": "missing"
    }
  ]
}
```

**Features:**
- Dual AI search: Claude (web search tool) + Gemini (validation/enrichment)
- Automatic Slovak detection for Slovak addresses
- Website quality scoring (0-100)
- Issue identification


### POST `/api/generate`
**Generate a complete HTML website for a business**

Request:
```json
{
  "business": {
    "name": "Michal Baránek Stavebne Prace",
    "category": "Construction",
    "address": "Rajecká dolina 45",
    "phone": "+421 123 456 789",
    "websiteIssues": ["no website", "needs modern design"]
  }
}
```

Response:
```json
{
  "success": true,
  "businessName": "Michal Baránek Stavebne Prace",
  "html": "<!DOCTYPE html>...",
  "sections": ["Navigation", "Hero Section", "About", "Services", "Contact", "Footer"]
}
```

**Features:**
- Complete single-file HTML5 website
- Modern 2025 design, mobile-responsive
- All text in Slovak
- Inline CSS and JavaScript (no build needed)
- SVG placeholders, schema.org JSON-LD
- Production-ready


### POST `/api/email`
**Draft a personalized cold outreach email**

Request:
```json
{
  "business": {
    "name": "Michal Baránek Stavebne Prace",
    "category": "Construction",
    "website": null,
    "websiteScore": 0,
    "websiteIssues": ["no website"]
  },
  "tone": "friendly"
}
```

Response:
```json
{
  "success": true,
  "businessName": "Michal Baránek Stavebne Prace",
  "subject": "Moderná webová stránka pre vašu firmu",
  "body": "Ahoj Michal,\n\nVidím, že Stavebne Prace..."
}
```

**Features:**
- Slovak language
- Under 150 words
- Personalized to business situation
- Links to pricing page
- Multiple tone options: friendly, professional, casual


### POST `/api/proposal`
**Generate a custom pricing proposal**

Request:
```json
{
  "business": {
    "name": "Michal Baránek Stavebne Prace",
    "category": "Construction",
    "websiteScore": 0,
    "websiteIssues": ["no website"]
  }
}
```

Response:
```json
{
  "success": true,
  "businessName": "Michal Baránek Stavebne Prace",
  "recommendedPackage": "Štandard",
  "totalEstimate": 800,
  "proposal": "Vážený Pán Baránek,\n\nBased on your business assessment..."
}
```

**Packages referenced:**
- **Tvorba (Creation)**
  - Starter: €450
  - Štandard: €800
  - Firemný: €1200+
- **Sprava (Management)**
  - Základná: €45/mesiac
  - Štandard: €60/mesiac
- **Extras**
  - Podstránky: €50
  - SEO audit: €100
  - Branding: €150


### GET `/api/leads`
**List all leads (with optional area filter)**

Query params:
- `area` (optional) — filter by area

Response:
```json
{
  "success": true,
  "count": 42,
  "leads": [
    {
      "id": 1,
      "name": "Michal Baránek Stavebne Prace",
      "category": "Construction",
      "address": "Rajecká dolina 45",
      "phone": "+421 XXX XXX XXX",
      "website": null,
      "has_website": false,
      "website_score": 0,
      "website_issues": [],
      "quality": "missing",
      "area": "Bratislava",
      "status": "new",
      "email_sent": false,
      "proposal_sent": false,
      "created_at": "2025-03-30T12:00:00Z",
      "updated_at": "2025-03-30T12:00:00Z"
    }
  ]
}
```

### POST `/api/leads`
**Create a new lead**

Request:
```json
{
  "name": "New Business Ltd",
  "category": "Retail",
  "address": "123 Main St",
  "phone": "+421 XXX XXX XXX",
  "website": null,
  "has_website": false,
  "website_score": 0,
  "website_issues": [],
  "area": "Bratislava"
}
```

Response:
```json
{
  "success": true,
  "lead": {
    "id": 43,
    "name": "New Business Ltd",
    "created_at": "2025-03-30T12:00:00Z"
  }
}
```

### PATCH `/api/leads?id=<id>`
**Update lead status**

Query params:
- `id` (required) — lead ID

Request body (all optional):
```json
{
  "status": "contacted",
  "email_sent": true,
  "proposal_sent": false,
  "notes": "Waiting for response"
}
```

Response:
```json
{
  "success": true,
  "lead": {
    "id": 1,
    "status": "contacted",
    "email_sent": true,
    "updated_at": "2025-03-30T13:00:00Z"
  }
}
```

### GET `/api/health`
**Health check endpoint**

Response:
```json
{
  "status": "ok",
  "service": "weblead-scout-backend",
  "timestamp": "2025-03-30T12:00:00Z",
  "version": "1.0.0"
}
```

---

## Database Schema

The PostgreSQL database (Neon) contains a single `leads` table:

```sql
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  address TEXT,
  phone VARCHAR(20),
  website VARCHAR(255),
  has_website BOOLEAN DEFAULT FALSE,
  website_score INTEGER DEFAULT 0,
  website_issues TEXT[] DEFAULT '{}',
  quality VARCHAR(50),
  area VARCHAR(100),
  status VARCHAR(50) DEFAULT 'new',
  email_sent BOOLEAN DEFAULT FALSE,
  proposal_sent BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Status values:** `new`, `contacted`, `proposal_sent`, `deal`, `rejected`, `follow_up`

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `ANTHROPIC_API_KEY` | Claude API key (web search) | `sk-ant-...` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSy...` |
| `DATABASE_URL` | Neon PostgreSQL connection | `postgresql://...` |
| `NODE_ENV` | Environment | `production` |

---

## Error Handling

All endpoints return errors in this format:

```json
{
  "error": "Human-readable error message",
  "message": "Optional additional details"
}
```

Common HTTP status codes:
- `200` — Success
- `201` — Created
- `400` — Bad request (missing fields, validation error)
- `405` — Method not allowed
- `500` — Server error

---

## CORS

All endpoints have CORS enabled for `*` origins. Preflight requests (OPTIONS) are supported.

---

## Performance Notes

- **`/api/scan`** — Takes 10-30 seconds (Claude web search + Gemini enrichment)
- **`/api/generate`** — Takes 15-45 seconds (full HTML generation)
- **`/api/email`** — Takes 3-10 seconds
- **`/api/proposal`** — Takes 5-15 seconds
- **Database operations** — <100ms (local queries)

For long operations, consider polling or webhooks.

---

## Rate Limiting

No built-in rate limiting. Recommend:
- Vercel's default function limits (60-second timeout)
- External rate limiting middleware (e.g., Vercel Edge Middleware)
- API key validation before processing

---

## Development

### Local testing with curl

```bash
# Scan for leads
curl -X POST http://localhost:3000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"area": "Bratislava", "categories": ["Construction"]}'

# Generate website
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "business": {
      "name": "Test Co",
      "category": "Retail",
      "address": "123 St",
      "phone": "+421 123 456 789",
      "websiteIssues": []
    }
  }'

# Draft email
curl -X POST http://localhost:3000/api/email \
  -H "Content-Type: application/json" \
  -d '{
    "business": {
      "name": "Test Co",
      "category": "Retail",
      "website": null,
      "websiteScore": 0
    },
    "tone": "friendly"
  }'

# Health check
curl http://localhost:3000/api/health
```

---

## File Structure

```
/
  api/
    scan.js        — Lead discovery (Claude + Gemini)
    generate.js    — Website HTML generation (Claude)
    email.js       — Outreach email drafting (Gemini)
    proposal.js    — Pricing proposal (Claude)
    leads.js       — Lead CRUD + database (Neon)
    health.js      — Health check
    utils.js       — Shared utilities
  package.json
  vercel.json
  .env.example
  README.md
```

---

## Deployment Checklist

- [ ] Set environment variables in Vercel dashboard
- [ ] Test all endpoints with sample data
- [ ] Verify database connection (Neon)
- [ ] Check API key limits and billing
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Configure CORS if needed (currently `*`)
- [ ] Test long-running endpoints with timeouts
- [ ] Set up rate limiting if needed

---

## Support & Issues

For questions or bugs:
1. Check logs in Vercel dashboard
2. Review environment variable setup
3. Verify API keys are valid
4. Check database connection string
5. Review error messages in response

---

**Last updated:** March 30, 2025
**Version:** 1.0.0
