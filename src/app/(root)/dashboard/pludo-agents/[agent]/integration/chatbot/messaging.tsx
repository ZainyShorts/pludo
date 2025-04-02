"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageSquare, Send, Bot, Clock, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Dummy data for chatbots and their histories
const dummyChatbots = [
  {
    id: "bot1",
    name: "Customer Support Bot",
    description: "Handles customer inquiries and support tickets",
    histories: [
      {
        id: "hist1-1",
        title: "Product Return Inquiry",
        date: "2 hours ago",
        messages: [
          { id: 1, sender: "user", text: "Hi, I need to return a product I purchased last week." },
          {
            id: 2,
            sender: "bot",
            text: "Hello! I'd be happy to help you with your return. Could you please provide your order number?",
          },
          { id: 3, sender: "user", text: "Sure, it's ORD-12345-AB." },
          {
            id: 4,
            sender: "bot",
            text: "Thank you for providing your order number. I can see you purchased a wireless headphone set on April 25th. What's the reason for the return?",
          },
          { id: 5, sender: "user", text: "The sound quality isn't what I expected. There's a lot of static." },
          {
            id: 6,
            sender: "bot",
            text: "I'm sorry to hear that. We can definitely process this return for you. I've just sent a return label to your email. Once you ship the item back, we'll process your refund within 3-5 business days.",
          },
          { id: 7, sender: "user", text: "Great, thank you for your help!" },
          { id: 8, sender: "bot", text: "You're welcome! Is there anything else I can assist you with today?" },
        ],
      },
      {
        id: "hist1-2",
        title: "Shipping Status Check",
        date: "1 day ago",
        messages: [
          { id: 1, sender: "user", text: "Hello, I'm wondering about the status of my order #ORD-67890." },
          { id: 2, sender: "bot", text: "Hi there! Let me check that for you right away." },
          {
            id: 3,
            sender: "bot",
            text: "I can see your order was shipped yesterday and is currently in transit. The estimated delivery date is April 30th. You should have received a tracking number via email.",
          },
          { id: 4, sender: "user", text: "I didn't get any tracking information." },
          {
            id: 5,
            sender: "bot",
            text: "I apologize for that. Let me send you the tracking information right now. The tracking number is USP12345678. You can track it on our website or the carrier's site.",
          },
          { id: 6, sender: "user", text: "Got it, thanks!" },
          { id: 7, sender: "bot", text: "You're welcome! Is there anything else you need help with?" },
        ],
      },
    ],
  },
  {
    id: "bot2",
    name: "Financial Advisor Bot",
    description: "Provides financial advice and portfolio management",
    histories: [
      {
        id: "hist2-1",
        title: "Investment Strategy",
        date: "3 days ago",
        messages: [
          {
            id: 1,
            sender: "user",
            text: "I'm looking to diversify my investment portfolio. What would you recommend?",
          },
          {
            id: 2,
            sender: "bot",
            text: "Hello! I'd be happy to help with your investment strategy. First, could you tell me about your current investments and risk tolerance?",
          },
          { id: 3, sender: "user", text: "I currently have mostly tech stocks and my risk tolerance is moderate." },
          {
            id: 4,
            sender: "bot",
            text: "Thank you for sharing that information. Given your moderate risk tolerance and concentration in tech, I would recommend adding some exposure to other sectors like healthcare, consumer staples, and perhaps some bonds to balance your portfolio.",
          },
          { id: 5, sender: "user", text: "That makes sense. Any specific ETFs you would recommend?" },
          {
            id: 6,
            sender: "bot",
            text: "For healthcare, you might consider XLV or VHT. For consumer staples, XLP or VDC are solid options. And for bonds, AGG or BND would provide good broad exposure. Would you like more specific recommendations?",
          },
          { id: 7, sender: "user", text: "No, this is helpful. I'll research these options." },
          {
            id: 8,
            sender: "bot",
            text: "Great! Feel free to come back if you have any questions after your research. Would you like me to prepare a more detailed diversification plan for your portfolio?",
          },
        ],
      },
      {
        id: "hist2-2",
        title: "Retirement Planning",
        date: "1 week ago",
        messages: [
          { id: 1, sender: "user", text: "I want to start planning for retirement. I'm 35 years old." },
          {
            id: 2,
            sender: "bot",
            text: "That's a great age to focus on retirement planning! Are you currently contributing to any retirement accounts like a 401(k) or IRA?",
          },
          { id: 3, sender: "user", text: "Yes, I have a 401(k) through my employer and I contribute 5% of my salary." },
          { id: 4, sender: "bot", text: "That's a good start! Does your employer offer any matching contributions?" },
          { id: 5, sender: "user", text: "They match up to 4%." },
          {
            id: 6,
            sender: "bot",
            text: "Excellent. I would recommend increasing your contribution to at least 4% to take full advantage of the employer match - that's essentially free money. Additionally, consider opening a Roth IRA for tax diversification in retirement.",
          },
        ],
      },
    ],
  },
  {
    id: "bot3",
    name: "Health & Wellness Coach",
    description: "Provides guidance on fitness, nutrition, and wellness",
    histories: [
      {
        id: "hist3-1",
        title: "Workout Plan",
        date: "5 days ago",
        messages: [
          {
            id: 1,
            sender: "user",
            text: "I want to start a new workout routine. I'm a beginner and can dedicate 3 days a week.",
          },
          {
            id: 2,
            sender: "bot",
            text: "That's great that you're starting a fitness journey! For beginners with 3 days available, I recommend a full-body workout approach rather than splitting by muscle groups.",
          },
          { id: 3, sender: "user", text: "What exercises should I include?" },
          {
            id: 4,
            sender: "bot",
            text: "I suggest focusing on compound movements that work multiple muscle groups. For each session, include: 1) A squat variation (bodyweight squats to start), 2) A push exercise (modified push-ups or chest press), 3) A pull exercise (dumbbell rows), 4) A hinge movement (glute bridges), and 5) A core exercise (planks).",
          },
          { id: 5, sender: "user", text: "How many sets and reps?" },
          {
            id: 6,
            sender: "bot",
            text: "Start with 2-3 sets of 10-12 reps for each exercise, with 60-90 seconds rest between sets. Focus on proper form rather than weight or speed. As you progress, we can adjust the program.",
          },
        ],
      },
      {
        id: "hist3-2",
        title: "Nutrition Advice",
        date: "2 weeks ago",
        messages: [
          { id: 1, sender: "user", text: "I'm trying to eat healthier. What are some simple changes I can make?" },
          {
            id: 2,
            sender: "bot",
            text: "I'm happy to help with your nutrition goals! Simple changes often lead to sustainable results. First, try to include protein and fiber in every meal - this helps with satiety and blood sugar control.",
          },
          { id: 3, sender: "user", text: "What are good sources of protein and fiber?" },
          {
            id: 4,
            sender: "bot",
            text: "For protein: eggs, chicken, fish, tofu, Greek yogurt, and legumes. For fiber: fruits, vegetables, whole grains, beans, and nuts. A simple breakfast example would be Greek yogurt with berries and a sprinkle of nuts or granola.",
          },
          { id: 5, sender: "user", text: "I tend to snack a lot between meals. Any suggestions?" },
          {
            id: 6,
            sender: "bot",
            text: "For snacks, try to combine protein and fiber as well. Good options include: apple slices with peanut butter, Greek yogurt with berries, hummus with vegetable sticks, or a small handful of nuts with a piece of fruit.",
          },
          { id: 7, sender: "user", text: "That's helpful, thanks!" },
          {
            id: 8,
            sender: "bot",
            text: "You're welcome! Another tip is to stay hydrated - sometimes we mistake thirst for hunger. Would you like me to provide a sample meal plan for a day?",
          },
        ],
      },
    ],
  },
]

export default function Messaging() {
  const [selectedHistory, setSelectedHistory] = useState<string | null>(null)
  const [selectedChatbot, setSelectedChatbot] = useState<string | null>(null)

  // Find the selected history based on IDs
  const selectedChatbotData = dummyChatbots.find((bot) => bot.id === selectedChatbot)
  const selectedHistoryData = selectedChatbotData?.histories.find((hist) => hist.id === selectedHistory)

  return (
    <motion.div
      className="w-full h-full rounded-2xl overflow-hidden backdrop-blur-sm bg-purple-950/30 border border-purple-700/50 shadow-[0_0_15px_rgba(139,92,246,0.2)] flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="p-4 border-b border-purple-800/50 bg-purple-900/30 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Chatbot Conversations</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
          <Input
            placeholder="Search conversations..."
            className="pl-9 bg-purple-950/60 border-purple-700/50 focus-visible:ring-purple-500 focus-visible:border-purple-500 text-white rounded-full"
          />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar with chatbots and histories */}
        <div className="w-80 border-r border-purple-800/50 bg-purple-950/20 overflow-y-auto">
          <div className="p-4">
            <Accordion type="single" collapsible className="w-full">
              {dummyChatbots.map((chatbot) => (
                <AccordionItem key={chatbot.id} value={chatbot.id} className="border-b border-purple-800/50">
                  <AccordionTrigger className="py-4 text-white hover:text-purple-300 hover:no-underline">
                    <div className="flex items-center text-left">
                      <Avatar className="h-8 w-8 mr-3 bg-purple-800">
                        <AvatarFallback className="bg-purple-800 text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{chatbot.name}</div>
                        <div className="text-xs text-purple-400">{chatbot.description}</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-11 pr-2 pb-2 space-y-1">
                      {chatbot.histories.map((history) => (
                        <button
                          key={history.id}
                          onClick={() => {
                            setSelectedChatbot(chatbot.id)
                            setSelectedHistory(history.id)
                          }}
                          className={`w-full flex items-center flex-wrap justify-between p-2 rounded-lg text-left transition-colors ${
                            selectedHistory === history.id
                              ? "bg-purple-800/70 text-white"
                              : "text-purple-300 hover:bg-purple-800/30"
                          }`}
                        >
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                            <div className="truncate">{history.title}</div>
                          </div>
                          <div className="flex items-center text-xs text-purple-400">
                            <Clock className="h-3 w-3 mr-1" />
                            {history.date}
                          </div>
                        </button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Right side with chat messages */}
        <div className="flex-1 flex flex-col">
          {selectedHistoryData ? (
            <>
              <div className="p-4 border-b border-purple-800/50 bg-purple-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3 bg-purple-800">
                      <AvatarFallback className="bg-purple-800 text-white">
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
    </motion.div>
  )
}

