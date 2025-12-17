'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface FormData {
  name: string
  description: string
  system_prompt: string
}

interface FormErrors {
  name?: string
  description?: string
  system_prompt?: string
}

export default function CreateAgent() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({ 
    name: '', 
    description: '', 
    system_prompt: '' 
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!form.name.trim()) {
      newErrors.name = 'Agent name is required'
    } else if (form.name.length < 3) {
      newErrors.name = 'Agent name must be at least 3 characters'
    } else if (form.name.length > 100) {
      newErrors.name = 'Agent name must be less than 100 characters'
    }

    if (!form.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (form.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    } else if (form.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }

    if (!form.system_prompt.trim()) {
      newErrors.system_prompt = 'System prompt is required'
    } else if (form.system_prompt.length < 20) {
      newErrors.system_prompt = 'System prompt must be at least 20 characters'
    } else if (form.system_prompt.length > 2000) {
      newErrors.system_prompt = 'System prompt must be less than 2000 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setServerError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/agents', { 
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form) 
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create agent')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setServerError(errorMessage)
      console.error('Error creating agent:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-6 inline-block">
        ← Back to Store
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New AI Agent</h1>
        <p className="text-gray-600">Build a custom AI agent with a unique personality and purpose</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          ✓ Agent created successfully! Redirecting...
        </div>
      )}

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 p-8 rounded-lg shadow-sm">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-900">
            Agent Name <span className="text-red-500">*</span>
          </label>
          <input 
            type="text"
            className={`w-full border p-3 rounded-lg text-black focus:outline-none focus:ring-2 transition ${ 
              errors.name 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="e.g., Travel Planning Assistant"
            value={form.name}
            onChange={e => {
              setForm({...form, name: e.target.value})
              if (errors.name) setErrors({...errors, name: undefined})
            }}
            disabled={loading}
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          <p className="text-gray-500 text-xs mt-1">{form.name.length}/100 characters</p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-900">
            Description <span className="text-red-500">*</span>
          </label>
          <input 
            type="text"
            className={`w-full border p-3 rounded-lg text-black focus:outline-none focus:ring-2 transition ${ 
              errors.description 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="What does this agent do?"
            value={form.description}
            onChange={e => {
              setForm({...form, description: e.target.value})
              if (errors.description) setErrors({...errors, description: undefined})
            }}
            disabled={loading}
          />
          {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
          <p className="text-gray-500 text-xs mt-1">{form.description.length}/500 characters</p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-900">
            System Prompt (The "Brain") <span className="text-red-500">*</span>
          </label>
          <textarea 
            className={`w-full border p-3 rounded-lg h-40 text-black focus:outline-none focus:ring-2 transition resize-none ${ 
              errors.system_prompt 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="You are a helpful travel assistant. Suggest destinations, create itineraries, provide budget tips..."
            value={form.system_prompt}
            onChange={e => {
              setForm({...form, system_prompt: e.target.value})
              if (errors.system_prompt) setErrors({...errors, system_prompt: undefined})
            }}
            disabled={loading}
          />
          {errors.system_prompt && <p className="text-red-600 text-sm mt-1">{errors.system_prompt}</p>}
          <p className="text-gray-500 text-xs mt-1">{form.system_prompt.length}/2000 characters</p>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-3 rounded-lg font-bold transition"
        >
          {loading ? 'Publishing...' : 'Publish Agent'}
        </button>
      </form>
    </main>
  )
}
