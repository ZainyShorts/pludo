import React, { useRef, useEffect, useState } from 'react';
import { useResizeObserver } from './useResizeObserver';

interface AudioVisualizationProps {
  audioData: Uint8Array;
}

export const AudioVisualization: React.FC<AudioVisualizationProps> = ({ audioData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const previousDataRef = useRef<number[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useResizeObserver(containerRef, (entry) => {
    const { width, height } = entry.contentRect;
    setDimensions({ 
      width: Math.round(width * window.devicePixelRatio), 
      height: Math.round(height * window.devicePixelRatio) 
    });
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    
    // Responsive bar count based on screen width
    const barCount = Math.max(16, Math.min(48, Math.floor(width / 12)));
    const barWidth = (width / barCount) * 0.8;
    const maxBarHeight = height * 0.8;
    const smoothingFactor = 0.3;

    if (previousDataRef.current.length !== barCount) {
      previousDataRef.current = new Array(barCount).fill(0);
    }

    const normalizedData = Array.from({ length: barCount }, (_, i) => {
      const dataIndex = Math.floor((i / barCount) * audioData.length);
      const value = audioData[dataIndex] || 0;
      const previousValue = previousDataRef.current[i];
      const smoothedValue = previousValue + (value - previousValue) * smoothingFactor;
      previousDataRef.current[i] = smoothedValue;
      return smoothedValue;
    });

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Responsive background glow
      const glowRadius = Math.min(width, height) / 2;
      const bgGradient = ctx.createRadialGradient(
        width, height/2, 0,
        width, height/2, glowRadius
      );
      bgGradient.addColorStop(0, 'rgba(167, 139, 250, 0.1)');
      bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Responsive bar scaling
      const baseBarScale = Math.min(1, width / 768); // Scale down bars on smaller screens
      const scaledMaxHeight = maxBarHeight * baseBarScale;

      normalizedData.forEach((value, i) => {
        const x = i * (width / barCount) + (width / barCount - barWidth) / 2;
        const normalizedValue = value / 255;
        const barHeight = normalizedValue * scaledMaxHeight;
        
        const hue = 280 + (normalizedValue * 60);
        const saturation = 80 + (normalizedValue * 20);
        const lightness = 50 + (normalizedValue * 20);

        const gradient = ctx.createLinearGradient(x, centerY - barHeight, x, centerY + barHeight);
        gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.9)`);
        gradient.addColorStop(0.5, `hsla(${hue + 30}, ${saturation}%, ${lightness + 10}%, 0.9)`);
        gradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.9)`);

        // Responsive glow effect
        const glowSize = Math.max(5, 15 * baseBarScale);
        ctx.shadowBlur = glowSize + (normalizedValue * glowSize);
        ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.5)`;

        // Responsive bar corners
        const cornerRadius = Math.max(1, barWidth/2 * baseBarScale);

        // Draw upper bar
        ctx.beginPath();
        ctx.roundRect(x, centerY - barHeight, barWidth, barHeight, cornerRadius);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw lower bar (mirrored)
        ctx.beginPath();
        ctx.roundRect(x, centerY, barWidth, barHeight, cornerRadius);
        ctx.fill();

        // Responsive highlight effect for loud sounds
        if (normalizedValue > 0.7) {
          ctx.globalAlpha = (normalizedValue - 0.7) / 0.3;
          const highlightWidth = barWidth + (4 * baseBarScale);
          ctx.beginPath();
          ctx.roundRect(
            x - (2 * baseBarScale),
            centerY - barHeight - (2 * baseBarScale),
            highlightWidth,
            barHeight * 2 + (4 * baseBarScale),
            cornerRadius + (2 * baseBarScale)
          );
          ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness + 20}%, 0.6)`;
          ctx.lineWidth = 2 * baseBarScale;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });

      const highVolumeThreshold = 0.8;
      normalizedData.forEach((value, i) => {
        const normalizedValue = value / 255;
        if (normalizedValue > highVolumeThreshold) {
          const x = i * (width / barCount) + (width / barCount) / 2;
          const particleCount = Math.floor((normalizedValue - highVolumeThreshold) * 10 * baseBarScale);
          
          for (let j = 0; j < particleCount; j++) {
            const particleSize = (Math.random() * 3 + 1) * baseBarScale;
            const angle = Math.random() * Math.PI * 2;
            const distance = (Math.random() * 30 + 10) * baseBarScale;
            const px = x + Math.cos(angle) * distance;
            const py = centerY + Math.sin(angle) * distance;

            ctx.beginPath();
            ctx.arc(px, py, particleSize, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${280 + Math.random() * 60}, 80%, 60%, ${Math.random() * 0.5 + 0.5})`;
            ctx.fill();
          }
        }
      });

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioData, dimensions]);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[120px] max-h-[192px]">
      <canvas 
        ref={canvasRef}
        className="w-full h-full rounded-lg"
        style={{ 
          width: `${dimensions.width / window.devicePixelRatio}px`,
          height: `${dimensions.height / window.devicePixelRatio}px`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none rounded-lg" />
    </div>
  );
};
