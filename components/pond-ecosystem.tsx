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

interface Frog {
  id: number
  x: number
  y: number
  state: "sitting" | "hopping" | "swimming" | "dissipating" | "appearing" | "relaxing"
  timer: number
  targetX: number
  targetY: number
  hopProgress: number
  hopStartX: number
  hopStartY: number
  legAngle: number
  breathe: number
  blinkTimer: number
  facing: number
  swimPhase: number
  dissipateProgress: number
  scale: number
  baseScale: number
  swimSpeed: number
  isBullfrog: boolean
  croakTimer: number
}

interface WaterBug {
  x: number
  y: number
  vx: number
  vy: number
  angle: number
  legPhase: number
  size: number
  pauseTimer: number
}

interface Reed {
  x: number
  baseY: number
  height: number
  segments: number
  phase: number
  thickness: number
  hasCattail: boolean
}

interface Lilypad {
  x: number
  y: number
  size: number
  rotation: number
  hasFlower: boolean
  bobPhase: number
}

interface Ripple {
  x: number
  y: number
  radius: number
  maxRadius: number
  opacity: number
}

interface NumberBubble {
  x: number
  y: number
  vy: number
  value: string
  size: number
  opacity: number
  wobble: number
}

interface Egret {
  x: number
  y: number
  state: "offscreen" | "flying-in" | "hunting" | "striking" | "eating" | "flying-out"
  timer: number
  targetFishIndex: number | null
  wingPhase: number
  neckExtension: number
  facing: number
  strikeX: number
  strikeY: number
}

interface MatrixDrop {
  x: number
  y: number
  speed: number
  chars: string[]
  length: number
  opacity: number
}

interface Tadpole {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  tailPhase: number
  transforming: boolean
  transformProgress: number
  codeTrail: { x: number; y: number; char: string; opacity: number }[]
}

export function PondEcosystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const fishRef = useRef<Fish[]>([])
  const splashesRef = useRef<NumberSplash[]>([])
  const frogsRef = useRef<Frog[]>([])
  const waterBugsRef = useRef<WaterBug[]>([])
  const reedsRef = useRef<Reed[]>([])
  const lilypadsRef = useRef<Lilypad[]>([])
  const ripplesRef = useRef<Ripple[]>([])
  const bubblesRef = useRef<NumberBubble[]>([])
  const egretRef = useRef<Egret | null>(null)
  const matrixDropsRef = useRef<MatrixDrop[]>([])
  const tadpolesRef = useRef<Tadpole[]>([])
  const timeRef = useRef(0)
  const windRef = useRef({ strength: 0, target: 0, time: 0 })
  const frogIdCounter = useRef(0)
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

  const createBubble = useCallback((x: number, y: number) => {
    bubblesRef.current.push({
      x,
      y,
      vy: -0.3 - Math.random() * 0.4,
      value: numberValues[Math.floor(Math.random() * numberValues.length)],
      size: 8 + Math.random() * 10,
      opacity: 0.12 + Math.random() * 0.08,
      wobble: Math.random() * Math.PI * 2
    })
  }, [numberValues])

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
      
      // Store display dimensions for use in animation
      dimensionsRef.current = { width: displayWidth, height: displayHeight }
      
      // Set canvas drawing dimensions (scaled for DPI)
      canvas.width = displayWidth * dpr
      canvas.height = displayHeight * dpr
      
      // Set display dimensions via CSS
      canvas.style.width = `${displayWidth}px`
      canvas.style.height = `${displayHeight}px`
      
      // Scale context to match DPI
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      
      updateButtonPos()
      initializeElements()
    }

    const initializeElements = () => {
      const w = dimensionsRef.current.width
      const h = dimensionsRef.current.height
      
      fishRef.current = []
      frogsRef.current = []
      waterBugsRef.current = []
      reedsRef.current = []
      lilypadsRef.current = []
      matrixDropsRef.current = []
      tadpolesRef.current = []

      // Initialize fish: 2 sharks, 6 small fish, 2 code fish
      // Sharks - big, slow, explode every ~60 seconds (3600 frames)
      for (let i = 0; i < 2; i++) {
        fishRef.current.push({
          x: 150 + Math.random() * (w - 300),
          y: 100 + Math.random() * (h - 200),
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.08,
          size: 28 + Math.random() * 8, // Big shark
          phase: Math.random() * Math.PI * 2,
          transformTimer: 3400 + Math.random() * 400, // ~57-63 seconds
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
          transformTimer: 750 + Math.random() * 180, // ~12.5-15.5 seconds
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
          transformTimer: 0, // Never explode
          opacity: 0.14,
          isCodeFish: true,
          codeChars: Array.from({ length: 15 }, () => codeChars[Math.floor(Math.random() * codeChars.length)]),
          alive: true,
          fishType: "code"
        })
      }

      // Initialize frogs with varied behaviors - spread across screen, avoid each other
      const frogZones: { x: number; y: number; isBullfrog: boolean }[] = []
      const frogCount = 9 // More frogs
      for (let i = 0; i < frogCount; i++) {
        let attempts = 0
        let x: number, y: number
        const side = i % 2
        const isBullfrog = i < 3 // First 3 are bullfrogs
        
        do {
          x = side === 0 ? 50 + Math.random() * 80 : w - 130 + Math.random() * 80
          y = (0.08 + (i / frogCount) * 0.84) * h + (Math.random() - 0.5) * 50
          attempts++
        } while (
          attempts < 20 &&
          frogZones.some(zone => Math.hypot(zone.x - x, zone.y - y) < 80)
        )
        
        frogZones.push({ x, y, isBullfrog })
      }

      frogZones.forEach((zone) => {
        const states: Frog["state"][] = ["sitting", "relaxing", "swimming"]
        const initialState = states[Math.floor(Math.random() * states.length)]
        // Random sizes - bullfrogs range 0.9-1.0, regular frogs range 0.5-1.0
        const baseScale = zone.isBullfrog 
          ? 0.9 + Math.random() * 0.1 
          : 0.5 + Math.random() * 0.5
        // Swim speeds vary from slow (0.4) to fast (1.4)
        const swimSpeed = 0.4 + Math.random() * 1.0
        frogsRef.current.push({
          id: frogIdCounter.current++,
          x: zone.x,
          y: zone.y,
          state: initialState,
          timer: 150 + Math.random() * 300,
          targetX: zone.x,
          targetY: zone.y,
          hopProgress: 0,
          hopStartX: zone.x,
          hopStartY: zone.y,
          legAngle: 0,
          breathe: Math.random() * Math.PI * 2,
          blinkTimer: Math.random() * 120,
          facing: Math.random() > 0.5 ? 1 : -1,
          swimPhase: Math.random() * Math.PI * 2,
          dissipateProgress: 0,
          scale: 1,
          baseScale,
          swimSpeed,
          isBullfrog: zone.isBullfrog,
          croakTimer: zone.isBullfrog ? Math.random() * 400 : 0
        })
      })

      // Initialize water bugs - more of them, spread across screen
      for (let i = 0; i < 18; i++) {
        const section = Math.floor(i / 3)
        waterBugsRef.current.push({
          x: 80 + (section / 6) * (w - 160) + (Math.random() - 0.5) * 100,
          y: (0.1 + Math.random() * 0.8) * h,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 0.8,
          angle: Math.random() * Math.PI * 2,
          legPhase: Math.random() * Math.PI * 2,
          size: 2 + Math.random() * 2.5,
          pauseTimer: 0
        })
      }

      // Initialize reeds - MORE and THICKER
      for (let side = 0; side < 2; side++) {
        for (let i = 0; i < 40; i++) {
          const x = side === 0
            ? 2 + Math.random() * 70
            : w - 72 + Math.random() * 70
          const ySection = Math.floor(i / 4)
          reedsRef.current.push({
            x,
            baseY: h * (0.04 + ySection * 0.095) + Math.random() * 40,
            height: 70 + Math.random() * 100,
            segments: 5 + Math.floor(Math.random() * 4),
            phase: Math.random() * Math.PI * 2,
            thickness: 2 + Math.random() * 1.5, // Thicker
            hasCattail: Math.random() > 0.55
          })
        }
      }

      // Initialize lilypads with spacing to avoid overlap
      const lilypadPositions: { x: number; y: number }[] = []
      for (let i = 0; i < 12; i++) {
        let attempts = 0
        let x: number, y: number
        const side = i % 2
        
        do {
          x = side === 0 ? 45 + Math.random() * 110 : w - 155 + Math.random() * 110
          y = (0.08 + (i / 12) * 0.82) * h + (Math.random() - 0.5) * 60
          attempts++
        } while (
          attempts < 20 &&
          lilypadPositions.some(pos => Math.hypot(pos.x - x, pos.y - y) < 55)
        )
        
        lilypadPositions.push({ x, y })
        lilypadsRef.current.push({
          x,
          y,
          size: 18 + Math.random() * 22,
          rotation: Math.random() * Math.PI * 2,
          hasFlower: Math.random() > 0.75,
          bobPhase: Math.random() * Math.PI * 2
        })
      }

      // Initialize matrix code drops - reduced
      for (let i = 0; i < 20; i++) {
        matrixDropsRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          speed: 0.25 + Math.random() * 0.4,
          chars: Array.from({ length: 6 + Math.floor(Math.random() * 8) }, () =>
            codeChars[Math.floor(Math.random() * codeChars.length)]
          ),
          length: 6 + Math.floor(Math.random() * 8),
          opacity: 0.015 + Math.random() * 0.02
        })
      }

      // Initialize tadpoles in small schools across the screen
      const schoolCount = 5
      for (let school = 0; school < schoolCount; school++) {
        // Each school in a different area
        const schoolX = 120 + (school / schoolCount) * (w - 240)
        const schoolY = 150 + (school / schoolCount) * (h - 300) + (Math.random() - 0.5) * 100
        const schoolSize = 6 + Math.floor(Math.random() * 4) // 6-9 tadpoles per school
        
        for (let i = 0; i < schoolSize; i++) {
          tadpolesRef.current.push({
            x: schoolX + (Math.random() - 0.5) * 60,
            y: schoolY + (Math.random() - 0.5) * 40,
            vx: (Math.random() - 0.5) * 0.8 + 0.3, // Slight drift direction
            vy: (Math.random() - 0.5) * 0.4,
            size: 2.5 + Math.random() * 2.5,
            tailPhase: Math.random() * Math.PI * 2,
            transforming: false,
            transformProgress: 0,
            codeTrail: []
          })
        }
      }

      // Initialize egret - starts offscreen, will attack every ~35 seconds (2100 frames)
      egretRef.current = {
        x: -300,
        y: h * 0.15,
        state: "offscreen",
        timer: 2100, // ~35 seconds at 60fps
        targetFishIndex: null,
        wingPhase: 0,
        neckExtension: 0,
        facing: 1,
        strikeX: 0,
        strikeY: 0
      }
    }

    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("scroll", updateButtonPos)

    // Create number splash - 50% chance all particles go to button, 50% chance they dissipate
    const createSplash = (x: number, y: number, isShark: boolean = false) => {
      const particles: SplashParticle[] = []
      // Sharks create bigger splashes
      const particleCount = isShark 
        ? 35 + Math.floor(Math.random() * 15)
        : 18 + Math.floor(Math.random() * 10)
      
      // 50% chance this entire splash goes to button
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

    // Draw matrix background
    const drawMatrixBackground = () => {
      const { width: w, height: h } = dimensionsRef.current
      ctx.font = '9px "IBM Plex Mono", monospace'
      ctx.textAlign = "center"

      matrixDropsRef.current.forEach(drop => {
        drop.y += drop.speed
        if (drop.y > h + drop.length * 14) {
          drop.y = -drop.length * 14
          drop.x = Math.random() * w
        }

        drop.chars.forEach((char, i) => {
          const y = drop.y - i * 14
          if (y > 0 && y < h) {
            const fadeProgress = i / drop.chars.length
            ctx.globalAlpha = drop.opacity * (1 - fadeProgress * 0.7)
            ctx.fillStyle = "#ffffff"
            ctx.fillText(char, drop.x, y)
          }
        })

        if (Math.random() > 0.98) {
          const idx = Math.floor(Math.random() * drop.chars.length)
          drop.chars[idx] = codeChars[Math.floor(Math.random() * codeChars.length)]
        }
      })
    }

    // Draw moonlight
    const drawMoonlight = () => {
      const { width: w, height: h } = dimensionsRef.current
      const gradient = ctx.createRadialGradient(
        w * 0.85, 30, 0,
        w * 0.85, 30, w * 0.35
      )
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.025)")
      gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.008)")
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, w, h)
    }

    // Draw wavy reed with wind
    const drawReed = (reed: Reed, time: number, wind: number) => {
      ctx.save()
      ctx.strokeStyle = "#ffffff"
      ctx.fillStyle = "#ffffff"
      ctx.lineCap = "round"

      const segmentHeight = reed.height / reed.segments

      ctx.beginPath()
      ctx.moveTo(reed.x, reed.baseY)

      let currentX = reed.x
      let currentY = reed.baseY

      for (let i = 1; i <= reed.segments; i++) {
        const progress = i / reed.segments
        // More wavy movement
        const waveOffset = Math.sin(time * 0.002 + reed.phase + progress * 2) * (12 + wind * 25) * progress
        const windOffset = wind * progress * progress * 30
        
        currentX = reed.x + waveOffset + windOffset
        currentY = reed.baseY - segmentHeight * i

        ctx.lineTo(currentX, currentY)
      }

      // Thicker base, thinner top
      ctx.lineWidth = reed.thickness * 1.2
      ctx.globalAlpha = 0.08
      ctx.stroke()

      // Draw again thinner for definition
      ctx.lineWidth = reed.thickness * 0.6
      ctx.globalAlpha = 0.12
      ctx.stroke()

      // Cattail
      if (reed.hasCattail) {
        ctx.globalAlpha = 0.12
        const cattailY = currentY - 8
        
        ctx.beginPath()
        ctx.ellipse(currentX, cattailY, 4, 14, 0, 0, Math.PI * 2)
        ctx.fill()
        
        // Cattail texture lines
        ctx.globalAlpha = 0.06
        ctx.lineWidth = 0.5
        for (let j = 0; j < 5; j++) {
          ctx.beginPath()
          ctx.moveTo(currentX - 3, cattailY - 10 + j * 5)
          ctx.lineTo(currentX + 3, cattailY - 10 + j * 5)
          ctx.stroke()
        }
      }

      ctx.restore()
    }

    // Draw lilypad
    const drawLilypad = (pad: Lilypad, time: number) => {
      const bob = Math.sin(time * 0.001 + pad.bobPhase) * 2

      ctx.save()
      ctx.translate(pad.x, pad.y + bob)
      ctx.rotate(pad.rotation + Math.sin(time * 0.0005 + pad.bobPhase) * 0.04)

      ctx.globalAlpha = 0.07
      ctx.fillStyle = "#ffffff"
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 0.8

      ctx.beginPath()
      ctx.arc(0, 0, pad.size, 0.15, Math.PI * 2 - 0.15)
      ctx.lineTo(0, 0)
      ctx.closePath()
      ctx.fill()

      ctx.globalAlpha = 0.03
      ctx.beginPath()
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 + 0.3
        ctx.moveTo(0, 0)
        ctx.lineTo(Math.cos(angle) * pad.size * 0.75, Math.sin(angle) * pad.size * 0.75)
      }
      ctx.stroke()

      if (pad.hasFlower) {
        ctx.globalAlpha = 0.12
        const flowerX = pad.size * 0.25
        const flowerY = -pad.size * 0.25

        for (let i = 0; i < 5; i++) {
          const petalAngle = (i / 5) * Math.PI * 2 + time * 0.0002
          ctx.beginPath()
          ctx.ellipse(
            flowerX + Math.cos(petalAngle) * 3,
            flowerY + Math.sin(petalAngle) * 3,
            5, 2.5,
            petalAngle,
            0, Math.PI * 2
          )
          ctx.fill()
        }

        ctx.globalAlpha = 0.18
        ctx.beginPath()
        ctx.arc(flowerX, flowerY, 2.5, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
    }

    // Draw detailed frog
    const drawFrog = (frog: Frog, time: number) => {
      if (frog.state === "dissipating") {
        drawDissipatingFrog(frog, time)
        return
      }

const bullfrogMult = frog.isBullfrog ? 1.5 : 1
  const finalScale = frog.baseScale * frog.scale * bullfrogMult
  ctx.save()
  ctx.translate(frog.x, frog.y)
  ctx.scale(frog.facing * finalScale, finalScale)

      const breatheScale = 1 + Math.sin(frog.breathe) * (frog.state === "relaxing" ? 0.05 : 0.025)
      ctx.scale(breatheScale, 1 / breatheScale)

      ctx.globalAlpha = frog.state === "appearing" ? frog.scale * 0.14 : 0.14
      ctx.fillStyle = "#ffffff"
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 0.7

      const isSwimming = frog.state === "swimming"
      const isHopping = frog.state === "hopping"
      const isRelaxing = frog.state === "relaxing"
      const swimKick = isSwimming ? Math.sin(frog.swimPhase) * 0.6 : 0

      // Bullfrog croak sac
      if (frog.isBullfrog && frog.croakTimer < 25) {
        const croakSize = 10 + Math.sin(frog.croakTimer * 0.25) * 7
        ctx.globalAlpha = 0.08
        ctx.beginPath()
        ctx.ellipse(16, 10, croakSize, croakSize * 0.55, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 0.14
      }

      // Back legs
      ctx.save()
      ctx.translate(-10, 3)

      if (isRelaxing) {
        ctx.rotate(-0.08)
        ctx.beginPath()
        ctx.ellipse(0, 10, 4, 12, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.save()
        ctx.translate(-1, 22)
        ctx.rotate(0.15)
        ctx.beginPath()
        ctx.ellipse(0, 8, 3, 10, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.translate(0, 18)
        ctx.beginPath()
        ctx.moveTo(-8, 0)
        ctx.quadraticCurveTo(-11, 6, -6, 11)
        ctx.lineTo(-2, 4)
        ctx.lineTo(0, 13)
        ctx.lineTo(2, 4)
        ctx.lineTo(6, 11)
        ctx.quadraticCurveTo(11, 6, 8, 0)
        ctx.closePath()
        ctx.globalAlpha = 0.08
        ctx.fill()
        ctx.globalAlpha = 0.14
        ctx.restore()
      } else {
        ctx.rotate(isHopping ? -0.7 - frog.legAngle : -0.2 + swimKick * 0.35)
        ctx.beginPath()
        ctx.ellipse(0, 8, 4, 10, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.save()
        ctx.translate(0, 16)
        ctx.rotate(isHopping ? 1 + frog.legAngle * 0.4 : 0.5 - swimKick * 0.25)
        ctx.beginPath()
        ctx.ellipse(0, 6, 3, 8, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.translate(0, 12)
        ctx.rotate(swimKick * 0.2)
        ctx.beginPath()
        ctx.moveTo(-6, 0)
        ctx.quadraticCurveTo(-7, 4, -4, 7)
        ctx.lineTo(-1, 2)
        ctx.lineTo(0, 8)
        ctx.lineTo(1, 2)
        ctx.lineTo(4, 7)
        ctx.quadraticCurveTo(7, 4, 6, 0)
        ctx.closePath()
        ctx.globalAlpha = 0.08
        ctx.fill()
        ctx.globalAlpha = 0.14
        ctx.restore()
      }
      ctx.restore()

      // Body
      ctx.beginPath()
      ctx.ellipse(0, 0, frog.isBullfrog ? 18 : 14, frog.isBullfrog ? 12 : 10, 0, 0, Math.PI * 2)
      ctx.fill()

      // Body spots
      ctx.globalAlpha = 0.04
      ctx.beginPath()
      ctx.ellipse(-4, -1, 3, 2.5, 0.2, 0, Math.PI * 2)
      ctx.ellipse(2, 2, 2.5, 2, -0.2, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 0.14

      // Head
      ctx.beginPath()
      ctx.ellipse(12, -2, frog.isBullfrog ? 13 : 10, frog.isBullfrog ? 10 : 8, 0.06, 0, Math.PI * 2)
      ctx.fill()

      // Snout
      ctx.beginPath()
      ctx.ellipse(22, 0, 4.5, 3.5, 0.1, 0, 0, Math.PI * 2)
      ctx.fill()

      // Nostrils
      ctx.globalAlpha = 0.06
      ctx.beginPath()
      ctx.arc(25, -1.5, 0.8, 0, Math.PI * 2)
      ctx.arc(26, 0.5, 0.8, 0, Math.PI * 2)
      ctx.fill()

      // Tympanum for bullfrog
      if (frog.isBullfrog) {
        ctx.globalAlpha = 0.08
        ctx.beginPath()
        ctx.arc(6, -6, 4, 0, Math.PI * 2)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(6, -6, 2.5, 0, Math.PI * 2)
        ctx.fill()
      }

      // Eye bumps
      ctx.globalAlpha = 0.14
      ctx.beginPath()
      ctx.ellipse(13, -10, 4.5, 4.5, 0, 0, Math.PI * 2)
      ctx.ellipse(19, -9, 4, 4, 0, 0, Math.PI * 2)
      ctx.fill()

      // Eyes
      const isBlinking = frog.blinkTimer < 6
      if (!isBlinking) {
        ctx.globalAlpha = 0.22
        ctx.beginPath()
        ctx.arc(13, -10, 2.5, 0, Math.PI * 2)
        ctx.arc(19, -9, 2, 0, Math.PI * 2)
        ctx.fill()

        ctx.globalAlpha = 0.1
        ctx.beginPath()
        ctx.arc(12, -11, 1, 0, Math.PI * 2)
        ctx.arc(18, -10, 0.8, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.globalAlpha = 0.1
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.arc(13, -10, 2.5, 0.25, Math.PI - 0.25)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(19, -9, 2, 0.25, Math.PI - 0.25)
        ctx.stroke()
      }

      // Front legs
      ctx.globalAlpha = 0.14
      ctx.save()
      ctx.translate(6, 6)
      ctx.rotate(isSwimming ? swimKick * 0.2 : 0.12)

      ctx.beginPath()
      ctx.ellipse(2, 4, 2, 4.5, 0.2, 0, Math.PI * 2)
      ctx.fill()

      ctx.save()
      ctx.translate(4, 8)
      ctx.rotate(0.3)
      ctx.beginPath()
      ctx.ellipse(0, 3, 1.5, 3.5, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 0.6
      ctx.beginPath()
      ctx.moveTo(-2, 5)
      ctx.lineTo(-2.5, 9)
      ctx.moveTo(0, 6)
      ctx.lineTo(0, 10)
      ctx.moveTo(2, 5)
      ctx.lineTo(2.5, 8)
      ctx.stroke()
      ctx.restore()
      ctx.restore()

      ctx.restore()
    }

    // Draw dissipating frog
    const drawDissipatingFrog = (frog: Frog, time: number) => {
      const progress = frog.dissipateProgress
      ctx.globalAlpha = 0.1 * (1 - progress)
      ctx.fillStyle = "#ffffff"

      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2 + time * 0.002
        const dist = progress * 50 + Math.sin(angle * 3 + time * 0.008) * 6
        const size = (frog.isBullfrog ? 3.5 : 2.5) * (1 - progress)

        ctx.beginPath()
        ctx.arc(
          frog.x + Math.cos(angle) * dist,
          frog.y + Math.sin(angle) * dist * 0.4,
          size,
          0,
          Math.PI * 2
        )
        ctx.fill()
      }
    }

    // Draw egret - LARGER and MORE VISIBLE
    const drawEgret = (egret: Egret, time: number) => {
      if (egret.state === "offscreen") return

      ctx.save()
      ctx.translate(egret.x, egret.y)
      ctx.scale(egret.facing * 1.8, 1.8) // Larger scale

      ctx.globalAlpha = 0.25 // More visible
      ctx.fillStyle = "#ffffff"
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 1.5

      const wingFlap = Math.sin(egret.wingPhase)
      const isFlying = egret.state === "flying-in" || egret.state === "flying-out"

      // Body
      ctx.beginPath()
      ctx.ellipse(0, 0, 25, 15, 0.1, 0, Math.PI * 2)
      ctx.fill()

      // Wings
      if (isFlying) {
        ctx.save()
        ctx.translate(-5, -5)
        ctx.rotate(wingFlap * 0.5)
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.quadraticCurveTo(-30, -20 + wingFlap * 25, -60, -10 + wingFlap * 35)
        ctx.quadraticCurveTo(-40, 5, -10, 8)
        ctx.closePath()
        ctx.globalAlpha = 0.2
        ctx.fill()
        ctx.restore()

        ctx.save()
        ctx.translate(-5, 5)
        ctx.rotate(-wingFlap * 0.3)
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.quadraticCurveTo(-25, 15 - wingFlap * 15, -50, 5 - wingFlap * 25)
        ctx.quadraticCurveTo(-30, -3, -5, -5)
        ctx.closePath()
        ctx.globalAlpha = 0.18
        ctx.fill()
        ctx.restore()
      } else {
        // Folded wings
        ctx.globalAlpha = 0.15
        ctx.beginPath()
        ctx.moveTo(-10, -8)
        ctx.quadraticCurveTo(-25, -5, -30, 8)
        ctx.quadraticCurveTo(-15, 12, 5, 8)
        ctx.closePath()
        ctx.fill()
      }

      // Neck - extends during strike
      const neckLength = 30 + egret.neckExtension * 35
      const neckCurve = egret.state === "striking" ? 0.1 : 0.4

      ctx.globalAlpha = 0.25
      ctx.lineWidth = 6
      ctx.lineCap = "round"
      ctx.beginPath()
      ctx.moveTo(20, -5)
      ctx.quadraticCurveTo(
        25 + neckLength * 0.3, -15 * neckCurve,
        30 + neckLength * 0.7, -20 + egret.neckExtension * 15
      )
      ctx.stroke()

      // Head
      const headX = 30 + neckLength * 0.7
      const headY = -20 + egret.neckExtension * 15
      ctx.beginPath()
      ctx.ellipse(headX, headY, 8, 6, 0.2, 0, Math.PI * 2)
      ctx.fill()

      // Beak - long and sharp
      const beakAngle = egret.state === "striking" ? 0.3 : -0.1
      ctx.save()
      ctx.translate(headX + 5, headY)
      ctx.rotate(beakAngle)
      ctx.beginPath()
      ctx.moveTo(0, -2)
      ctx.lineTo(22, 0)
      ctx.lineTo(0, 2)
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      // Eye
      ctx.globalAlpha = 0.35
      ctx.beginPath()
      ctx.arc(headX + 2, headY - 2, 2, 0, Math.PI * 2)
      ctx.fill()

      // Legs
      if (!isFlying) {
        ctx.globalAlpha = 0.2
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(-5, 12)
        ctx.lineTo(-8, 45)
        ctx.lineTo(-12, 50)
        ctx.moveTo(-8, 45)
        ctx.lineTo(-4, 50)
        ctx.moveTo(5, 12)
        ctx.lineTo(3, 42)
        ctx.lineTo(-1, 47)
        ctx.moveTo(3, 42)
        ctx.lineTo(7, 47)
        ctx.stroke()
      } else {
        // Trailing legs when flying
        ctx.globalAlpha = 0.15
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(-5, 10)
        ctx.lineTo(-20, 30)
        ctx.moveTo(5, 10)
        ctx.lineTo(-15, 35)
        ctx.stroke()
      }

      // Tail feathers
      ctx.globalAlpha = 0.12
      ctx.beginPath()
      ctx.moveTo(-22, 0)
      ctx.quadraticCurveTo(-35, -3, -40, 5)
      ctx.quadraticCurveTo(-32, 3, -25, 5)
      ctx.closePath()
      ctx.fill()

      ctx.restore()
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

        // Body shape from code chars
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

    // Draw water bug
    const drawWaterBug = (bug: WaterBug, time: number) => {
      ctx.save()
      ctx.translate(bug.x, bug.y)
      ctx.rotate(bug.angle)

      ctx.globalAlpha = 0.08
      ctx.fillStyle = "#ffffff"
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 0.4

      // Body
      ctx.beginPath()
      ctx.ellipse(0, 0, bug.size * 1.5, bug.size * 0.7, 0, 0, Math.PI * 2)
      ctx.fill()

      // Legs
      const legPhase = bug.legPhase + time * 0.006
      ctx.globalAlpha = 0.06
      ctx.lineWidth = 0.3

      for (let side = -1; side <= 1; side += 2) {
        for (let i = 0; i < 3; i++) {
          const legAngle = (i - 1) * 0.4 + Math.sin(legPhase + i * 0.5) * 0.15
          const legLength = bug.size * (2 + i * 0.5)

          ctx.beginPath()
          ctx.moveTo(0, side * bug.size * 0.3)
          ctx.lineTo(
            Math.cos(legAngle) * legLength * side,
            side * bug.size * 0.3 + Math.sin(legAngle) * legLength * 0.3
          )
          ctx.stroke()

          // Leg dimple on water
          ctx.globalAlpha = 0.03
          ctx.beginPath()
          ctx.arc(
            Math.cos(legAngle) * legLength * side,
            side * bug.size * 0.3 + Math.sin(legAngle) * legLength * 0.3,
            1.5,
            0,
            Math.PI * 2
          )
          ctx.fill()
          ctx.globalAlpha = 0.06
        }
      }

      ctx.restore()
    }

    // Draw tadpole with code transformation
    const drawTadpole = (tadpole: Tadpole, time: number) => {
      ctx.save()
      
      // Draw code trail first (behind tadpole)
      tadpole.codeTrail.forEach(trail => {
        ctx.globalAlpha = trail.opacity * 0.15
        ctx.fillStyle = "#ffffff"
        ctx.font = '8px "IBM Plex Mono", monospace'
        ctx.fillText(trail.char, trail.x, trail.y)
      })
      
      if (tadpole.transforming) {
        // Transforming into code - flicker and dissolve
        const flicker = Math.sin(time * 0.3) > 0 ? 0.12 : 0.06
        ctx.globalAlpha = flicker * (1 - tadpole.transformProgress)
      } else {
        ctx.globalAlpha = 0.09
      }
      
      ctx.translate(tadpole.x, tadpole.y)
      const angle = Math.atan2(tadpole.vy, tadpole.vx)
      ctx.rotate(angle)
      
      ctx.fillStyle = "#ffffff"
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 0.5
      
      // Body (oval)
      ctx.beginPath()
      ctx.ellipse(0, 0, tadpole.size, tadpole.size * 0.65, 0, 0, Math.PI * 2)
      ctx.fill()
      
      // Tail with wave
      const tailWave = Math.sin(tadpole.tailPhase) * 3
      ctx.beginPath()
      ctx.moveTo(-tadpole.size, 0)
      ctx.quadraticCurveTo(
        -tadpole.size * 2, tailWave,
        -tadpole.size * 3.5, tailWave * 1.5
      )
      ctx.lineWidth = tadpole.size * 0.4
      ctx.lineCap = "round"
      ctx.stroke()
      
      // Eyes
      ctx.globalAlpha = 0.15
      ctx.beginPath()
      ctx.arc(tadpole.size * 0.4, -tadpole.size * 0.25, 1, 0, Math.PI * 2)
      ctx.arc(tadpole.size * 0.4, tadpole.size * 0.25, 1, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.restore()
    }

    // Main animation loop
    const animate = () => {
      timeRef.current++
      const time = timeRef.current
      const { width: w, height: h } = dimensionsRef.current

      ctx.clearRect(0, 0, w, h)

      // Update wind
      windRef.current.time++
      if (windRef.current.time > 200) {
        windRef.current.target = (Math.random() - 0.3) * 0.6
        windRef.current.time = 0
      }
      windRef.current.strength += (windRef.current.target - windRef.current.strength) * 0.01

      // Draw layers
      drawMoonlight()
      drawMatrixBackground()

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

      // Draw lilypads
      lilypadsRef.current.forEach(pad => drawLilypad(pad, time))

      // Draw and update fish
      fishRef.current.forEach((fish, index) => {
        if (!fish.alive) return

        fish.x += fish.vx
        fish.y += fish.vy
        fish.phase += 0.05

        // Bounce off edges
        if (fish.x < 80 || fish.x > w - 80) fish.vx *= -1
        if (fish.y < 50 || fish.y > h - 50) fish.vy *= -1

        // Random direction changes
        if (Math.random() > 0.995) {
// Different movement based on fish type
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

// Transform timer (splash) - sharks every ~60s, small fish every ~14s
        if (!fish.isCodeFish && fish.transformTimer > 0) {
          fish.transformTimer--
          if (fish.transformTimer === 0) {
            const isShark = fish.fishType === "shark"
            createSplash(fish.x, fish.y, isShark)
            // Reset timer: sharks ~60s (3600 frames), small fish ~14s (840 frames)
            fish.transformTimer = isShark 
              ? 3400 + Math.random() * 400 
              : 750 + Math.random() * 180
          }
        }

        drawFish(fish, time)
      })

      // Draw and update tadpoles with schooling and code transformation
      const codeCharsForTadpoles = ["0", "1", "{", "}", "$", "=", "<", ">", "/", "*"]
      tadpolesRef.current.forEach((tadpole, idx) => {
        tadpole.tailPhase += 0.15 + Math.abs(tadpole.vx) * 0.1
        
        // School behavior - avoid other tadpoles
        tadpolesRef.current.forEach((other, otherIdx) => {
          if (idx === otherIdx) return
          const dx = tadpole.x - other.x
          const dy = tadpole.y - other.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 25 && dist > 0) {
            // Push apart
            tadpole.vx += (dx / dist) * 0.05
            tadpole.vy += (dy / dist) * 0.03
          }
        })
        
        // Random movement
        if (Math.random() > 0.98) {
          tadpole.vx += (Math.random() - 0.5) * 0.3
          tadpole.vy += (Math.random() - 0.5) * 0.2
        }
        
        // Speed limits
        const speed = Math.sqrt(tadpole.vx * tadpole.vx + tadpole.vy * tadpole.vy)
        if (speed > 1.5) {
          tadpole.vx = (tadpole.vx / speed) * 1.5
          tadpole.vy = (tadpole.vy / speed) * 1.5
        }
        
        // Move
        tadpole.x += tadpole.vx
        tadpole.y += tadpole.vy
        
        // Check if approaching edge - start transforming
        const edgeMargin = 60
        const nearEdge = tadpole.x < edgeMargin || tadpole.x > w - edgeMargin ||
                         tadpole.y < edgeMargin || tadpole.y > h - edgeMargin
        
        if (nearEdge && !tadpole.transforming) {
          tadpole.transforming = true
        }
        
        // Transform into code
        if (tadpole.transforming) {
          tadpole.transformProgress += 0.02
          
          // Leave code trail
          if (Math.random() > 0.6) {
            tadpole.codeTrail.push({
              x: tadpole.x + (Math.random() - 0.5) * 10,
              y: tadpole.y + (Math.random() - 0.5) * 10,
              char: codeCharsForTadpoles[Math.floor(Math.random() * codeCharsForTadpoles.length)],
              opacity: 1
            })
          }
          
          // Fade out trail
          tadpole.codeTrail = tadpole.codeTrail.filter(trail => {
            trail.opacity -= 0.02
            return trail.opacity > 0
          })
          
          // Respawn when fully transformed
          if (tadpole.transformProgress >= 1) {
            tadpole.x = w / 2 + (Math.random() - 0.5) * (w - 300)
            tadpole.y = h / 2 + (Math.random() - 0.5) * (h - 300)
            tadpole.vx = (Math.random() - 0.5) * 1.2
            tadpole.vy = (Math.random() - 0.5) * 0.6
            tadpole.transforming = false
            tadpole.transformProgress = 0
            tadpole.codeTrail = []
          }
        } else {
          // Bounce off edges normally if not transforming yet
          if (tadpole.x < 40) { tadpole.x = 40; tadpole.vx = Math.abs(tadpole.vx) }
          if (tadpole.x > w - 40) { tadpole.x = w - 40; tadpole.vx = -Math.abs(tadpole.vx) }
          if (tadpole.y < 40) { tadpole.y = 40; tadpole.vy = Math.abs(tadpole.vy) }
          if (tadpole.y > h - 40) { tadpole.y = h - 40; tadpole.vy = -Math.abs(tadpole.vy) }
        }
        
        drawTadpole(tadpole, time)
      })

      // Draw bubbles
      if (Math.random() > 0.985) {
        createBubble(
          80 + Math.random() * (w - 160),
          h * (0.3 + Math.random() * 0.6)
        )
      }

      bubblesRef.current = bubblesRef.current.filter(bubble => {
        bubble.y += bubble.vy
        bubble.wobble += 0.03
        bubble.x += Math.sin(bubble.wobble) * 0.3

        if (bubble.y < -20) return false

        ctx.globalAlpha = bubble.opacity
        ctx.fillStyle = "#ffffff"
        ctx.font = `${bubble.size}px "IBM Plex Mono", monospace`
        ctx.textAlign = "center"
        ctx.fillText(bubble.value, bubble.x, bubble.y)

        return true
      })

      // Draw and update splashes with button targeting
      splashesRef.current = splashesRef.current.filter(splash => {
        splash.life++

        splash.particles.forEach(p => {
          if (p.targetButton && splash.life > 20) {
            // Particles going to button
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
            // Normal physics
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

      // Draw reeds with wind
      reedsRef.current.forEach(reed => drawReed(reed, time, windRef.current.strength))

      // Draw water bugs
      waterBugsRef.current.forEach(bug => {
        if (bug.pauseTimer > 0) {
          bug.pauseTimer--
        } else {
          bug.x += bug.vx
          bug.y += bug.vy
          bug.legPhase += 0.1

          if (bug.x < 50 || bug.x > w - 50) {
            bug.vx *= -1
            bug.angle = Math.atan2(bug.vy, bug.vx)
          }
          if (bug.y < h * 0.05 || bug.y > h * 0.95) {
            bug.vy *= -1
            bug.angle = Math.atan2(bug.vy, bug.vx)
          }

          if (Math.random() > 0.99) {
            bug.vx += (Math.random() - 0.5) * 0.5
            bug.vy += (Math.random() - 0.5) * 0.3
            bug.vx = Math.max(-2, Math.min(2, bug.vx))
            bug.vy = Math.max(-1, Math.min(1, bug.vy))
            bug.angle = Math.atan2(bug.vy, bug.vx)
          }

          if (Math.random() > 0.998) {
            bug.pauseTimer = 30 + Math.random() * 60
          }
        }

        drawWaterBug(bug, time)
      })

      // Update and draw frogs with collision avoidance
      frogsRef.current.forEach((frog, frogIdx) => {
        frog.breathe += 0.03
        frog.blinkTimer--
        if (frog.blinkTimer < 0) frog.blinkTimer = 80 + Math.random() * 120

        if (frog.isBullfrog) {
          frog.croakTimer--
          if (frog.croakTimer < 0) frog.croakTimer = 300 + Math.random() * 500
        }

        // Avoid other frogs
        frogsRef.current.forEach((other, otherIdx) => {
          if (frogIdx === otherIdx) return
          const dx = frog.x - other.x
          const dy = frog.y - other.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const minDist = (frog.isBullfrog ? 60 : 40) + (other.isBullfrog ? 60 : 40)
          if (dist < minDist && dist > 0 && frog.state === "sitting") {
            // Gently push apart
            frog.x += (dx / dist) * 0.5
            frog.y += (dy / dist) * 0.3
          }
        })

        switch (frog.state) {
          case "sitting":
          case "relaxing":
            frog.timer--
            if (frog.timer <= 0) {
              const rand = Math.random()
              if (rand < 0.25) {
                frog.state = "hopping"
                frog.targetX = frog.x + (Math.random() - 0.5) * 100
                frog.targetY = frog.y + (Math.random() - 0.5) * 60
                frog.targetX = Math.max(50, Math.min(w - 50, frog.targetX))
                frog.targetY = Math.max(50, Math.min(h - 50, frog.targetY))
                frog.hopStartX = frog.x
                frog.hopStartY = frog.y
                frog.hopProgress = 0
                frog.facing = frog.targetX > frog.x ? 1 : -1
              } else if (rand < 0.4) {
                frog.state = "swimming"
                frog.targetX = frog.x + (Math.random() - 0.5) * 150
                frog.targetY = frog.y + (Math.random() - 0.5) * 80
                frog.targetX = Math.max(40, Math.min(w - 40, frog.targetX))
                frog.targetY = Math.max(40, Math.min(h - 40, frog.targetY))
                frog.facing = frog.targetX > frog.x ? 1 : -1
                createRipple(frog.x, frog.y, 25)
              } else if (rand < 0.55) {
                frog.state = frog.state === "sitting" ? "relaxing" : "sitting"
                frog.timer = 200 + Math.random() * 300
              } else {
                frog.timer = 100 + Math.random() * 200
              }
            }
            break

          case "hopping":
            frog.hopProgress += 0.04
            frog.legAngle = Math.sin(frog.hopProgress * Math.PI) * 0.8

            const hopT = frog.hopProgress
            frog.x = frog.hopStartX + (frog.targetX - frog.hopStartX) * hopT
            frog.y = frog.hopStartY + (frog.targetY - frog.hopStartY) * hopT - Math.sin(hopT * Math.PI) * 40

            if (frog.hopProgress >= 1) {
              frog.x = frog.targetX
              frog.y = frog.targetY
              frog.state = "sitting"
              frog.timer = 100 + Math.random() * 250
              frog.legAngle = 0
              createRipple(frog.x, frog.y, 30)
            }
            break

          case "swimming":
            // Faster swim = faster leg kicks
            frog.swimPhase += 0.08 + frog.swimSpeed * 0.08
            const dx = frog.targetX - frog.x
            const dy = frog.targetY - frog.y
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist > 5) {
              frog.x += (dx / dist) * frog.swimSpeed
              frog.y += (dy / dist) * frog.swimSpeed
              // Faster swimmers create more ripples
              if (Math.random() > (1 - frog.swimSpeed * 0.05)) createRipple(frog.x, frog.y, 15)
            } else {
              frog.state = "sitting"
              frog.timer = 150 + Math.random() * 250
              createRipple(frog.x, frog.y, 25)
            }
            break

          case "dissipating":
            frog.dissipateProgress += 0.015
            if (frog.dissipateProgress >= 1) {
              frog.state = "appearing"
              frog.x = frog.x < w / 2
                ? w - 70 - Math.random() * 40
                : 50 + Math.random() * 40
              frog.y = Math.random() * h * 0.8 + h * 0.1
              frog.scale = 0
            }
            break

          case "appearing":
            frog.scale += 0.02
            if (frog.scale >= 1) {
              frog.scale = 1
              // Assign new random size and speed when reappearing
              frog.baseScale = frog.isBullfrog 
                ? 0.9 + Math.random() * 0.1 
                : 0.5 + Math.random() * 0.5
              frog.swimSpeed = 0.4 + Math.random() * 1.0
              frog.state = "sitting"
              frog.timer = 150 + Math.random() * 200
              frog.dissipateProgress = 0
            }
            break
        }

        drawFrog(frog, time)
      })

      // Update and draw egret
      const egret = egretRef.current
      if (egret) {
        egret.wingPhase += 0.12

        switch (egret.state) {
          case "offscreen":
            egret.timer--
            if (egret.timer <= 0) {
              // Start flying in from corner
              egret.state = "flying-in"
              egret.x = -100
              egret.y = 80 + Math.random() * 150
              egret.facing = 1
              
              // Find a target fish
              const aliveFish = fishRef.current
                .map((f, i) => ({ fish: f, index: i }))
                .filter(f => f.fish.alive && !f.fish.isCodeFish && f.fish.y < h * 0.4)
              
              if (aliveFish.length > 0) {
                const target = aliveFish[Math.floor(Math.random() * aliveFish.length)]
                egret.targetFishIndex = target.index
                egret.strikeX = target.fish.x
                egret.strikeY = target.fish.y
              } else {
                egret.strikeX = 150 + Math.random() * 200
                egret.strikeY = 100 + Math.random() * 100
              }
            }
            break

          case "flying-in":
            egret.x += 4
            egret.y += Math.sin(time * 0.05) * 0.5
            
            if (egret.x > egret.strikeX - 80) {
              egret.state = "hunting"
              egret.timer = 60
              egret.neckExtension = 0
            }
            break

          case "hunting":
            egret.timer--
            // Bob head slightly
            egret.neckExtension = Math.sin(time * 0.1) * 0.1
            
            if (egret.timer <= 0) {
              egret.state = "striking"
              egret.timer = 25
            }
            break

          case "striking":
            egret.timer--
            egret.neckExtension = Math.min(1, egret.neckExtension + 0.15)
            
            if (egret.timer <= 0) {
              // Create splash at strike point
              createSplash(egret.strikeX, egret.strikeY)
              createRipple(egret.strikeX, egret.strikeY, 50)
              
              egret.state = "eating"
              egret.timer = 40
            }
            break

          case "eating":
            egret.timer--
            egret.neckExtension = Math.max(0.3, egret.neckExtension - 0.03)
            
            if (egret.timer <= 0) {
              egret.state = "flying-out"
            }
            break

          case "flying-out":
            egret.x += 5
            egret.y -= 1
            egret.neckExtension = Math.max(0, egret.neckExtension - 0.02)
            
            if (egret.x > w + 150) {
              egret.state = "offscreen"
              egret.timer = 2100 // ~35 seconds until next appearance
              egret.x = -300
              egret.targetFishIndex = null
            }
            break
        }

        drawEgret(egret, time)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("scroll", updateButtonPos)
      cancelAnimationFrame(animationRef.current)
    }
  }, [numberValues, codeChars, createRipple, createBubble])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{ background: "#01020A" }}
    />
  )
}
