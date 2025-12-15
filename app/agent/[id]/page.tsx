'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function RunAgent({ params }: { params: { id: string } }) {
  const [agent, setAgent] = useState<any>(null)
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('agents').select('*').eq('id', params.id).single()
      .then(({ data }) => setAgent(data))
  }, [params.id])

  const runAI = async () => {
    if (!input) return
    setLoading(true)
    const res = await fetch(`/api/agents/${params.id}/run`, {
      method: 'POST', body: JSON.stringify({ input })
    })
    const data = await res.json()
    setResponse(data.response)
    setLoading(false)
  }

  if (!agent) return <div className="p-8">Loading...</div>

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{agent.name}</h1>
      <p className="text-gray-600 mb-8">{agent.description}</p>

      <div className="bg-gray-50 p-6 rounded-lg border min-h-[200px] mb-6 whitespace-pre-wrap">
        {response || <span className="text-gray-400">AI response will appear here...</span>}
      </div>

      <div className="flex gap-2">
        <input 
          className="flex-1 border p-3 rounded text-black"
          placeholder="Ask something..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && runAI()}
        />
        <button 
          onClick={runAI} 
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded disabled:opacity-50">
          {loading ? 'Running...' : 'Run'}
        </button>
      </div>
    </main>
  )
}
