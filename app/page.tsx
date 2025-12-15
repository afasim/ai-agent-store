'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [agents, setAgents] = useState<any[]>([])

  useEffect(() => {
    supabase.from('agents').select('*').then(({ data }) => setAgents(data || []))
  }, [])

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">AI App Store</h1>
        <Link href="/admin/create" className="bg-blue-600 text-white px-4 py-2 rounded">
          Build New Agent
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <div key={agent.id} className="border p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2">{agent.name}</h2>
            <p className="text-gray-600 mb-4">{agent.description}</p>
            <Link href={`/agent/${agent.id}`} className="text-blue-600 font-medium hover:underline">
              Run App →
            </Link>
          </div>
        ))}
      </div>
    </main>
  )
}
