'use client'

import { useState, useRef, useEffect } from 'react'
import { getChatbotResponse } from '@/utils/chatbotLogic'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'

export default function Chatbot() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (input.trim() === '') return

    const userMessage = { text: input, isUser: true }
    setMessages(prevMessages => [...prevMessages, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const botResponse = await getChatbotResponse(input)
      const botMessage = { text: botResponse, isUser: false }
      setMessages(prevMessages => [...prevMessages, botMessage])
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
            initial={{ opacity: 1, scale: 0.8 }}  // Ensure the button is visible at the start
            animate={{ scale: 1 }}  // Animate to full scale
            exit={{ scale: 0 }}  // Exit animation when closed
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
            // exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 1 }}
            className="bg-white rounded-lg shadow-md w-full max-w-md"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h1 className="text-2xl font-bold">Chatbot</h1>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
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
