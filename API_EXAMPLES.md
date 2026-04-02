# WebLead Scout API — Usage Examples

Complete examples for testing and integrating with the WebLead Scout backend API.

Replace `https://your-api.vercel.app` with your actual deployment URL.

---

## 1. Health Check

**Verify the API is running:**

```bash
curl https://your-api.vercel.app/api/health
```

**Response:**
```json
{
  "status": "ok",
  "service": "weblead-scout-backend",
  "timestamp": "2025-03-30T12:00:00.000Z",
  "version": "1.0.0"
}
```

---

## 2. Scan for Leads

**Find local businesses with poor/missing websites:**

```bash
curl -X POST https://your-api.vercel.app/api/scan \
  -H "Content-Type: application/json" \
  -d '{
    "area": "Bratislava",
    "categories": ["Construction", "Plumbing", "Electrical"]
  }'
```

**Response:**
```json
{
  "success": true,
  "count": 8,
  "area": "Bratislava",
  "leads": [
    {
      "name": "Stavebne Prace Baranek",
      "category": "Construction",
      "address": "Rajecká dolina 45, Banská Bystrica",
      "phone": "+421 917 123 456",
      "website": null,
      "hasWebsite": false,
      "websiteScore": 0,
      "websiteIssues": [],
      "quality": "missing"
    },
    {
      "name": "Instalaterske sluzby Kovac",
      "category": "Plumbing",
      "address": "Hlavná 12, Bratislava",
      "phone": "+421 904 567 890",
      "website": "http://www.sluzby-kovac.sk",
      "hasWebsite": true,
      "websiteScore": 28,
      "websiteIssues": ["outdated design", "not mobile responsive", "slow loading"],
      "quality": "poor"
    }
  ]
}
```

**Parameters:**
- `area` (required) — geographic area to search (works with Slovak cities)
- `categories` (optional) — array of business categories to focus on

**Category examples:** Construction, Plumbing, Electrical, Retail, Restaurant, Services, Healthcare, Fitness, Real Estate, Automotive

---

## 3. Generate Website HTML

**Create a complete single-file HTML website:**

```bash
curl -X POST https://your-api.vercel.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "business": {
      "name": "Stavebne Prace Baranek",
      "category": "Construction",
      "address": "Rajecká dolina 45, Banská Bystrica",
      "phone": "+421 917 123 456",
      "websiteIssues": ["no website", "needs modern design"]
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "businessName": "Stavebne Prace Baranek",
  "html": "<!DOCTYPE html>\n<html lang=\"sk\">\n<head>\n<meta charset=\"UTF-8\">\n...(full HTML here)...",
  "sections": [
    "Navigation",
    "Hero Section",
    "About",
    "Services",
    "Contact",
    "Footer"
  ]
}
```

**Save the HTML to a file:**
```bash
curl -X POST https://your-api.vercel.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "business": {
      "name": "Stavebne Prace Baranek",
      "category": "Construction",
      "address": "Rajecká dolina 45, Banská Bystrica",
      "phone": "+421 917 123 456"
    }
  }' | jq -r '.html' > index.html

# Open in browser
open index.html
```

**The generated HTML includes:**
- Mobile-responsive design
- Modern 2025 aesthetic
- All text in Slovak
- Schema.org markup for local business
- Contact form
- Service sections
- No external dependencies (except Google Fonts)

---

## 4. Draft Outreach Email

**Generate a personalized cold email in Slovak:**

```bash
curl -X POST https://your-api.vercel.app/api/email \
  -H "Content-Type: application/json" \
  -d '{
    "business": {
      "name": "Stavebne Prace Baranek",
      "category": "Construction",
      "website": null,
      "websiteScore": 0,
      "websiteIssues": ["no website"]
    },
    "tone": "friendly"
  }'
```

**Response:**
```json
{
  "success": true,
  "businessName": "Stavebne Prace Baranek",
  "subject": "Moderná webová stránka pre vašu stavebnu firmu",
  "body": "Ahoj Michal,\n\nSem Martin, tvorca webových stránok. Vidím, že Stavebne Prace Baranek by mohla mať modernu webovu stranku, ktora by vam pomohla prilákat viac klientov.\n\nMam skúsenosti s vytváraním profesionálnych webov pre stavebne firmy. Všetky mojich stránky su:\n- Rýchle a optimalizované\n- Mobilne priateľské\n- Jednoduché na správu\n\nMoje cenníka найdeš na https://darkmaster9452.github.io/Dark-s-Imperium\n\nChcel by si si o tom popovedať?\n\nMartin"
}
```

**Tone options:**
- `friendly` (default) — warm, conversational, personable
- `professional` — direct, business-focused
- `casual` — approachable, informal

---

## 5. Generate Pricing Proposal

**Create a custom proposal with recommended packages:**

```bash
curl -X POST https://your-api.vercel.app/api/proposal \
  -H "Content-Type: application/json" \
  -d '{
    "business": {
      "name": "Stavebne Prace Baranek",
      "category": "Construction",
      "websiteScore": 0,
      "websiteIssues": ["no website"]
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "businessName": "Stavebne Prace Baranek",
  "recommendedPackage": "Štandard",
  "totalEstimate": 800,
  "proposal": "Vážený Pán Baránek,\n\nŤa som analyzoval situáciu vašej stavebnej firmy a rád by som vám navrhol vhodný balíček pre vytvorenie modernej webovej stránky.\n\nVáša situácia:\n- Momentálne nemáte webovú stránku\n- Máte potenciál na internete\n- Konkurencia má modernú prítomnosť online\n\nMoja rekomendácia: ŠTANDARD balíček (€800)\n- Profesiálna webová stránka\n- Optimalizovane pre mobilný prístup\n- Integrácia s mapami a kontaktnou formou\n- Štvortýždňová podpora\n- SEO základy\n\nVálec ďalších doplnkov:\n- Podstránka s galériou projektov: +€50\n- SEO audit a optimalizácia: +€100\n- Branding a logo dizajn: +€150\n\nPo spustení môžete svoj web spravovať pomocou nášho management balíčka:\n- Základná správa: €45/mesiac\n- Štandard (s SEO): €60/mesiac\n\nChcel by som si to s vami bližšie podiskutovať. Ste dostupný na krátky hovor?\n\nMartin"
}
```

**Pricing packages referenced:**
- **Tvorba (Creation)**
  - Starter: €450 — Simple 1-page site
  - Štandard: €800 — Multi-page professional site
  - Firemný: €1200+ — Premium, advanced features
- **Sprava (Management)**
  - Základná: €45/month — Basic maintenance
  - Štandard: €60/month — Standard + SEO
- **Extras**
  - Podstránky (Subpages): €50
  - SEO audit: €100
  - Branding: €150

---

## 6. List All Leads

**Get all leads stored in the database:**

```bash
curl https://your-api.vercel.app/api/leads
```

**Response:**
```json
{
  "success": true,
  "count": 42,
  "leads": [
    {
      "id": 1,
      "name": "Stavebne Prace Baranek",
      "category": "Construction",
      "address": "Rajecká dolina 45, Banská Bystrica",
      "phone": "+421 917 123 456",
      "website": null,
      "has_website": false,
      "website_score": 0,
      "website_issues": [],
      "quality": "missing",
      "area": "Banská Bystrica",
      "status": "new",
      "email_sent": false,
      "proposal_sent": false,
      "notes": null,
      "created_at": "2025-03-30T12:00:00Z",
      "updated_at": "2025-03-30T12:00:00Z"
    }
  ]
}
```

**Filter by area:**
```bash
curl "https://your-api.vercel.app/api/leads?area=Bratislava"
```

---

## 7. Create a Lead

**Add a new lead manually:**

```bash
curl -X POST https://your-api.vercel.app/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Business Ltd",
    "category": "Retail",
    "address": "123 Main Street, Bratislava",
    "phone": "+421 914 567 890",
    "website": "https://newbusiness.sk",
    "has_website": true,
    "website_score": 45,
    "website_issues": ["outdated design", "not mobile responsive"],
    "quality": "poor",
    "area": "Bratislava"
  }'
```

**Response:**
```json
{
  "success": true,
  "lead": {
    "id": 43,
    "name": "New Business Ltd",
    "category": "Retail",
    "address": "123 Main Street, Bratislava",
    "phone": "+421 914 567 890",
    "website": "https://newbusiness.sk",
    "has_website": true,
    "website_score": 45,
    "website_issues": ["outdated design", "not mobile responsive"],
    "quality": "poor",
    "area": "Bratislava",
    "status": "new",
    "email_sent": false,
    "proposal_sent": false,
    "notes": null,
    "created_at": "2025-03-30T12:30:00Z",
    "updated_at": "2025-03-30T12:30:00Z"
  }
}
```

---

## 8. Update Lead Status

**Mark lead as contacted, email sent, etc.:**

```bash
curl -X PATCH "https://your-api.vercel.app/api/leads?id=1" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "contacted",
    "email_sent": true,
    "notes": "Called on March 30, interested in meeting next week"
  }'
```

**Response:**
```json
{
  "success": true,
  "lead": {
    "id": 1,
    "name": "Stavebne Prace Baranek",
    "status": "contacted",
    "email_sent": true,
    "notes": "Called on March 30, interested in meeting next week",
    "updated_at": "2025-03-30T13:00:00Z"
  }
}
```

**Status values:** `new`, `contacted`, `proposal_sent`, `deal`, `rejected`, `follow_up`

---

## Workflow Example

Here's a complete workflow for finding and contacting leads:

```bash
#!/bin/bash

API="https://your-api.vercel.app"

# Step 1: Find leads in Bratislava
echo "Scanning for leads in Bratislava..."
SCAN=$(curl -s -X POST $API/api/scan \
  -H "Content-Type: application/json" \
  -d '{
    "area": "Bratislava",
    "categories": ["Construction", "Plumbing"]
  }')

echo "$SCAN" | jq '.leads | length' # Show count

# Step 2: Save to database
FIRST_LEAD=$(echo "$SCAN" | jq '.leads[0]')
LEAD_NAME=$(echo "$FIRST_LEAD" | jq -r '.name')
LEAD_CATEGORY=$(echo "$FIRST_LEAD" | jq -r '.category')
LEAD_ADDRESS=$(echo "$FIRST_LEAD" | jq -r '.address')
LEAD_PHONE=$(echo "$FIRST_LEAD" | jq -r '.phone')
LEAD_WEBSITE=$(echo "$FIRST_LEAD" | jq -r '.website')
LEAD_SCORE=$(echo "$FIRST_LEAD" | jq -r '.websiteScore')

echo "Creating lead: $LEAD_NAME"
curl -s -X POST $API/api/leads \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$LEAD_NAME\",
    \"category\": \"$LEAD_CATEGORY\",
    \"address\": \"$LEAD_ADDRESS\",
    \"phone\": \"$LEAD_PHONE\",
    \"website\": $LEAD_WEBSITE,
    \"has_website\": $([ $LEAD_WEBSITE != 'null' ] && echo 'true' || echo 'false'),
    \"website_score\": $LEAD_SCORE,
    \"area\": \"Bratislava\"
  }" | jq '.lead.id'

# Step 3: Draft email
echo "Drafting email..."
EMAIL=$(curl -s -X POST $API/api/email \
  -H "Content-Type: application/json" \
  -d "{
    \"business\": $FIRST_LEAD,
    \"tone\": \"friendly\"
  }")

echo "Subject: $(echo "$EMAIL" | jq -r '.subject')"
echo "Body:"
echo "$EMAIL" | jq -r '.body'

# Step 4: Generate website
echo "Generating website..."
WEBSITE=$(curl -s -X POST $API/api/generate \
  -H "Content-Type: application/json" \
  -d "{\"business\": $FIRST_LEAD}")

echo "$WEBSITE" | jq -r '.html' > "$LEAD_NAME-index.html"
echo "Website saved to $LEAD_NAME-index.html"

# Step 5: Generate proposal
echo "Generating proposal..."
PROPOSAL=$(curl -s -X POST $API/api/proposal \
  -H "Content-Type: application/json" \
  -d "{\"business\": $FIRST_LEAD}")

echo "Recommended: $(echo "$PROPOSAL" | jq -r '.recommendedPackage')"
echo "Estimate: €$(echo "$PROPOSAL" | jq -r '.totalEstimate')"

# Step 6: Mark as emailed
echo "Updating lead status..."
curl -s -X PATCH "$API/api/leads?id=1" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "contacted",
    "email_sent": true,
    "notes": "Email sent on $(date)"
  }'

echo "Done!"
```

---

## Error Handling

All errors return a consistent format:

```json
{
  "error": "Error message",
  "message": "Additional details"
}
```

**Common status codes:**
- `200` — Success
- `201` — Created
- `400` — Bad request (missing required field)
- `405` — Method not allowed
- `500` — Server error

**Example error:**
```bash
curl -X POST https://your-api.vercel.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{"business": {}}'  # Missing required name
```

```json
{
  "error": "Missing required field: business.name",
  "message": "Missing required field: business.name"
}
```

---

## Rate Limiting & Performance

### Timeouts
- `/api/scan` — 30 seconds (web search is slow)
- `/api/generate` — 45 seconds (full HTML generation)
- `/api/email` — 10 seconds
- `/api/proposal` — 15 seconds
- `/api/leads` — 5 seconds (database)

### Optimal Usage
- Run scans during off-peak hours (they take time)
- Batch database operations when possible
- Cache results locally
- Poll long operations instead of waiting

---

## Integration Example (JavaScript/Node.js)

```javascript
const API_BASE = "https://your-api.vercel.app";

async function scanLeads(area, categories) {
  const response = await fetch(`${API_BASE}/api/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ area, categories }),
  });
  return response.json();
}

async function draftEmail(business, tone = "friendly") {
  const response = await fetch(`${API_BASE}/api/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ business, tone }),
  });
  return response.json();
}

async function generateWebsite(business) {
  const response = await fetch(`${API_BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ business }),
  });
  return response.json();
}

// Usage
const leads = await scanLeads("Bratislava", ["Construction"]);
const email = await draftEmail(leads.leads[0]);
const website = await generateWebsite(leads.leads[0]);

console.log("Email subject:", email.subject);
console.log("Website HTML:", website.html.substring(0, 100) + "...");
```

---

**Last updated:** March 30, 2025
