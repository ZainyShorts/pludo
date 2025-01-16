'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatInput } from '../Input/Input'
import { Sparkles } from 'lucide-react'
import { ChatHeader } from '../Chat-header/Chat-header'
import type { ChatInterfaceProps, Message } from '../types/chat'
import { TypingLoader } from '../typing-Loader/Typing-Loader'

export const ChatInterface = ({ botName, botAvatar }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
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
      
      setIsTyping(true)
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          content: `Response to: ${message.trim()}`
        }
        setMessages(prev => [...prev, botMessage])
        setIsTyping(false)
      }, 2000)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-purple-950 via-gray-950 to-black">
      <div className="absolute lg:ml-64 inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Messages Area with enhanced scrollbar */}
      <ChatHeader botName={botName} botAvatar={botAvatar} />
      <div className="flex-1 p-8 overflow-y-auto space-y-4 relative scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20"> 

        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center mt-10 justify-center space-y-4"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 flex items-center justify-center backdrop-blur-xl border border-white/10">
                <Sparkles className="w-12 h-12 text-white/40 animate-pulse" />
              </div>
              <p className="text-lg font-light tracking-wide text-white/60 bg-white/5 px-6 py-2 rounded-full backdrop-blur-xl border border-white/10">
                Your messages will be shown here
              </p>
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
                  className={`max-w-[80%] p-4 rounded-2xl backdrop-blur-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-white/95 to-white/90 text-black ml-auto hover:shadow-purple-500/10'
                      : 'bg-gradient-to-br from-white/10 to-transparent text-white hover:bg-white/20 border border-white/10 hover:border-white/20'
                  }`}
                >
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="font-light"
                  >
                    {message.content}
                  </motion.p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        {isTyping && <TypingLoader />}
        <div ref={chatEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-4 bg-gradient-to-t from-black/40 to-black/20 backdrop-blur-2xl border-t border-white/5"
      >
        <div className="flex items-end gap-2 w-full mx-auto">
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

