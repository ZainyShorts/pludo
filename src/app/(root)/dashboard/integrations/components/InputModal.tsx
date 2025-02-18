"use client"

import { useState } from "react"
import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X, Loader2 } from "lucide-react"

interface ModalComponentProps {
  setEmail: (email: string) => void
  setAppCode: (appCode: string) => void
  AppCode: string
  email: string
  onSubmit: () => Promise<void>
  onClose: () => void
}

export default function ModalComponent({
  email,
  AppCode,
  setEmail,
  setAppCode,
  onSubmit,
  onClose,
}: ModalComponentProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await onSubmit();
    setIsLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-purple-950/90 to-indigo-950/80 rounded-lg shadow-2xl p-8 w-full max-w-md border border-purple-500/30">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        <h2 className="text-3xl font-bold mb-6 text-white text-center">Enter Details</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-purple-950/50 border-2 border-purple-500/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring focus:ring-purple-400 focus:ring-opacity-50 rounded-lg shadow-sm transition-all duration-300"
              required
              placeholder="your@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="appCode" className="text-sm font-medium text-gray-300">
              App Code
            </Label>
            <Input
              id="appCode"
              type="text"
              value={AppCode}
              onChange={(e) => setAppCode(e.target.value)}
              className="w-full bg-purple-950/50 border-2 border-purple-500/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring focus:ring-purple-400 focus:ring-opacity-50 rounded-lg shadow-sm transition-all duration-300"
              required
              placeholder="Enter app code"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

