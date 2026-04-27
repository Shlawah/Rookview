"use client"

import { useEffect, useRef, useMemo, useCallback } from "react"

interface Fish {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  phase: number
  transformTimer: number
  opacity: number
  isCodeFish: boolean
  codeChars: string[]
  alive: boolean
  fishType: "small" | "shark" | "code"
}

interface NumberSplash {
  x: number
  y: number
  particles: SplashParticle[]
  life: number
  maxLife: number
}

interface SplashParticle {
  x: number
  y: number
  vx: number
  vy: number
  value: string
  size: number
  rotation: number
  rotationSpeed: number
  gravity: number
  targetButton: boolean
  buttonX: number
  buttonY: number
}

interface Ripple {
  x: number
  y: number
  radius: number
  maxRadius: number
  opacity: number
}

export function PondEcosystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const fishRef = useRef<Fish[]>([])
  const splashesRef = useRef<NumberSplash[]>([])
  const ripplesRef = useRef<Ripple[]>([])
  const timeRef = useRef(0)
  const buttonPosRef = useRef({ x: 0, y: 0 })
  const dimensionsRef = useRef({ width: 0, height: 0 })

  const numberValues = useMemo(() => [
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    "$", "¥", "€", "£"
  ], [])

  const codeChars = useMemo(() => [
    "{", "}", "[", "]", "(", ")", "<", ">", "/", "=",
    ";", ":", "0", "1"
  ], [])

  const createRipple = useCallback((x: number, y: number, maxRadius = 40) => {
    ripplesRef.current.push({
      x, y,
      radius: 0,
      maxRadius,
      opacity: 0.12
    })
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Get button position for particle targeting
    const updateButtonPos = () => {
      const btn = document.getElementById("start-building-btn")
      if (btn) {
        const rect = btn.getBoundingClientRect()
        buttonPosRef.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        }
      }
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
      
      updateButtonPos()
      initializeElements()
    }

    const initializeElements = () => {
      const w = dimensionsRef.current.width
      const h = dimensionsRef.current.height
      
      fishRef.current = []

      // Initialize fish: 2 sharks, 6 small fish, 2 code fish
      // Sharks - big, slow, explode every ~60 seconds (3600 frames)
      for (let i = 0; i < 2; i++) {
        fishRef.current.push({
          x: 150 + Math.random() * (w - 300),
          y: 100 + Math.random() * (h - 200),
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.08,
          size: 28 + Math.random() * 8,
          phase: Math.random() * Math.PI * 2,
          transformTimer: 3400 + Math.random() * 400,
          opacity: 0.12,
          isCodeFish: false,
          codeChars: [],
          alive: true,
          fishType: "shark"
        })
      }
      
      // Small fish - explode every ~14 seconds (840 frames)
      for (let i = 0; i < 6; i++) {
        const section = Math.floor(i / 2)
        fishRef.current.push({
          x: 100 + (section / 3) * (w - 200) + (Math.random() - 0.5) * 120,
          y: 80 + Math.random() * (h - 160),
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.2,
          size: 5 + Math.random() * 4,
          phase: Math.random() * Math.PI * 2,
          transformTimer: 750 + Math.random() * 180,
          opacity: 0.08 + Math.random() * 0.04,
          isCodeFish: false,
          codeChars: [],
          alive: true,
          fishType: "small"
        })
      }
      
      // Code fish - never explode, just swim
      for (let i = 0; i < 2; i++) {
        fishRef.current.push({
          x: 200 + Math.random() * (w - 400),
          y: 150 + Math.random() * (h - 300),
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.12,
          size: 12 + Math.random() * 4,
          phase: Math.random() * Math.PI * 2,
          transformTimer: 0,
          opacity: 0.14,
          isCodeFish: true,
          codeChars: Array.from({ length: 15 }, () => codeChars[Math.floor(Math.random() * codeChars.length)]),
          alive: true,
          fishType: "code"
        })
      }
    }

    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("scroll", updateButtonPos)

    // Create number splash
    const createSplash = (x: number, y: number, isShark: boolean = false) => {
      const particles: SplashParticle[] = []
      const particleCount = isShark 
        ? 35 + Math.floor(Math.random() * 15)
        : 18 + Math.floor(Math.random() * 10)
      
      const splashGoesToButton = Math.random() < 0.5

      for (let i = 0; i < particleCount; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.2
        const speed = isShark ? 3 + Math.random() * 4 : 2 + Math.random() * 3

        particles.push({
          x: 0,
          y: 0,
          vx: Math.cos(angle) * speed * (0.5 + Math.random() * 0.4),
          vy: Math.sin(angle) * speed,
          value: numberValues[Math.floor(Math.random() * numberValues.length)],
          size: isShark ? 12 + Math.random() * 14 : 10 + Math.random() * 10,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.12,
          gravity: splashGoesToButton ? 0.02 : 0.05 + Math.random() * 0.025,
          targetButton: splashGoesToButton,
          buttonX: buttonPosRef.current.x,
          buttonY: buttonPosRef.current.y
        })
      }

      splashesRef.current.push({ x, y, particles, life: 0, maxLife: splashGoesToButton ? 180 : 150 })
      createRipple(x, y, isShark ? 70 : 45)
    }

    // Draw fish
    const drawFish = (fish: Fish, time: number) => {
      if (!fish.alive) return
      
      if (fish.isCodeFish) {
        // Code fish made of characters
        ctx.save()
        ctx.translate(fish.x, fish.y)
        ctx.scale(fish.vx > 0 ? 1 : -1, 1)

        ctx.globalAlpha = fish.opacity
        ctx.fillStyle = "#ffffff"
        ctx.font = `${fish.size * 0.6}px "IBM Plex Mono", monospace`
        ctx.textAlign = "center"

        fish.codeChars.forEach((char, i) => {
          const angle = (i / fish.codeChars.length) * Math.PI * 2
          const dist = fish.size * (0.4 + Math.sin(angle * 2) * 0.2)
          const x = Math.cos(angle + time * 0.002) * dist
          const y = Math.sin(angle + time * 0.002) * dist * 0.5

          ctx.globalAlpha = fish.opacity * (0.6 + Math.sin(i + time * 0.003) * 0.4)
          ctx.fillText(char, x, y)
        })

        ctx.restore()
      } else if (fish.fishType === "shark") {
        // Big shark fish
        ctx.save()
        ctx.translate(fish.x, fish.y)
        ctx.scale(fish.vx > 0 ? 1 : -1, 1)

        const wave = Math.sin(fish.phase + time * 0.005) * 0.08
        ctx.rotate(wave)

        ctx.globalAlpha = fish.opacity
        ctx.fillStyle = "#ffffff"

        // Streamlined body
        ctx.beginPath()
        ctx.moveTo(fish.size, 0)
        ctx.quadraticCurveTo(fish.size * 0.5, -fish.size * 0.35, -fish.size * 0.3, -fish.size * 0.25)
        ctx.lineTo(-fish.size, 0)
        ctx.lineTo(-fish.size * 0.3, fish.size * 0.25)
        ctx.quadraticCurveTo(fish.size * 0.5, fish.size * 0.35, fish.size, 0)
        ctx.fill()

        // Dorsal fin
        ctx.beginPath()
        ctx.moveTo(fish.size * 0.2, -fish.size * 0.25)
        ctx.lineTo(0, -fish.size * 0.6)
        ctx.lineTo(-fish.size * 0.3, -fish.size * 0.25)
        ctx.closePath()
        ctx.fill()

        // Tail fin
        const tailWave = Math.sin(fish.phase + time * 0.008) * 0.25
        ctx.save()
        ctx.translate(-fish.size, 0)
        ctx.rotate(tailWave)
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(-fish.size * 0.5, -fish.size * 0.4)
        ctx.lineTo(-fish.size * 0.35, 0)
        ctx.lineTo(-fish.size * 0.5, fish.size * 0.4)
        ctx.closePath()
        ctx.fill()
        ctx.restore()

        // Pectoral fin
        ctx.beginPath()
        ctx.moveTo(fish.size * 0.3, fish.size * 0.15)
        ctx.lineTo(fish.size * 0.1, fish.size * 0.4)
        ctx.lineTo(-fish.size * 0.1, fish.size * 0.15)
        ctx.closePath()
        ctx.fill()

        // Eye
        ctx.globalAlpha = fish.opacity * 1.8
        ctx.beginPath()
        ctx.arc(fish.size * 0.6, -fish.size * 0.08, fish.size * 0.08, 0, Math.PI * 2)
        ctx.fill()

        // Gill slits
        ctx.globalAlpha = fish.opacity * 0.5
        ctx.lineWidth = 1
        ctx.strokeStyle = "#ffffff"
        for (let i = 0; i < 3; i++) {
          ctx.beginPath()
          ctx.moveTo(fish.size * 0.35 - i * 4, -fish.size * 0.1)
          ctx.lineTo(fish.size * 0.35 - i * 4, fish.size * 0.1)
          ctx.stroke()
        }

        ctx.restore()
      } else {
        // Small regular fish
        ctx.save()
        ctx.translate(fish.x, fish.y)
        ctx.scale(fish.vx > 0 ? 1 : -1, 1)

        const wave = Math.sin(fish.phase + time * 0.008) * 0.15
        ctx.rotate(wave)

        ctx.globalAlpha = fish.opacity
        ctx.fillStyle = "#ffffff"

        // Body
        ctx.beginPath()
        ctx.ellipse(0, 0, fish.size, fish.size * 0.4, 0, 0, Math.PI * 2)
        ctx.fill()

        // Tail
        const tailWave = Math.sin(fish.phase + time * 0.012) * 0.3
        ctx.save()
        ctx.translate(-fish.size, 0)
        ctx.rotate(tailWave)
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(-fish.size * 0.6, -fish.size * 0.35)
        ctx.lineTo(-fish.size * 0.6, fish.size * 0.35)
        ctx.closePath()
        ctx.fill()
        ctx.restore()

        // Eye
        ctx.globalAlpha = fish.opacity * 1.5
        ctx.beginPath()
        ctx.arc(fish.size * 0.5, -fish.size * 0.1, fish.size * 0.12, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      }
    }

    // Main animation loop
    const animate = () => {
      timeRef.current++
      const time = timeRef.current
      const { width: w, height: h } = dimensionsRef.current

      ctx.clearRect(0, 0, w, h)

      // Draw ripples
      ripplesRef.current = ripplesRef.current.filter(ripple => {
        ripple.radius += 0.8
        ripple.opacity -= 0.002

        if (ripple.opacity <= 0) return false

        ctx.globalAlpha = ripple.opacity
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 0.8
        ctx.beginPath()
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
        ctx.stroke()

        if (ripple.radius < ripple.maxRadius * 0.6) {
          ctx.globalAlpha = ripple.opacity * 0.5
          ctx.beginPath()
          ctx.arc(ripple.x, ripple.y, ripple.radius * 0.6, 0, Math.PI * 2)
          ctx.stroke()
        }

        return true
      })

      // Draw and update fish
      fishRef.current.forEach((fish) => {
        if (!fish.alive) return

        fish.x += fish.vx
        fish.y += fish.vy
        fish.phase += 0.05

        // Bounce off edges
        if (fish.x < 80 || fish.x > w - 80) fish.vx *= -1
        if (fish.y < 50 || fish.y > h - 50) fish.vy *= -1

        // Random direction changes
        if (Math.random() > 0.995) {
          if (fish.fishType === "shark") {
            fish.vx += (Math.random() - 0.5) * 0.08
            fish.vy += (Math.random() - 0.5) * 0.04
            fish.vx = Math.max(-0.3, Math.min(0.3, fish.vx))
            fish.vy = Math.max(-0.1, Math.min(0.1, fish.vy))
          } else {
            fish.vx += (Math.random() - 0.5) * 0.2
            fish.vy += (Math.random() - 0.5) * 0.1
            fish.vx = Math.max(-0.7, Math.min(0.7, fish.vx))
            fish.vy = Math.max(-0.25, Math.min(0.25, fish.vy))
          }
        }

        // Transform timer (splash)
        if (!fish.isCodeFish && fish.transformTimer > 0) {
          fish.transformTimer--
          if (fish.transformTimer === 0) {
            const isShark = fish.fishType === "shark"
            createSplash(fish.x, fish.y, isShark)
            fish.transformTimer = isShark 
              ? 3400 + Math.random() * 400 
              : 750 + Math.random() * 180
          }
        }

        drawFish(fish, time)
      })

      // Draw and update splashes
      splashesRef.current = splashesRef.current.filter(splash => {
        splash.life++

        splash.particles.forEach(p => {
          if (p.targetButton && splash.life > 20) {
            const dx = p.buttonX - (splash.x + p.x)
            const dy = p.buttonY - (splash.y + p.y)
            const dist = Math.sqrt(dx * dx + dy * dy)
            
            if (dist > 10) {
              p.vx += (dx / dist) * 0.15
              p.vy += (dy / dist) * 0.15
              p.vx *= 0.98
              p.vy *= 0.98
            }
          } else {
            p.vy += p.gravity
          }

          p.x += p.vx
          p.y += p.vy
          p.rotation += p.rotationSpeed
        })

        const progress = splash.life / splash.maxLife
        const fadeStart = 0.6

        splash.particles.forEach(p => {
          let alpha = 0.4
          if (progress > fadeStart) {
            alpha = 0.4 * (1 - (progress - fadeStart) / (1 - fadeStart))
          }

          ctx.save()
          ctx.translate(splash.x + p.x, splash.y + p.y)
          ctx.rotate(p.rotation)
          ctx.globalAlpha = alpha
          ctx.fillStyle = "#ffffff"
          ctx.font = `bold ${p.size}px "IBM Plex Mono", monospace`
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(p.value, 0, 0)
          ctx.restore()
        })

        return splash.life < splash.maxLife
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("scroll", updateButtonPos)
      cancelAnimationFrame(animationRef.current)
    }
  }, [numberValues, codeChars, createRipple])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{ background: "#01020A" }}
    />
  )
}
