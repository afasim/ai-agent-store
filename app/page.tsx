'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Agent {
  id: string
  name: string
  description: string
  created_at?: string
}

export default function Home() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from('agents')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (fetchError) {
          setError(`Failed to load agents: ${fetchError.message}`)
          return
        }
        
        setAgents(data || [])
        setError(null)
      } catch (err) {
        setError('An unexpected error occurred while loading agents')
        console.error('Error fetching agents:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [])

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">AI Agent Store</h1>
          <p className="text-gray-600">Build, publish, and run custom AI agents</p>
        </div>
        <Link 
          href="/admin/create" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-md"
        >
          + Build New Agent
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 w-full bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      ) : agents.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg mb-4">No AI agents published yet</p>
          <Link 
            href="/admin/create" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            Create the first agent
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map((agent) => (
            <div 
              key={agent.id} 
              className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-lg hover:border-blue-300 transition duration-200 cursor-pointer group"
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition">
                {agent.name}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{agent.description}</p>
              <Link 
                href={`/agent/${agent.id}`} 
                className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition group-hover:gap-2 gap-1"
              >
                Run App <span className="transition group-hover:translate-x-1">→</span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
