'use client'

import { useState } from 'react'
import CreateChatbot from './create-chatbot'
import Messaging from './messaging'
import { motion } from 'framer-motion'

export default function Home() {
  const [activeTab, setActiveTab] = useState('create')

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 p-4 md:p-6 lg:p-8 flex flex-col">
      <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col">
        <header className="mb-6">
          <motion.h1 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-violet-200 to-fuchsia-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            AI Chatbot Studio
          </motion.h1>
        </header>
        
        <div className="w-full rounded-2xl overflow-hidden backdrop-blur-sm bg-purple-950/20 border border-purple-700/50 shadow-[0_0_25px_rgba(139,92,246,0.3)] mb-6">
          <div className="grid grid-cols-2 w-full">
            <button
              onClick={() => setActiveTab('create')}
              className={`py-4 px-6 flex items-center justify-center gap-2 transition-all duration-300 ${
                activeTab === 'create'
                  ? 'bg-purple-800/80 text-white font-medium'
                  : 'bg-transparent text-purple-300 hover:bg-purple-800/40'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bot">
                <path d="M12 8V4H8"></path>
                <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                <path d="M2 14h2"></path>
                <path d="M20 14h2"></path>
                <path d="M15 13v2"></path>
                <path d="M9 13v2"></path>
              </svg>
              Create Your Chatbot
            </button>
            <button
              onClick={() => setActiveTab('messaging')}
              className={`py-4 px-6 flex items-center justify-center gap-2 transition-all duration-300 ${
                activeTab === 'messaging'
                  ? 'bg-purple-800/80 text-white font-medium'
                  : 'bg-transparent text-purple-300 hover:bg-purple-800/40'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Messaging
            </button>
          </div>
        </div>
        
        <div className="flex-1 w-full">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === 'create' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {activeTab === 'create' ? <CreateChatbot /> : <Messaging />}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
