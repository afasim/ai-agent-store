# 🚀 AI Agent Store - Quick Setup Checklist

Use this checklist to track your setup progress. Follow these steps in order.

## Phase 1: Project Setup ✅

- [ ] **Clone Repository**
  ```bash
  git clone https://github.com/afasim/ai-agent-store.git
  cd ai-agent-store
  ```

- [ ] **Install Dependencies**
  ```bash
  npm install
  ```

- [ ] **Verify Installation**
  ```bash
  npm run dev
  ```
  Open http://localhost:3000 - you should see "No AI agents published yet"

---

## Phase 2: Supabase Setup 🗄️

> **Time: ~10 minutes**

- [ ] **Create Supabase Account**
  - Go to https://supabase.com
  - Sign up for free
  - Create a new project

- [ ] **Create Agents Table**
  - In your Supabase project, go to "SQL Editor"
  - Click "New Query"
  - Run this SQL:
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
  - Click "Run"
  - You should see "Success. No rows returned."

- [ ] **Get Supabase Credentials**
  - Go to "Project Settings" → "API"
  - Copy the **Project URL** (looks like `https://xxxxx.supabase.co`)
  - Copy the **anon/public key** (under "Project API keys")
  - Save these - you'll need them next

---

## Phase 3: Google Cloud Setup 🔐

> **Time: ~20 minutes**

- [ ] **Create Google Cloud Project**
  - Go to https://console.cloud.google.com
  - Click "Select a Project" → "New Project"
  - Name it "AI Agent Store"
  - Click "Create"

- [ ] **Enable Required APIs**
  - Go to "APIs & Services" → "Enabled APIs & services"
  - Click "Enable APIs and Services"
  - Search for and enable these:
    - [ ] **Vertex AI API**
    - [ ] **Compute Engine API**

- [ ] **Create Service Account**
  - Go to "IAM & Admin" → "Service Accounts"
  - Click "Create Service Account"
  - Name: `ai-agent-store-bot`
  - Click "Create and Continue"
  - Grant Role: `Editor` (or `Vertex AI Service Agent` for minimum access)
  - Click "Continue" → "Done"

- [ ] **Download Credentials File**
  - Click the service account you just created
  - Go to the "Keys" tab
  - Click "Add Key" → "Create new key"
  - Choose "JSON"
  - This downloads a file - save it in your project root as `google-credentials.json`
  - ⚠️ **SECURITY:** This file is sensitive! Never commit it to git.

- [ ] **Get Your Project ID**
  - In the top-left, next to "Google Cloud", click the project name
  - You'll see your **Project ID** (looks like `my-project-123456`)
  - Copy and save this

---

## Phase 4: Environment Variables ⚙️

- [ ] **Create .env.local**
  ```bash
  cp .env.local.example .env.local
  ```

- [ ] **Edit .env.local**
  Open the file and fill in:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_anon_key_here
  GOOGLE_PROJECT_ID=your-project-id-123456
  GOOGLE_APPLICATION_CREDENTIALS=google-credentials.json
  ```

- [ ] **Verify Files Exist**
  - [ ] `google-credentials.json` is in project root
  - [ ] `.env.local` is in project root
  - [ ] Both files are in `.gitignore`

---

## Phase 5: Test Locally 🧪

- [ ] **Start Dev Server** (if not already running)
  ```bash
  npm run dev
  ```

- [ ] **Create an Agent**
  - Go to http://localhost:3000
  - Click "+ Build New Agent"
  - Fill in:
    - **Name:** "Test Agent"
    - **Description:** "A test agent"
    - **System Prompt:** "You are a helpful assistant. Answer questions concisely."
  - Click "Publish Agent"

- [ ] **Run the Agent**
  - You should see your agent on the homepage
  - Click "Run App"
  - Type: "Say hello!"
  - Click "Send"
  - Wait for response...
  - ✅ If you see a response, your setup works!

- [ ] **Test Error Handling**
  - Try sending an empty message (should show error)
  - Try creating an agent with missing fields (should show error)

---

## Phase 6: Prepare for Deployment 🚀

- [ ] **Clean Up & Test**
  ```bash
  npm run build
  npm run start
  ```
  - Your app should load at http://localhost:3000

- [ ] **Commit to Git**
  ```bash
  git add .
  git commit -m "Initial commit: AI Agent Store setup complete"
  git push origin main
  ```

- [ ] **Verify Git**
  ```bash
  git status
  ```
  - Should show "nothing to commit"
  - `google-credentials.json` should NOT be in git

---

## Phase 7: Deploy to Vercel 🌍

> **Time: ~10 minutes**

- [ ] **Sign Up on Vercel**
  - Go to https://vercel.com
  - Click "Sign Up"
  - Choose "Continue with GitHub"
  - Authorize Vercel

- [ ] **Import Project**
  - Click "Add New..." → "Project"
  - Find `ai-agent-store`
  - Click "Import"

- [ ] **Add Environment Variables**
  - In the "Environment Variables" section, add:
    ```
    NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key
    GOOGLE_PROJECT_ID = your_project_id
    GOOGLE_APPLICATION_CREDENTIALS = [paste entire JSON file]
    ```
  
  - ⚠️ For `GOOGLE_APPLICATION_CREDENTIALS`:
    - Open your `google-credentials.json` file
    - Copy the entire JSON content
    - Paste it as the value in Vercel
    - Mark it as "Secret"

- [ ] **Deploy**
  - Click "Deploy"
  - Wait for build to complete (~2-3 minutes)
  - You'll get a URL like `https://ai-agent-store-xxx.vercel.app`

- [ ] **Test Production**
  - Open your Vercel URL
  - Test creating and running an agent
  - If errors occur, check Vercel logs: Deployments → Click deployment → View logs

---

## Phase 8: Optional - Custom Domain 🌐

- [ ] **Add Custom Domain**
  - In Vercel project settings → "Domains"
  - Add your domain
  - Follow DNS setup instructions
  - SSL/HTTPS is automatic

---

## Phase 9: Maintenance Tasks 📋

- [ ] **Regular Checks** (do monthly)
  - [ ] Check Supabase database usage
  - [ ] Check Google Cloud billing
  - [ ] Check Vercel deployment status
  - [ ] Update npm dependencies: `npm update`

- [ ] **Backup** (do before major updates)
  - Export Supabase data via their backup feature
  - Keep a copy locally

---

## 🎯 Completion Checklist

Once all steps are done:
- [ ] Local development works
- [ ] Can create agents
- [ ] Can run agents and get AI responses
- [ ] Production deployed to Vercel
- [ ] Production agents work
- [ ] All credentials are private (not in git)
- [ ] Team members added to Google Cloud & Vercel (if applicable)

---

## ❓ Common Issues & Quick Fixes

| Issue | Solution |
|-------|----------|
| "Agent not found" locally | Restart `npm run dev` |
| "Failed to load agents" | Check Supabase URL and key in `.env.local` |
| "Failed to generate response" | Check `google-credentials.json` exists and is valid |
| Vercel deploy fails | Check environment variables in Vercel dashboard |
| Can't push to git | Make sure `google-credentials.json` is in `.gitignore` |
| Port 3000 already in use | Use different port: `npm run dev -- -p 3001` |

---

## 📚 Need Help?

- **Local Setup Issues?** → Check README.md
- **Deployment Issues?** → Check DEPLOYMENT.md
- **Code Issues?** → Check browser console (F12)
- **Google Cloud Issues?** → Check Cloud Console logs

---

## 🎉 Congratulations!

Your AI Agent Store is live! You can now:
- ✅ Build custom AI agents
- ✅ Publish agents to a marketplace
- ✅ Run agents with Google Gemini
- ✅ Share the platform with others

**Next Steps:**
1. Invite friends to create agents
2. Get feedback on the UX
3. Add new features (authentication, ratings, categories)
4. Monitor performance and costs
5. Plan monetization strategy

---

**Good luck! 🚀**
