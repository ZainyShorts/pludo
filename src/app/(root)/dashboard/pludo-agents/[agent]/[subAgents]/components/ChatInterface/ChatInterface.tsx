"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChatInput } from "../Input/Input"
import { Sparkles, Play, Pause } from "lucide-react"
import { sendMessage } from "@/redux/features/openAI/messageSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { ChatHeader } from "../Chat-header/Chat-header"
import { TypingLoader } from "../typing-Loader/Typing-Loader"
import { useAIFunctions } from "./Functions/Functions"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Image from "next/image"

interface MessageContent {
  text?: string
  url?: string[]
  audio?: string
}

interface Message {
  id: string
  sender: string
  content: MessageContent
}

interface ChatInterfaceProps {
  botName?: string
  botAvatar?: string
  mainAgent?: string
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ botName, botAvatar, mainAgent }) => {
  const dispatch = useAppDispatch()
  const { createThread, createMessage, deleteThread, AudioToText ,createMessageWithImage } = useAIFunctions()
  const messages = useAppSelector((state: { message: { messages: Message[] } }) => state.message.messages)
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [subAgent, setSubAgent] = useState<string>("")
  const chatEndRef = useRef<HTMLDivElement>(null)
  const [threadID, setThreadID] = useState<string>("")
  const [audioPlaying, setAudioPlaying] = useState<string | null>(null)

  useEffect(() => {
    if (threadID === "") {
      const create = async () => {
        const id = await createThread()
        setThreadID(id)
      }
      create()
    }
  }, [threadID, createThread])

  useEffect(() => {
    function formatBotName(name: string | undefined): string {
      if (!name) return ""
      return name.replace(/\s+/g, "_").toUpperCase()
    }

    if (botName) {
      setSubAgent(formatBotName(botName))
    }
  }, [botName])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])
    


  const handleSendMessage = async (content: MessageContent) => {
    if (content.audio) {
      const audioUrl = URL.createObjectURL(content.audio as any);
  
      const text = await AudioToText(content.audio);
  
      content.audio = audioUrl;
  
      content.text = (content.text || '') + text; 
  
      console.log('Audio to text:', text); 
      console.log('Audio URL:', content.audio); 
  }
  
    const userMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: "user",
      content,
    }
  
  
  
    dispatch(sendMessage(userMessage))
    const data = {
      assistantType: mainAgent,
      subType: subAgent,
      userPrompt: JSON.stringify(content.text), 
      token: 100,
    }

    setIsTyping(true)
    const res = await createMessage(data)
    const responseText = res.data

    const lines = responseText.split("\n")

    const messages = lines.filter((line : any) => line.startsWith("data:")).map((line : any ) => line.replace("data:", "").trim())

    const fullMessage = messages.join(" ")

    const botMessage = {
      id: (Date.now() + 1).toString(),
      sender: "bot",
      content: { text: fullMessage },
    }

    console.log(botMessage)
    dispatch(sendMessage(botMessage))
    setIsTyping(false)
  }

  useEffect(() => {
    return () => {
      deleteThread(threadID as string)
    }
  }, [])

  const toggleAudio = (audioUrl: string) => {
    if (audioPlaying === audioUrl) {
      setAudioPlaying(null)
      const audio = new Audio(audioUrl)
      audio.pause()
    } else {
      if (audioPlaying) {
        const prevAudio = new Audio(audioPlaying)
        prevAudio.pause()
      }
      setAudioPlaying(audioUrl)
      const audio = new Audio(audioUrl)
      audio.play()
    }
  }

  return (
    <div className="flex flex-col w-full md:w-[80%] h-[95vh] bg-gradient-to-b from-purple-950 via-gray-950 to-black">
      <div className="absolute lg:ml-64 inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

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
            messages.map((msg: Message, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl backdrop-blur-xl shadow-lg transform transition-all duration-200 ${
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-white/95 to-white/90 text-black ml-auto hover:shadow-purple-500/10"
                      : "bg-gradient-to-br from-gray-600/90 to-gray-700/80 text-white mr-auto hover:shadow-purple-500/10"
                  }`}
                >
                  {Object.keys(msg.content).length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="font-light space-y-2"
                    >
                      {msg.content.text && (
                        <Markdown remarkPlugins={[remarkGfm]} className="font-serif">
                          {msg.content.text}
                        </Markdown>
                      )}
                      {msg.content.url && msg.content.url.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {msg.content.url.map((img, index) => (
                            <Image
                              key={index}
                              src={img || "/placeholder.svg"}
                              alt="User uploaded image"
                              width={300}
                              height={200}
                              className="rounded-lg"
                            />
                          ))}
                        </div>
                      )}
                      {msg.content.audio && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleAudio(msg.content.audio as string)}
                            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                          >
                            {audioPlaying === msg.content.audio ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </button>
                          <span>Audio message</span>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <p>Empty message</p>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        {isTyping && <TypingLoader />}
        <div ref={chatEndRef} />
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-4 bg-gradient-to-t from-black/40 to-black/20 backdrop-blur-2xl border-t border-white/5"
      >
        <div className="flex items-end gap-2 w-full mx-auto">
          <div className="flex-1 relative">
            <ChatInput onSendMessage={handleSendMessage} allowImage={true} allowAudio={true} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

