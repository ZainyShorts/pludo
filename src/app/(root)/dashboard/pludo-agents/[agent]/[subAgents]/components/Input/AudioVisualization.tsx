import type React from "react"
import { useRef, useEffect, useState } from "react"

interface AudioVisualizationProps {
  audioData: Uint8Array
}

const AudioVisualization: React.FC<AudioVisualizationProps> = ({ audioData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        const height = containerRef.current.offsetHeight
        setDimensions({ width, height })
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas && audioData) {
      const ctx = canvas.getContext("2d")!
      const width = dimensions.width
      const height = dimensions.height

      const draw = () => {
        ctx.clearRect(0, 0, width, height)

        // Pulsating background
        const time = Date.now() / 1000
        const pulseIntensity = (Math.sin(time * 2) + 1) / 2
        const glowRadius = (Math.min(width, height) / 2) * (0.8 + pulseIntensity * 0.2)
        const bgGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, glowRadius)
        bgGradient.addColorStop(0, `rgba(167, 139, 250, ${0.1 + pulseIntensity * 0.05})`)
        bgGradient.addColorStop(1, "rgba(0, 0, 0, 0)")
        ctx.fillStyle = bgGradient
        ctx.fillRect(0, 0, width, height)

        const barWidth = width / audioData.length
        ctx.fillStyle = "white"
        ctx.strokeStyle = "white"
        for (let i = 0; i < audioData.length; i++) {
          const barHeight = (audioData[i] / 255) * height
          ctx.fillRect(i * barWidth, height - barHeight, barWidth, barHeight)
        }
      }

      const animationFrame = requestAnimationFrame(draw)
      return () => cancelAnimationFrame(animationFrame)
    }
  }, [audioData, dimensions])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[120px] max-h-[192px] animate-pulse"
      style={{ animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-lg"
        style={{
          width: `${dimensions.width / window.devicePixelRatio}px`,
          height: `${dimensions.height / window.devicePixelRatio}px`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none rounded-lg" />
    </div>
  )
}

export default AudioVisualization

