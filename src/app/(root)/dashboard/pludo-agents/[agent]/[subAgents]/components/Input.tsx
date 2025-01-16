'use client'

import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ReactMic } from 'react-mic'
import { Mic, ImageIcon, Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  onSendImage: (image: File) => void
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
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    adjustTextareaHeight()
  }

  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`
    }
  }, [])

  const handleSendMessage = () => {
    if (input.trim()) {
      onSendMessage(input)
      setInput('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onSendImage(file)
    }
  }

  const handleStartRecording = () => {
    setIsRecording(true)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
  }

  const onData = (recordedBlob: Blob) => {
    // You can use this to visualize the audio data if needed
  }

  const onStop = (recordedBlob: { blob: Blob; }) => {
    onSendAudio(recordedBlob.blob)
  }

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-opacity-30 bg-gray-800 backdrop-blur-lg rounded-lg p-4 mt-4 relative z-20 shadow-lg"
      >
        <div className="flex items-end space-x-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-grow bg-transparent text-white placeholder-gray-400 border-none focus:ring-0 resize-none min-h-[40px] max-h-[150px] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
          />
          <Button
            onClick={handleSendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-colors duration-200"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex mt-2 space-x-2">
          {allowImage && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <label className="cursor-pointer">
                    <ImageIcon className="w-5 h-5 text-gray-300" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload Image</p>
              </TooltipContent>
            </Tooltip>
          )}
          {allowAudio && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`rounded-full ${isRecording ? 'bg-red-500' : ''}`}
                  onMouseDown={handleStartRecording}
                  onMouseUp={handleStopRecording}
                  onTouchStart={handleStartRecording}
                  onTouchEnd={handleStopRecording}
                >
                  <Mic className="w-5 h-5 text-gray-300" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isRecording ? 'Recording...' : 'Record Audio'}</p>
              </TooltipContent>
            </Tooltip>
          )}
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
