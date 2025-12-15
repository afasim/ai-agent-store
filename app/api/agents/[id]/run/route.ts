import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: Request, { params }: { params: { id: string } }) {
  // 1. Get user input
  const { input } = await request.json()
  
  // 2. Fetch the agent's "Brain" (System Prompt) from DB
  const { data: agent } = await supabase.from('agents').select('system_prompt').eq('id', params.id).single()
  
  if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 })

  // 3. Run the AI
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini", // Cost effective model
    messages: [
      { role: "system", content: agent.system_prompt },
      { role: "user", content: input }
    ],
  })

  return NextResponse.json({ response: completion.choices[0].message.content })
}
