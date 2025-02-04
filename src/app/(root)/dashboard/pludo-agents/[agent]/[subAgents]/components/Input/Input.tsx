"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ReactMic } from "react-mic"
import { Mic, ImageIcon, Send, X, Loader2, Trash2, StopCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip" 
import type { AudioVisualizerProps, AudioData } from "./Audio"
import {
  resetTextareaHeight,
  adjustTextareaHeight,
  handleImageUpload,
  handleCancelImage,
  triggerImageUpload,
  handleSendMessage as sendMessage,
  deleteFromAWS,
} from "./functios"
import type { MessageContent } from "./types"
import { AudioVisualization } from "./AudioVisualization"

interface ChatInputProps {
  onSendMessage: (content: MessageContent) => void
  allowImage: boolean
  allowAudio: boolean
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, allowImage, allowAudio }) => {
  const [input, setInput] = useState<any>("")
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [selectedImage, setSelectedImage] = useState<{ file: File; preview: string; awsUrl: string | null } | null>(
    null,
  )
  const [uploadProgress, setUploadProgress] = useState(0)
  const [audio, setAudio] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(64).fill(0))
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
      audio,
      onSendMessage,
      setInput,
      setSelectedImage,
      setAudio,
      resetTextareaHeightCallback,
    )
    setAudioUrl(null)
  }

  const handleStartRecording = () => setIsRecording(true)
  const handleStopRecording = () => setIsRecording(false) 
  const [recordingTime, setRecordingTime] = useState<number>(0); 
  useEffect(()=> {  
    if (isRecording) {  
    
      if (isRecording) {
       const intervalId = setInterval(() => {
          setRecordingTime((prev) => {
            if (prev < 30) {
              return prev + 1; 
            } else {
              clearInterval(intervalId);  
              setIsRecording(false);
              return prev = 0; 
            }
          });
        }, 1000);  
    return () => { 
      clearInterval(intervalId);
    } 
  } 
}
  },[isRecording])

  const onData = useCallback((recordedBlob: any) => {
    if (recordedBlob && recordedBlob.blob) {
      recordedBlob.blob.arrayBuffer().then((arrayBuffer : any) => {
        const audioData = new Uint8Array(arrayBuffer)
        if (audioData.length > 0) {
          const visualizationData = new Uint8Array(64)
          const step = Math.max(1, Math.floor(audioData.length / 64))
          for (let i = 0; i < 64; i++) {
            visualizationData[i] = audioData[i * step]
          }
          setAudioData(visualizationData)
        } 
     
    
      })
    }
  }, [])


  const onStop = (recordedBlob: { blob: Blob }) => {
    setAudio(recordedBlob.blob)
    setAudioUrl(URL.createObjectURL(recordedBlob.blob))
  }

  const handleDeleteAudio = () => {
    setAudio(null)
    setAudioUrl(null)
  }

  useEffect(() => {
    const handleUnload = async () => {
      if (selectedImage && selectedImage.awsUrl) {
        await deleteFromAWS(selectedImage.file.name)
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
        <div className="group bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 transition-all duration-300 hover:border-white/30">
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
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-grow bg-transparent border-none text-white placeholder-white/40 resize-none h-[40px] max-h-[150px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20 py-5 transition-all duration-200 focus:outline-none focus:ring-0 focus:border-transparent w-full md:w-[calc(100%-120px)] lg:w-[calc(100%-160px)] xl:w-[calc(100%-200px)]"
            />
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="h-9 w-9 bg-gradient-to-r from-purple-500/80 to-fuchsia-500/80 hover:from-purple-500 hover:to-fuchsia-500 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/25 backdrop-blur-sm"
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
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 p-4 bg-gradient-to-r from-purple-500/40 to-fuchsia-500/40 backdrop-blur-lg rounded-lg shadow-lg border border-white/20"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" /> 
                  <p className="text-white">{recordingTime}</p>
                </div> 
                <AudioVisualization audioData={audioData} />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {audioUrl && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3"
              >
                <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-2">
                  <audio src={audioUrl} controls className="w-full" />
                  <Button size="icon" variant="destructive" onClick={handleDeleteAudio} className="flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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

