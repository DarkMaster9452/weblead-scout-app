# WebLead Scout Backend — Complete File Index

**Total Lines:** 2,948 | **API Endpoints:** 6 | **Status:** Production Ready

---

## Quick Navigation

### Getting Started
1. **[README.md](./README.md)** — Start here. Overview, endpoints, quick start guide
2. **[DEPLOYMENT.md](./DEPLOYMENT.md)** — Deploy to Vercel in 15 minutes
3. **[API_EXAMPLES.md](./API_EXAMPLES.md)** — Test all endpoints with cURL examples

### For Developers
4. **[BACKEND_SUMMARY.md](./BACKEND_SUMMARY.md)** — Technical deep dive, architecture decisions
5. **[/api/config.js](./api/config.js)** — All configuration constants and pricing
6. **[package.json](./package.json)** — Dependencies and scripts

---

## File Structure & Contents

### Core API Endpoints

#### 1. **`/api/scan.js`** (198 lines)
**Lead discovery endpoint**
- Dual AI search: Claude (web_search) + Gemini (validation)
- Finds local businesses with poor/missing websites
- POST `/api/scan`
- Input: `{ area: string, categories?: string[] }`
- Output: Array of leads with website scores
- Speed: 10-30 seconds

**Key Features:**
- Automatic Slovak language detection
- Website quality scoring (0-100)
- Identifies specific website issues
- Returns up to 15 results

#### 2. **`/api/generate.js`** (122 lines)
**Website HTML generator**
- Creates complete single-file HTML websites
- POST `/api/generate`
- Input: Business details (name, category, address, phone)
- Output: Complete HTML5 + sections list
- Speed: 15-45 seconds

**Generated Websites Include:**
- Mobile-responsive design
- Modern 2025 aesthetic
- All text in Slovak
- Schema.org markup
- Contact forms & service sections
- No external dependencies (except Google Fonts)

#### 3. **`/api/email.js`** (120 lines)
**Outreach email drafter**
- Creates personalized cold emails in Slovak
- POST `/api/email`
- Input: Business data + tone option
- Output: `{ subject: string, body: string }`
- Speed: 3-10 seconds

**Email Features:**
- Personalized to business situation
- References specific website issues
- Under 150 words (concise)
- Multiple tone options: friendly, professional, casual
- Links to pricing page
- Professional signature

#### 4. **`/api/proposal.js`** (161 lines)
**Pricing proposal generator**
- Creates custom proposals with package recommendations
- POST `/api/proposal`
- Input: Business data with website score
- Output: Recommended package + estimate + proposal text
- Speed: 5-15 seconds

**Packages Referenced:**
- Tvorba (Creation): Starter €450, Štandard €800, Firemný €1200+
- Sprava (Management): Základná €45/mo, Štandard €60/mo
- Extras: Subpages €50, SEO audit €100, Branding €150

#### 5. **`/api/leads.js`** (205 lines)
**Lead database CRUD + Neon PostgreSQL**
- List, create, and update leads
- GET `/api/leads` — list all (optional area filter)
- POST `/api/leads` — create new lead
- PATCH `/api/leads?id=<id>` — update status
- Speed: <1 second (database)

**Database Features:**
- Auto-creates table on first request
- Tracks: status, email_sent, proposal_sent, notes
- Timestamps: created_at, updated_at
- 15 columns per lead

#### 6. **`/api/health.js`** (10 lines)
**Health check endpoint**
- Simple status verification
- GET `/api/health`
- Returns: status, timestamp, version
- Speed: <1 second

---

### Support & Configuration

#### 7. **`/api/config.js`** (141 lines)
**Configuration and constants**
- All pricing packages defined here
- AI model names and versions
- Timeout values
- Website scoring thresholds
- Slovak area detection list
- Lead statuses
- Default categories
- Error messages

**Update this file to change:**
- Pricing
- AI models
- Timeout limits
- Supported categories

#### 8. **`/api/utils.js`** (157 lines)
**Shared utility functions**
- CORS header helpers
- Input validation functions
- Website scoring logic
- JSON extraction from text
- Marketing package getters
- Schema.org generator
- Shared constants

---

### Configuration & Deployment

#### 9. **`package.json`** (30 lines)
**Dependencies and scripts**
- @anthropic-ai/sdk (Claude API)
- @google/generative-ai (Gemini API)
- @neondatabase/serverless (PostgreSQL)
- Scripts: dev, start, deploy

#### 10. **`vercel.json`** (30 lines)
**Vercel routing and configuration**
- Serverless function limits
- Environment variables mapping
- Route rewrites
- API routes configuration

#### 11. **`.env.example`** (11 lines)
**Environment variables template**
- ANTHROPIC_API_KEY
- GEMINI_API_KEY
- DATABASE_URL
- NODE_ENV

Copy to `.env.local` and fill in your keys before deploying.

#### 12. **`.gitignore`** (38 lines)
**Git ignore rules**
- node_modules
- .env and .env.local
- Vercel cache
- IDE files (.vscode, .idea)
- Build artifacts

---

### Documentation

#### 13. **`README.md`** (479 lines)
**Main documentation**
- Project overview
- Quick start (npm install, environment setup)
- Complete endpoint documentation
- Database schema
- Environment variables
- Error handling
- CORS info
- File structure
- Development notes
- Deployment checklist

**Start here** if you're new to the project.

#### 14. **`DEPLOYMENT.md`** (341 lines)
**Step-by-step deployment guide**
- Prerequisites
- Create Neon database
- Get API keys (Anthropic, Gemini)
- Prepare repository
- Deploy to Vercel (2 methods)
- Set environment variables
- Verify deployment
- Setup database
- Troubleshooting
- Production best practices
- Monitoring and logs
- Rollback instructions

**Follow this** to deploy to production.

#### 15. **`API_EXAMPLES.md`** (534 lines)
**Complete cURL and code examples**
- Health check example
- Scan for leads example
- Generate website example
- Draft email example
- Generate proposal example
- List all leads example
- Create lead example
- Update lead status example
- Complete workflow bash script
- Error handling examples
- Rate limiting info
- JavaScript/Node.js integration example

**Copy from here** when testing or integrating.

#### 16. **`BACKEND_SUMMARY.md`** (420 lines)
**Technical architecture and decisions**
- What was built (overview)
- Complete architecture diagram
- File descriptions
- Dependencies
- Configuration
- Endpoints summary table
- Error handling overview
- Design decisions explained
- Performance characteristics
- Deployment checklist
- Future enhancements
- Support resources

**Read this** to understand the technical design.

#### 17. **`INDEX.md`** (This file)
**File navigation and reference**
- Quick navigation
- File structure
- Contents of each file
- Quick reference table

---

## Quick Reference Table

| File | Lines | Purpose | Update Frequency |
|---|---|---|---|
| api/scan.js | 198 | Lead discovery | Rarely |
| api/generate.js | 122 | Website generation | Rarely |
| api/email.js | 120 | Email drafting | Rarely |
| api/proposal.js | 161 | Proposal generation | Rarely |
| api/leads.js | 205 | Database CRUD | Rarely |
| api/health.js | 10 | Health check | Never |
| api/config.js | 141 | Pricing & config | Often |
| api/utils.js | 157 | Shared functions | Rarely |
| package.json | 30 | Dependencies | Rarely |
| vercel.json | 30 | Deployment config | Rarely |
| .env.example | 11 | Template (don't edit) | Never |
| .gitignore | 38 | Git rules | Never |
| README.md | 479 | Main docs | Sometimes |
| DEPLOYMENT.md | 341 | Deploy guide | Sometimes |
| API_EXAMPLES.md | 534 | Examples & tests | Sometimes |
| BACKEND_SUMMARY.md | 420 | Architecture | Rarely |
| INDEX.md | This | Navigation | Rarely |

---

## Common Tasks

### I want to...

**Deploy the API**
→ Read [DEPLOYMENT.md](./DEPLOYMENT.md)

**Test an endpoint**
→ Copy examples from [API_EXAMPLES.md](./API_EXAMPLES.md)

**Change pricing**
→ Edit [/api/config.js](./api/config.js)

**Understand the architecture**
→ Read [BACKEND_SUMMARY.md](./BACKEND_SUMMARY.md)

**Add a new endpoint**
→ Copy pattern from existing endpoint in `/api/`, add to config.js

**Fix an issue**
→ Check [DEPLOYMENT.md](./DEPLOYMENT.md) troubleshooting section

**Integrate with frontend**
→ Review [API_EXAMPLES.md](./API_EXAMPLES.md) JavaScript example

**Monitor in production**
→ Check Vercel dashboard (Functions → Logs)

**Change API models**
→ Edit [/api/config.js](./api/config.js) `CLAUDE_MODEL` and `GEMINI_MODEL`

**Scale for heavy traffic**
→ Read [DEPLOYMENT.md](./DEPLOYMENT.md) "Scaling & Performance" section

---

## Dependencies Overview

### What does each do?

| Package | Size | Purpose | Used In |
|---|---|---|---|
| @anthropic-ai/sdk | ~50KB | Claude API client | scan.js, generate.js, proposal.js |
| @google/generative-ai | ~100KB | Gemini API client | scan.js, email.js |
| @neondatabase/serverless | ~30KB | PostgreSQL driver | leads.js |

**Total:** ~180KB installed (node_modules)

No frontend frameworks, no bundlers, no unnecessary dependencies.

---

## Environment Variables

**Required:**
```
ANTHROPIC_API_KEY=sk-ant-...      # Get from https://console.anthropic.com
GEMINI_API_KEY=AIzaSy...          # Get from https://aistudio.google.com
DATABASE_URL=postgresql://...     # Get from https://neon.tech
```

**Optional:**
```
NODE_ENV=production               # Set automatically by Vercel
```

See [.env.example](./.env.example) for template.

---

## API Endpoints at a Glance

```
GET  /api/health              Health check (1s)
POST /api/scan                Find leads (10-30s)
POST /api/generate            Create website (15-45s)
POST /api/email               Draft email (3-10s)
POST /api/proposal            Generate proposal (5-15s)
GET  /api/leads               List leads (<1s)
POST /api/leads               Create lead (<1s)
PATCH /api/leads?id=X         Update lead (<1s)
```

---

## Performance Profile

| Endpoint | Time | Why |
|---|---|---|
| health | <1s | Simple status |
| leads GET | <1s | Database query |
| leads POST/PATCH | <1s | Database write |
| email | 3-10s | Gemini API call |
| proposal | 5-15s | Claude API call |
| generate | 15-45s | Full HTML generation |
| scan | 10-30s | Web search + validation |

**Note:** First request after deploy = add 2-3s for cold start.

---

## Error Messages

All errors follow this format:
```json
{
  "error": "Human-readable error",
  "message": "Optional additional context"
}
```

Common errors:
- `400` — Missing required field
- `405` — Method not allowed (use POST, not GET, etc.)
- `500` — Server error (check logs)

---

## Version History

| Version | Date | Status |
|---|---|---|
| 1.0.0 | Mar 30, 2025 | Production Ready |

---

## Support & Help

**Documentation Files:**
- [README.md](./README.md) — Main reference
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Getting deployed
- [API_EXAMPLES.md](./API_EXAMPLES.md) — Testing
- [BACKEND_SUMMARY.md](./BACKEND_SUMMARY.md) — Understanding

**External Docs:**
- [Vercel Docs](https://vercel.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Anthropic Claude](https://docs.anthropic.com)
- [Google Gemini](https://ai.google.dev)

**Issues?**
1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) troubleshooting
2. Review [README.md](./README.md) error handling section
3. Check Vercel dashboard logs
4. Verify environment variables

---

## Statistics

```
Total Files:        17
Total Lines:        2,948
API Endpoints:      6
Documented:        100%
Production Ready:   Yes

Breakdown:
- Code (api/):      1,114 lines
- Config:           109 lines
- Docs:             1,774 lines
```

---

**Last Updated:** March 30, 2025
**Status:** Ready for production
**Maintained by:** Martin Straňanek

---

## Next Steps

1. **[Deploy →](./DEPLOYMENT.md)** Follow the deployment guide
2. **[Test →](./API_EXAMPLES.md)** Use provided examples
3. **[Integrate →](./README.md)** Connect your frontend
4. **[Monitor →](./BACKEND_SUMMARY.md)** Understand monitoring

---
