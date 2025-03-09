"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Upload, Loader2, FileAudio, Check, Download, Play, Pause, Volume2, VolumeX } from "lucide-react"
import axios from "axios"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

const url = process.env.NEXT_PUBLIC_PLUDO_SERVER || ""

const languages = [
  { value: "German", label: "German" },
  { value: "French", label: "French" },
  { value: "Spanish", label: "Spanish" },
  { value: "Italian", label: "Italian" },
  { value: "English", label: "English" },
]

const voices = [
  "Aria",
  "Roger",
  "Sarah",
  "Laura",
  "Charlie",
  "George",
  "Callum",
  "River",
  "Liam",
  "Charlotte",
  "Alice",
  "Matilda",
  "Will",
  "Jessica",
  "Eric",
  "Chris",
  "Brian",
  "Daniel",
  "Lily",
  "Bill",
]

// Voice name to code mapping
const voiceCodes = {
  Aria: "9BWtsMINqrJLrRacOk9x",
  Roger: "CwhRBWXzGAHq8TQ4Fs17",
  Sarah: "EXAVITQu4vr4xnSDxMaL",
  Laura: "FGY2WhTYpPnrIDTdsKH5",
  Charlie: "IKne3meq5aSn9XLyUdCD",
  George: "JBFqnCBsd6RMkjVDRZzb",
  Callum: "N2lVS1w4EtoT3dr4eOWO",
  River: "N2lVS1w4EtoT3dr4eOWO",
  Liam: "TX3LPaxmHKxFdv7VOQHJ",
  Charlotte: "XB0fDUnXU5powFXDhCwa",
  Alice: "Xb7hH8MSUJpSbSDYk0k2",
  Matilda: "XrExE9yKIg1WjnnlVkGX",
  Will: "bIHbv24MWmeRgasZH58o",
  Jessica: "cgSgspJ2msm6clMCkdW9",
  Eric: "cjVigY5qzO86Huf0OWal",
  Chris: "iP95p4xoKVk53GoZ742B",
  Brian: "nPczCjzI2devNBz1zQrb",
  Daniel: "onwK4e9ZLuTAKqWW03F9",
  Lily: "pFZP5JQG7iQjIQuC4Bku",
  Bill: "pqHfZKP75CvOlQylNhV4",
}

export default function AILanguageTranslator() {
  const [file, setFile] = useState<File | null>(null)
  const [language, setLanguage] = useState<string>("")
  const [selectedVoice, setSelectedVoice] = useState<string>("")
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [isConverting, setIsConverting] = useState<boolean>(false)
  const [convertedAudioUrl, setConvertedAudioUrl] = useState<string>("")
  const [isDownloaded, setIsDownloaded] = useState<boolean>(false)
  const [sampleAudioUrl, setSampleAudioUrl] = useState<string>("")
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [duration, setDuration] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [volume, setVolume] = useState<number>(1)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const convertedAudioRef = useRef<HTMLAudioElement>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      if (!selectedFile.type.startsWith("audio/")) {
        alert("Please upload an audio file")
        return
      }

      if (selectedFile.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB limit")
        return
      }

      setIsUploading(true)
      setFile(selectedFile)
      setIsUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
  }

  const handleVoiceChange = (value: string) => {
    setSelectedVoice(value)
    setSampleAudioUrl(`/voices/${value}.mp3`)
    setIsPlaying(false)
  }

  const togglePlaySample = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleAudioEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const handlePlayConvertedAudio = () => {
    if (convertedAudioRef.current) {
      if (convertedAudioRef.current.paused) {
        convertedAudioRef.current.play()
        progressIntervalRef.current = setInterval(() => {
          if (convertedAudioRef.current) {
            setCurrentTime(convertedAudioRef.current.currentTime)
          }
        }, 100)
      } else {
        convertedAudioRef.current.pause()
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current)
        }
      }
    }
  }

  const handleLoadedMetadata = () => {
    if (convertedAudioRef.current) {
      setDuration(convertedAudioRef.current.duration)
    }
  }

  const handleSeek = (value: number[]) => {
    if (convertedAudioRef.current) {
      const newTime = value[0]
      convertedAudioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (convertedAudioRef.current) {
      convertedAudioRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (convertedAudioRef.current) {
      if (isMuted) {
        convertedAudioRef.current.volume = volume || 1
        setIsMuted(false)
      } else {
        convertedAudioRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const handleConvertAudio = async () => {
    if (!file || !language || !selectedVoice) {
      alert("Please upload an audio file, select a language, and choose a voice")
      return
    }

    setIsConverting(true)
    setConvertedAudioUrl("")

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("lang", language)
      formData.append("voice", voiceCodes[selectedVoice as keyof typeof voiceCodes])

      const res = await axios.post(`${url}/elevenlab/changeAudioLanguage`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      })

      // Create a URL for the blob response
      const audioUrl = URL.createObjectURL(res.data)
      setConvertedAudioUrl(audioUrl)

      // Reset file input
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Error converting audio:", error)
      alert("Error converting audio. Please try again.")
    } finally {
      setIsConverting(false)
    }
  }

  const handleDownloadAudio = () => {
    if (convertedAudioUrl) {
      const a = document.createElement("a")
      a.href = convertedAudioUrl
      a.download = `translated-to-${language}-${selectedVoice}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      setIsDownloaded(true)
      setTimeout(() => {
        setIsDownloaded(false)
      }, 2000)
    }
  }

  return (
    <div className="bg-gradient-to-r from-[#1c0e29] to-[#160a27] border border-[#3b1d59]/30 shadow-[0_0_15px_rgba(74,29,106,0.15)] backdrop-blur-sm min-h-[350px] max-h-[550px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#3b1d59]/50 rounded-lg relative max-w-4xl w-full p-6">
      <h2 className="text-2xl font-bold text-white mb-6">AI Language Translator</h2>

      <div className="mb-6">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="audio/*"
          onChange={handleFileSelect}
          disabled={isUploading}
        />

        {!file ? (
          <div
            className="border-2 border-dashed border-[#3b1d59] rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#4a2472] transition-colors"
            onClick={triggerFileInput}
          >
            <Upload className="h-12 w-12 text-purple-400 mb-4" />
            <p className="text-purple-300 text-center mb-2">Click to upload or drag and drop</p>
            <p className="text-purple-400/60 text-sm text-center">Audio File only (Max 10MB)</p>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-[#2a1541] border border-[#3b1d59] rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <FileAudio className="h-6 w-6 text-purple-400" />
              <span className="text-white truncate max-w-[300px]">{file.name}</span>
            </div>
            <button
              className="bg-[#3b1d59]/50 hover:bg-[#3b1d59] rounded-full p-1.5 transition-colors"
              onClick={handleRemoveFile}
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-white text-sm font-medium mb-2">Select Target Language</label>
          <Select onValueChange={handleLanguageChange} value={language}>
            <SelectTrigger className="w-full bg-[#2a1541] border-[#3b1d59] text-white h-12">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="bg-[#2a1541] border-[#3b1d59] text-white">
              {languages.map((lang) => (
                <SelectItem
                  key={lang.value}
                  value={lang.value}
                  className="hover:bg-[#3b1d59] focus:bg-[#3b1d59] cursor-pointer"
                >
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">Select Voice</label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select onValueChange={handleVoiceChange} value={selectedVoice}>
                <SelectTrigger className="w-full bg-[#2a1541] border-[#3b1d59] text-white h-12">
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent className="bg-[#2a1541] border-[#3b1d59] text-white max-h-[200px]">
                  {voices.map((voice) => (
                    <SelectItem
                      key={voice}
                      value={voice}
                      className="hover:bg-[#3b1d59] focus:bg-[#3b1d59] cursor-pointer"
                    >
                      {voice}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedVoice && (
              <button
                onClick={togglePlaySample}
                className="flex items-center justify-center h-12 w-12 bg-[#3b1d59] hover:bg-[#4a2472] text-white rounded-md transition-colors"
                title={isPlaying ? "Pause sample" : "Play sample"}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
            )}

            {sampleAudioUrl && (
              <audio ref={audioRef} src={sampleAudioUrl} onEnded={handleAudioEnded} className="hidden" />
            )}
          </div>
        </div>
      </div>

      <button
        className="w-full py-6 text-lg font-semibold bg-[#3b1d59] hover:bg-[#4a2472] transition-colors text-white rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        onClick={handleConvertAudio}
        disabled={isUploading || isConverting || !file || !language || !selectedVoice}
      >
        {isConverting ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            <span>Converting Audio...</span>
          </div>
        ) : (
          "Convert Audio"
        )}
      </button>

      {convertedAudioUrl && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-white">Translated Audio</h3>
            <button
              onClick={handleDownloadAudio}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3b1d59] hover:bg-[#4a2472] text-white rounded-md transition-colors text-sm"
              disabled={isDownloaded}
            >
              {isDownloaded ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-[#2a1541]/80 backdrop-blur border border-[#3b1d59] rounded-lg p-6">
            <audio
              ref={convertedAudioRef}
              src={convertedAudioUrl}
              onEnded={handleAudioEnded}
              onLoadedMetadata={handleLoadedMetadata}
              className="hidden"
            />

            <div className="custom-audio-player space-y-4">
              {/* Main Controls */}
              <div className="flex items-center gap-4">
                {/* Play/Pause Button */}
                <button onClick={handlePlayConvertedAudio} className="relative group">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-md transition-all group-hover:bg-white/30" />
                  <div className="relative flex items-center justify-center h-12 w-12 bg-white/10 hover:bg-white/20 rounded-full border border-white/20 backdrop-blur transition-all">
                    {convertedAudioRef.current?.paused ? (
                      <Play className="h-5 w-5 text-white fill-white" />
                    ) : (
                      <Pause className="h-5 w-5 text-white fill-white" />
                    )}
                  </div>
                </button>

                {/* Time Display */}
                <div className="text-white/90 font-medium tabular-nums">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-2 ml-auto">
                  <button onClick={toggleMute} className="relative group">
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center justify-center h-8 w-8 hover:bg-white/10 rounded-full transition-colors">
                      {isMuted ? (
                        <VolumeX className="h-4 w-4 text-white" />
                      ) : (
                        <Volume2 className="h-4 w-4 text-white" />
                      )}
                    </div>
                  </button>

                  <div className="w-24 py-2">
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                      className="relative flex items-center select-none touch-none w-full"
                    >
                      <div className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-white/10">
                        <div
                          className="absolute h-full bg-white/50 group-hover:bg-white/60 transition-colors"
                          style={{
                            transform: `translateX(-${100 - (isMuted ? 0 : volume) * 100}%)`,
                          }}
                        />
                      </div>
                      <div
                        className="block h-4 w-4 rounded-full border-2 border-white bg-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                        style={{
                          left: `${(isMuted ? 0 : volume) * 100}%`,
                          transform: "translateX(-50%)",
                        }}
                      />
                    </Slider>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative group">
                <div className="absolute inset-y-0 w-full bg-white/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="absolute h-full bg-white/50 group-hover:bg-white/60 transition-colors"
                    style={{
                      width: `${(currentTime / (duration || 1)) * 100}%`,
                    }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    step={0.01}
                    value={currentTime}
                    onChange={(e) => handleSeek([Number.parseFloat(e.target.value)])}
                    className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

