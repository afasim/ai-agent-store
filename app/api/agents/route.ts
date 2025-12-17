import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface Agent {
  name: string
  description: string
  system_prompt: string
}

interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// Validate agent data
function validateAgent(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.name || typeof data.name !== 'string') {
    errors.push('Name is required and must be a string')
  } else if (data.name.trim().length < 3) {
    errors.push('Name must be at least 3 characters')
  } else if (data.name.length > 100) {
    errors.push('Name must not exceed 100 characters')
  }

  if (!data.description || typeof data.description !== 'string') {
    errors.push('Description is required and must be a string')
  } else if (data.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters')
  } else if (data.description.length > 500) {
    errors.push('Description must not exceed 500 characters')
  }

  if (!data.system_prompt || typeof data.system_prompt !== 'string') {
    errors.push('System prompt is required and must be a string')
  } else if (data.system_prompt.trim().length < 20) {
    errors.push('System prompt must be at least 20 characters')
  } else if (data.system_prompt.length > 2000) {
    errors.push('System prompt must not exceed 2000 characters')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Agent>>> {
  try {
    // Parse request body
    const body = await request.json()
    
    // Validate agent data
    const validation = validateAgent(body)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errors.join('; ') },
        { status: 400 }
      )
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('agents')
      .insert([{
        name: body.name.trim(),
        description: body.description.trim(),
        system_prompt: body.system_prompt.trim()
      }])
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: `Failed to create agent: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    console.error('POST /api/agents error:', err)
    const errorMessage = err instanceof SyntaxError 
      ? 'Invalid JSON in request body' 
      : err.message || 'An unexpected error occurred'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

export async function GET(): Promise<NextResponse<Agent[] | ApiResponse<null>>> {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: `Failed to fetch agents: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(data || [])
  } catch (err: any) {
    console.error('GET /api/agents error:', err)
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
