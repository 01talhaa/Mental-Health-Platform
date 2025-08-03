'use client'

import { useState, useRef, useEffect } from 'react'
// import { getChatbotResponse } from '@/utils/chatbotLogic'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'

export default function Chatbot() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [showHistory, setShowHistory] = useState(false)
  const [sessions, setSessions] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  // Get userId from localStorage (from login info)
  const getUserId = () => {
    if (typeof window !== 'undefined') {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        return user?.user_id || user?.id || null
      } catch {
        return null
      }
    }
    return null
  }

  // Create a new chat session if not already created
  const createSession = async () => {
    const userId = getUserId()
    if (!userId) return null
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    try {
      const res = await fetch(`${baseUrl}/api/ai-chat/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
      if (!res.ok) throw new Error('Failed to create chat session')
      const data = await res.json()
      return data.session_id
    } catch (err) {
      console.error('Session error:', err)
      return null
    }
  }

  // Load chat history for session
  const loadChatHistory = async (sid) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    try {
      const res = await fetch(`${baseUrl}/api/ai-chat/sessions/${sid}/messages`)
      if (!res.ok) throw new Error('Failed to load chat history')
      const data = await res.json()
      // Map to UI format
      setMessages(
        data.map(msg => ({ text: msg.message_text, isUser: msg.sender === 'user' }))
      )
    } catch (err) {
      setMessages([])
      console.error('History error:', err)
    }
  }

  // On open, create session and load history
  useEffect(() => {
    if (isOpen && !sessionId) {
      (async () => {
        const sid = await createSession()
        if (sid) {
          setSessionId(sid)
          await loadChatHistory(sid)
        }
      })()
    } else if (isOpen && sessionId) {
      loadChatHistory(sessionId)
    }
    // eslint-disable-next-line
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (input.trim() === '' || !sessionId) return

    const userMessage = { text: input, isUser: true }
    setMessages(prevMessages => [...prevMessages, userMessage])
    setInput('')
    setIsLoading(true)

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    try {
      // Send user message
      const res = await fetch(`${baseUrl}/api/ai-chat/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageText: input })
      })
      if (!res.ok) throw new Error('Failed to send message')
      const data = await res.json()
      // Get AI reply from response
      if (data.sender === 'ai' && data.message_text) {
        const botMessage = { text: data.message_text, isUser: false }
        setMessages(prevMessages => [...prevMessages, botMessage])
      } else {
        // Fallback: reload chat history
        await loadChatHistory(sessionId)
      }
    } catch (error) {
      console.error('Error getting chatbot response:', error)
      const errorMessage = { text: "I'm sorry, I'm having trouble responding right now. Please try again later.", isUser: false }
      setMessages(prevMessages => [...prevMessages, errorMessage])
    }

    setIsLoading(false)
  }

  return (
    <div className="fixed bottom-32 right-4 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 1, scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0 }}
            className="bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <MessageCircle size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="bg-white rounded-lg shadow-md w-full max-w-md"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h1 className="text-2xl font-bold">Chatbot</h1>
              <div className="flex gap-2">
                {/* <button
                  onClick={async () => {
                    // Create new session and clear messages
                    setIsLoading(true)
                    setSessionId(null)
                    setMessages([])
                    const sid = await createSession()
                    if (sid) {
                      setSessionId(sid)
                      await loadChatHistory(sid)
                    }
                    setIsLoading(false)
                  }}
                  className="text-blue-500 hover:text-blue-700 border border-blue-500 rounded px-2 py-1 text-xs font-semibold mr-2"
                  title="Start New Session"
                >
                  New Session
                </button>
                <button
                  onClick={async () => {
                    setShowHistory(true)
                  }}
                  className="text-green-500 hover:text-green-700 border border-green-500 rounded px-2 py-1 text-xs font-semibold mr-2"
                  title="View Chat History"
                >
                  History
                </button> */}
                <button
                  onClick={() => {
                    setIsOpen(false)
                    setSessionId(null)
                    setMessages([])
                  }}
                  className="text-gray-500 hover:text-gray-700"
                  title="Close"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="h-[500px] flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-xs px-4 py-2 rounded-lg bg-gray-200 text-black">
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSubmit} className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your message..."
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
