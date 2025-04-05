"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MessageSquare, Clock,  Trash, Trash2, Edit, Link, Check, Loader2 } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area" 
import axios from "axios"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useSession, useUser } from "@descope/nextjs-sdk/client" 
import { Bot, User } from 'lucide-react'
import { toast } from "react-toastify"
import { DeleteChatbotModal } from "./confirmation"
import type { Chatbot } from "./page" // Import the Chatbot interface from page.tsx

interface MessagingProps {
  onEditChatbot: (chatbot: Chatbot) => void
} 
interface Message {
  role: "user" | "assistant"
  content: string
  id: string
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
    const [messages, setMessages] = useState<Message[]>([])
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
  useEffect(() => {

    fetchChatbots()
  }, [ID, isSessionLoading]) 
   const [loading , setLoading] = useState(false);
 
    const [noMessages ,setNoMessages] = useState<any>(null);
   const fetchMessages = async (threadIdValue: string) => { 
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PLUDO_SERVER}/openai/messagesList?threadId=${threadIdValue}`,
      )
      const responseData = await response.json()
      console.log("Messages fetched:", responseData)

      let messagesArray = null

      setMessages([]);
      if (responseData.success) { 
        if (responseData.data && Array.isArray(responseData.data)) {
          messagesArray = responseData.data
        } else if (responseData.data && responseData.data.data && Array.isArray(responseData.data.data)) {
          messagesArray = responseData.data.data
        } else if (
          responseData.data &&
          responseData.data.body &&
          responseData.data.body.data &&
          Array.isArray(responseData.data.body.data)
        ) {
          messagesArray = responseData.data.body.data
        }
      }
      if (!responseData.data.data) { 
        setNoMessages("No messages found in the response") 
        return 
      }
      if (messagesArray && messagesArray.length > 0) {
        const sortedMessages = [...messagesArray].sort((a, b) => b.created_at - a.created_at)


        if (sortedMessages.length > 0) {
          for (let i = sortedMessages.length - 1; i >= 0; i--) {
            const currentMessage = sortedMessages[i];
            if (
              currentMessage.content &&
              Array.isArray(currentMessage.content) &&
              currentMessage.content.length > 0
            ) {
              const textValues = currentMessage.content
                .filter((item) => item.type === "text" && item.text?.value)
                .map((item) => item.text.value);
        
              if (textValues.length > 0) {
                const assistantMessage: Message = {
                  role: currentMessage.role, 
                  content: textValues.join("\n"), 
                  id: Date.now().toString() + "-" + i, 
                };
        
                setMessages((prev) => [...prev, assistantMessage]);
                console.log(assistantMessage);
              }
            } else {
              throw new Error("Invalid message content format");
            }
          }
        } else {
          throw new Error("No assistant messages found")
        }
      } else {
          setNoMessages("No messages found in the response")
      }
    } catch (error) {
      console.error("Error fetching messages:", error)

      // Add a fallback message
      const errorMessage: Message = {
        role: "assistant",
        content: "I processed your request, but couldn't retrieve the response. Please try again.",
        id: Date.now().toString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } 
    finally{ 
      setLoading(false);
    }
  }
  // Find the selected history based on IDs
  const selectedChatbotData = chatbots.find((bot) => bot._id === selectedChatbot)

  const copyLinkToClipboard = (id: string, clr: string, e: React.MouseEvent) => {
    // Construct the iframe HTML string
    const iframeHtml = `<iframe 
        src="${window.location.origin}/dashboard/pludo-agents/Maverik/integration/${id}?clr=${encodeURIComponent(clr)}"
        width="400"
        height="500"
        style="
            position: absolute; 
            bottom: 20px; 
            right: 20px; 
            border: none; 
            border-radius: 12px;"
    ></iframe>`;

    // Copy the iframe HTML to clipboard
    navigator.clipboard
        .writeText(iframeHtml)
        .then(() => {
            setCopiedLinkId(id);
            setTimeout(() => setCopiedLinkId(null), 2000);
            toast.success("Iframe HTML copied to clipboard!");
        })
        .catch((err) => {
            console.error("Failed to copy iframe:", err);
            toast.error("Failed to copy iframe");
        });
};

  const handleEditClick = (chatbot: Chatbot, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent accordion from toggling
    onEditChatbot(chatbot) // Pass the chatbot data to the parent component
  }

  const openDeleteModal = (chatbot: Chatbot, e: React.MouseEvent) => {
    e.stopPropagation()
    setChatbotToDelete(chatbot)
    setIsDeleteModalOpen(true)
  } 
  const [chatBotColor, setChatBotColor] = useState<any>('#ffffff');

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
  const handleDeleteThread = async (threadId : any , ass_ID : any) => { 
    setIsLoading(true)
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_PLUDO_SERVER}/openai/deleteThread/${threadId}/${ass_ID}`);
      toast.success("Chat Deleted Successfully!")
      
      fetchChatbots();
      return response.data; 

    } catch (error) {
      console.error('Error deleting thread:', error.response?.data || error.message);
      throw error;
    } 
    finally{ 
      setIsLoading(false)
    }
  };
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
                          onClick={(e) => copyLinkToClipboard(chatbot.chatBotId , chatbot.appearance, e)}
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
                                setChatBotColor(chatbot.appearance)
                                fetchMessages(history.threadId as any)
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
                                <div className="truncate">{history.email.slice(0,12)}...</div>  
                                </div>
                                <Trash2 
  onClick={(e) => {
    e.stopPropagation();
    handleDeleteThread(history.threadId , chatbot.chatBotId);
  }} 
  className="h-4 w-4 mr-2 flex-shrink-0" 
/>                              </div>
                             
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
          {messages ? (
            <>

              <ScrollArea className="flex-1 p-4">
  <div className="space-y-4">
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
    {messages.length === 0 ? (
  <div className="flex h-full items-center justify-center">
    <div className="text-center text-white space-y-3 max-w-md mx-auto">
      <Bot className="text-white h-12 w-12 mx-auto text-primary/80" />
      <h3 className="  text-xl font-medium">Chats Will be Shown Here</h3>
    </div>
  </div>
) : (
  <>
    {messages.map((message, index) => (
      <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
        <div
          className={`flex max-w-[80%] md:max-w-[70%] ${
            message.role === "user" ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <div className={`flex-shrink-0 ${message.role === "user" ? "ml-3" : "mr-3"}`}>
            {message.role === "user" ? (
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
            ) : (
              <div className="h-8 w-8 rounded-full  flex items-center justify-center"
              style={{backgroundColor : chatBotColor || "#9333ea"}}
               >
                <Bot className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
          <div
            className={`p-3 rounded-lg ${
              message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            {message.content}
          </div>
        </div>
      </div>
    ))}
   
  </>
)}
      
    </div>
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

