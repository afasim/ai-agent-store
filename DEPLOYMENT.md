# Deployment Guide - AI Agent Store

This guide covers all manual steps required to deploy your AI Agent Store to production.

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
3. [Other Cloud Providers](#other-cloud-providers)
4. [Custom Domain Setup](#custom-domain-setup)
5. [Production Considerations](#production-considerations)
6. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Pre-Deployment Checklist

Before deploying to production, ensure you have:

- [ ] Local development working perfectly (`npm run dev`)
- [ ] Supabase project created and `agents` table set up
- [ ] Google Cloud project created with Vertex AI enabled
- [ ] Service account JSON credentials downloaded
- [ ] All environment variables configured locally
- [ ] Code committed to GitHub (or your Git provider)
- [ ] `.env.local` and `google-credentials.json` added to `.gitignore`
- [ ] Tested creating and running agents locally

**Verify your .gitignore includes:**
```
.env.local
google-credentials.json
node_modules/
.next/
dist/
```

Run this to check:
```bash
git status
```

You should NOT see `.env.local` or `google-credentials.json` in the output.

---

## Vercel Deployment (Recommended)

Vercel is the easiest way to deploy Next.js applications. It's owned by the Next.js team and integrates seamlessly.

### Step 1: Push Code to GitHub

If not already done:

```bash
git add .
git commit -m "Initial commit: AI Agent Store"
git push origin main
```

### Step 2: Sign Up on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" and choose "Continue with GitHub"
3. Authorize Vercel to access your GitHub account
4. Select your personal or organization account

### Step 3: Import Your Project

1. Click "Add New..." → "Project"
2. Find your `ai-agent-store` repository
3. Click "Import"

### Step 4: Configure Environment Variables

On the "Configure Project" screen:

**Add these environment variables:**

| Variable | Value | Type |
|----------|-------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Public |
| `GOOGLE_PROJECT_ID` | Your Google Cloud project ID | Secret |
| `GOOGLE_APPLICATION_CREDENTIALS` | **Entire contents of your `google-credentials.json` file** | Secret |

**How to add the credentials file:**

1. Open your `google-credentials.json` file locally
2. Copy the entire JSON content
3. In Vercel, for `GOOGLE_APPLICATION_CREDENTIALS`:
   - Click "Add Environment Variable"
   - Paste the entire JSON content as the value
   - Make sure it's marked as "Secret"

**Example of what to paste:**
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "xxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
  "client_id": "xxxxx",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "xxxxx"
}
```

### Step 5: Deploy!

1. Click "Deploy"
2. Wait for the build to complete (usually 2-3 minutes)
3. Once successful, you'll get a URL like: `https://ai-agent-store-xxx.vercel.app`

### Step 6: Test Your Deployment

1. Open your deployed URL
2. Test creating an agent
3. Test running an agent with a query
4. Check the browser console and Vercel logs for errors

**Common deployment issues:**
- If you see "Project verification failed", make sure all environment variables are set correctly
- If Vertex AI fails, double-check the JSON credentials were pasted correctly
- If Supabase fails, verify the URL and key are correct

---

## Other Cloud Providers

### AWS Amplify

1. **Connect Repository:**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
   - Click "New app" → "Host web app"
   - Select GitHub and authorize
   - Choose your repository

2. **Build Settings:**
   - Framework: Next.js
   - Click "Save and deploy"

3. **Add Environment Variables:**
   - Click "Environment variables" in the left sidebar
   - Add all variables from the Vercel setup above

4. **Deploy:**
   - Changes to `main` branch automatically deploy

### Netlify

1. **Connect Repository:**
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository

2. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Environment Variables:**
   - Go to Site settings → Build & deploy → Environment
   - Add all variables from the Vercel setup above

4. **Deploy:**
   - Click "Deploy site"

**Note:** Netlify requires additional configuration for Next.js. Vercel is recommended.

### Docker Deployment (Self-Hosted)

If you want full control, you can deploy using Docker:

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

ENV NODE_ENV production

EXPOSE 3000

CMD ["npm", "start"]
```

**Build and run:**
```bash
docker build -t ai-agent-store .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  -e GOOGLE_PROJECT_ID=your_project \
  -e GOOGLE_APPLICATION_CREDENTIALS=/app/credentials.json \
  -v ./google-credentials.json:/app/credentials.json \
  ai-agent-store
```

---

## Custom Domain Setup

### Vercel Custom Domain

1. In Vercel project settings, go to "Domains"
2. Click "Add Domain"
3. Enter your domain (e.g., `agenthouse.com`)
4. Choose to add a subdomain or root domain

**For existing domain:**
- Add DNS CNAME record pointing to Vercel
- Check Vercel dashboard for specific CNAME value

**For domain purchased through Vercel:**
- It's automatically set up

### SSL/HTTPS

- Vercel provides free SSL certificates automatically
- Your site is secure at deployment (HTTPS enabled by default)

---

## Production Considerations

### 1. Database Security

**Enable Row-Level Security (RLS) in Supabase:**

In the SQL Editor, run:

```sql
-- Enable RLS on agents table
alter table agents enable row level security;

-- Allow anyone to read agents
create policy "Agents are viewable by everyone" on agents
  for select using (true);

-- Allow inserts from anyone (for now - consider adding auth later)
create policy "Anyone can create agents" on agents
  for insert with check (true);
```

### 2. Rate Limiting

Add rate limiting to prevent abuse:

**Install rate limiting package:**
```bash
npm install @vercel/kv
```

**Update `/app/api/agents/[id]/run/route.ts`:**
```typescript
import { kv } from '@vercel/kv'

// Add this before the POST function
async function checkRateLimit(ip: string): Promise<boolean> {
  const key = `ratelimit:${ip}`
  const count = await kv.incr(key)
  
  if (count === 1) {
    await kv.expire(key, 60) // Reset every 60 seconds
  }
  
  return count <= 10 // Allow 10 requests per minute
}

// In your POST function, add:
const ip = request.headers.get('x-forwarded-for') || 'unknown'
if (!(await checkRateLimit(ip))) {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    { status: 429 }
  )
}
```

### 3. Error Logging

Set up Sentry for error tracking:

**Install Sentry:**
```bash
npm install @sentry/nextjs
```

**Create `sentry.client.config.ts`:**
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

Add `NEXT_PUBLIC_SENTRY_DSN` to Vercel environment variables.

### 4. Performance Optimization

**Already included:**
- ✅ Image optimization
- ✅ Code splitting
- ✅ Minification

**Additional optimizations:**
- Add CDN caching headers
- Implement database query caching
- Monitor Core Web Vitals

### 5. Security Headers

Add security headers by creating `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

---

## Monitoring & Maintenance

### 1. Monitor Vercel Deployment

- Visit Vercel dashboard regularly
- Check "Analytics" for performance
- Review "Deployments" for any failed builds

### 2. Google Cloud Monitoring

- Monitor Vertex AI API usage
- Check for authentication errors
- Review quota usage

### 3. Supabase Monitoring

- Check database storage usage
- Monitor API rate limits
- Review security alerts

### 4. Automated Backups

**Supabase automatic backups:**
- Free tier: 7-day backup retention
- Pro tier: 30-day retention
- Enable point-in-time recovery in settings

**Manual backup:**
```bash
# Export your database
pg_dump postgresql://user:password@host/database > backup.sql
```

### 5. Update Dependencies

Regularly update packages:

```bash
# Check for outdated packages
npm outdated

# Update all packages
npm update

# Update major versions
npm install -g npm-check-updates
ncu -u
npm install
```

### 6. Monitor Costs

**Google Cloud:**
- Vertex AI: ~$0.0001 per 1000 tokens (varies by model)
- Set up billing alerts

**Vercel:**
- Free tier for hobby projects
- $20/month for Pro (includes 6GB edge functions)

**Supabase:**
- Free tier: 500MB database storage
- Pro: $25/month + overage costs

---

## Troubleshooting Deployment Issues

### Build Fails with "GOOGLE_PROJECT_ID not found"

**Solution:** Make sure all Google Cloud environment variables are set in Vercel before deploying.

### "Cannot find module '@google-cloud/vertexai'"

**Solution:** Run `npm install` and verify all dependencies are installed before pushing to git.

### Deployed site shows "Agent not found"

**Solution:** Verify Supabase credentials are correct in Vercel environment variables.

### Vertex AI returns "Permission denied"

**Solution:** 
1. Check service account has "Vertex AI Service Agent" role
2. Re-download JSON credentials and update Vercel variable
3. Ensure Vertex AI API is enabled

### Slow performance after deployment

**Solution:**
1. Check Vercel Analytics for bottlenecks
2. Enable database query caching
3. Consider upgrading Supabase plan
4. Optimize image sizes

---

## Going Further

### Add User Authentication

Once deployed, consider adding user authentication so users can:
- Own their published agents
- Track agent usage
- Get analytics

**Recommended: Add Supabase Auth**
```bash
npm install @supabase/auth-helpers-nextjs
```

### Add Payment Processing

For monetization:
- Stripe integration for premium agents
- Usage-based billing

### Auto-Deployment from Git

Vercel automatically deploys when you push to main. You can also:
- Set up preview deployments for pull requests
- Configure production environment
- Set up rollback strategies

---

## Support

If you encounter deployment issues:

1. Check Vercel logs: Click "Deployments" → Select failed deployment → View logs
2. Check browser console for client errors
3. Check Supabase logs in dashboard
4. Check Google Cloud logs in Cloud Console

For questions, open an issue on GitHub or check the main README.

---

**Your AI Agent Store is now production-ready! 🚀**
