"use client"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CreateAgent() {
  const [agentName, setAgentName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [systemPrompt, setSystemPrompt] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!agentName.trim()) newErrors.agentName = "Agent name is required"
    if (!file) newErrors.file = "Image is required"
    if (!systemPrompt.trim()) newErrors.systemPrompt = "System prompt is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (validateForm()) {
      // Handle form submission
      console.log("Form submitted", { agentName, file, systemPrompt })
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0])
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-custom-gradient text-white p-8 font-sans">
      <div className="max-w-3xl w-full mx-auto bg-gradient-to-b from-purple-900 to-indigo-950 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 space-y-8">
          <h1 className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            Create Agent
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="agent-name" className="block text-sm font-medium text-purple-300 mb-1">
                Agent Name
              </label>
              <input
                type="text"
                id="agent-name"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className={`w-full bg-purple-700 bg-opacity-50 border ${errors.agentName ? "border-red-500" : "border-purple-400"} rounded-md px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-200`}
              />
              {errors.agentName && <p className="text-red-400 text-xs mt-1">{errors.agentName}</p>}
            </div>

            <div>
              <label htmlFor="image-upload" className="block text-sm font-medium text-purple-300 mb-1">
                Image Upload
              </label>
              <div
                className="border-2 border-dashed border-purple-400 rounded-md p-6 text-center cursor-pointer hover:bg-purple-800 hover:bg-opacity-50 transition duration-300"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                <Upload className="h-12 w-12 mx-auto text-purple-300 mb-2" />
                <p className="text-purple-300 text-sm">{file ? file.name : "Click to upload an image"}</p>
                <input type="file" id="image-upload" className="hidden" onChange={handleFileChange} accept="image/*" />
              </div>
              {errors.file && <p className="text-red-400 text-xs mt-1">{errors.file}</p>}
            </div>

            <div>
              <label htmlFor="system-prompt" className="block text-sm font-medium text-purple-300 mb-1">
                System Prompt
              </label>
              <textarea
                id="system-prompt"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={4}
                className={`w-full bg-purple-700 bg-opacity-50 border ${errors.systemPrompt ? "border-red-500" : "border-purple-400"} rounded-md px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-200`}
              />
              {errors.systemPrompt && <p className="text-red-400 text-xs mt-1">{errors.systemPrompt}</p>}
            </div>

            <Button
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold rounded-md shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 border border-purple-300"
            >
              Create  Agent
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

