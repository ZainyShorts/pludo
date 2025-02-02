"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ReactMic } from "react-mic"
import { Mic, ImageIcon, Send, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  resetTextareaHeight,
  adjustTextareaHeight,
  handleImageUpload,
  handleCancelImage,
  triggerImageUpload,
  handleSendMessage as sendMessage,
  deleteFromAWS,
} from "./functios"

interface ChatInputProps {
  onSendMessage: (message: string , imageUrl?:string) => void
  onSendImage: (image: File, awsUrl: string | null) => void
  onSendAudio: (audio: Blob) => void
  allowImage: boolean
  allowAudio: boolean
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onSendImage,
  onSendAudio,
  allowImage,
  allowAudio,
}) => {
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{ file: File; preview: string; awsUrl: string | null } | null>(
    null,
  )
  const [uploadProgress, setUploadProgress] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetTextareaHeightCallback = useCallback(() => resetTextareaHeight(textareaRef as any), [])
  const adjustTextareaHeightCallback = useCallback(() => adjustTextareaHeight(textareaRef as any), [])

  useEffect(() => {
    if (!input.trim()) {
      resetTextareaHeightCallback()
    }
  }, [input, resetTextareaHeightCallback])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    adjustTextareaHeightCallback()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSendMessage = () => {
    sendMessage(
      input,
      selectedImage,
      onSendMessage,
      onSendImage,
      setInput,
      setSelectedImage,
      resetTextareaHeightCallback,
    )
  }

  const handleStartRecording = () => setIsRecording(true)
  const handleStopRecording = () => setIsRecording(false)

  const onData = (recordedBlob: Blob) => {
    // Visualization data
  }

  const onStop = (recordedBlob: { blob: Blob }) => {
    onSendAudio(recordedBlob.blob)
  }

  useEffect(() => {
    const handleUnload = async () => {
      if (selectedImage && selectedImage.awsUrl) {
        await deleteFromAWS(selectedImage.file.name);
      }
    }

    window.addEventListener("beforeunload", handleUnload)

    return () => {
      window.removeEventListener("beforeunload", handleUnload)
    }
  }, [selectedImage])

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-20 w-full max-w-7xl mx-auto"
      >
        <div className="group bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-2xl shadow-lg border border-white/10 transition-all duration-300 hover:border-white/20">
          <AnimatePresence>
            {selectedImage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3"
              >
                <div className="relative w-24 h-24 rounded-lg overflow-hidden group/image">
                  <img
                    src={selectedImage.preview || "/placeholder.svg"}
                    alt="Selected"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity duration-200" />
                  {uploadProgress < 100 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-1 right-1 w-5 h-5 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity duration-200"
                    onClick={() => {
                      if (selectedImage && selectedImage.awsUrl) {
                        const filename = selectedImage.awsUrl.split("/").pop()
                        if (filename) {
                          deleteFromAWS(filename)
                        }
                      }
                      handleCancelImage(selectedImage, setSelectedImage)
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2 p-2 w-full">
            {allowImage && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full hover:bg-white/10"
                    onClick={() => triggerImageUpload(fileInputRef as React.RefObject<HTMLInputElement>)}
                  >
                    <ImageIcon className="w-5 h-5 text-white/60 hover:text-white/80 transition-colors duration-200" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-white/10 backdrop-blur-lg border-white/10">
                  <p>Upload Image</p>
                </TooltipContent>
              </Tooltip>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, setSelectedImage, setUploadProgress)}
              className="hidden"
            />
            {allowAudio && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-9 w-9 rounded-full transition-all duration-300 ${
                      isRecording ? "bg-red-500/20 hover:bg-red-500/30" : "hover:bg-white/10"
                    }`}
                    onMouseDown={handleStartRecording}
                    onMouseUp={handleStopRecording}
                    onTouchStart={handleStartRecording}
                    onTouchEnd={handleStopRecording}
                  >
                    <Mic
                      className={`w-5 h-5 transition-colors duration-200 ${
                        isRecording ? "text-red-500" : "text-white/60 hover:text-white/80"
                      }`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-white/10 backdrop-blur-lg border-white/10">
                  <p>{isRecording ? "Recording..." : "Record Audio"}</p>
                </TooltipContent>
              </Tooltip>
            )}
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-grow bg-transparent border-none text-white placeholder-white/40 resize-none h-[40px] max-h-[150px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20 py-5 transition-all duration-200 focus:outline-none focus:ring-0 focus:border-transparent w-full md:w-[calc(100%-120px)] lg:w-[calc(100%-160px)] xl:w-[calc(100%-200px)]"
            />
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="h-9 w-9 bg-gradient-to-r from-purple-500/80 to-fuchsia-500/80 hover:from-purple-500 hover:to-fuchsia-500 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <ReactMic
          record={isRecording}
          className="hidden"
          onStop={onStop}
          onData={onData}
          strokeColor="#000000"
          backgroundColor="#FF4081"
        />
      </motion.div>
    </TooltipProvider>
  )
}

