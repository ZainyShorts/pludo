"use client"

import { useState, useRef, useEffect } from "react"
import { Loader2, Volume2, Wand2, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

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

export default function TextToSpeechComponent() {
  const [text, setText] = useState("")
  const [selectedVoice, setSelectedVoice] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [sampleAudioUrl, setSampleAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.onended = () => setIsPlaying(false)

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }

      if (sampleAudioUrl && sampleAudioUrl.startsWith("blob:")) {
        URL.revokeObjectURL(sampleAudioUrl)
      }
    }
  }, [])

  useEffect(() => {
    if (selectedVoice) {
      setSampleAudioUrl(`/voices/${selectedVoice}.mp3`)
    }
  }, [selectedVoice])

  const togglePlaySample = () => {
    if (!audioRef.current || !sampleAudioUrl) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.src = sampleAudioUrl
      audioRef.current.play().catch((err) => {
        toast({
          title: "Error playing audio",
          description: "Could not play the sample audio file.",
          variant: "destructive",
        })
        console.error("Error playing audio:", err)
      })
      setIsPlaying(true)
    }
  }

  async function handleGenerate() {
    if (!text || !selectedVoice) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PLUDO_SERVER}/elevenlab/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text,
          voice: getVoiceCode(selectedVoice),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate audio")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `tts_${selectedVoice.toLowerCase()}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      setTimeout(() => URL.revokeObjectURL(url), 100)

      toast({
        title: "Audio generated successfully",
        description: "Your audio has been downloaded.",
      })
    } catch (err) {
      console.error("Error generating audio:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      toast({
        title: "Error generating audio",
        description: err instanceof Error ? err.message : "Failed to generate audio",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getVoiceCode = (voiceName: string) => {
  
    const voiceCodes: Record<string, string> = {
      Alice: "cgSgspJ2msm6clMCkdW9",
    }

    return voiceCodes[voiceName] || "cgSgspJ2msm6clMCkdW9"
  }

  return (
    <div className="bg-gradient-to-r from-[#1c0e29] to-[#160a27] border border-[#3b1d59]/30 shadow-[0_0_15px_rgba(74,29,106,0.15)] backdrop-blur-sm min-h-[350px] max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#3b1d59]/50 rounded-lg relative max-w-4xl w-full p-6">
      <div className="flex items-center gap-3 mb-6">
        <Volume2 className="h-7 w-7 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Text to Speech</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-700/30 rounded-md text-red-200">
          <p>{error}</p>
        </div>
      )}

      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="text" className="text-lg text-white font-medium">
            Enter your text
          </Label>
          <Textarea
            id="text"
            placeholder="Type something to convert to speech..."
            className="min-h-[150px] bg-[#2a1541] border-[#3b1d59] text-white placeholder:text-gray-400 focus-visible:ring-[#6e35a8] focus-visible:ring-offset-[#3b1d59] text-base resize-none shadow-inner"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <p className="text-xs text-purple-300/70 mt-1">
            Enter the text you want to convert to speech. Maximum 10000 characters.
          </p>
        </div>

        {text && (
          <div className="space-y-2 animate-fadeIn">
            <Label htmlFor="voice" className="text-lg text-white font-medium">
              Select Voice
            </Label>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Select onValueChange={setSelectedVoice} value={selectedVoice}>
                  <SelectTrigger
                    id="voice"
                    className="bg-[#2a1541] border-[#3b1d59] text-white focus:ring-[#6e35a8] focus:ring-offset-[#3b1d59] h-12"
                  >
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2a1541] border-[#3b1d59] text-white max-h-[300px]">
                    <div className="grid grid-cols-2 gap-1">
                      {voices.map((voice) => (
                        <SelectItem
                          key={voice}
                          value={voice}
                          className="focus:bg-[#4a2472] focus:text-white hover:bg-[#3b1d59] cursor-pointer"
                        >
                          {voice}
                        </SelectItem>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </div>

              {selectedVoice && (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 bg-[#2a1541] border-[#3b1d59] text-white hover:bg-[#3b1d59] hover:text-white"
                  onClick={togglePlaySample}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  <span className="sr-only">{isPlaying ? "Pause" : "Play"} sample</span>
                </Button>
              )}
            </div>
            <p className="text-xs text-purple-300/70 mt-1">
              Choose a voice and click the play button to hear a sample.
            </p>
          </div>
        )}

        <div className="flex flex-col space-y-4">
          <Button
            onClick={handleGenerate}
            disabled={!text || !selectedVoice || isLoading}
            className="mt-4 bg-[#4a2472] hover:bg-[#5c2d8a] text-white disabled:opacity-50 h-14 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:shadow-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Generating Audio...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Wand2 className="mr-2 h-5 w-5" />
                <span>Generate Audio</span>
              </div>
            )}
          </Button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

