"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, ImageIcon, Send, X, Loader2, FileAudio, StopCircle, Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import {
  resetTextareaHeight,
  adjustTextareaHeight,
  handleImageUpload,
  triggerImageUpload,
  handleSendMessage as sendMessage, 
  handleSendMessageWithImage,
  deleteFromAWS,
} from "./functios"
import type { MessageContent } from "./types"
import AudioVisualization from "./AudioVisualization"
import { useAudioRecording } from "./useAudioRecording"
import type React from "react"

interface ChatInputProps {
  onSendMessage: (content: MessageContent) => void
  allowImage: boolean
  allowAudio: boolean 
  disable:boolean
}

type ImageType = {
  file: File
  preview: string
  awsUrl: string | null
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, allowImage, allowAudio ,disable }) => {
  const [input, setInput] = useState<string>("")
  const [selectedImages, setSelectedImages] = useState<ImageType[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    isRecording,
    isPaused,
    audioChunks,
    audioUrl,
    audioData,
    recordingTime,
    handleStartRecording,
    handlePauseRecording,
    handleResumeRecording,
    handleStopRecording,
    handleDeleteAudio,
  } = useAudioRecording()

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
    let audioBlob = null
    if (audioChunks && audioChunks.length > 0) {
      audioBlob = new Blob(audioChunks, { type: "audio/webm" })
    } 
    if (selectedImages.length <= 0) {
    sendMessage(
      input,
      audioBlob,
      onSendMessage,
      setInput,
      () => {},
      resetTextareaHeightCallback,
    )  
  } 
  else if (selectedImages.length > 0) { 
    handleSendMessageWithImage( 
      input,
      audioBlob,
      onSendMessage, 
      selectedImages, 
      setSelectedImages,
      setInput,
      () => {},
      resetTextareaHeightCallback,
    )
  }
    handleDeleteAudio()
  }

  const handleCancelImageWrapper = (index: number) => {
    const imageToRemove = selectedImages[index]
    if (imageToRemove && imageToRemove.awsUrl) {
      const filename = imageToRemove.awsUrl.split("/").pop()
      if (filename) {
        deleteFromAWS(filename)
      }
    }
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  useEffect(() => {
    const handleUnload = async () => {
      for (const image of selectedImages) {
        if (image.awsUrl) {
          const filename = image.awsUrl.split("/").pop()
          if (filename) {
            await deleteFromAWS(filename)
          }
        }
      }
    }

    window.addEventListener("beforeunload", handleUnload)

    return () => {
      window.removeEventListener("beforeunload", handleUnload)
    }
  }, [selectedImages])

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-20 w-full max-w-7xl mx-auto"
      >
        <div className="group bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 transition-all duration-300 hover:border-white/30">
          <AnimatePresence>
            {selectedImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 flex gap-2"
              >
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden group/image">
                    <img
                      src={image.preview || "/placeholder.svg"}
                      alt={`Selected ${index + 1}`}
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
                      onClick={() => handleCancelImageWrapper(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
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
                    disabled={selectedImages.length >= 3}
                  >
                    <ImageIcon className="w-5 h-5 text-white/60 hover:text-white/80 transition-colors duration-200" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-white/10 backdrop-blur-lg border-white/10">
                  <p>{selectedImages.length >= 3 ? "Max 3 images" : "Upload Image"}</p>
                </TooltipContent>
              </Tooltip>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"  
              onChange={(e)=> handleImageUpload(e, setSelectedImages as any , setUploadProgress) }
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
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                  >
                    {isRecording ? (
                      <StopCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <Mic className="w-5 h-5 text-white/60 hover:text-white/80" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-white/10 backdrop-blur-lg border-white/10">
                  <p>{isRecording ? "Stop Recording" : "Start Recording"}</p>
                </TooltipContent>
              </Tooltip>
            )}
            <Textarea
              ref={textareaRef}
              value={input} 
              disabled={disable}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-grow bg-transparent border-none text-white placeholder-white/40 resize-none h-[40px] max-h-[150px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20 py-5 transition-all duration-200 focus:outline-none focus:ring-0 focus:border-transparent w-full md:w-[calc(100%-120px)] lg:w-[calc(100%-160px)] xl:w-[calc(100%-200px)]"
            />
            <Button
              onClick={handleSendMessage}
              size="icon" 
              disabled={disable}
              className="h-9 w-9 bg-gradient-to-r from-indigo-500/80 to-pink-500/80 hover:from-indigo-500 hover:to-pink-500 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 backdrop-blur-sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 p-4 bg-gradient-to-r from-indigo-500/40 to-pink-500/40 backdrop-blur-lg rounded-lg shadow-lg border border-white/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                    <p className="text-white font-medium">{recordingTime}s</p>
                  </div>
                  <div className="flex space-x-2">
                    {isPaused ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleResumeRecording}
                        className="hover:text-white bg-white text-black border-white/20 hover:bg-white/10"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Resume
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handlePauseRecording}
                        className="hover:text-white bg-white text-black border-white/20 hover:bg-white/10"
                      >
                        <Pause className="w-4 h-4 mr-1" />
                        Pause
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={handleStopRecording}>
                      <StopCircle className="w-4 h-4 mr-1" />
                      Stop
                    </Button>
                  </div>
                </div>
                <AudioVisualization audioData={audioData} />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {audioUrl && !isRecording && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3"
              >
                <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-2">
                  <FileAudio className="w-6 h-6 text-blue-400" />
                  <span className="text-sm text-white/80">Audio recording</span>
                  <Badge
                    variant="secondary"
                    className="ml-auto cursor-pointer hover:bg-red-500/20 transition-colors duration-200"
                    onClick={handleDeleteAudio}
                  >
                    <X className="w-3 h-3" />
                  </Badge>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}

