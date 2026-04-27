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
  fishType: "small" | "shark" | "code" | "angler"
  // Anglerfish specific
  dartTimer?: number
  isDarting?: boolean
  dartDirection?: number
  lureGlow?: number
  // Schooling behavior
  schoolId?: number
  targetX?: number
  targetY?: number
  // Dissolve into matrix effect
  dissolving?: boolean
  dissolveProgress?: number
  dissolveChars?: { char: string; x: number; y: number; vy: number; opacity: number }[]
}

interface MatrixDrop {
  x: number
  y: number
  chars: { char: string; opacity: number }[]
  speed: number
  life: number
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
  const matrixDropsRef = useRef<MatrixDrop[]>([])
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

      // Initialize fish: 3 sharks, schools of small fish, 2 code fish, 1 anglerfish
      
      // Sharks - big, faster, can swim off screen and wrap around
      for (let i = 0; i < 3; i++) {
        const direction = Math.random() > 0.5 ? 1 : -1
        fishRef.current.push({
          x: Math.random() * w,
          y: 100 + Math.random() * (h - 200),
          vx: direction * (1.5 + Math.random() * 1),
          vy: (Math.random() - 0.5) * 0.5,
          size: 90 + Math.random() * 40,
          phase: Math.random() * Math.PI * 2,
          transformTimer: 3400 + Math.random() * 400,
          opacity: 0.3,
          isCodeFish: false,
          codeChars: [],
          alive: true,
          fishType: "shark"
        })
      }
      
      // Schools of small fish - 3 schools with 10-15 fish each, slower and more wavy
      for (let school = 0; school < 3; school++) {
        const schoolCenterX = 200 + Math.random() * (w - 400)
        const schoolCenterY = 150 + Math.random() * (h - 300)
        const schoolDirection = Math.random() > 0.5 ? 1 : -1
        const schoolSpeed = 0.8 + Math.random() * 0.5 // Half speed
        const fishCount = 10 + Math.floor(Math.random() * 6)
        
        for (let i = 0; i < fishCount; i++) {
          fishRef.current.push({
            x: schoolCenterX + (Math.random() - 0.5) * 100,
            y: schoolCenterY + (Math.random() - 0.5) * 80,
            vx: schoolDirection * schoolSpeed + (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.4,
            size: 16 + Math.random() * 10,
            phase: Math.random() * Math.PI * 2,
            transformTimer: 600 + Math.random() * 400, // Will trigger dissolve
            opacity: 0.28 + Math.random() * 0.1,
            isCodeFish: false,
            codeChars: [],
            alive: true,
            fishType: "small",
            schoolId: school,
            targetX: schoolCenterX,
            targetY: schoolCenterY,
            dissolving: false,
            dissolveProgress: 0,
            dissolveChars: []
          })
        }
      }
      
      // Code fish - never explode, just swim faster
      for (let i = 0; i < 2; i++) {
        const direction = Math.random() > 0.5 ? 1 : -1
        fishRef.current.push({
          x: 200 + Math.random() * (w - 400),
          y: 150 + Math.random() * (h - 300),
          vx: direction * (1.2 + Math.random() * 0.8),
          vy: (Math.random() - 0.5) * 0.4,
          size: 50 + Math.random() * 20,
          phase: Math.random() * Math.PI * 2,
          transformTimer: 0,
          opacity: 0.35,
          isCodeFish: true,
          codeChars: Array.from({ length: 15 }, () => codeChars[Math.floor(Math.random() * codeChars.length)]),
          alive: true,
          fishType: "code"
        })
      }

      // Anglerfish - huge, scary, darts across screen even faster
      fishRef.current.push({
        x: -300,
        y: h * 0.3 + Math.random() * (h * 0.4),
        vx: 0.5,
        vy: 0,
        size: 180 + Math.random() * 60,
        phase: Math.random() * Math.PI * 2,
        transformTimer: 2000 + Math.random() * 500,
        opacity: 0.4,
        isCodeFish: false,
        codeChars: [],
        alive: true,
        fishType: "angler",
        dartTimer: 120 + Math.random() * 80,
        isDarting: false,
        dartDirection: 1,
        lureGlow: 0
      })
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
      } else if (fish.fishType === "angler") {
        // Scary anglerfish
        ctx.save()
        ctx.translate(fish.x, fish.y)
        ctx.scale(fish.vx > 0 ? 1 : -1, 1)

        const wave = Math.sin(fish.phase + time * 0.003) * 0.05
        ctx.rotate(wave)

        ctx.globalAlpha = fish.opacity
        ctx.fillStyle = "#ffffff"

        // Bulbous, ugly body
        ctx.beginPath()
        ctx.moveTo(fish.size * 0.8, 0)
        ctx.quadraticCurveTo(fish.size * 0.6, -fish.size * 0.5, 0, -fish.size * 0.45)
        ctx.quadraticCurveTo(-fish.size * 0.5, -fish.size * 0.4, -fish.size * 0.7, -fish.size * 0.15)
        ctx.lineTo(-fish.size, 0)
        ctx.quadraticCurveTo(-fish.size * 0.7, fish.size * 0.3, -fish.size * 0.3, fish.size * 0.4)
        ctx.quadraticCurveTo(fish.size * 0.3, fish.size * 0.5, fish.size * 0.8, 0)
        ctx.fill()

        // Huge scary mouth
        ctx.globalAlpha = fish.opacity * 0.3
        ctx.fillStyle = "#000000"
        ctx.beginPath()
        ctx.moveTo(fish.size * 0.85, fish.size * 0.05)
        ctx.quadraticCurveTo(fish.size * 0.5, fish.size * 0.35, fish.size * 0.1, fish.size * 0.25)
        ctx.quadraticCurveTo(fish.size * 0.4, fish.size * 0.1, fish.size * 0.85, fish.size * 0.05)
        ctx.fill()

        // Sharp teeth
        ctx.globalAlpha = fish.opacity * 1.2
        ctx.fillStyle = "#ffffff"
        const teethCount = 8
        for (let i = 0; i < teethCount; i++) {
          const t = i / (teethCount - 1)
          const tx = fish.size * 0.8 - t * fish.size * 0.65
          const ty = fish.size * 0.08 + Math.sin(t * Math.PI) * fish.size * 0.15
          const toothSize = fish.size * 0.08 * (1 - t * 0.3)
          
          ctx.beginPath()
          ctx.moveTo(tx - toothSize * 0.3, ty)
          ctx.lineTo(tx, ty + toothSize)
          ctx.lineTo(tx + toothSize * 0.3, ty)
          ctx.closePath()
          ctx.fill()
        }
        // Bottom teeth
        for (let i = 0; i < teethCount - 2; i++) {
          const t = (i + 0.5) / (teethCount - 1)
          const tx = fish.size * 0.75 - t * fish.size * 0.55
          const ty = fish.size * 0.22 + Math.sin(t * Math.PI) * fish.size * 0.08
          const toothSize = fish.size * 0.06 * (1 - t * 0.3)
          
          ctx.beginPath()
          ctx.moveTo(tx - toothSize * 0.3, ty)
          ctx.lineTo(tx, ty - toothSize)
          ctx.lineTo(tx + toothSize * 0.3, ty)
          ctx.closePath()
          ctx.fill()
        }

        // Creepy small eye
        ctx.globalAlpha = fish.opacity * 2
        ctx.beginPath()
        ctx.arc(fish.size * 0.3, -fish.size * 0.2, fish.size * 0.06, 0, Math.PI * 2)
        ctx.fill()
        
        // Pupil
        ctx.globalAlpha = fish.opacity * 0.5
        ctx.fillStyle = "#000000"
        ctx.beginPath()
        ctx.arc(fish.size * 0.32, -fish.size * 0.2, fish.size * 0.03, 0, Math.PI * 2)
        ctx.fill()

        // Bioluminescent lure (esca)
        const lureX = fish.size * 0.1
        const lureY = -fish.size * 0.65
        const glowIntensity = fish.lureGlow || 0.5 + Math.sin(time * 0.05) * 0.3
        
        // Illicium (the fishing rod stalk)
        ctx.globalAlpha = fish.opacity * 0.8
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(fish.size * 0.2, -fish.size * 0.4)
        ctx.quadraticCurveTo(fish.size * 0.3, -fish.size * 0.6, lureX, lureY)
        ctx.stroke()

        // Glowing lure
        const glowRadius = fish.size * 0.12
        const gradient = ctx.createRadialGradient(lureX, lureY, 0, lureX, lureY, glowRadius * 3)
        gradient.addColorStop(0, `rgba(200, 255, 255, ${glowIntensity})`)
        gradient.addColorStop(0.3, `rgba(100, 200, 255, ${glowIntensity * 0.6})`)
        gradient.addColorStop(0.6, `rgba(50, 150, 255, ${glowIntensity * 0.3})`)
        gradient.addColorStop(1, "rgba(0, 100, 200, 0)")
        
        ctx.globalAlpha = 1
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(lureX, lureY, glowRadius * 3, 0, Math.PI * 2)
        ctx.fill()

        // Bright center of lure
        ctx.globalAlpha = glowIntensity
        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.arc(lureX, lureY, glowRadius * 0.5, 0, Math.PI * 2)
        ctx.fill()

        // Spiny fins
        ctx.globalAlpha = fish.opacity * 0.7
        ctx.fillStyle = "#ffffff"
        for (let i = 0; i < 5; i++) {
          const spineX = -fish.size * 0.2 - i * fish.size * 0.12
          const spineHeight = fish.size * 0.2 * (1 - i * 0.1)
          ctx.beginPath()
          ctx.moveTo(spineX - fish.size * 0.03, -fish.size * 0.35)
          ctx.lineTo(spineX, -fish.size * 0.35 - spineHeight)
          ctx.lineTo(spineX + fish.size * 0.03, -fish.size * 0.35)
          ctx.closePath()
          ctx.fill()
        }

        // Ragged tail
        const tailWave = Math.sin(fish.phase + time * 0.006) * 0.2
        ctx.save()
        ctx.translate(-fish.size, 0)
        ctx.rotate(tailWave)
        ctx.globalAlpha = fish.opacity * 0.8
        ctx.beginPath()
        ctx.moveTo(0, -fish.size * 0.1)
        ctx.lineTo(-fish.size * 0.4, -fish.size * 0.35)
        ctx.lineTo(-fish.size * 0.3, -fish.size * 0.15)
        ctx.lineTo(-fish.size * 0.5, 0)
        ctx.lineTo(-fish.size * 0.3, fish.size * 0.15)
        ctx.lineTo(-fish.size * 0.4, fish.size * 0.3)
        ctx.lineTo(0, fish.size * 0.1)
        ctx.closePath()
        ctx.fill()
        ctx.restore()

        ctx.restore()
      } else {
        // Small regular fish - more wavy and lifelike
        ctx.save()
        ctx.translate(fish.x, fish.y)
        ctx.scale(fish.vx > 0 ? 1 : -1, 1)

        // More pronounced body wave
        const bodyWave = Math.sin(fish.phase * 2 + time * 0.015) * 0.2
        const verticalBob = Math.sin(fish.phase + time * 0.008) * fish.size * 0.08
        ctx.translate(0, verticalBob)
        ctx.rotate(bodyWave)

        ctx.globalAlpha = fish.opacity
        ctx.fillStyle = "#ffffff"

        // Slightly curved body using bezier
        ctx.beginPath()
        const bodyStretch = 1 + Math.sin(fish.phase + time * 0.01) * 0.05
        ctx.ellipse(0, 0, fish.size * bodyStretch, fish.size * 0.38, 0, 0, Math.PI * 2)
        ctx.fill()

        // Animated tail with more wave
        const tailWave = Math.sin(fish.phase * 2.5 + time * 0.02) * 0.5
        ctx.save()
        ctx.translate(-fish.size * bodyStretch, 0)
        ctx.rotate(tailWave)
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.quadraticCurveTo(-fish.size * 0.3, -fish.size * 0.2, -fish.size * 0.55, -fish.size * 0.4)
        ctx.lineTo(-fish.size * 0.45, 0)
        ctx.lineTo(-fish.size * 0.55, fish.size * 0.4)
        ctx.quadraticCurveTo(-fish.size * 0.3, fish.size * 0.2, 0, 0)
        ctx.closePath()
        ctx.fill()
        ctx.restore()

        // Small dorsal fin
        ctx.globalAlpha = fish.opacity * 0.8
        ctx.beginPath()
        ctx.moveTo(fish.size * 0.1, -fish.size * 0.35)
        ctx.quadraticCurveTo(0, -fish.size * 0.5, -fish.size * 0.15, -fish.size * 0.35)
        ctx.closePath()
        ctx.fill()

        // Eye
        ctx.globalAlpha = fish.opacity * 1.5
        ctx.beginPath()
        ctx.arc(fish.size * 0.5, -fish.size * 0.08, fish.size * 0.1, 0, Math.PI * 2)
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

        // Special anglerfish behavior - darting
        if (fish.fishType === "angler") {
          fish.dartTimer = (fish.dartTimer || 0) - 1
          
          // Update lure glow
          fish.lureGlow = 0.5 + Math.sin(time * 0.05) * 0.3 + (fish.isDarting ? 0.5 : 0)
          
          if (fish.isDarting) {
            // Darting across screen at very high speed
            fish.x += fish.vx * 12
            fish.y += fish.vy * 3
            fish.phase += 0.08
            
            // Check if reached edge or dart time expired
            if (fish.x > w + fish.size * 2 || fish.x < -fish.size * 2 || fish.dartTimer! < -40) {
              fish.isDarting = false
              fish.dartTimer = 200 + Math.random() * 150 // Wait before next dart
              
              // Reposition off screen on opposite side
              fish.dartDirection = fish.dartDirection === 1 ? -1 : 1
              fish.x = fish.dartDirection === 1 ? -fish.size * 1.5 : w + fish.size * 1.5
              fish.y = h * 0.15 + Math.random() * (h * 0.7)
              fish.vx = fish.dartDirection * 0.8
              fish.vy = (Math.random() - 0.5) * 0.2
            }
          } else {
            // Slow lurking movement
            fish.x += fish.vx
            fish.y += fish.vy
            fish.phase += 0.02
            
            // Random subtle movements
            if (Math.random() > 0.97) {
              fish.vy += (Math.random() - 0.5) * 0.1
              fish.vy = Math.max(-0.3, Math.min(0.3, fish.vy))
            }
            
            // Keep in bounds while lurking
            if (fish.y < h * 0.1) fish.vy = Math.abs(fish.vy)
            if (fish.y > h * 0.9) fish.vy = -Math.abs(fish.vy)
            
            // Start darting when timer expires
            if (fish.dartTimer! <= 0) {
              fish.isDarting = true
              fish.dartTimer = 0
              // Set dart direction and speed - much faster
              fish.vx = fish.dartDirection! * (5 + Math.random() * 3)
              fish.vy = (Math.random() - 0.5) * 1.5
              
              // Create ripple when darting starts
              createRipple(fish.x, fish.y, 120)
            }
          }
          
          // Transform timer (splash) for anglerfish
          if (fish.transformTimer > 0) {
            fish.transformTimer--
            if (fish.transformTimer === 0) {
              createSplash(fish.x, fish.y, true)
              fish.transformTimer = 2000 + Math.random() * 500
            }
          }
        } else if (fish.fishType === "shark") {
          // Sharks - swim fast, wrap around screen
          fish.x += fish.vx
          fish.y += fish.vy
          fish.phase += 0.06
          
          // Wrap around screen edges
          if (fish.x > w + fish.size * 2) {
            fish.x = -fish.size * 2
            fish.y = 100 + Math.random() * (h - 200)
          }
          if (fish.x < -fish.size * 2) {
            fish.x = w + fish.size * 2
            fish.y = 100 + Math.random() * (h - 200)
          }
          
          // Gentle vertical movement
          if (Math.random() > 0.98) {
            fish.vy += (Math.random() - 0.5) * 0.3
            fish.vy = Math.max(-1, Math.min(1, fish.vy))
          }
          if (fish.y < 80 || fish.y > h - 80) fish.vy *= -0.8
          
          // Occasional speed bursts
          if (Math.random() > 0.998) {
            fish.vx = (fish.vx > 0 ? 1 : -1) * (2 + Math.random() * 1.5)
            createRipple(fish.x, fish.y, 60)
          }
          
          // Transform timer (splash)
          if (fish.transformTimer > 0) {
            fish.transformTimer--
            if (fish.transformTimer === 0) {
              createSplash(fish.x, fish.y, true)
              fish.transformTimer = 3400 + Math.random() * 400
            }
          }
        } else if (fish.fishType === "small") {
          // Check if fish is dissolving into matrix code
          if (fish.dissolving) {
            fish.dissolveProgress = (fish.dissolveProgress || 0) + 0.015
            
            // Update dissolve characters falling down like matrix rain
            if (fish.dissolveChars) {
              fish.dissolveChars.forEach(dc => {
                dc.y += dc.vy
                dc.vy += 0.08 // gravity
                dc.opacity -= 0.012
              })
              fish.dissolveChars = fish.dissolveChars.filter(dc => dc.opacity > 0)
            }
            
            // Draw dissolving fish - parts turn into falling code
            if (fish.dissolveProgress < 1) {
              ctx.save()
              ctx.translate(fish.x, fish.y)
              ctx.scale(fish.vx > 0 ? 1 : -1, 1)
              
              // Fish body fading out from top to bottom
              const fadeY = fish.size * (fish.dissolveProgress * 2 - 1)
              ctx.globalAlpha = fish.opacity * (1 - fish.dissolveProgress * 0.8)
              ctx.fillStyle = "#ffffff"
              
              ctx.beginPath()
              ctx.ellipse(0, 0, fish.size * (1 - fish.dissolveProgress * 0.3), fish.size * 0.4 * (1 - fish.dissolveProgress * 0.5), 0, 0, Math.PI * 2)
              ctx.fill()
              
              ctx.restore()
              
              // Spawn new matrix characters from the fish
              if (Math.random() > 0.7 && fish.dissolveChars) {
                const matrixChars = "01{}[]<>/=;:$¥€£"
                fish.dissolveChars.push({
                  char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
                  x: fish.x + (Math.random() - 0.5) * fish.size * 1.5,
                  y: fish.y + (Math.random() - 0.5) * fish.size * 0.5,
                  vy: 0.5 + Math.random() * 1,
                  opacity: 0.6 + Math.random() * 0.3
                })
              }
            }
            
            // Draw falling matrix characters
            if (fish.dissolveChars) {
              ctx.font = `${fish.size * 0.5}px "IBM Plex Mono", monospace`
              ctx.textAlign = "center"
              fish.dissolveChars.forEach(dc => {
                ctx.globalAlpha = dc.opacity
                ctx.fillStyle = `rgba(100, 255, 150, ${dc.opacity})`
                ctx.fillText(dc.char, dc.x, dc.y)
              })
            }
            
            // Fish fully dissolved - respawn it
            if (fish.dissolveProgress >= 1 && (!fish.dissolveChars || fish.dissolveChars.length === 0)) {
              fish.dissolving = false
              fish.dissolveProgress = 0
              fish.dissolveChars = []
              // Respawn at edge of screen
              const spawnSide = Math.random() > 0.5
              fish.x = spawnSide ? -fish.size * 2 : w + fish.size * 2
              fish.y = 100 + Math.random() * (h - 200)
              fish.vx = spawnSide ? Math.abs(fish.vx) : -Math.abs(fish.vx)
              fish.transformTimer = 800 + Math.random() * 600
              fish.opacity = 0.28 + Math.random() * 0.1
            }
            
            return // Skip normal fish drawing/movement while dissolving
          }
          
          // Schooling fish behavior - slower and more wavy
          const schoolmates = fishRef.current.filter(f => f.fishType === "small" && f.schoolId === fish.schoolId && f !== fish && !f.dissolving)
          
          // Calculate school center
          let avgX = fish.x
          let avgY = fish.y
          let avgVx = fish.vx
          let avgVy = fish.vy
          
          schoolmates.forEach(mate => {
            avgX += mate.x
            avgY += mate.y
            avgVx += mate.vx
            avgVy += mate.vy
          })
          
          const count = schoolmates.length + 1
          avgX /= count
          avgY /= count
          avgVx /= count
          avgVy /= count
          
          // Add wavy sinusoidal motion
          const waveFreq = 0.02
          const waveAmp = 0.3
          fish.vy += Math.sin(time * waveFreq + fish.phase) * waveAmp * 0.05
          
          // Cohesion - move toward school center (gentler)
          fish.vx += (avgX - fish.x) * 0.001
          fish.vy += (avgY - fish.y) * 0.001
          
          // Alignment - match school velocity (gentler)
          fish.vx += (avgVx - fish.vx) * 0.01
          fish.vy += (avgVy - fish.vy) * 0.01
          
          // Separation - avoid getting too close
          schoolmates.forEach(mate => {
            const dx = fish.x - mate.x
            const dy = fish.y - mate.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 35 && dist > 0) {
              fish.vx += (dx / dist) * 0.05
              fish.vy += (dy / dist) * 0.05
            }
          })
          
          // Speed limit - slower
          const speed = Math.sqrt(fish.vx * fish.vx + fish.vy * fish.vy)
          const maxSpeed = 1.8
          const minSpeed = 0.6
          if (speed > maxSpeed) {
            fish.vx = (fish.vx / speed) * maxSpeed
            fish.vy = (fish.vy / speed) * maxSpeed
          }
          if (speed < minSpeed && speed > 0) {
            fish.vx = (fish.vx / speed) * minSpeed
            fish.vy = (fish.vy / speed) * minSpeed
          }
          
          fish.x += fish.vx
          fish.y += fish.vy
          fish.phase += 0.04 // Slower phase for smoother movement
          
          // Wrap around screen
          if (fish.x > w + fish.size * 2) fish.x = -fish.size * 2
          if (fish.x < -fish.size * 2) fish.x = w + fish.size * 2
          
          // Wavy vertical bounds
          const waveOffset = Math.sin(time * 0.01 + fish.schoolId! * 2) * 50
          if (fish.y < 80 + waveOffset) fish.vy = Math.abs(fish.vy) * 0.5
          if (fish.y > h - 80 + waveOffset) fish.vy = -Math.abs(fish.vy) * 0.5
          
          // Random gentle school direction changes
          if (Math.random() > 0.999 && fish.schoolId !== undefined) {
            const newDirection = Math.random() > 0.5 ? 1 : -1
            fishRef.current.filter(f => f.schoolId === fish.schoolId && !f.dissolving).forEach(f => {
              f.vx = newDirection * (0.8 + Math.random() * 0.5)
            })
          }
          
          // Transform timer - triggers dissolve instead of splash
          if (fish.transformTimer > 0) {
            fish.transformTimer--
            if (fish.transformTimer === 0) {
              // Start dissolving into matrix code
              fish.dissolving = true
              fish.dissolveProgress = 0
              fish.dissolveChars = []
              
              // Create initial burst of matrix characters
              const matrixChars = "01{}[]<>/=;:$¥€£"
              for (let i = 0; i < 12; i++) {
                fish.dissolveChars.push({
                  char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
                  x: fish.x + (Math.random() - 0.5) * fish.size,
                  y: fish.y + (Math.random() - 0.5) * fish.size * 0.5,
                  vy: 0.3 + Math.random() * 0.8,
                  opacity: 0.7 + Math.random() * 0.3
                })
              }
            }
          }
        } else {
          // Code fish - swim steadily, wrap around
          fish.x += fish.vx
          fish.y += fish.vy
          fish.phase += 0.04
          
          // Wrap around screen
          if (fish.x > w + fish.size * 2) {
            fish.x = -fish.size * 2
            fish.y = 100 + Math.random() * (h - 200)
          }
          if (fish.x < -fish.size * 2) {
            fish.x = w + fish.size * 2
            fish.y = 100 + Math.random() * (h - 200)
          }
          
          // Gentle vertical movement
          if (Math.random() > 0.98) {
            fish.vy += (Math.random() - 0.5) * 0.2
            fish.vy = Math.max(-0.8, Math.min(0.8, fish.vy))
          }
          if (fish.y < 80 || fish.y > h - 80) fish.vy *= -0.8
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
