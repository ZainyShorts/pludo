import { useState, useRef, useCallback, useEffect } from "react"

export interface AudioRecordingHook {
  isRecording: boolean
  isPaused: boolean
  audioChunks: Blob[]
  audioUrl: string | null
  audioData: Uint8Array
  recordingTime: number
  handleStartRecording: () => Promise<void>
  handlePauseRecording: () => void
  handleResumeRecording: () => void
  handleStopRecording: () => void
  handleDeleteAudio: () => void
}

export function useAudioRecording(): AudioRecordingHook {
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(64).fill(0))
  const [recordingTime, setRecordingTime] = useState<number>(60)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, event.data])
        }
      }

      mediaRecorderRef.current.start(500) 
      setIsRecording(true)
      setIsPaused(false)
      setRecordingTime(60)
      setAudioChunks([])
      setAudioUrl(null)

      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      sourceNodeRef.current = audioContextRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioContextRef.current.createAnalyser()
      sourceNodeRef.current.connect(analyserRef.current)

      visualize()
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const handlePauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
    }
  }

  const handleResumeRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
    }
  }

  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      setRecordingTime(60)

      const audioBlob = new Blob(audioChunks, { type: "audio/webm" })
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)

      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect()
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [isRecording, audioChunks])

  const handleDeleteAudio = () => {
    setAudioChunks([])
    setAudioUrl(null)
  }

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isRecording && !isPaused) {
      intervalId = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev > 1) {
            return prev - 1
          } else {
            handleStopRecording()
            return 60
          }
        })
      }, 1000)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isRecording, isPaused])

  const visualize = () => {
    if (!analyserRef.current) return

    analyserRef.current.fftSize = 256
    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const updateVisualization = () => {
      if (!isRecording) return

      analyserRef.current!.getByteFrequencyData(dataArray)
      setAudioData(dataArray)

      requestAnimationFrame(updateVisualization)
    }

    updateVisualization()
  }

  return {
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
  }
}
