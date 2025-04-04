"use client"
import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Send, Bot, User } from 'lucide-react'

interface Assistant {
  id: string
  name: string
  model: string
  instructions: string
}

interface Message {
  role: "user" | "assistant"
  content: string
  id: string
}

interface ThreadResponse {
  data: {
    id: string
    object: string
    created_at: number
    metadata: Record<string, any>
    tool_resources: Record<string, any>
  }
  success: boolean
  statusCode: number
  msg: string
}

const ChatbotPage = () => {
  const { chatbotId } = useParams()
  const [assistant, setAssistant] = useState<Assistant | null>(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [threadId, setThreadId] = useState<string | null>(null)

  // Fetch assistant data
  useEffect(() => {
    const fetchAssistant = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_PLUDO_SERVER}/openai/retriveById?id=${chatbotId}`)
        const data = await response.json()
        setAssistant({
          id: data.id,
          name: data.name,
          model: data.model,
          instructions: data.instructions,
        })
      } catch (error) {
        console.error("Error fetching assistant:", error)
      } finally {
        setLoading(false)
      }
    }

    if (chatbotId) {
      fetchAssistant()
    }
  }, [chatbotId])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const createThread = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PLUDO_SERVER}/openai/createThread?assistantId=${chatbotId}`)
      const data: ThreadResponse = await response.json()
      
      if (data.success && data.data.id) {
        setThreadId(data.data.id)
        return data.data.id
      } else {
        throw new Error("Failed to create thread")
      }
    } catch (error) {
      console.error("Error creating thread:", error)
      throw error
    }
  }

  const createMessage = async (messageText: string, threadIdValue: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PLUDO_SERVER}/openai/createMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          threadId: threadIdValue
        })
      })
      const data = await response.json()
      console.log("Message created:", data)
      return data
    } catch (error) {
      console.error("Error creating message:", error)
      throw error
    }
  }

  // Create a run
  const createRun = async (assistantIdValue: string, threadIdValue: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PLUDO_SERVER}/openai/createRun`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assistantId: assistantIdValue,
          threadId: threadIdValue
        })
      })
      const data = await response.json()
      console.log("Run created:", data)
      return data
    } catch (error) {
      console.error("Error creating run:", error)
      throw error
    }
  } 
  const pollRunStatus = async (runId: string, threadIdValue: string) => {
    try {
      let isCompleted = false
      let attempts = 0
      const maxAttempts = 20 // Prevent infinite polling

      while (!isCompleted && attempts < maxAttempts) {
        attempts++

        if (attempts > 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }

        const statusResponse = await fetch(
          `${process.env.NEXT_PUBLIC_PLUDO_SERVER}/openai/runStatus?runId=${runId}&threadId=${threadIdValue}`,
        )

        const statusData = await statusResponse.json()
        console.log(`Run status (attempt ${attempts}):`, statusData)

        if (statusData.success && statusData.data) {
          const { completedAt, expiresAt, cancelledAt, status } = statusData.data

          // Check if run is finished
          if (completedAt || expiresAt || cancelledAt || status === "completed") {
            isCompleted = true

            if (status === "completed") {
              // Fetch messages after completion
              await fetchMessages(threadIdValue)
            } else {
              // Handle other completion states (expired, cancelled)
              const statusMessage: Message = {
                role: "assistant",
                content: `The assistant couldn't complete the response (status: ${status}).`,
                id: Date.now().toString(),
              }
              setMessages((prev) => [...prev, statusMessage])
            }
          }
        } else {
          console.error("Error in run status response:", statusData)
        }
      }

      if (!isCompleted) {
        throw new Error("Maximum polling attempts reached")
      }
    } catch (error) {
      console.error("Error polling run status:", error)
      throw error
    } finally {
      setIsProcessing(false)
    }
  }

  const fetchMessages = async (threadIdValue: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PLUDO_SERVER}/openai/messagesList?threadId=${threadIdValue}`,
      )
      const responseData = await response.json()
      console.log("Messages fetched:", responseData)

      let messagesArray = null

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

      if (messagesArray && messagesArray.length > 0) {
        const sortedMessages = [...messagesArray].sort((a, b) => b.created_at - a.created_at)

        const assistantMessages = sortedMessages.filter((msg) => msg.role === "assistant")

        if (assistantMessages.length > 0) {
          const latestMessage = assistantMessages[0]

          if (
            latestMessage.content &&
            Array.isArray(latestMessage.content) &&
            latestMessage.content.length > 0 &&
            latestMessage.content[0].type === "text" &&
            latestMessage.content[0].text &&
            latestMessage.content[0].text.value
          ) {
            const assistantMessage: Message = {
              role: "assistant",
              content: latestMessage.content[0].text.value,
              id: Date.now().toString(),
            }

            setMessages((prev) => [...prev, assistantMessage])
          } else {
            throw new Error("Invalid message content format")
          }
        } else {
          throw new Error("No assistant messages found")
        }
      } else {
        throw new Error("No messages found in the response")
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
  }
  // Handle message submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isProcessing) return

    // Add user message to UI immediately
    const userMessage: Message = {
      role: "user",
      content: input,
      id: Date.now().toString(),
    }

    setMessages((prev) => [...prev, userMessage])
    const messageText = input
    setInput("")
    setIsProcessing(true)

    try {
      // TASK 1: Create thread if this is the first message
      let currentThreadId = threadId
      if (!currentThreadId) {
        currentThreadId = await createThread()
      }

      // TASK 2: Create message
      await createMessage(messageText, currentThreadId!)

      // TASK 3: Create run
      const runResponse = await createRun(chatbotId as string, currentThreadId!)

      // Start polling for run status
      if (runResponse && runResponse.data && runResponse.data.id) {
        await pollRunStatus(runResponse.data.id, currentThreadId!)
      } else {
        throw new Error("Invalid run response")
      }
    } catch (error) {
      console.error("Error in chat flow:", error)
      // Add error message
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        id: Date.now().toString(),
      }
      setMessages((prev) => [...prev, errorMessage])
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <Card className="rounded-none border-b shadow-sm">
        <CardHeader className="py-3">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3 bg-primary/10">
              <Bot className="h-6 w-6 text-primary" />
            </Avatar>
            <div>
              <CardTitle className="text-xl">{loading ? "Loading..." : assistant?.name || "AI Assistant"}</CardTitle>
              <p className="text-sm text-muted-foreground">{loading ? "" : assistant?.model || ""}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center space-y-3 max-w-md mx-auto">
              <Bot className="h-12 w-12 mx-auto text-primary/80" />
              <h3 className="text-xl font-medium">Start a conversation</h3>
              <p className="text-muted-foreground">
                Send a message to begin chatting with {assistant?.name || 'the assistant'}
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
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
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary" />
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
          ))
        )}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="flex max-w-[80%] md:max-w-[70%] flex-row">
              <div className="flex-shrink-0 mr-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <Card className="rounded-none border-t">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isProcessing}
            />
            <Button type="submit" disabled={isProcessing || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ChatbotPage 