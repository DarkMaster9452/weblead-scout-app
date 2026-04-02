# WebLead Scout Backend — Deployment Guide

Complete guide for deploying the WebLead Scout backend API to Vercel with Neon PostgreSQL.

---

## Prerequisites

- Node.js 20+
- npm or yarn
- Vercel account
- Anthropic API key (Claude)
- Google Gemini API key
- Neon PostgreSQL account

---

## Step 1: Create Neon Database

1. Go to https://neon.tech
2. Sign up and create a new project
3. Create a database (default: `neondb`)
4. Copy the connection string (looks like: `postgresql://user:password@project.neon.tech/neondb?sslmode=require`)
5. Save it for later

---

## Step 2: Get API Keys

### Anthropic API Key
1. Go to https://console.anthropic.com
2. Create an account or sign in
3. Navigate to **API Keys**
4. Create a new API key
5. Copy it (starts with `sk-ant-`)

### Google Gemini API Key
1. Go to https://aistudio.google.com
2. Sign in with Google
3. Click **Get API Key** → **Create API key in new project**
4. Copy the generated key (starts with `AIzaSy`)

---

## Step 3: Prepare Repository

### Option A: New Repository
```bash
mkdir weblead-scout-backend
cd weblead-scout-backend
git init

# Copy all files from this project
# (package.json, api/, vercel.json, .env.example, etc.)

git add .
git commit -m "Initial commit: WebLead Scout backend"
git branch -M main
```

### Option B: GitHub Desktop or CLI
```bash
gh repo create weblead-scout-backend --private --source=. --remote=origin --push
```

---

## Step 4: Deploy to Vercel

### Method A: Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from project root:
```bash
vercel
# Follow the prompts:
# - Confirm you want to create a new project
# - Project name: weblead-scout-backend
# - Framework: Other
# - Root directory: ./
# - Build command: (leave empty)
```

4. Set environment variables:
```bash
vercel env add ANTHROPIC_API_KEY
# Paste your Anthropic key

vercel env add GEMINI_API_KEY
# Paste your Gemini key

vercel env add DATABASE_URL
# Paste your Neon connection string
```

5. Re-deploy to apply env vars:
```bash
vercel --prod
```

### Method B: Vercel Dashboard

1. Go to https://vercel.com
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework:** Other
   - **Root Directory:** ./
   - **Build Command:** (leave empty)
   - **Install Command:** npm install

5. Click **Deploy**

6. After deployment completes:
   - Go to **Settings** → **Environment Variables**
   - Add three variables:
     - `ANTHROPIC_API_KEY` = (your key)
     - `GEMINI_API_KEY` = (your key)
     - `DATABASE_URL` = (your Neon connection string)

7. Click **Redeploy** to apply the environment variables

---

## Step 5: Verify Deployment

Test that the API is live:

```bash
# Health check (should return "ok")
curl https://your-project.vercel.app/api/health

# Test scan endpoint
curl -X POST https://your-project.vercel.app/api/scan \
  -H "Content-Type: application/json" \
  -d '{"area": "Bratislava", "categories": ["Construction"]}'
```

---

## Step 6: Setup Database

The database will auto-initialize on first request to `/api/leads`. However, you can manually set it up:

```bash
# If you have psql installed:
psql "postgresql://user:password@project.neon.tech/neondb?sslmode=require" < schema.sql

# Or use Neon's web console to run:
CREATE TABLE IF NOT EXISTS leads (
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

---

## Environment Variables Reference

| Variable | Value | Example |
|---|---|---|
| `ANTHROPIC_API_KEY` | Your Claude API key | `sk-ant-abc123...` |
| `GEMINI_API_KEY` | Your Gemini API key | `AIzaSyAbc123...` |
| `DATABASE_URL` | Neon PostgreSQL connection | `postgresql://user:pass@project.neon.tech/neondb?sslmode=require` |
| `NODE_ENV` | Environment (auto-set by Vercel) | `production` |

---

## Troubleshooting

### "No API key found" error
- Verify environment variables are set in Vercel dashboard
- Check spelling: `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `DATABASE_URL`
- Wait 1-2 minutes after setting (Vercel redeploy takes time)
- Check deployment logs in Vercel dashboard

### Database connection fails
- Verify `DATABASE_URL` is correct from Neon dashboard
- Check that the connection string includes `?sslmode=require`
- Ensure Neon project is active (not paused)
- Test connection locally: `psql "postgresql://..."`

### API returns 500 error
- Check **Deployments** → **Logs** in Vercel dashboard
- Look for error message in runtime logs
- Common issues:
  - Invalid API key
  - Database timeout
  - Missing environment variable
  - Function timeout (increase max duration in `vercel.json`)

### Timeout errors on `/api/scan`
- The scan endpoint uses web search, which can be slow
- Default timeout is 60 seconds (set in `vercel.json`)
- If you need longer, upgrade Vercel plan or split into multiple requests

---

## Production Best Practices

### 1. Rate Limiting
Add rate limiting to prevent abuse:
```javascript
// In each endpoint
const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
// Store request count in cache/Redis
// Return 429 if exceeded
```

### 2. Error Monitoring
Add Sentry for error tracking:
```bash
npm install @sentry/node
```

### 3. Database Backups
Neon automatically backs up daily. To restore:
1. Go to Neon project settings
2. Select a backup point
3. Click restore

### 4. API Security
- Add API key validation before processing
- Use HTTPS only (Vercel provides this)
- Validate all input fields
- Sanitize text for prompt injection

### 5. Cost Optimization
- Monitor API usage in Anthropic & Google dashboards
- Set spend limits
- Cache results when possible
- Use streaming for large responses

---

## Scaling & Performance

### For Heavy Usage
1. Enable Vercel's **Automatic Scaling**
2. Upgrade Neon plan if approaching connection limits
3. Add caching layer (Redis/Upstash)
4. Implement request queue (Bull/RabbitMQ)

### Current Limits
- Vercel function timeout: 60 seconds
- Neon connections: depends on plan
- Anthropic rate limit: depends on plan
- Gemini rate limit: depends on plan

---

## Monitoring & Logs

### Vercel Dashboard
- **Deployments** — see all deployments and rollback
- **Functions** — see runtime logs for each endpoint
- **Usage** — monitor API calls and performance
- **Alerts** — set up notifications for errors

### API Monitoring
Add monitoring for:
- Response times (target: <5s for most endpoints)
- Error rate (target: <1%)
- Database latency (target: <200ms)
- API key usage (compare to limits)

---

## Rollback

If something breaks:

```bash
# Rollback to previous deployment
vercel rollback
# Or select specific deployment from dashboard
```

---

## Updates & Maintenance

### Updating Dependencies
```bash
npm update
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
# Vercel auto-deploys from main branch
```

### Updating Code
```bash
git commit -am "Fix: describe your change"
git push
# Auto-deploys to production
```

### Zero-Downtime Deployment
Vercel handles this automatically:
1. New version deployed to separate environment
2. Traffic gradually switched
3. Old version remains available for rollback

---

## Support & Documentation

- **Vercel Docs:** https://vercel.com/docs
- **Neon Docs:** https://neon.tech/docs
- **Claude API:** https://docs.anthropic.com
- **Gemini API:** https://ai.google.dev

---

**Deployment Date:** March 30, 2025
**Version:** 1.0.0
