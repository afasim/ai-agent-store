# 🔧 MANUAL SETUP INSTRUCTIONS

## ⚠️ IMPORTANT: YOU MUST DO THESE STEPS MANUALLY

This document lists all the manual tasks you need to complete before the AI Agent Store can run. These cannot be automated, but the instructions are detailed and easy to follow.

---

## Quick Overview

You have 3 main services to set up:
1. **Supabase** - Database for storing agents
2. **Google Cloud** - AI service credentials
3. **Environment Variables** - Connect local code to services

**Estimated Time:** 30-40 minutes

---

## STEP 1: Set Up Supabase (Database) ⏱️ ~10 minutes

### 1.1 Create Supabase Account

1. Go to https://supabase.com
2. Click **"Sign Up"**
3. Choose **"Sign up with GitHub"** (easiest)
4. Authorize Supabase to access your GitHub
5. You'll be redirected to your Supabase dashboard

### 1.2 Create a New Project

1. Click **"New Project"**
2. Choose your organization (or create one)
3. **Project name:** `ai-agent-store`
4. **Database password:** Create a strong password (save it securely)
5. **Region:** Choose closest to you
6. Click **"Create new project"**
7. Wait for the project to initialize (~2 minutes)

### 1.3 Create the Agents Table

1. In your Supabase project, click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Copy and paste this SQL:

```sql
create table agents (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  system_prompt text not null
);

create index idx_agents_created_at on agents(created_at);
```

4. Click **"Run"** (or press Ctrl+Enter)
5. You should see: **"Success. No rows returned."**

✅ **Supabase table created!**

### 1.4 Get Your Supabase Credentials

1. In your Supabase project, click **"Project Settings"** at the bottom left
2. Click **"API"**
3. **Copy these values and save them in a text file:**

   - **Project URL** - Looks like: `https://xxxxx.supabase.co`
     - Copy the whole URL
   
   - **anon/public key** - Under "Project API keys"
     - Click the key to copy (the public key, not the secret one)

**Save format:**
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=ey...xxxxx...
```

---

## STEP 2: Set Up Google Cloud (AI Service) ⏱️ ~20 minutes

### 2.1 Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. At the top left, click **"Select a Project"**
3. Click **"New Project"**
4. **Project name:** `ai-agent-store`
5. Click **"Create"**
6. Wait for it to initialize (~30 seconds)

### 2.2 Enable Required APIs

1. Go to **"APIs & Services"** → **"Enabled APIs & services"** (left sidebar)
2. Click **"Enable APIs and Services"** at the top

**First API: Vertex AI**
1. Search for **"Vertex AI"**
2. Click on **"Vertex AI API"**
3. Click **"Enable"**
4. Wait for it to complete

**Second API: Compute Engine**
1. Go back to "APIs & Services"
2. Click "Enable APIs and Services"
3. Search for **"Compute Engine"**
4. Click on **"Compute Engine API"**
5. Click **"Enable"**
6. Wait for it to complete

✅ **Both APIs enabled!**

### 2.3 Create Service Account

1. Go to **"IAM & Admin"** → **"Service Accounts"** (left sidebar)
2. Click **"Create Service Account"** at the top

**Fill in the form:**
- **Service account name:** `ai-agent-store-bot`
- **Service account ID:** (auto-filled)
- **Description:** Optional
- Click **"Create and Continue"**

3. **Grant Role:**
   - In the "Grant this service account access to project" section
   - Click the "Select a role" dropdown
   - Type **"Editor"** and select it
   - (You can also select "Vertex AI Service Agent" for minimal access)
   - Click **"Continue"**

4. Click **"Done"**

✅ **Service account created!**

### 2.4 Download Credentials File

1. You're now in the Service Accounts list
2. Click on the **`ai-agent-store-bot`** service account you just created
3. Go to the **"Keys"** tab
4. Click **"Add Key"** → **"Create new key"**
5. Choose **"JSON"**
6. Click **"Create"**
7. A JSON file will download automatically

**IMPORTANT:**
- This file is called `google-credentials.json`
- Save it in your project's root folder (same level as `package.json`)
- ⚠️ **NEVER commit this file to Git!** It contains secret credentials

### 2.5 Get Your Project ID

1. Go back to the Google Cloud Console
2. At the top, you'll see your **Project ID**
3. Click to copy it
4. **Save it** - it looks like: `my-project-id-123456`

---

## STEP 3: Configure Environment Variables ⏱️ ~5 minutes

### 3.1 Create .env.local File

In your project folder (where `package.json` is):

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Or manually create `.env.local` with this content:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
   GOOGLE_PROJECT_ID=your_project_id_here
   GOOGLE_APPLICATION_CREDENTIALS=google-credentials.json
   ```

### 3.2 Fill in the Values

Open `.env.local` and replace with your actual credentials:

**From Supabase:**
- `NEXT_PUBLIC_SUPABASE_URL` = The URL you saved from Step 1.4
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = The key you saved from Step 1.4

**From Google Cloud:**
- `GOOGLE_PROJECT_ID` = Your project ID from Step 2.5
- `GOOGLE_APPLICATION_CREDENTIALS` = `google-credentials.json` (keep this as-is, it's the filename)

### 3.3 Verify Your Setup

Check that:
- [ ] `.env.local` file exists in project root
- [ ] `google-credentials.json` file exists in project root
- [ ] `.env.local` is in `.gitignore` (to prevent leaking secrets)
- [ ] `google-credentials.json` is in `.gitignore`
- [ ] Both files have been filled with your credentials

Run this to verify:
```bash
cat .env.local
cat google-credentials.json
```

Both commands should show your credentials (if they don't, the files are missing).

---

## STEP 4: Test Locally ⏱️ ~10 minutes

### 4.1 Install Dependencies

```bash
npm install
```

### 4.2 Start Development Server

```bash
npm run dev
```

You should see:
```
  ▲ Next.js 14.0.4
  - Local:        http://localhost:3000
```

### 4.3 Test the Application

1. Open http://localhost:3000 in your browser
2. You should see the AI Agent Store homepage
3. Click **"+ Build New Agent"**
4. Fill in:
   - **Name:** `Test Agent`
   - **Description:** `This is a test agent`
   - **System Prompt:** `You are a helpful assistant. Answer questions clearly and concisely. Keep responses under 100 words.`
5. Click **"Publish Agent"**

✅ You should see your agent on the homepage!

### 4.4 Test Running an Agent

1. Click **"Run App"** on your Test Agent
2. Type: `Hello! What can you do?`
3. Click **"Send"**
4. Wait 2-5 seconds...

✅ You should see an AI response!

If this works, everything is set up correctly! 🎉

---

## STEP 5: (Optional) Deploy to Vercel ⏱️ ~15 minutes

### 5.1 Push to GitHub

```bash
git add .
git commit -m "Initial commit: AI Agent Store"
git push origin main
```

### 5.2 Deploy to Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"** and choose **"GitHub"**
3. Authorize Vercel with GitHub
4. Click **"New Project"**
5. Select your `ai-agent-store` repository
6. Click **"Import"**

### 5.3 Add Environment Variables

On the "Configure Project" page:

Add these environment variables:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `GOOGLE_PROJECT_ID` | Your Google Project ID |
| `GOOGLE_APPLICATION_CREDENTIALS` | **Paste the entire contents of your `google-credentials.json` file here** |

**Important for the last one:**
- Open `google-credentials.json` locally
- Copy the entire JSON content
- Paste it as the value in Vercel
- Make it a "Secret" variable

### 5.4 Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~3-5 minutes)
3. You'll get a URL like: `https://ai-agent-store-xxx.vercel.app`
4. Click the URL to test

---

## 🆘 Troubleshooting Manual Steps

### "I can't find the SQL Editor in Supabase"
- Make sure you're logged into Supabase
- Make sure you've selected your project
- Click the project name at top-left to see options

### "I can't find the Google Cloud console"
- Make sure you're logged in to Google
- Try https://console.cloud.google.com directly

### "Google credentials file won't download"
- Make sure you have the right permissions in Google Cloud
- Try a different browser
- Check your Downloads folder

### ".env.local file not working"
- Make sure you're in the project root directory
- File name must be exactly `.env.local` (with the dot)
- Restart `npm run dev` after creating `.env.local`

### "Still getting errors after setup?"
- Check all values in `.env.local` are correct
- Restart `npm run dev`
- Open DevTools (F12) and check Console tab for errors
- Check that `google-credentials.json` is in the root folder

---

## ✅ Checklist - Manual Setup Complete When:

- [ ] Supabase project created
- [ ] `agents` table created in Supabase
- [ ] Supabase credentials saved
- [ ] Google Cloud project created
- [ ] Vertex AI API enabled
- [ ] Compute Engine API enabled
- [ ] Service account created
- [ ] `google-credentials.json` downloaded and saved in project root
- [ ] Google Project ID saved
- [ ] `.env.local` created with all credentials filled in
- [ ] Can start dev server (`npm run dev`)
- [ ] Can access http://localhost:3000
- [ ] Can create a test agent
- [ ] Can run the agent and get AI response

Once all are checked, your setup is complete! 🎉

---

## Next Steps

1. **Share the platform** - Give the URL to friends/team
2. **Monitor usage** - Check Supabase and Google Cloud dashboards
3. **Add more features** - See CODE_REVIEW_SUMMARY.md for ideas

---

**Questions? See README.md or DEPLOYMENT.md for more details.**
