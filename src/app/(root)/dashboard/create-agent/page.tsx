"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Info, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function CreateAgent() {
  const [agentTitle, setAgentTitle] = useState("")
  const [agentName, setAgentName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [systemPrompt, setSystemPrompt] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!agentTitle.trim()) newErrors.agentTitle = "Agent title is required"
    if (!agentName.trim()) newErrors.agentName = "Agent name is required"
    if (!file) newErrors.file = "Image is required"
    if (!systemPrompt.trim()) newErrors.systemPrompt = "Agent role description is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (validateForm()) {
      console.log("Form submitted", { agentTitle, agentName, file, systemPrompt })
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleDeleteImage = () => {
    setFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl("")
    }
  }

  return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-custom-gradient text-white p-8 font-sans">
        <div className="max-w-3xl w-full mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="p-8 space-y-8">
          <h1 className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            Create Agent
          </h1>

          {/* Preview Section */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                {previewUrl ? (
                  <img src={previewUrl || "/placeholder.svg"} alt="Agent" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{agentTitle || "Mark"}</h2>
                <p className="text-gray-200 text-sm">{agentName || "Strategic Planing Management"}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="agent-title" className="text-sm font-medium text-gray-300">
                  Agent Title
                </Label>
                <Input
                  id="agent-title"
                  value={agentTitle}
                  onChange={(e) => setAgentTitle(e.target.value)}
                  className={`mt-1 bg-gray-700 border ${errors.agentTitle ? "border-red-500" : "border-gray-600"} text-white placeholder-gray-400`}
                  placeholder="e.g., Strategic Planning Agent"
                />
                {errors.agentTitle && <p className="text-red-400 text-xs mt-1">{errors.agentTitle}</p>}
              </div>
              <div>
                <Label htmlFor="agent-name" className="text-sm font-medium text-gray-300">
                  Agent Name
                </Label>
                <Input
                  id="agent-name"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className={`mt-1 bg-gray-700 border ${errors.agentName ? "border-red-500" : "border-gray-600"} text-white placeholder-gray-400`}
                  placeholder="e.g., Strategic Planner"
                />
                {errors.agentName && <p className="text-red-400 text-xs mt-1">{errors.agentName}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="image-upload" className="text-sm font-medium text-gray-300 mb-1 flex items-center">
                Image Upload
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Upload a square image (1:1 ratio) for best results. Recommended size: 512x512 pixels.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="mt-1 border-2 border-dashed border-gray-600 rounded-md p-6 text-center relative">
                {file ? (
                  <div className="space-y-4">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden">
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-center gap-2">
                      <Button
                      className="text-black "
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("image-upload")?.click()}
                      >
                        Change Image
                      </Button>
                      <Button type="button" variant="destructive" size="sm" onClick={handleDeleteImage}>
                        <X className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="cursor-pointer hover:bg-gray-700 transition duration-300"
                    onClick={() => document.getElementById("image-upload")?.click()}
                  >
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-400 text-sm">Click or drag to upload an image</p>
                  </div>
                )}
                <input type="file" id="image-upload" className="hidden" onChange={handleFileChange} accept="image/*" />
              </div>
              {errors.file && <p className="text-red-400 text-xs mt-1">{errors.file}</p>}
            </div>

            <div>
              <Label htmlFor="system-prompt" className="text-sm font-medium text-gray-300">
                Describe Agent Role
              </Label>
              <Textarea
                id="system-prompt"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={4}
                className={`mt-1 bg-gray-700 border ${errors.systemPrompt ? "border-red-500" : "border-gray-600"} text-white placeholder-gray-400`}
                placeholder="Describe the agent's role and capabilities"
              />
              {errors.systemPrompt && <p className="text-red-400 text-xs mt-1">{errors.systemPrompt}</p>}
            </div>

            <Button
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold rounded-md shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              Create Agent
            </Button>
          </form>
        </div>
         </div>
     </div>
  )
}


 

