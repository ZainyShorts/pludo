import type { ReactMicStopEvent } from "react-mic"

export interface AudioVisualizerProps {
  isRecording: boolean
  onStop: (recordedBlob: ReactMicStopEvent) => void
}

export interface AudioData {
  buffer: ArrayBuffer
}

