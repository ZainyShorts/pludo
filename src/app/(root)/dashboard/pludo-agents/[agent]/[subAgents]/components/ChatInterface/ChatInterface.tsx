'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatInput } from '../Input'
import { Sparkles, Stars } from 'lucide-react'
import { ChatHeader } from '../Chat-header/Chat-header'
import type { ChatInterfaceProps, Message } from '../types/chat'

export const ChatInterface = ({ botName, botAvatar }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendImage = (image: File) => {
    console.log('Image:', image)
  }

  const handleSendAudio = (audio: Blob) => {
    console.log('Audio:', audio)
    const url = URL.createObjectURL(audio)
    const audio_element = new Audio(url)
    audio_element.play()
  }

  const handleSendMessage = (message: string) => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        content: message.trim()
      }
      setMessages(prev => [...prev, newMessage])
      setInput('')
      
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          content: `Response to: ${message.trim()}`
        }
        setMessages(prev => [...prev, botMessage])
      }, 1000)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute lg:ml-[280px] inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjMiIGN5PSIzIiByPSIxIi8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      </div>
      
      {/* Messages Area */}
      <ChatHeader botName={botName} botAvatar={botAvatar} />
      <div className="flex-1 p-4 overflow-y-auto space-y-4 relative"> 

        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col  items-center justify-center h-full space-y-4 text-gray-400"
            >
              <Stars className="w-12 h-12 animate-pulse" />
              <p className="text-lg font-light tracking-wide">Your messages will be shown here</p>
              <Sparkles className="w-6 h-6 animate-bounce" />
            </motion.div>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl backdrop-blur-md shadow-lg transform transition-all duration-200 hover:scale-[1.02] ${
                    message.sender === 'user'
                      ? 'bg-white text-black ml-auto hover:shadow-white/20'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                  }`}
                >
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {message.content}
                  </motion.p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-4 bg-black/20 backdrop-blur-xl border-t border-white/10"
      >
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <ChatInput
              onSendMessage={handleSendMessage}
              onSendImage={handleSendImage}
              onSendAudio={handleSendAudio}
              allowImage={true}
              allowAudio={true}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

