"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ModalComponentProps {
  setEmail: (email: string) => void
  setAppCode: (appCode: string) => void
  AppCode: string
  email: string
  onSubmit: () => void
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative bg-gradient-to-r from-purple-950 to-purple-950 rounded-lg shadow-2xl p-8 w-full max-w-md border-2 border-purple-500">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Enter Details</h2>
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
              className="w-full bg-transparent border-2 border-purple-500 text-white placeholder-gray-400 focus:border-purple-600 focus:ring focus:ring-purple-500 focus:ring-opacity-50 rounded-md shadow-sm"
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
              className="w-full bg-transparent border-2 border-purple-500 text-white placeholder-gray-400 focus:border-purple-600 focus:ring focus:ring-purple-500 focus:ring-opacity-50 rounded-md shadow-sm"
              required
              placeholder="Enter app code"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  )
}

