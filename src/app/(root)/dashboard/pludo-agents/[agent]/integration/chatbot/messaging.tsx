"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MessageSquare, Bot, Clock, Search, Trash, Trash2, Edit, Link, Check, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useSession, useUser } from "@descope/nextjs-sdk/client"
import { toast } from "react-toastify"
import { DeleteChatbotModal } from "./confirmation"
import type { Chatbot } from "./page" // Import the Chatbot interface from page.tsx

interface MessagingProps {
  onEditChatbot: (chatbot: Chatbot) => void
}

interface Conversation {
  id: string
  title: string
  date: string
  messages: {
    id: number
    sender: string
    text: string
  }[]
}

export default function Messaging({ onEditChatbot }: MessagingProps) {
  const [selectedHistory, setSelectedHistory] = useState<string | null>(null)
  const [selectedChatbot, setSelectedChatbot] = useState<string | null>(null)
  const [chatbots, setChatbots] = useState<Chatbot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [chatbotToDelete, setChatbotToDelete] = useState<Chatbot | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Get user from Descope
  const { user } = useUser()
  const { isAuthenticated, isSessionLoading, sessionToken } = useSession()
  const ID = user?.userId

  // Fetch chatbots data
  useEffect(() => {
    const fetchChatbots = async () => {
      if (!ID || isSessionLoading) return

      try {
        setIsLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_PLUDO_SERVER}/chatbot/${ID}`)

        if (!response.ok) {
          throw new Error("Failed to fetch chatbots")
        }

        const data = await response.json()
        setChatbots(data)
      } catch (err) {
        console.error("Error fetching chatbots:", err)
        setError("Failed to load chatbots. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchChatbots()
  }, [ID, isSessionLoading])

  // Find the selected history based on IDs
  const selectedChatbotData = chatbots.find((bot) => bot._id === selectedChatbot)
  const selectedHistoryData = selectedChatbotData?.conversations?.find((hist) => hist.id === selectedHistory)

  const copyLinkToClipboard = (id: string, e: React.MouseEvent) => {
    const link = `${window.location.origin}/dashboard/pludo-agents/Maverik/integration/${id}`
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopiedLinkId(id)
        setTimeout(() => setCopiedLinkId(null), 2000) // Reset after 2 seconds
        toast.success("Link copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy link:", err)
        toast.error("Failed to copy link")
      })
  }

  const handleEditClick = (chatbot: Chatbot, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent accordion from toggling
    onEditChatbot(chatbot) // Pass the chatbot data to the parent component
  }

  const openDeleteModal = (chatbot: Chatbot, e: React.MouseEvent) => {
    e.stopPropagation()
    setChatbotToDelete(chatbot)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setChatbotToDelete(null)
  }

  const deleteChatbot = async () => {
    if (!chatbotToDelete) return

    setDeletingId(chatbotToDelete._id)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PLUDO_SERVER}/chatbot/${chatbotToDelete._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete chatbot")
      }

      // Remove the deleted chatbot from state
      setChatbots((prevChatbots) => prevChatbots.filter((bot) => bot._id !== chatbotToDelete._id))

      // If the deleted chatbot was selected, clear the selection
      if (selectedChatbot === chatbotToDelete._id) {
        setSelectedChatbot(null)
        setSelectedHistory(null)
      }

      toast.success("Chatbot deleted successfully")
    } catch (error) {
      console.error("Error deleting chatbot:", error)
      toast.error("Failed to delete chatbot")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <motion.div
      className="w-full h-full rounded-2xl overflow-hidden backdrop-blur-sm bg-purple-950/30 border border-purple-700/50 shadow-[0_0_15px_rgba(139,92,246,0.2)] flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="p-4 border-b border-purple-800/50 bg-purple-900/30 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Chatbot Conversations</h2>
       
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar with chatbots and histories */}
        <div className="w-80 border-r border-purple-800/50 bg-purple-950/20 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-purple-300 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <span>Loading chatbots</span>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-400">{error}</div>
          ) : chatbots.length === 0 ? (
            <div className="p-8 text-center text-purple-300">No chatbots found</div>
          ) : (
            <div className="p-4">
              <Accordion type="single" collapsible className="w-full">
                {chatbots.map((chatbot) => (
                  <AccordionItem key={chatbot._id} value={chatbot._id} className="border-b border-purple-800/50">
                    <div className="flex items-center w-full py-3 px-3 hover:bg-purple-900/20 rounded-lg group">
                      <div className="flex items-center flex-1">
                        <Avatar className="h-8 w-8 mr-3" style={{ backgroundColor: chatbot.appearance || "#9333ea" }}>
                          <AvatarFallback
                            style={{ backgroundColor: chatbot.appearance || "#9333ea" }}
                            className="font-medium text-white"
                          >
                            {chatbot.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <AccordionTrigger className="py-0 text-white hover:text-purple-300 hover:no-underline">
                            <div className="text-left">
                              <div className="font-medium">{chatbot.name}</div>
                              <div className="text-xs text-purple-300">{chatbot.knowledgeBase}</div>
                            </div>
                          </AccordionTrigger>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        <button
                          onClick={(e) => copyLinkToClipboard(chatbot.chatBotId, e)}
                          className="p-1.5 rounded-full hover:bg-purple-800/50 transition-colors"
                          aria-label="Copy link"
                        >
                          {copiedLinkId === chatbot._id ? (
                            <Check className="h-4 w-4 text-green-400" />
                          ) : (
                            <Link className="h-4 w-4 text-purple-300" />
                          )}
                        </button>
                        <button
                          onClick={(e) => handleEditClick(chatbot, e)}
                          className="p-1.5 rounded-full hover:bg-purple-800/50 transition-colors"
                          aria-label="Edit chatbot"
                        >
                          <Edit className="h-4 w-4 text-purple-300" />
                        </button>
                        <button
                          onClick={(e) => openDeleteModal(chatbot, e)}
                          className="p-1.5 rounded-full hover:bg-purple-800/50 transition-colors"
                          disabled={deletingId === chatbot._id}
                          aria-label="Delete chatbot"
                        >
                          <Trash className="h-4 w-4 text-purple-300" />
                        </button>
                      </div>
                    </div>
                    <AccordionContent>
                      <div className="pl-2 pr-2 pb-2 space-y-1">
                        {chatbot.conversations && chatbot.conversations.length > 0 ? (
                          chatbot.conversations.map((history,index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setSelectedChatbot(chatbot._id)
                                setSelectedHistory(history)
                              }}
                              className={`w-full flex items-center flex-wrap justify-between p-2 rounded-lg  transition-colors ${
                                selectedHistory === history
                                  ? "bg-purple-800/70 text-white"
                                  : "text-purple-300 hover:bg-purple-800/30"
                              }`}
                            >
                              <div className="flex items-center justify-between w-full"> 
                                <div className="flex gap-2 items-center">
                                <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                                <div className="truncate">{history.slice(0,12)}...</div>  
                                </div>
                                <Trash2  className="h-4 w-4 mr-2 flex-shrink-0" />
                              </div>
                              <div className="flex items-center text-xs text-purple-400">
                                <Clock className="h-3 w-3 mr-1" />
                                {history}
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="text-sm text-purple-400 py-2">No conversations yet</div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>

        {/* Right side with chat messages */}
        <div className="flex-1 flex flex-col">
          {selectedHistoryData ? (
            <>
              <div className="p-4 border-b border-purple-800/50 bg-purple-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar
                      className="h-10 w-10 mr-3"
                      style={{ backgroundColor: selectedChatbotData?.appearance || "#9333ea" }}
                    >
                      <AvatarFallback
                        style={{ backgroundColor: selectedChatbotData?.appearance || "#9333ea" }}
                        className="text-white"
                      >
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-white">{selectedChatbotData?.name}</h3>
                      <p className="text-xs text-purple-400">{selectedHistoryData.title}</p>
                    </div>
                  </div>
                  <div className="text-xs text-purple-400 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {selectedHistoryData.date}
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedHistoryData.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-3 ${
                          message.sender === "user"
                            ? "bg-purple-600 text-white rounded-tr-none"
                            : "bg-purple-900/50 text-purple-100 rounded-tl-none border border-purple-700/50"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8">
              <div className="w-16 h-16 rounded-full bg-purple-800/50 flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-purple-300" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Select a Conversation</h2>
              <p className="text-purple-300 opacity-80 text-center max-w-md">
                Choose a chatbot and conversation history from the sidebar to view messages
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {chatbotToDelete && (
        <DeleteChatbotModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={deleteChatbot}
          chatbotName={chatbotToDelete.name}
          isDeleting={deletingId === chatbotToDelete._id}
        />
      )}
    </motion.div>
  )
}

