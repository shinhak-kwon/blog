import React, { useEffect, useRef, useState } from 'react'
import { FastAverageColor } from 'fast-average-color'

interface ImageWithGradientProps {
  src: string
  alt: string
  className?: string
}

export const ImageWithGradient: React.FC<ImageWithGradientProps> = ({
  src,
  alt,
  className,
}) => {
  const imgRef = useRef<HTMLImageElement>(null)
  const [color, setColor] = useState<string | null>(null)
  const [isDark, setIsDark] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fac = new FastAverageColor()

    if (imgRef.current) {
      // Use standard DOM image processing
      fac
        .getColorAsync(imgRef.current, { algorithm: 'dominant' })
        .then((color) => {
          setColor(color.hex)
          setIsDark(color.isDark)
        })
        .catch((e) => {
          console.error('FastAverageColor error:', e)
          setError(e.message)
        })
    }

    return () => {
      fac.destroy()
    }
  }, [src])

  return (
    <div className={`group relative ${className} mb-8`}>
      {/* Halo Effect */}
      <div
        className="absolute inset-0 -z-10 rounded-xl opacity-40 blur-3xl transition-colors duration-1000"
        style={{
          backgroundColor: color || 'transparent',
          transform: 'scale(1.05)',
        }}
      />

      {/* Main Image */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="relative z-10 h-auto w-full rounded-xl shadow-md"
        crossOrigin="anonymous"
        loading="lazy"
      />

      {/* Bottom Description Bar - Only show if color is found */}
      {color && (
        <div
          className="mt-4 flex flex-col gap-2 rounded-lg border border-white/20 bg-white/50 p-4 shadow-sm backdrop-blur-sm transition-all duration-1000 dark:bg-black/20"
          style={{
            borderLeft: `4px solid ${color}`,
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full shadow-sm ring-1 ring-white/50"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm font-medium">Image Palette Analysis</span>
          </div>
          <p className="text-muted-foreground text-xs">
            Extracted dominant color:{' '}
            <code className="bg-muted rounded px-1 py-0.5">{color}</code>. This
            gradient is dynamically generated from the image content.
          </p>
        </div>
      )}
    </div>
  )
}
