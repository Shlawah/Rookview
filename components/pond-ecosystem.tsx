"use client"

import { useEffect, useRef } from "react"

interface Anglerfish {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  phase: number
  lureGlow: number
}

export function PondEcosystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const fishRef = useRef<Anglerfish | null>(null)
  const timeRef = useRef(0)
  const dimensionsRef = useRef({ width: 0, height: 0 })
  const textElementsRef = useRef<{ x: number; y: number; width: number; height: number; text: string }[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Collect text elements from the page for light reflection
    const collectTextElements = () => {
      textElementsRef.current = []
      const textSelectors = "h1, h2, h3, h4, p, span, a, button, label"
      const elements = document.querySelectorAll(textSelectors)
      
      elements.forEach(el => {
        const rect = el.getBoundingClientRect()
        const text = el.textContent?.trim() || ""
        if (text && rect.width > 0 && rect.height > 0) {
          textElementsRef.current.push({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2 + window.scrollY,
            width: rect.width,
            height: rect.height,
            text: text.substring(0, 50)
          })
        }
      })
    }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const displayWidth = window.innerWidth
      const displayHeight = document.documentElement.scrollHeight || window.innerHeight * 3
      
      dimensionsRef.current = { width: displayWidth, height: displayHeight }
      
      canvas.width = displayWidth * dpr
      canvas.height = displayHeight * dpr
      
      canvas.style.width = `${displayWidth}px`
      canvas.style.height = `${displayHeight}px`
      
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      
      collectTextElements()
      initializeFish()
    }

    const initializeFish = () => {
      const w = dimensionsRef.current.width
      const h = dimensionsRef.current.height
      
      // Single anglerfish patrolling
      fishRef.current = {
        x: w * 0.2,
        y: h * 0.3,
        vx: 0.4,
        vy: 0.15,
        size: 120,
        phase: 0,
        lureGlow: 0.8
      }
    }

    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("scroll", collectTextElements)

    // Collect text elements periodically
    const textInterval = setInterval(collectTextElements, 2000)

    const animate = () => {
      timeRef.current++
      const time = timeRef.current
      const { width: w, height: h } = dimensionsRef.current
      const fish = fishRef.current

      ctx.clearRect(0, 0, w, h)

      if (!fish) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      // Update fish position - slow patrol
      fish.x += fish.vx
      fish.y += fish.vy
      fish.phase += 0.02

      // Gentle direction changes
      if (Math.random() > 0.99) {
        fish.vx += (Math.random() - 0.5) * 0.15
        fish.vy += (Math.random() - 0.5) * 0.1
      }

      // Keep speed in check
      fish.vx = Math.max(-0.8, Math.min(0.8, fish.vx))
      fish.vy = Math.max(-0.4, Math.min(0.4, fish.vy))

      // Bounce off edges with padding
      const padding = fish.size * 1.5
      if (fish.x < padding || fish.x > w - padding) {
        fish.vx *= -1
        fish.x = Math.max(padding, Math.min(w - padding, fish.x))
      }
      if (fish.y < padding || fish.y > h - padding) {
        fish.vy *= -1
        fish.y = Math.max(padding, Math.min(h - padding, fish.y))
      }

      // Pulsing lure glow
      fish.lureGlow = 0.6 + Math.sin(time * 0.03) * 0.3

      // Calculate lure position in world space
      const facingRight = fish.vx > 0
      const lureOffsetX = facingRight ? fish.size * 0.1 : -fish.size * 0.1
      const lureOffsetY = -fish.size * 0.65
      const lureWorldX = fish.x + lureOffsetX
      const lureWorldY = fish.y + lureOffsetY

      // Draw blue light reflection on nearby text elements
      const lightRadius = 350
      textElementsRef.current.forEach(textEl => {
        const dx = textEl.x - lureWorldX
        const dy = textEl.y - lureWorldY
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist < lightRadius) {
          const intensity = (1 - dist / lightRadius) * fish.lureGlow * 0.6
          
          // Draw glowing text reflection
          ctx.save()
          ctx.globalAlpha = intensity
          ctx.font = "bold 14px 'IBM Plex Mono', monospace"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          
          // Blue glow effect on text area
          const gradient = ctx.createRadialGradient(
            textEl.x, textEl.y, 0,
            textEl.x, textEl.y, Math.max(textEl.width, textEl.height) * 0.8
          )
          gradient.addColorStop(0, `rgba(80, 180, 255, ${intensity * 0.4})`)
          gradient.addColorStop(0.5, `rgba(40, 120, 255, ${intensity * 0.2})`)
          gradient.addColorStop(1, "rgba(20, 80, 200, 0)")
          
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.ellipse(textEl.x, textEl.y, textEl.width * 0.6, textEl.height * 0.8, 0, 0, Math.PI * 2)
          ctx.fill()
          
          ctx.restore()
        }
      })

      // Draw large ambient blue glow from lure
      const ambientGradient = ctx.createRadialGradient(
        lureWorldX, lureWorldY, 0,
        lureWorldX, lureWorldY, lightRadius
      )
      ambientGradient.addColorStop(0, `rgba(100, 200, 255, ${fish.lureGlow * 0.15})`)
      ambientGradient.addColorStop(0.3, `rgba(60, 150, 255, ${fish.lureGlow * 0.08})`)
      ambientGradient.addColorStop(0.6, `rgba(30, 100, 220, ${fish.lureGlow * 0.03})`)
      ambientGradient.addColorStop(1, "rgba(20, 60, 150, 0)")
      
      ctx.fillStyle = ambientGradient
      ctx.beginPath()
      ctx.arc(lureWorldX, lureWorldY, lightRadius, 0, Math.PI * 2)
      ctx.fill()

      // Draw anglerfish
      ctx.save()
      ctx.translate(fish.x, fish.y)
      ctx.scale(facingRight ? 1 : -1, 1)

      const wave = Math.sin(fish.phase + time * 0.003) * 0.05
      ctx.rotate(wave)

      ctx.globalAlpha = 0.35
      ctx.fillStyle = "#ffffff"

      // Bulbous body
      ctx.beginPath()
      ctx.moveTo(fish.size * 0.8, 0)
      ctx.quadraticCurveTo(fish.size * 0.6, -fish.size * 0.5, 0, -fish.size * 0.45)
      ctx.quadraticCurveTo(-fish.size * 0.5, -fish.size * 0.4, -fish.size * 0.7, -fish.size * 0.15)
      ctx.lineTo(-fish.size, 0)
      ctx.quadraticCurveTo(-fish.size * 0.7, fish.size * 0.3, -fish.size * 0.3, fish.size * 0.4)
      ctx.quadraticCurveTo(fish.size * 0.3, fish.size * 0.5, fish.size * 0.8, 0)
      ctx.fill()

      // Mouth
      ctx.globalAlpha = 0.15
      ctx.fillStyle = "#000000"
      ctx.beginPath()
      ctx.moveTo(fish.size * 0.85, fish.size * 0.05)
      ctx.quadraticCurveTo(fish.size * 0.5, fish.size * 0.35, fish.size * 0.1, fish.size * 0.25)
      ctx.quadraticCurveTo(fish.size * 0.4, fish.size * 0.1, fish.size * 0.85, fish.size * 0.05)
      ctx.fill()

      // Teeth
      ctx.globalAlpha = 0.45
      ctx.fillStyle = "#ffffff"
      const teethCount = 8
      for (let i = 0; i < teethCount; i++) {
        const t = i / (teethCount - 1)
        const tx = fish.size * 0.8 - t * fish.size * 0.65
        const ty = fish.size * 0.08 + Math.sin(t * Math.PI) * fish.size * 0.15
        const toothSize = fish.size * 0.07 * (1 - t * 0.3)
        
        ctx.beginPath()
        ctx.moveTo(tx - toothSize * 0.3, ty)
        ctx.lineTo(tx, ty + toothSize)
        ctx.lineTo(tx + toothSize * 0.3, ty)
        ctx.closePath()
        ctx.fill()
      }

      // Eye
      ctx.globalAlpha = 0.6
      ctx.beginPath()
      ctx.arc(fish.size * 0.3, -fish.size * 0.2, fish.size * 0.05, 0, Math.PI * 2)
      ctx.fill()

      // Illicium (stalk)
      ctx.globalAlpha = 0.3
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(fish.size * 0.2, -fish.size * 0.4)
      ctx.quadraticCurveTo(fish.size * 0.3, -fish.size * 0.55, fish.size * 0.1, -fish.size * 0.65)
      ctx.stroke()

      // Glowing blue lure
      const lureX = fish.size * 0.1
      const lureY = -fish.size * 0.65
      
      const lureGradient = ctx.createRadialGradient(lureX, lureY, 0, lureX, lureY, fish.size * 0.25)
      lureGradient.addColorStop(0, `rgba(150, 220, 255, ${fish.lureGlow})`)
      lureGradient.addColorStop(0.2, `rgba(80, 180, 255, ${fish.lureGlow * 0.8})`)
      lureGradient.addColorStop(0.5, `rgba(40, 120, 255, ${fish.lureGlow * 0.4})`)
      lureGradient.addColorStop(1, "rgba(20, 80, 200, 0)")
      
      ctx.globalAlpha = 1
      ctx.fillStyle = lureGradient
      ctx.beginPath()
      ctx.arc(lureX, lureY, fish.size * 0.25, 0, Math.PI * 2)
      ctx.fill()

      // Bright core
      ctx.globalAlpha = fish.lureGlow
      ctx.fillStyle = "#ffffff"
      ctx.beginPath()
      ctx.arc(lureX, lureY, fish.size * 0.04, 0, Math.PI * 2)
      ctx.fill()

      // Dorsal spines
      ctx.globalAlpha = 0.25
      ctx.fillStyle = "#ffffff"
      for (let i = 0; i < 4; i++) {
        const spineX = -fish.size * 0.15 - i * fish.size * 0.12
        const spineHeight = fish.size * 0.15 * (1 - i * 0.15)
        ctx.beginPath()
        ctx.moveTo(spineX - 2, -fish.size * 0.38)
        ctx.lineTo(spineX, -fish.size * 0.38 - spineHeight)
        ctx.lineTo(spineX + 2, -fish.size * 0.38)
        ctx.closePath()
        ctx.fill()
      }

      // Tail
      const tailWave = Math.sin(fish.phase + time * 0.005) * 0.15
      ctx.save()
      ctx.translate(-fish.size, 0)
      ctx.rotate(tailWave)
      ctx.globalAlpha = 0.3
      ctx.beginPath()
      ctx.moveTo(0, -fish.size * 0.08)
      ctx.lineTo(-fish.size * 0.3, -fish.size * 0.25)
      ctx.lineTo(-fish.size * 0.25, 0)
      ctx.lineTo(-fish.size * 0.3, fish.size * 0.2)
      ctx.lineTo(0, fish.size * 0.08)
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      ctx.restore()

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("scroll", collectTextElements)
      clearInterval(textInterval)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{ background: "#01020A" }}
    />
  )
}
