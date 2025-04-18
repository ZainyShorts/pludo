"use client"
import { useEffect, useState, useRef } from "react"
import type React from "react"

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Send, Bot, User, X, MessageCircle } from "lucide-react"
import { useSearchParams } from "next/navigation"

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
  const searchParams = useSearchParams()
  const clr = decodeURIComponent(searchParams?.get("clr") || "")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [threadId, setThreadId] = useState<string | null>(null)
  const [isFirstMessage, setIsFirstMessage] = useState(true)
  const [isChatOpen, setIsChatOpen] = useState(true)

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
  useEffect(() => {
    console.log("message", isFirstMessage)
  }, [isFirstMessage])
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const createThread = async (email: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PLUDO_SERVER}/openai/createThread?assistantId=${chatbotId}&email=${email}`,
      )
      const data: ThreadResponse = await response.json()
      console.log(data)

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
          threadId: threadIdValue,
        }),
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
          threadId: threadIdValue,
        }),
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

  const fetchPreviousChat = async (threadIdValue: string) => {
    setLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PLUDO_SERVER}/openai/messagesList?threadId=${threadIdValue}`,
      )
      const responseData = await response.json()
      console.log("Messages fetched:", responseData)

      let messagesArray = null

      setMessages([])
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
        console.log("No messages found in the response")
        setIsFirstMessage(false)
        setLoading(false)
        return
      }
      if (messagesArray && messagesArray.length > 0) {
        const sortedMessages = [...messagesArray].sort((a, b) => b.created_at - a.created_at)

        if (sortedMessages.length > 0) {
          for (let i = sortedMessages.length - 1; i >= 0; i--) {
            const currentMessage = sortedMessages[i]
            if (currentMessage.content && Array.isArray(currentMessage.content) && currentMessage.content.length > 0) {
              const textValues = currentMessage.content
                .filter((item) => item.type === "text" && item.text?.value)
                .map((item) => item.text.value)

              if (textValues.length > 0) {
                const formattedContent = formatMarkdownText(textValues.join("\n"))

                const assistantMessage: Message = {
                  role: currentMessage.role,
                  content: formattedContent,
                  id: Date.now().toString() + "-" + i,
                }

                setMessages((prev) => [...prev, assistantMessage])
                console.log(assistantMessage)
              }
            } else {
              throw new Error("Invalid message content format")
            }
          }
        } else {
          throw new Error("No assistant messages found")
        }
      } else {
        setIsFirstMessage(false)
        console.log("No messages found in the response")
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
    } finally {
      setLoading(false)
    }
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
  const fetchMessages = async (threadIdValue: string) => {
    setLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PLUDO_SERVER}/openai/messagesList?threadId=${threadIdValue}`,
      )
      const responseData = await response.json()
      console.log("Messages fetched:", responseData)

      let messagesArray = null

      setMessages([])
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
        console.log("No messages found in the response")
        return
      }
      if (messagesArray && messagesArray.length > 0) {
        const sortedMessages = [...messagesArray].sort((a, b) => b.created_at - a.created_at)

        if (sortedMessages.length > 0) {
          for (let i = sortedMessages.length - 1; i >= 0; i--) {
            const currentMessage = sortedMessages[i]
            if (currentMessage.content && Array.isArray(currentMessage.content) && currentMessage.content.length > 0) {
              const textValues = currentMessage.content
                .filter((item) => item.type === "text" && item.text?.value)
                .map((item) => item.text.value)

              if (textValues.length > 0) {
                const formattedContent = formatMarkdownText(textValues.join("\n"))

                const assistantMessage: Message = {
                  role: currentMessage.role,
                  content: formattedContent,
                  id: Date.now().toString() + "-" + i,
                }

                setMessages((prev) => [...prev, assistantMessage])
                console.log(assistantMessage)
              }
            } else {
              throw new Error("Invalid message content format")
            }
          }
        } else {
          throw new Error("No assistant messages found")
        }
      } else {
        console.log("No messages found in the response")
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
    } finally {
      setLoading(false)
    }
  }
  function formatMarkdownText(raw: string): string {
    // First, handle the escaped newlines
    let formattedText = raw.replace(/\\n/g, "\n")

    // Replace ** bold markers with HTML tags
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

    // Add line breaks after periods (but not if they're already followed by a newline)
    formattedText = formattedText.replace(/\.(?!\n)([^\s])/g, ".\n$1")
    formattedText = formattedText.replace(/\.(?!\n)(\s+)/g, ".\n$1")

    // Add proper spacing for numbered lists
    formattedText = formattedText.replace(/(\d+\.)(\s*)/g, "<strong>$1</strong>$2")

    // Add proper paragraph spacing
    formattedText = formattedText.replace(/\n{3,}/g, "\n\n") // Normalize multiple newlines

    // Ensure proper spacing after colons in headings
    formattedText = formattedText.replace(/<strong>(.*?):<\/strong>/g, "<strong>$1:</strong> ")

    // Split into paragraphs and process each one
    const paragraphs = formattedText.split("\n\n")
    const processedParagraphs = paragraphs
      .map((p) => {
        if (p.trim()) {
          // Instead of wrapping in HTML tags, just add a line break after each paragraph
          return p.trim()
        }
        return ""
      })
      .join("\n\n")

    // Convert newlines to <br> tags for HTML rendering
    return processedParagraphs.replace(/\n/g, "<br />")
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
      if (isFirstMessage) {
        if (!isValidEmail(messageText)) {
          const errorMessage: Message = {
            role: "assistant",
            content: "Please enter a valid email address to continue.",
            id: Date.now().toString(),
          }
          setMessages((prev) => [...prev, errorMessage])
          setIsProcessing(false)
          return
        }
        const conversations = []
        if (isValidEmail(messageText)) {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_PLUDO_SERVER}/chatbot/findOne/${chatbotId}`)
          console.log("res", res)
          for (let i = 0; i < res.data.conversations.length; i++) {
            conversations.push(res.data.conversations[i])
          }
          const matchedEmail = conversations.find((conv) => conv.email === messageText)
          if (matchedEmail) {
            const threadID = matchedEmail.threadId
            setThreadId(threadID)
            setIsProcessing(false)
            await fetchPreviousChat(threadID)
            setIsFirstMessage(false)
            return
          } else if (!matchedEmail) {
            console.log("Not MATCHED", matchedEmail)
            const currentThreadId = await createThread(messageText)
          }
        }

        // Add success message
        const successMessage: Message = {
          role: "assistant",
          content: "Thank you! Now you can chat with me.",
          id: Date.now().toString(),
        }
        setMessages((prev) => [...prev, successMessage])
        setIsFirstMessage(false)
        setIsProcessing(false)
        return
      }

      const currentThreadId = threadId
      // if (!currentThreadId) {
      //   currentThreadId = await createThread("")
      // }

      await createMessage(messageText, currentThreadId!)

      const runResponse = await createRun(chatbotId as string, currentThreadId!)

      if (runResponse && runResponse.data && runResponse.data.id) {
        await pollRunStatus(runResponse.data.id, currentThreadId!)
      } else {
        throw new Error("Invalid run response")
      }
    } catch (error) {
      console.error("Error in chat flow:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        id: Date.now().toString(),
      }
      setMessages((prev) => [...prev, errorMessage])
      setIsProcessing(false)
    }
  }

  // Toggle chat open/closed
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  if (!isChatOpen) {
    return (
      <div className="fixed inset-0 pointer-events-none bg-transparent">
        <div
          className="fixed bottom-6 right-6 cursor-pointer transform transition-transform hover:scale-110 pointer-events-auto"
          onClick={toggleChat}
        >
          <div
            className="rounded-full p-4 shadow-lg flex items-center justify-center"
            style={{ backgroundColor: clr || "#4f46e5" }}
          >
            <MessageCircle className="h-10 w-10 text-white" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <Card className="rounded-none border-b shadow-sm">
        <CardHeader className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3 flex justify-center items-center" style={{ backgroundColor: clr }}>
                <Bot className="h-6 w-6 text-primary" />
              </Avatar>
              <div>
                <CardTitle className="text-xl">{loading ? "Loading..." : assistant?.name || "AI Assistant"}</CardTitle>
                <p className="text-sm text-muted-foreground">{loading ? "" : "online" || ""}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="rounded-full hover:bg-gray-100">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isFirstMessage ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center space-y-3 max-w-md mx-auto">
              <Bot className="h-12 w-12 mx-auto text-primary/80" />
              <h3 className="text-xl font-medium">Start a conversation</h3>
              <p className="text-muted-foreground">
                Send a message to begin chatting with {assistant?.name || "the assistant"}
              </p>
            </div>
          </div>
        ) : messages.length === 0 && isFirstMessage ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center  space-y-3 max-w-md mx-auto">
              <Bot className="h-12 w-12 mx-auto text-primary/80" />
              <h3 className="text-xl font-medium">Write your email to continue</h3>
              <p className="text-muted-foreground">Please enter your email address to start chatting</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
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
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                  )}
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  } ${message.role === "assistant" ? "assistant-message" : ""}`}
                  dangerouslySetInnerHTML={message.role === "assistant" ? { __html: message.content } : undefined}
                >
                  {message.role === "user" ? message.content : null}
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
                  <div
                    className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
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
              placeholder={isFirstMessage ? "Enter your email..." : "Type your message..."}
              className="flex-1"
              disabled={isProcessing}
            />
            <Button style={{ backgroundColor: clr }} type="submit" disabled={isProcessing || !input.trim()}>
              <Send className="h-4 w-4 text-black" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ChatbotPage

