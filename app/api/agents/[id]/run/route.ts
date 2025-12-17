import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface RunRequest {
  input: string
}

interface AgentData {
  id: string
  name: string
  system_prompt: string
}

interface ApiResponse<T> {
  response?: T
  error?: string
}

// Initialize Google Cloud Vertex AI (dynamically imported to catch initialization errors)
let vertexAI: any = null
let model: any = null
let initializationError: string | null = null

async function initializeVertexAI() {
  if (vertexAI && model) {
    return { success: true }
  }

  if (initializationError) {
    return { success: false, error: initializationError }
  }

  try {
    const { VertexAI } = await import('@google-cloud/vertexai')

    if (!process.env.GOOGLE_PROJECT_ID) {
      throw new Error('GOOGLE_PROJECT_ID environment variable is not set')
    }

    vertexAI = new VertexAI({
      project: process.env.GOOGLE_PROJECT_ID,
      location: 'us-central1'
    })

    model = vertexAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    return { success: true }
  } catch (err: any) {
    initializationError = err.message
    console.error('Vertex AI initialization error:', err)
    return { success: false, error: initializationError }
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<string>>> {
  try {
    // Validate input
    const body = await request.json() as RunRequest

    if (!body.input || typeof body.input !== 'string') {
      return NextResponse.json(
        { error: 'Input message is required' },
        { status: 400 }
      )
    }

    const userInput = body.input.trim()
    if (userInput.length === 0) {
      return NextResponse.json(
        { error: 'Input message cannot be empty' },
        { status: 400 }
      )
    }

    if (userInput.length > 5000) {
      return NextResponse.json(
        { error: 'Input message is too long (max 5000 characters)' },
        { status: 400 }
      )
    }

    // Fetch agent from database
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('id, name, system_prompt')
      .eq('id', params.id)
      .single()

    if (agentError) {
      console.error('Database error fetching agent:', agentError)
      return NextResponse.json(
        { error: 'Failed to fetch agent' },
        { status: 500 }
      )
    }

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }

    // Initialize Vertex AI
    const initResult = await initializeVertexAI()
    if (!initResult.success) {
      return NextResponse.json(
        { error: `Google Cloud setup incomplete: ${initResult.error}. Please configure your environment variables.` },
        { status: 500 }
      )
    }

    // Generate response using Vertex AI
    try {
      const chat = model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: `SYSTEM INSTRUCTION: ${agent.system_prompt}` }]
          },
          {
            role: 'model',
            parts: [{ text: 'Understood. I will act as this agent.' }]
          }
        ]
      })

      const result = await chat.sendMessage(userInput)

      // Safely extract response
      const response = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text
      if (!response) {
        throw new Error('No response text received from Gemini')
      }

      return NextResponse.json({ response })
    } catch (aiError: any) {
      console.error('Gemini API error:', aiError)
      
      // Provide more helpful error messages
      let errorMessage = 'Failed to generate AI response'
      if (aiError.message?.includes('API key')) {
        errorMessage = 'Google Cloud API authentication failed. Check your GOOGLE_APPLICATION_CREDENTIALS.'
      } else if (aiError.message?.includes('permission')) {
        errorMessage = 'Permission denied. Check your Google Cloud project permissions.'
      } else if (aiError.message?.includes('quota')) {
        errorMessage = 'Rate limit exceeded. Please try again later.'
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      )
    }
  } catch (err: any) {
    console.error('POST /api/agents/[id]/run error:', err)

    const errorMessage = err instanceof SyntaxError
      ? 'Invalid JSON in request body'
      : err.message || 'An unexpected error occurred'

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
