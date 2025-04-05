"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckIcon, ChevronDownIcon, Palette, FileUp, FileText, X, ArrowLeft } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-toastify"
import { useSession, useUser } from "@descope/nextjs-sdk/client"
import type { Chatbot } from "./page" 

interface CreateChatbotProps {
  chatbotToEdit: Chatbot | null
  isEditMode: boolean
  onSuccess: () => void
  onCancel: () => void
}

const tones = [
  { label: "Casual", value: "Casual" },
  { label: "Formal", value: "Formal" },
  { label: "Friendly", value: "Friendly" },
]

export default function CreateChatbot({ chatbotToEdit, isEditMode, onSuccess, onCancel }: CreateChatbotProps) {
  const [selectedColor, setSelectedColor] = useState("#9333ea")
  const { user } = useUser()
  const { isAuthenticated, isSessionLoading, sessionToken } = useSession()
  const ID = user?.userId
  const [promptType, setPromptType] = useState("text")
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false)
  const [selectedTone, setSelectedTone] = useState("casual")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [chatbotName, setChatbotName] = useState("")
  const [knowledgeBase, setKnowledgeBase] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [chatbotId, setChatbotId] = useState<string | null>(null)
  const [chatBotId, setChatBotId] = useState<string | null>(null)

 useEffect(() => {
    if (isEditMode && chatbotToEdit) {
      setChatbotName(chatbotToEdit.name)
      setSelectedTone(chatbotToEdit.tone.toLowerCase())
      setSelectedColor(chatbotToEdit.appearance)
      setPromptType(chatbotToEdit.type.toLowerCase())
      setKnowledgeBase(chatbotToEdit.knowledgeBase)
      setChatbotId(chatbotToEdit._id)
      setChatBotId(chatbotToEdit.chatBotId)
    } else {
      resetForm()
    }
  }, [isEditMode, chatbotToEdit])

  const resetForm = () => {
    setChatbotName("")
    setSelectedTone("casual")
    setKnowledgeBase("")
    setSelectedColor("#9333ea")
    setPromptType("text")
    setSelectedFile(null)
    setChatbotId(null)
    setChatBotId(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      if (!file.type.includes("pdf") && !file.type.includes("text/plain") && !file.type.includes("text/markdown")) {
        toast.error("Please upload a PDF, TXT, or MD file")
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB")
        return
      }

      setSelectedFile(file)
      setIsFileDialogOpen(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]

      // Check file type
      if (!file.type.includes("pdf") && !file.type.includes("text/plain") && !file.type.includes("text/markdown")) {
        toast.error("Please upload a PDF, TXT, or MD file")
        return
      }

      // Check file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB")
        return
      }

      setSelectedFile(file)
      setIsFileDialogOpen(false)
    }
  }

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const clearSelectedFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedFile(null)
  }

  const handleSubmit = async () => {
    if (!chatbotName) {
      toast.error("Please enter a chatbot name")
      return
    }

    if (!selectedTone) {
      toast.error("Please select a tone")
      return
    }

    if (promptType === "text" && !knowledgeBase) {
      toast.error("Please define the chatbot's role")
      return
    }

    if (promptType === "file" && !selectedFile && !isEditMode) {
      toast.error("Please upload a file")
      return
    }

    if (!user?.userId) {
      toast.error("User authentication required")
      return
    }

    setIsLoading(true)

    try {
      let response
      const endpoint = isEditMode
        ? `${process.env.NEXT_PUBLIC_PLUDO_SERVER}/chatbot/${chatbotId}`
        : `${process.env.NEXT_PUBLIC_PLUDO_SERVER}/chatbot/create`

      const method = isEditMode ? "PUT" : "POST"

      if (promptType === "text") {
        const requestBody: any = {
          name: chatbotName,
          type: "Text",
          tone: selectedTone.charAt(0).toUpperCase() + selectedTone.slice(1),
          knowledgeBase: knowledgeBase,
          userId: ID,
          appearance: selectedColor,
        }
        const editBody = { ...requestBody }; 

        if (isEditMode && chatbotToEdit?.chatBotId) {
          editBody.chatBotId = chatbotToEdit.chatBotId;
          delete editBody.userId; 
        }
        
        console.log('formData',editBody)
        response = await fetch(endpoint, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editBody),
        })
      } else {
        const formData = new FormData()
        formData.append("name", chatbotName)
        formData.append("type", "File")
        formData.append("tone", selectedTone.charAt(0).toUpperCase() + selectedTone.slice(1))

        
        if (selectedFile) {
          formData.append("file", selectedFile)
        } 
        if (!isEditMode) {
          formData.append("userId", ID);
        }
        

        formData.append("appearance", selectedColor)

        if (isEditMode && chatbotToEdit?.chatBotId) {
          formData.append("chatBotId", chatbotToEdit.chatBotId)
        }
        console.log('formdata',formData)

        response = await fetch(endpoint, {
          method: method,
          body: formData,
        })
      } 
      const data = await response.json()
     console.log('data',data);
      if (!response.ok) {
        throw new Error(data.message || `Failed to ${isEditMode ? "update" : "create"} chatbot`)
      }

      toast.success(`Chatbot ${isEditMode ? "updated" : "created"} successfully!`)

      resetForm()
      onSuccess()
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} chatbot:`, error)
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${isEditMode ? "  error.message : `Failed to ${isEditMode ? 'update" : "create"} chatbot`,
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      className="w-full rounded-2xl overflow-hidden backdrop-blur-sm bg-purple-950/30 border border-purple-700/50 shadow-[0_0_15px_rgba(139,92,246,0.2)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isEditMode ? "Edit Your Chatbot" : "Customize Your Chatbot"}
            </h2>
            <p className="text-purple-300 opacity-80">
              {isEditMode
                ? "Update your AI assistant's personality and appearance"
                : "Configure your AI assistant's personality and appearance"}
            </p>
          </div>
          {isEditMode && (
            <Button
              variant="outline"
              className="border-purple-600/50 bg-purple-900/30 hover:bg-purple-800/50 text-white"
              onClick={onCancel}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel Edit
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-purple-200 font-medium">
              Chatbot Name
            </Label>
            <Input
              id="name"
              value={chatbotName}
              onChange={(e) => setChatbotName(e.target.value)}
              placeholder="Enter a name for your chatbot"
              className="bg-purple-950/40 border-purple-600/50 focus-visible:ring-purple-500 focus-visible:border-purple-500 text-white h-12 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone" className="text-purple-200 font-medium">
              Chatbot Tone
            </Label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-full h-12 px-4 py-2 bg-purple-950/40 border border-purple-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <span>{selectedTone ? tones.find((t) => t.value === selectedTone)?.label : "Select a tone"}</span>
                <ChevronDownIcon className="w-5 h-5 text-purple-300" />
              </button>

              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-purple-900 border border-purple-700 rounded-xl shadow-lg overflow-hidden">
                  {tones.map((tone) => (
                    <button
                      key={tone.value}
                      onClick={() => {
                        setSelectedTone(tone.value)
                        setIsDropdownOpen(false)
                      }}
                      className={`flex items-center justify-between w-full px-4 py-3 text-left hover:bg-purple-800 transition-colors ${
                        selectedTone === tone.value ? "bg-purple-800 text-white" : "text-purple-200"
                      }`}
                    >
                      {tone.label}
                      {selectedTone === tone.value && <CheckIcon className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color" className="text-purple-200 font-medium flex items-center">
              <Palette className="mr-2 h-4 w-4" />
              Theme Color
            </Label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  id="color"
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-14 h-14 p-1 bg-transparent border-purple-600/50 rounded-xl cursor-pointer overflow-hidden"
                />
              </div>
              <div
                className="h-12 flex-1 rounded-xl border border-purple-600/50 flex items-center px-4"
                style={{ backgroundColor: `${selectedColor}20` }}
              >
                <div className="w-6 h-6 rounded-full mr-3" style={{ backgroundColor: selectedColor }}></div>
                <span className="text-white font-mono">{selectedColor}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Label className="text-purple-200 font-medium">Prompt Type</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPromptType("text")}
                className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                  promptType === "text"
                    ? "border-purple-500 bg-purple-800/50 text-white"
                    : "border-purple-700/50 bg-purple-950/30 text-purple-300 hover:bg-purple-900/30"
                }`}
              >
                <FileText className="h-5 w-5" />
                Text Prompt
              </button>
              <button
                onClick={() => setPromptType("file")}
                className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                  promptType === "file"
                    ? "border-purple-500 bg-purple-800/50 text-white"
                    : "border-purple-700/50 bg-purple-950/30 text-purple-300 hover:bg-purple-900/30"
                }`}
              >
                <FileUp className="h-5 w-5" />
                File Prompt
              </button>
            </div>
          </div>

          {promptType === "text" ? (
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-purple-200 font-medium">
                Define Role
              </Label>
              <Textarea
                id="prompt"
                value={knowledgeBase}
                onChange={(e) => setKnowledgeBase(e.target.value)}
                placeholder="Define the role here"
                className="bg-purple-950/40 border-purple-600/50 focus-visible:ring-purple-500 focus-visible:border-purple-500 text-white min-h-[120px] rounded-xl"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-purple-200 font-medium">Upload Prompt File</Label>
              {selectedFile ? (
                <div className="w-full p-4 border border-purple-600/50 bg-purple-950/40 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-purple-800/50 p-2 rounded-lg mr-3">
                        <FileText className="h-6 w-6 text-purple-300" />
                      </div>
                      <div>
                        <p className="text-white font-medium truncate max-w-[200px] md:max-w-[300px]">
                          {selectedFile.name}
                        </p>
                        <p className="text-purple-400 text-xs">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      onClick={clearSelectedFile}
                      className="p-1.5 rounded-full hover:bg-purple-800/50 text-purple-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {isEditMode && (
                    <p className="text-purple-300 mb-2">
                      {chatbotToEdit?.type === "File"
                        ? "Upload a new file to replace the existing one (optional)"
                        : "Upload a file to change to file-based prompt"}
                    </p>
                  )}
                  <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-24 border-dashed border-2 border-purple-600/70 bg-purple-950/20 hover:bg-purple-900/30 text-purple-300 rounded-xl"
                      >
                        <FileUp className="mr-2 h-5 w-5" />
                        Click to upload prompt file
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-purple-950 border-purple-700 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-purple-200">Upload Prompt File</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div
                          className="border-2 border-dashed border-purple-600/70 rounded-xl p-12 text-center bg-purple-950/50 hover:bg-purple-900/30 transition-colors cursor-pointer"
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          onClick={handleBrowseClick}
                        >
                          <FileUp className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                          <p className="text-purple-200 mb-2">Drag and drop your file here</p>
                          <p className="text-purple-400 text-sm">or</p>
                          <Button
                            type="button"
                            variant="outline"
                            className="mt-4 border-purple-600 bg-purple-900/50 hover:bg-purple-800 text-white"
                          >
                            Browse Files
                          </Button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".pdf,.txt,.md"
                            onChange={handleFileChange}
                          />
                        </div>
                        <p className="text-purple-400 text-sm text-center">
                          Supported formats: .txt, .md, .pdf (max 10MB)
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          )}

          <Button
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-medium rounded-xl shadow-lg shadow-purple-900/30 transition-all duration-300 hover:shadow-purple-800/40"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Update Chatbot"
                : "Create Chatbot"}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

