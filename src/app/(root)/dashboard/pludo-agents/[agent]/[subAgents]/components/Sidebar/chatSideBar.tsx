"use client"

import * as React from "react"
import { Settings2, History, Twitter, Linkedin, ChevronRight, X, Plus } from "lucide-react"
import { toggleSidebar } from "@/redux/features/chatBox/chatBox"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { Button } from "@/components/ui/button"

interface CompactAgentSidebarProps {
  botName: string
  botAvatar: string
  mainAgent: string
}

export function CompactAgentSidebar({ botName, botAvatar, mainAgent }: CompactAgentSidebarProps) {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector((state) => state.chatbox.isOpen)

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 xl:hidden" onClick={() => dispatch(toggleSidebar())} />}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 right-0 w-[310px] h-full flex flex-col overflow-hidden z-50
          transition-transform duration-300 ease-in-out
          xl:translate-x-0 xl:relative xl:z-0
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Enhanced Gradient Background */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg, 
                #1a0b2e 0%,
                #2f1c54 25%,
                #3b2266 50%,
                #2f1c54 75%,
                #1a0b2e 100%
              )
            `,
            boxShadow: "inset 0 0 100px rgba(138, 43, 226, 0.1)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-800/40 via-transparent to-transparent" />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Close button with enhanced hover effect */}
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white xl:hidden 
                       hover:bg-white/10 rounded-full p-1 transition-all duration-200"
            onClick={() => dispatch(toggleSidebar())}
          >
            <X className="h-6 w-6" />
          </button>

          {/* Profile Section */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-white font-semibold text-lg tracking-tight">{botName}</h2>
              <button
                className="text-white/80 hidden xl:block hover:text-white p-1.5 rounded-full 
                               hover:bg-white/10 transition-all duration-200"
              >
                <Settings2 className="h-5 w-5" />
              </button>
            </div>

            {/* Enhanced Avatar Section with Animated Gradient */}
            <div className="relative h-48 w-full mb-6 group">
              <div
                className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-[20px] 
                            blur-md opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse"
              />
              <img
                src={botAvatar || "/placeholder.svg"}
                alt={botName}
                className="relative w-full h-full object-cover rounded-2xl shadow-lg 
                         border border-white/10 group-hover:border-white/20 transition-all duration-300"
              />
            </div>

            {/* New Chat Button */}
            <Button
              className="w-full h-10 mb-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 
                         hover:border-white/30 rounded-xl transition-all hover:text-gray-200 duration-200 backdrop-blur-sm
                         flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/20"
              variant="ghost"
            >
              <Plus className="h-4 w-4" />
              <span>New Chat</span>
            </Button>

            <div className="flex flex-col gap-1">
              <span className="text-white/70 text-sm font-medium tracking-wide">{mainAgent}</span>
            </div>
          </div>

          {/* Enhanced Power-Ups Section */}
          <div className="px-6 mb-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-white/80 text-sm font-semibold">Power-Ups</h3>
              <button
                className="text-white/70 hover:text-white text-sm transition-all duration-200 
                               flex items-center gap-1 hover:gap-2"
              >
                See all
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {/* Enhanced Twitter Button */}
              <button className="group relative flex items-center justify-center h-12 rounded-xl overflow-hidden">
                <div
                  className="absolute inset-0 bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl 
                              group-hover:border-white/20 transition-all duration-300"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/10 
                              transition-all duration-300 scale-95 group-hover:scale-100"
                />
                <Twitter
                  className="relative h-5 w-5 text-white/90 group-hover:text-white 
                                 transition-all duration-200 transform group-hover:scale-110"
                />
              </button>

              {/* Enhanced LinkedIn Button */}
              <button className="group relative flex items-center justify-center h-12 rounded-xl overflow-hidden">
                <div
                  className="absolute inset-0 bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl 
                              group-hover:border-white/20 transition-all duration-300"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/10 
                              transition-all duration-300 scale-95 group-hover:scale-100"
                />
                <Linkedin
                  className="relative h-5 w-5 text-white/90 group-hover:text-white 
                                  transition-all duration-200 transform group-hover:scale-110"
                />
              </button>
            </div>
          </div>

          {/* Enhanced History Section */}
          <div className="flex-1 px-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <div className="flex items-center gap-2 mb-3">
              <History className="h-4 w-4 text-white/70" />
              <h3 className="text-white/80 text-sm font-semibold">History</h3>
            </div>
            <div className="space-y-2">
              {[
                "Market Analysis Report Q4",
                "Financial Forecast 2025",
                "Investment Strategy Review",
                "Portfolio Optimization",
                "Risk Assessment Summary",
              ].map((title, index) => (
                <button key={index} className="group relative w-full text-left p-3 rounded-xl">
                  <div
                    className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 
                                transition-all duration-200 group-hover:border-white/20 group-hover:bg-white/10"
                  />
                  <span
                    className="relative text-sm text-white/90 font-medium group-hover:text-white 
                                 transition-colors duration-200"
                  >
                    {title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Footer Section */}
          <div className="p-6">
            <button className="relative w-full overflow-hidden group">
              <div className="absolute inset-0 bg-black/20 rounded-xl backdrop-blur-sm" />
              <div
                className="relative py-2.5 px-4 rounded-xl text-sm font-medium text-white 
                            transition-all duration-300 border border-white/20 
                            group-hover:bg-white/10 group-hover:border-white/30
                            flex items-center justify-between"
              >
                <span>Switch Agent</span>
                <ChevronRight
                  className="h-4 w-4 opacity-70 group-hover:opacity-100 
                                      transition-all duration-200 transform group-hover:translate-x-0.5"
                />
              </div>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

