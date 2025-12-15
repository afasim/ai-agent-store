# AI Agent Store

An open-source marketplace for building, publishing, and running AI agents. Built with Next.js, Supabase, and OpenAI.

## Features

- ✅ **Build Custom AI Agents** - Create agents with custom system prompts
- ✅ **Agent Marketplace** - Browse and run published agents
- ✅ **Real-time AI Interaction** - Chat with agents powered by OpenAI
- ✅ **Simple Architecture** - Clean Next.js App Router + Supabase backend

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4o-mini
- **TypeScript** for type safety

## Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)
- OpenAI API key

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/afasim/ai-agent-store.git
cd ai-agent-store
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, run this SQL to create the agents table:

```sql
create table agents (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  system_prompt text not null,
  tags text
);
```

3. Go to Project Settings > API and copy:
   - Project URL
   - `anon` `public` key

### 4. Set up environment variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and add your keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating an Agent

1. Click **"Build New Agent"** on the home page
2. Fill in:
   - **App Name**: Short, descriptive name
   - **Description**: What the agent does
   - **System Prompt**: The agent's "brain" - instructions for how it should behave
3. Click **"Publish App"**

**Example System Prompts:**
- `"You are a helpful travel assistant. Suggest destinations and itineraries."`
- `"You are a code review expert. Analyze code and suggest improvements."`
- `"You are a creative writing coach. Help users brainstorm story ideas."`

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
