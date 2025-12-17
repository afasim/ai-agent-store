'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Agent {
  id: string
  name: string
  description: string
  system_prompt: string
}

interface Message {
  id: string
  text: string
  sender: 'user' | 'agent'
  timestamp: Date
}

export default function RunAgent({ params }: { params: { id: string } }) {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [agentLoading, setAgentLoading] = useState(true)
  const [agentError, setAgentError] = useState<string | null>(null)
  
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [inputError, setInputError] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch agent details
  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setAgentLoading(true)
        const { data, error } = await supabase
          .from('agents')
          .select('*')
          .eq('id', params.id)
          .single()
        
        if (error) {
          setAgentError(`Failed to load agent: ${error.message}`)
          return
        }

        if (!data) {
          setAgentError('Agent not found')
          return
        }

        setAgent(data)
        setAgentError(null)
      } catch (err) {
        setAgentError('An unexpected error occurred while loading the agent')
        console.error('Error fetching agent:', err)
      } finally {
        setAgentLoading(false)
      }
    }

    fetchAgent()
  }, [params.id])

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) {
      setInputError('Please enter a message')
      return
    }

    if (input.length > 5000) {
      setInputError('Message is too long (max 5000 characters)')
      return
    }

    setLoading(true)
    setInputError(null)

    // Add user message to UI immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')

    try {
      const response = await fetch(`/api/agents/${params.id}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: userMessage.text })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to get AI response')
      }

      const data = await response.json()
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'No response received',
        sender: 'agent',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, agentMessage])
    } catch (err) {
      const errorText = err instanceof Error ? err.message : 'An unexpected error occurred'
      
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Error: ${errorText}`,
        sender: 'agent',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
      
      setInputError(errorText)
      console.error('Error running agent:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (agentLoading) {
    return (
      <main className="p-8 max-w-3xl mx-auto">
        <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-6 inline-block">
          ← Back to Store
        </Link>
        <div className="flex justify-center items-center py-32">
          <div className="animate-pulse text-center">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4 mx-auto"></div>
            <div className="h-20 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      </main>
    )
  }

  if (agentError) {
    return (
      <main className="p-8 max-w-3xl mx-auto">
        <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-6 inline-block">
          ← Back to Store
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {agentError}
        </div>
      </main>
    )
  }

  if (!agent) {
    return (
      <main className="p-8 max-w-3xl mx-auto">
        <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-6 inline-block">
          ← Back to Store
        </Link>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-lg">
          Agent not found
        </div>
      </main>
    )
  }

  return (
    <main className="p-8 max-w-3xl mx-auto h-screen flex flex-col">
      <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-6 inline-block">
        ← Back to Store
      </Link>

      <div className="mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold mb-2">{agent.name}</h1>
        <p className="text-gray-600">{agent.description}</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mb-6 bg-gray-50 rounded-lg p-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <p className="text-gray-500 text-lg mb-2">Start a conversation</p>
              <p className="text-gray-400 text-sm">Ask {agent.name} anything...</p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none shadow-sm'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
              <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {inputError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
          {inputError}
        </div>
      )}

      <div className="flex gap-2">
        <textarea
          className="flex-1 border border-gray-300 p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Type your message... (Shift+Enter for new line, Enter to send)"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            if (inputError) setInputError(null)
          }}
          onKeyDown={handleKeyPress}
          disabled={loading}
          rows={3}
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition h-fit"
        >
          {loading ? 'Running...' : 'Send'}
        </button>
      </div>
    </main>
  )
}
