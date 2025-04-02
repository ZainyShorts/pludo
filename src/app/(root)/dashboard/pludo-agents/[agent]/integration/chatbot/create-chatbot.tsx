"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckIcon, ChevronDownIcon, Palette, FileUp, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function CreateChatbot() {
  const [selectedColor, setSelectedColor] = useState("#9333ea")
  const [promptType, setPromptType] = useState("text")
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false)
  const [selectedTone, setSelectedTone] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const tones = [
    { value: "friendly", label: "Friendly" },
    { value: "formal", label: "Formal" },
    { value: "casual", label: "Casual" },
  ]

  return (
    <motion.div
      className="w-full rounded-2xl overflow-hidden backdrop-blur-sm bg-purple-950/30 border border-purple-700/50 shadow-[0_0_15px_rgba(139,92,246,0.2)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Customize Your Chatbot</h2>
          <p className="text-purple-300 opacity-80">Configure your AI assistant's personality and appearance</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-purple-200 font-medium">
              Chatbot Name
            </Label>
            <Input
              id="name"
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
                placeholder="Define the role here"
                className="bg-purple-950/40 border-purple-600/50 focus-visible:ring-purple-500 focus-visible:border-purple-500 text-white min-h-[120px] rounded-xl"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-purple-200 font-medium">Upload Prompt File</Label>
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
                    <div className="border-2 border-dashed border-purple-600/70 rounded-xl p-12 text-center bg-purple-950/50 hover:bg-purple-900/30 transition-colors cursor-pointer">
                      <FileUp className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                      <p className="text-purple-200 mb-2">Drag and drop your file here</p>
                      <p className="text-purple-400 text-sm">or</p>
                      <Button
                        variant="outline"
                        className="mt-4 border-purple-600 bg-purple-900/50 hover:bg-purple-800 text-white"
                      >
                        Browse Files
                      </Button>
                    </div>
                    <p className="text-purple-400 text-sm text-center">Supported formats: .txt, .md, .pdf (max 10MB)</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          <Button className="w-full h-12 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-medium rounded-xl shadow-lg shadow-purple-900/30 transition-all duration-300 hover:shadow-purple-800/40">
            Create Chatbot
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

