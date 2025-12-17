# AI Agent Store

An open-source marketplace for building, publishing, and running custom AI agents powered by Google Gemini. Think of it as an "App Store" for AI assistants.

## 🎯 What Is This?

The AI Agent Store lets you:
- **Build** custom AI agents by simply writing system prompts
- **Publish** agents to a marketplace for others to discover
- **Interact** with agents through a real-time chat interface
- **No Code Required** - anyone can create agents without programming knowledge

**Real-world examples:**
- Travel Planning Assistant - helps users plan trips
- Code Review Expert - analyzes and reviews code
- Creative Writing Coach - brainstorms story ideas
- Recipe Generator - creates recipes from available ingredients

## ✨ Features

- ✅ **Build Custom AI Agents** - Create agents with custom system prompts
- ✅ **Agent Marketplace** - Browse and run published agents
- ✅ **Real-time AI Interaction** - Chat with agents powered by Google Gemini
- ✅ **Message History** - See full conversation context
- ✅ **Error Handling** - Clear error messages and validation
- ✅ **Responsive Design** - Beautiful UI for desktop and mobile
- ✅ **TypeScript** - Full type safety throughout

## 🏗️ Tech Stack

| Component | Technology | Why |
|-----------|-----------|-----|
| **Frontend** | Next.js 14 (App Router) + React + TailwindCSS | Modern, fast, great DX |
| **Backend** | Next.js API Routes | Serverless, easy deployment |
| **Database** | Supabase (PostgreSQL) | Open-source, free tier, easy to self-host |
| **AI Engine** | Google Vertex AI (Gemini 1.5 Flash) | Fast, cost-effective, paid via Google Cloud |
| **Language** | TypeScript | Type safety and better DX |

## 📋 Prerequisites

- **Node.js** 18+ installed ([download](https://nodejs.org))
- **Supabase** account (free tier works) - [sign up here](https://supabase.com)
- **Google Cloud** project with Vertex AI enabled
- **Git** for cloning the repository

## 🚀 Local Setup Guide

### Step 1: Clone and Install

```bash
git clone https://github.com/afasim/ai-agent-store.git
cd ai-agent-store
npm install
```

### Step 2: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and sign up for free
2. Create a new project (remember your password)
3. In the **SQL Editor**, run this SQL to create the agents table:

```sql
create table agents (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  system_prompt text not null
);

-- Add indexes for better performance
create index idx_agents_created_at on agents(created_at);
```

4. Get your credentials:
   - Go to **Project Settings** → **API**
   - Copy **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - Copy the **anon/public key** under `Project API keys`

### Step 3: Set Up Google Cloud & Vertex AI

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable these APIs:
   - **Vertex AI API**
   - **Compute Engine API**

4. Create a Service Account:
   - Go to **IAM & Admin** → **Service Accounts**
   - Click **Create Service Account**
   - Give it a name (e.g., "ai-agent-store-bot")
   - Click **Create and Continue**
   - Grant it the role: **Vertex AI Service Agent** or **Editor** (for testing)
   - Click **Continue** and **Done**

5. Create a JSON Key:
   - Click the service account you just created
   - Go to the **Keys** tab
   - Click **Add Key** → **Create new key**
   - Select **JSON**
   - This will download a `google-credentials.json` file
   - Save it in your project root: `./google-credentials.json`

**SECURITY WARNING:** Never commit this file to git! It contains your API credentials.

### Step 4: Set Up Environment Variables

1. Create `.env.local` in your project root:

```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and fill in your values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Google Cloud Configuration
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=google-credentials.json
```

**Explanation of each variable:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL (public, safe to expose)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (public, safe to expose)
- `GOOGLE_PROJECT_ID` - Your Google Cloud project ID (find it in Cloud Console)
- `GOOGLE_APPLICATION_CREDENTIALS` - Path to your service account JSON file

### Step 5: Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the AI Agent Store homepage! 🎉

## 📖 Usage Guide

### Creating an Agent

1. Click **"+ Build New Agent"** button
2. Fill in the form:
   - **Agent Name**: Short, descriptive name (e.g., "Travel Expert")
   - **Description**: What the agent does (e.g., "Suggests travel destinations and creates itineraries")
   - **System Prompt**: The agent's personality and instructions
3. Click **"Publish Agent"**

**Good System Prompt Examples:**

```
You are a helpful travel assistant with expertise in budget travel. You suggest destinations based on user preferences, create detailed itineraries, provide cost estimates, and give insider tips. Always consider the user's budget and preferences.
```

```
You are a code review expert with 15 years of experience. Review code for performance, security, maintainability, and best practices. Provide actionable feedback with examples. Ask clarifying questions if needed.
```

```
You are a creative writing coach. Help users develop story ideas, characters, plot structures, and dialogue. Provide writing exercises and feedback on drafts. Be encouraging and constructive.
```

**Tips for great prompts:**
- Be specific about the agent's role and expertise
- Mention the tone (helpful, formal, casual, etc.)
- Include specific behaviors or constraints
- Length: 50-500 words works best

### Running an Agent

1. Browse the homepage to see published agents
2. Click **"Run App"** on any agent
3. Type your question or request in the input box
4. Press **Enter** or click **"Send"**
5. Wait for the AI response
6. Continue the conversation naturally

## 🔧 Troubleshooting

### "Agent not found" error
- Make sure the agent was published successfully
- Refresh the page and try again
- Check the browser console for more details

### "Failed to load agents" error
- Check your Supabase connection:
  - Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
  - Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
  - Check that the `agents` table exists in your database

### "Failed to generate AI response" error
- **Google Cloud setup incomplete:**
  - Verify `GOOGLE_PROJECT_ID` is correct
  - Verify `google-credentials.json` exists and is valid
  - Check that Vertex AI API is enabled
  - Check that your service account has the correct permissions

- **Authentication issues:**
  - Re-download your service account JSON file
  - Verify the file is in your project root
  - Don't commit the file to git

- **Rate limiting:**
  - You may have exceeded your quota
  - Wait a few minutes and try again

### "Invalid JSON" error
- Make sure you're sending valid JSON in API requests
- Check the browser's Network tab in DevTools

### Port 3000 already in use
```bash
# Use a different port
npm run dev -- -p 3001
```

## 🚀 Deployment Guide

### Deploy to Vercel (Recommended)

Vercel is the company behind Next.js and the easiest way to deploy.

1. **Push to GitHub:**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New..." → "Project"
   - Select your repository
   - Click "Import"

3. **Set Environment Variables:**
   - In the "Environment Variables" section, add:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `GOOGLE_PROJECT_ID`
     - `GOOGLE_APPLICATION_CREDENTIALS` - **⚠️ IMPORTANT:** Paste the entire contents of your `google-credentials.json` file here

   **SECURITY WARNING:** These are production secrets. Use Vercel's secret management carefully.

4. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app is live!

**Important:** Make sure you've completed the Google Cloud setup (Steps 3-5 in Local Setup) before deploying, otherwise Vertex AI won't work.

### Manual Deployment (Other Platforms)

For AWS, Heroku, Railway, etc., the steps are similar:
1. Push code to your Git provider
2. Connect your repository to your deployment platform
3. Set environment variables
4. Deploy

**Note:** Google Vertex AI requires authentication via the service account file. Some platforms may have limitations with file-based auth. Research your platform's docs for handling sensitive files.

## 📊 Database Schema

The `agents` table has this structure:

```
id: UUID (auto-generated)
created_at: Timestamp (auto-generated)
name: Text (required)
description: Text (optional)
system_prompt: Text (required)
```

Future enhancements could add:
- `user_id` - Track who created each agent
- `rating` - Average user rating
- `usage_count` - Track popularity
- `updated_at` - Track modifications
- `tags` - Categorize agents

## 🔒 Security Considerations

- **Never commit `google-credentials.json` to git** - Add it to `.gitignore`
- **Never expose `GOOGLE_PROJECT_ID` with full credentials** - Only use it server-side
- Environment variables in Vercel are encrypted
- Supabase uses row-level security (RLS) - consider adding it for production
- Add rate limiting to API routes in production
- Validate and sanitize all user inputs (this is already done in the code)

## 🎓 Learning Resources

### Google Gemini & Vertex AI
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Gemini API Guide](https://cloud.google.com/vertex-ai/docs/generative-ai/start/quickstarts/quickstart-multimodal)

### System Prompts & Prompt Engineering
- [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [Claude Prompt Engineering](https://docs.anthropic.com/en/docs/build-a-prompt)

### Next.js & React
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TailwindCSS](https://tailwindcss.com)

### Supabase
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Guide](https://www.postgresql.org/docs/)

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- User authentication (so creators own their agents)
- Agent ratings and reviews
- Categories and tagging system
- Analytics and usage tracking
- Multi-language support
- Mobile app
- API access for third-party integrations

## 📝 License

This project is open source and available under the MIT License.

## 🙋 Support

Having issues? Try these:
1. Read the **Troubleshooting** section above
2. Check the [GitHub Issues](https://github.com/afasim/ai-agent-store/issues)
3. Look at the browser console for error messages
4. Check the server logs for backend errors

## 🚀 Future Roadmap

- [ ] User authentication & authorization
- [ ] Agent analytics (views, ratings, usage)
- [ ] Conversation history (persistent storage)
- [ ] Agent versioning
- [ ] Custom agent scheduling/automation
- [ ] Webhook integrations
- [ ] API access for developers
- [ ] Multi-modal support (images, documents, voice)
- [ ] Agent marketplace monetization
- [ ] Premium tier with advanced features

---

Built with ❤️ using Next.js, Supabase, and Google Gemini

### Running an Agent

1. Click on any agent card from the home page
2. Type your query in the input box
3. Press Enter or click **"Run"**
4. The AI response will appear above

## Project Structure

```
ai-agent-store/
├── app/
│   ├── api/
│   │   └── agents/
│   │       ├── route.ts           # Create/list agents
│   │       └── [id]/run/route.ts  # Run AI with agent's prompt
│   ├── admin/create/page.tsx  # Agent creation form
│   ├── agent/[id]/page.tsx    # Agent runner UI
│   └── page.tsx               # Home page (marketplace)
├── lib/
│   └── supabase.ts            # Supabase client
├── package.json
└── .env.local.example
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables in Vercel settings
4. Deploy!

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

MIT

## Author

Built by [afasim](https://github.com/afasim)
