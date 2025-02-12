"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChatInput } from "../Input/Input"
import { Sparkles, Play, Pause ,Volume2 ,Files } from "lucide-react"
import { sendMessage , updateBotMessage } from "@/redux/features/openAI/messageSlice"
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
  const {  createMessage, AudioToText, createMessageWithImage , createMessageStream } = useAIFunctions()
  const messages = useAppSelector((state: { message: { messages: Message[] } }) => state.message.messages)
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [subAgent, setSubAgent] = useState<string>("")
  const chatEndRef = useRef<HTMLDivElement>(null)
  const [audioPlaying, setAudioPlaying] = useState<string | null>(null)

  
  const [disable , setDisable ] = useState(false);

  useEffect(() => {
    function formatBotName(name: string | undefined): string {
      if (!name) return ""
      return name.replace(/[-\s]+/g, "_").toUpperCase()
    }
  
    if (botName) {
      setSubAgent(formatBotName(botName))
    } 
    console.log('sub', formatBotName(botName))
  }, [botName])
  

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (content: MessageContent) => { 
    if (!content.url) {  
      setDisable(true);
      const userMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "user",
        content,
      }
       
      dispatch(sendMessage(userMessage))  
      let audioText = '';
    
      try {
        // Handle audio processing if present
        if (content.audio) {
          const response = await fetch(content.audio)
          const audioBlob = await response.blob()
          const webmBlob = new Blob([audioBlob], { type: "audio/webm" })
          const text: any = await AudioToText(webmBlob as File)
          
          if (text.data.data !== "") {
            audioText = text.data.data
          }
          console.log("Audio URL:", content.audio)
        }
    
        // Prepare data for API call
        const data = {
          assistantType: mainAgent,
          subType: subAgent,
          userPrompt: JSON.stringify(content.text + audioText),
          token: 100,
        }
    
    
        // Create an initial bot message
        const botMessageId = (Date.now() + 2).toString();
        const initialBotMessage: Message = {
          id: botMessageId,
          sender: "bot",
          content: { text: "" },
        }
        dispatch(sendMessage(initialBotMessage)) 
        
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_PLUDO_SERVER}/openai/stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
    
        if (!response.body) {
          throw new Error('No response body');
        }
    
        const reader = response.body.getReader(); 
        const decoder = new TextDecoder(); 
        let buffer = ''; 
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
    
          let cleanedText = '';
          
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; 
    
          for (const line of lines) {
            if (line.trim()) {
              // Remove "data:" prefix and clean up the text
              const cleanLine = line 
                .replace(/id:\s*\d+\s*/g, '')
                .replace(/^data:\s*/, '')   
                .replace(/\\n/g, '\n')     // Handle escaped newlines
                .replace(/\\\"/g, '"')     // Handle escaped quotes
                .replace(/\\t/g, '\t')     // Handle escaped tabs
                .replace(/\d+\\\nid:\s*\d+\\ndata:\s*/g, '') // Remove id markers 

                .trim();
    
              if (cleanLine) {
                cleanedText += cleanLine + ' ';
              }
            }
          }
    
          if (cleanedText) {
            dispatch(updateBotMessage({ 
              id: botMessageId, 
              chunk: cleanedText
            })); 
          } 
        }
    
        setDisable(false);
    
      } catch (error) {
        console.error('Error in message processing:', error);
        setIsTyping(false);
        setDisable(false);
      }
    }
    if (content.url) { 
      setDisable(true);
      const userMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "user",
        content,
      }
      dispatch(sendMessage(userMessage)) 
      setIsTyping(true)
      let audiotext = '';


      if (content.audio) {
        const response = await fetch(content.audio)
        const audioBlob = await response.blob()

        const webmBlob = new Blob([audioBlob], { type: "audio/webm" })

        const text: any = await AudioToText(webmBlob as File)
        console.log("text", text.data.data)
        if (text.data.data !== "") { 
          audiotext = text.data.data;
        }

      }

      const data = {
        assistantType: mainAgent,
        subType: subAgent,
        userPrompt: content.text + audiotext,
        url: content.url,
        token: 100,
      }

      const response = await createMessageWithImage(data)
      console.log(response)


      const lines = response.data.split("\n")

      const messages = lines
        .filter((line: any) => line.startsWith("data:"))
        .map((line: any) => line.replace("data:", "").trim())

      const fullMessage = messages.join(" ")

      const botMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        content: { text: fullMessage },
      }

      dispatch(sendMessage(botMessage))
      setIsTyping(false) 
      setDisable(false);
    }
  }



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
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
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
                        <Markdown children={msg.content.text} remarkPlugins={[remarkGfm]} className="font-serif"/>
                      )}
                      {msg.content.url && msg.content.url.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {msg.content.url.map((img, index) => (
                            <Image
                              key={index}
                              src={img || "/placeholder.svg"}
                              alt="User uploaded image"
                              width={100}
                              height={100}
                              className="rounded-lg w-[60px] h-[60px] lg:w-[100px] lg:h-[100px] bg-slate-400"
                              style={{ objectFit: "cover" }}
                              loading="eager"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder.svg"
                              }}
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
                {msg.sender === "bot" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.2 }}
                    className="mt-2 flex gap-2 ml-4"
                  >
                    <div className="p-1 text-white rounded-full shadow-md transition-transform hover:scale-110 cursor-pointer">
                      <Volume2  size={18} />
                    </div> 
                    <div className="p-1 text-white rounded-full shadow-md transition-transform hover:scale-110 cursor-pointer">
                      <Files   size={18} />
                    </div>
                  </motion.div>
                )}
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
            <ChatInput onSendMessage={handleSendMessage} allowImage={true} allowAudio={true} disable= {disable} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

