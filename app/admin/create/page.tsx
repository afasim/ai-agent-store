'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateAgent() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', description: '', system_prompt: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/agents', { method: 'POST', body: JSON.stringify(form) })
    router.push('/')
  }

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New AI App</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">App Name</label>
          <input className="w-full border p-2 rounded text-black" required 
            onChange={e => setForm({...form, name: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <input className="w-full border p-2 rounded text-black" required 
            onChange={e => setForm({...form, description: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">System Prompt (The "Brain")</label>
          <textarea className="w-full border p-2 rounded h-32 text-black" required 
            placeholder="You are a helpful travel assistant..."
            onChange={e => setForm({...form, system_prompt: e.target.value})} />
        </div>
        <button type="submit" className="w-full bg-black text-white p-3 rounded font-bold">Publish App</button>
      </form>
    </main>
  )
}
