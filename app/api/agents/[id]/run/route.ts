import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { VertexAI } from '@google-cloud/vertexai'

// Initialize Google Cloud Vertex AI
const vertexAI = new VertexAI({
  project: process.env.GOOGLE_PROJECT_ID,
  location: 'us-central1' // Standard Google Cloud location
});

// Select the Gemini model (Google's competitor to GPT-4)
const model = vertexAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    // 1. Get User Input
    const { input } = await request.json()

    // 2. Fetch the Agent's "Persona" from your Open Source DB
    const { data: agent } = await supabase
      .from('agents')
      .select('system_prompt')
      .eq('id', params.id)
      .single()
    
    if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 })

    // 3. Send to Google Gemini
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: `SYSTEM INSTRUCTION: ${agent.system_prompt}` }] },
        { role: 'model', parts: [{ text: "Understood. I will act as this agent." }] }
      ],
    });

    const result = await chat.sendMessage(input);
    const response = result.response.candidates[0].content.parts[0].text;

    return NextResponse.json({ response })

  } catch (error: any) {
    console.error("Google AI Error:", error)
    return NextResponse.json({ error: error.message || 'AI generation failed' }, { status: 500 })
  }
}
