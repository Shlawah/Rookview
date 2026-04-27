"use client"

import { useEffect, useRef, useCallback } from "react"

interface Entity {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  type: "fish" | "chess"
  variant: number // 0: shark, 1: stingray, 2: gar, 3: regular fish for fish | 0-5 for chess
  opacity: number
  rotation: number
  flipX: boolean
  tailPhase: number // For tail animation
}

interface MatrixNumber {
  x: number
  y: number
  value: string
  opacity: number
  speed: number
  size: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  value: string
  opacity: number
  life: number
  maxLife: number
  size: number
}

interface MeltingEntity {
  entity: Entity
  startTime: number
  particles: MeltParticle[]
}

interface MeltParticle {
  x: number
  y: number
  vy: number
  value: string
  opacity: number
  delay: number
  size: number
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const entitiesRef = useRef<Entity[]>([])
  const matrixNumbersRef = useRef<MatrixNumber[]>([])
  const meltingEntitiesRef = useRef<MeltingEntity[]>([])
  const animationFrameRef = useRef<number>(0)
  const lastMeltRef = useRef<number>(0)
  const moonVisibleRef = useRef<boolean>(true)
  const lastMoonToggleRef = useRef<number>(0)

  const createMatrixNumber = useCallback((width: number, height: number): MatrixNumber => {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      value: String(Math.floor(Math.random() * 10)),
      opacity: 0.08 + Math.random() * 0.15, // More subtle
      speed: 0.2 + Math.random() * 0.3, // Slower, more peaceful
      size: 12 + Math.random() * 8,
    }
  }, [])

  const createEntity = useCallback((width: number, height: number, fromEdge = true): Entity => {
    const isChess = Math.random() > 0.7 // 70% fish, 30% chess
    const type: "fish" | "chess" = isChess ? "chess" : "fish"
    
    let x: number, y: number, vx: number, vy: number
    
    if (fromEdge) {
      if (isChess) {
        // Chess pieces can come from any edge
        const edge = Math.floor(Math.random() * 4)
        switch (edge) {
          case 0: // Left
            x = -120
            y = Math.random() * height
            vx = 2 + Math.random() * 2
            vy = (Math.random() - 0.5) * 1.5
            break
          case 1: // Right
            x = width + 120
            y = Math.random() * height
            vx = -(2 + Math.random() * 2)
            vy = (Math.random() - 0.5) * 1.5
            break
          case 2: // Top
            x = Math.random() * width
            y = -120
            vx = (Math.random() - 0.5) * 1.5
            vy = 2 + Math.random() * 2
            break
          default: // Bottom
            x = Math.random() * width
            y = height + 120
            vx = (Math.random() - 0.5) * 1.5
            vy = -(2 + Math.random() * 2)
        }
      } else {
        // Fish only swim horizontally - peaceful, slow swimming
        const fromLeft = Math.random() > 0.5
        x = fromLeft ? -200 : width + 200
        y = 100 + Math.random() * (height - 200)
        vx = fromLeft ? (0.3 + Math.random() * 0.5) : -(0.3 + Math.random() * 0.5)
        vy = (Math.random() - 0.5) * 0.1
      }
    } else {
      x = Math.random() * width
      y = Math.random() * height
      vx = isChess ? (Math.random() - 0.5) * 3 : (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random() * 0.5)
      vy = isChess ? (Math.random() - 0.5) * 3 : (Math.random() - 0.5) * 0.15
    }

    return {
      x,
      y,
      vx,
      vy,
      size: isChess ? 70 + Math.random() * 30 : 80 + Math.random() * 40, // Smaller fish, more visible
      type,
      variant: isChess ? Math.floor(Math.random() * 6) : Math.floor(Math.random() * 4),
      opacity: 0.25 + Math.random() * 0.15,
      rotation: Math.random() * Math.PI * 2,
      flipX: vx < 0,
      tailPhase: Math.random() * Math.PI * 2,
    }
  }, [])

  // Create melting effect - fish slowly dissolves into falling code (subtle)
  const createMeltEffect = useCallback((entity: Entity, time: number) => {
    const particles: MeltParticle[] = []
    const particleCount = 12 // Fewer particles for subtle effect
    const spread = entity.size * 0.6
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: entity.x + (Math.random() - 0.5) * spread,
        y: entity.y + (Math.random() - 0.5) * spread * 0.5,
        vy: 0.4 + Math.random() * 0.8, // Slower falling
        value: String(Math.floor(Math.random() * 10)),
        opacity: 0,
        delay: i * 120 + Math.random() * 300, // More staggered, gentler
        size: 10 + Math.random() * 6,
      })
    }
    
    meltingEntitiesRef.current.push({
      entity: { ...entity },
      startTime: time,
      particles,
    })
  }, [])

  // Draw shark
  const drawShark = useCallback((ctx: CanvasRenderingContext2D, entity: Entity, time: number) => {
    ctx.save()
    ctx.translate(entity.x, entity.y)
    ctx.scale(entity.flipX ? -1 : 1, 1)
    ctx.globalAlpha = entity.opacity
    
    const s = entity.size
    const tailWave = Math.sin(time * 0.004 + entity.tailPhase) * 0.15
    
    ctx.fillStyle = "#9ca3af"
    ctx.strokeStyle = "#6b7280"
    ctx.lineWidth = 2
    
    // Body - sleek shark shape
    ctx.beginPath()
    ctx.moveTo(s * 0.5, 0) // Pointed nose
    ctx.quadraticCurveTo(s * 0.4, -s * 0.12, s * 0.2, -s * 0.15)
    ctx.quadraticCurveTo(-s * 0.1, -s * 0.18, -s * 0.3, -s * 0.1)
    ctx.lineTo(-s * 0.4 + tailWave * s, 0)
    ctx.lineTo(-s * 0.3, s * 0.1)
    ctx.quadraticCurveTo(-s * 0.1, s * 0.18, s * 0.2, s * 0.12)
    ctx.quadraticCurveTo(s * 0.4, s * 0.08, s * 0.5, 0)
    ctx.fill()
    ctx.stroke()
    
    // Dorsal fin - iconic shark fin
    ctx.beginPath()
    ctx.moveTo(s * 0.05, -s * 0.15)
    ctx.lineTo(-s * 0.05, -s * 0.35)
    ctx.lineTo(-s * 0.15, -s * 0.15)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    
    // Tail fin
    ctx.beginPath()
    ctx.moveTo(-s * 0.35, 0)
    ctx.lineTo(-s * 0.55 + tailWave * s * 2, -s * 0.2)
    ctx.lineTo(-s * 0.45 + tailWave * s, 0)
    ctx.lineTo(-s * 0.55 + tailWave * s * 2, s * 0.12)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    
    // Pectoral fin
    ctx.beginPath()
    ctx.moveTo(s * 0.1, s * 0.1)
    ctx.lineTo(s * 0.0, s * 0.25)
    ctx.lineTo(-s * 0.1, s * 0.1)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    
    // Gill slits
    ctx.beginPath()
    ctx.moveTo(s * 0.25, -s * 0.05)
    ctx.lineTo(s * 0.22, s * 0.05)
    ctx.moveTo(s * 0.2, -s * 0.06)
    ctx.lineTo(s * 0.17, s * 0.05)
    ctx.moveTo(s * 0.15, -s * 0.07)
    ctx.lineTo(s * 0.12, s * 0.05)
    ctx.strokeStyle = "#4b5563"
    ctx.lineWidth = 1.5
    ctx.stroke()
    
    // Eye
    ctx.beginPath()
    ctx.arc(s * 0.35, -s * 0.03, s * 0.025, 0, Math.PI * 2)
    ctx.fillStyle = "#1f2937"
    ctx.fill()
    
    ctx.restore()
  }, [])

  // Draw stingray
  const drawStingray = useCallback((ctx: CanvasRenderingContext2D, entity: Entity, time: number) => {
    ctx.save()
    ctx.translate(entity.x, entity.y)
    ctx.scale(entity.flipX ? -1 : 1, 1)
    ctx.globalAlpha = entity.opacity
    
    const s = entity.size
    const wingWave = Math.sin(time * 0.003 + entity.tailPhase) * 0.08
    
    ctx.fillStyle = "#a1a1aa"
    ctx.strokeStyle = "#71717a"
    ctx.lineWidth = 2
    
    // Body - diamond/kite shape with undulating wings
    ctx.beginPath()
    ctx.moveTo(s * 0.35, 0) // Nose
    ctx.quadraticCurveTo(s * 0.2, -s * 0.15 + wingWave * s, 0, -s * 0.35 + wingWave * s)
    ctx.quadraticCurveTo(-s * 0.15, -s * 0.2 + wingWave * s * 0.5, -s * 0.25, 0)
    ctx.quadraticCurveTo(-s * 0.15, s * 0.2 - wingWave * s * 0.5, 0, s * 0.35 - wingWave * s)
    ctx.quadraticCurveTo(s * 0.2, s * 0.15 - wingWave * s, s * 0.35, 0)
    ctx.fill()
    ctx.stroke()
    
    // Tail - long whip tail
    ctx.beginPath()
    ctx.moveTo(-s * 0.2, 0)
    ctx.quadraticCurveTo(-s * 0.4, s * 0.02, -s * 0.65, -s * 0.05)
    ctx.strokeStyle = "#71717a"
    ctx.lineWidth = 3
    ctx.stroke()
    
    // Eyes
    ctx.beginPath()
    ctx.arc(s * 0.15, -s * 0.08, s * 0.025, 0, Math.PI * 2)
    ctx.arc(s * 0.15, s * 0.08, s * 0.025, 0, Math.PI * 2)
    ctx.fillStyle = "#27272a"
    ctx.fill()
    
    // Spots pattern
    ctx.beginPath()
    ctx.arc(0, -s * 0.12, s * 0.03, 0, Math.PI * 2)
    ctx.arc(0, s * 0.12, s * 0.03, 0, Math.PI * 2)
    ctx.arc(-s * 0.08, 0, s * 0.025, 0, Math.PI * 2)
    ctx.fillStyle = "#d4d4d8"
    ctx.fill()
    
    ctx.restore()
  }, [])

  // Draw gar (long needle-nose fish)
  const drawGar = useCallback((ctx: CanvasRenderingContext2D, entity: Entity, time: number) => {
    ctx.save()
    ctx.translate(entity.x, entity.y)
    ctx.scale(entity.flipX ? -1 : 1, 1)
    ctx.globalAlpha = entity.opacity
    
    const s = entity.size
    const bodyWave = Math.sin(time * 0.005 + entity.tailPhase)
    
    ctx.fillStyle = "#b8c0cc"
    ctx.strokeStyle = "#6b7280"
    ctx.lineWidth = 2
    
    // Long needle-like body
    ctx.beginPath()
    ctx.moveTo(s * 0.55, 0) // Long pointed snout
    ctx.quadraticCurveTo(s * 0.3, -s * 0.02, s * 0.2, -s * 0.06)
    ctx.quadraticCurveTo(0, -s * 0.1, -s * 0.2, -s * 0.08 + bodyWave * s * 0.02)
    ctx.lineTo(-s * 0.35, -s * 0.05 + bodyWave * s * 0.03)
    ctx.lineTo(-s * 0.35, s * 0.05 + bodyWave * s * 0.03)
    ctx.lineTo(-s * 0.2, s * 0.08 + bodyWave * s * 0.02)
    ctx.quadraticCurveTo(0, s * 0.1, s * 0.2, s * 0.06)
    ctx.quadraticCurveTo(s * 0.3, s * 0.02, s * 0.55, 0)
    ctx.fill()
    ctx.stroke()
    
    // Dorsal fin (set far back)
    ctx.beginPath()
    ctx.moveTo(-s * 0.18, -s * 0.08)
    ctx.lineTo(-s * 0.22, -s * 0.18)
    ctx.lineTo(-s * 0.32, -s * 0.08)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    
    // Tail fin
    ctx.beginPath()
    ctx.moveTo(-s * 0.32, 0)
    ctx.lineTo(-s * 0.48 + bodyWave * s * 0.04, -s * 0.12)
    ctx.lineTo(-s * 0.42 + bodyWave * s * 0.03, 0)
    ctx.lineTo(-s * 0.48 + bodyWave * s * 0.04, s * 0.12)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    
    // Anal fin
    ctx.beginPath()
    ctx.moveTo(-s * 0.18, s * 0.08)
    ctx.lineTo(-s * 0.22, s * 0.16)
    ctx.lineTo(-s * 0.3, s * 0.08)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    
    // Eye
    ctx.beginPath()
    ctx.arc(s * 0.22, -s * 0.01, s * 0.02, 0, Math.PI * 2)
    ctx.fillStyle = "#1f2937"
    ctx.fill()
    
    // Teeth indication on snout
    ctx.beginPath()
    ctx.moveTo(s * 0.45, -s * 0.01)
    ctx.lineTo(s * 0.45, s * 0.01)
    ctx.strokeStyle = "#4b5563"
    ctx.lineWidth = 1
    ctx.stroke()
    
    ctx.restore()
  }, [])

  // Draw regular fish
  const drawRegularFish = useCallback((ctx: CanvasRenderingContext2D, entity: Entity, time: number) => {
    ctx.save()
    ctx.translate(entity.x, entity.y)
    ctx.scale(entity.flipX ? -1 : 1, 1)
    ctx.globalAlpha = entity.opacity
    
    const s = entity.size
    const tailWave = Math.sin(time * 0.006 + entity.tailPhase) * 0.12
    
    ctx.fillStyle = "#d1d5db"
    ctx.strokeStyle = "#6b7280"
    ctx.lineWidth = 2
    
    // Body - classic oval fish shape
    ctx.beginPath()
    ctx.moveTo(s * 0.4, 0)
    ctx.quadraticCurveTo(s * 0.35, -s * 0.2, s * 0.1, -s * 0.25)
    ctx.quadraticCurveTo(-s * 0.15, -s * 0.22, -s * 0.3, 0)
    ctx.quadraticCurveTo(-s * 0.15, s * 0.22, s * 0.1, s * 0.25)
    ctx.quadraticCurveTo(s * 0.35, s * 0.2, s * 0.4, 0)
    ctx.fill()
    ctx.stroke()
    
    // Tail
    ctx.beginPath()
    ctx.moveTo(-s * 0.25, 0)
    ctx.lineTo(-s * 0.45 + tailWave * s, -s * 0.18)
    ctx.lineTo(-s * 0.35 + tailWave * s * 0.5, 0)
    ctx.lineTo(-s * 0.45 + tailWave * s, s * 0.18)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    
    // Dorsal fin
    ctx.beginPath()
    ctx.moveTo(s * 0.05, -s * 0.22)
    ctx.quadraticCurveTo(-s * 0.02, -s * 0.38, -s * 0.12, -s * 0.25)
    ctx.lineTo(s * 0.05, -s * 0.22)
    ctx.fill()
    ctx.stroke()
    
    // Pectoral fin
    ctx.beginPath()
    ctx.moveTo(s * 0.1, s * 0.08)
    ctx.quadraticCurveTo(s * 0.15, s * 0.22, -s * 0.02, s * 0.2)
    ctx.lineTo(s * 0.1, s * 0.08)
    ctx.fill()
    ctx.stroke()
    
    // Eye
    ctx.beginPath()
    ctx.arc(s * 0.22, -s * 0.04, s * 0.045, 0, Math.PI * 2)
    ctx.fillStyle = "#1f2937"
    ctx.fill()
    
    ctx.beginPath()
    ctx.arc(s * 0.24, -s * 0.055, s * 0.015, 0, Math.PI * 2)
    ctx.fillStyle = "#ffffff"
    ctx.fill()
    
    ctx.restore()
  }, [])

  // Draw chess pieces
  const drawChessPiece = useCallback((ctx: CanvasRenderingContext2D, entity: Entity) => {
    ctx.save()
    ctx.translate(entity.x, entity.y)
    ctx.rotate(entity.rotation)
    ctx.globalAlpha = entity.opacity
    
    const s = entity.size
    ctx.fillStyle = "#e5e7eb"
    ctx.strokeStyle = "#6b7280"
    ctx.lineWidth = 2
    
    switch (entity.variant) {
      case 0: // Pawn
        ctx.beginPath()
        ctx.arc(0, -s * 0.3, s * 0.15, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(-s * 0.08, -s * 0.15)
        ctx.lineTo(s * 0.08, -s * 0.15)
        ctx.lineTo(s * 0.06, 0)
        ctx.lineTo(-s * 0.06, 0)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(-s * 0.2, s * 0.35)
        ctx.lineTo(s * 0.2, s * 0.35)
        ctx.lineTo(s * 0.12, 0)
        ctx.lineTo(-s * 0.12, 0)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.ellipse(0, s * 0.38, s * 0.25, s * 0.08, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        break
        
      case 1: // Rook
        ctx.fillRect(-s * 0.15, -s * 0.2, s * 0.3, s * 0.5)
        ctx.strokeRect(-s * 0.15, -s * 0.2, s * 0.3, s * 0.5)
        ctx.fillRect(-s * 0.2, -s * 0.38, s * 0.12, s * 0.18)
        ctx.fillRect(-s * 0.06, -s * 0.38, s * 0.12, s * 0.18)
        ctx.fillRect(s * 0.08, -s * 0.38, s * 0.12, s * 0.18)
        ctx.strokeRect(-s * 0.2, -s * 0.38, s * 0.12, s * 0.18)
        ctx.strokeRect(-s * 0.06, -s * 0.38, s * 0.12, s * 0.18)
        ctx.strokeRect(s * 0.08, -s * 0.38, s * 0.12, s * 0.18)
        ctx.beginPath()
        ctx.ellipse(0, s * 0.35, s * 0.22, s * 0.08, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        break
        
      case 2: // Knight
        ctx.beginPath()
        ctx.moveTo(s * 0.15, -s * 0.35)
        ctx.quadraticCurveTo(s * 0.28, -s * 0.3, s * 0.22, -s * 0.12)
        ctx.lineTo(s * 0.3, -s * 0.08)
        ctx.quadraticCurveTo(s * 0.32, 0, s * 0.2, s * 0.05)
        ctx.lineTo(s * 0.12, s * 0.1)
        ctx.lineTo(s * 0.1, s * 0.28)
        ctx.lineTo(-s * 0.1, s * 0.28)
        ctx.lineTo(-s * 0.12, -s * 0.05)
        ctx.quadraticCurveTo(-s * 0.1, -s * 0.25, 0, -s * 0.35)
        ctx.quadraticCurveTo(s * 0.08, -s * 0.42, s * 0.15, -s * 0.35)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(s * 0.05, -s * 0.35)
        ctx.lineTo(s * 0.1, -s * 0.48)
        ctx.lineTo(s * 0.15, -s * 0.35)
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(s * 0.18, -s * 0.18, s * 0.04, 0, Math.PI * 2)
        ctx.fillStyle = "#374151"
        ctx.fill()
        ctx.fillStyle = "#e5e7eb"
        ctx.beginPath()
        ctx.ellipse(0, s * 0.35, s * 0.18, s * 0.08, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        break
        
      case 3: // Bishop
        ctx.beginPath()
        ctx.arc(0, -s * 0.42, s * 0.07, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(0, -s * 0.35)
        ctx.bezierCurveTo(s * 0.18, -s * 0.3, s * 0.18, -s * 0.05, s * 0.12, s * 0.02)
        ctx.lineTo(-s * 0.12, s * 0.02)
        ctx.bezierCurveTo(-s * 0.18, -s * 0.05, -s * 0.18, -s * 0.3, 0, -s * 0.35)
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(-s * 0.02, -s * 0.32)
        ctx.lineTo(s * 0.08, -s * 0.1)
        ctx.strokeStyle = "#4b5563"
        ctx.lineWidth = 2.5
        ctx.stroke()
        ctx.strokeStyle = "#6b7280"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(-s * 0.18, s * 0.35)
        ctx.lineTo(s * 0.18, s * 0.35)
        ctx.lineTo(s * 0.12, s * 0.02)
        ctx.lineTo(-s * 0.12, s * 0.02)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.ellipse(0, s * 0.38, s * 0.22, s * 0.08, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        break
        
      case 4: // Queen
        for (let i = 0; i < 5; i++) {
          const angle = -Math.PI / 2 + (i - 2) * 0.4
          const px = Math.cos(angle) * s * 0.2
          const py = -s * 0.32 + Math.sin(angle) * s * 0.12
          ctx.beginPath()
          ctx.arc(px, py, s * 0.05, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
        }
        ctx.beginPath()
        ctx.moveTo(-s * 0.2, -s * 0.12)
        ctx.lineTo(-s * 0.18, -s * 0.32)
        ctx.lineTo(-s * 0.09, -s * 0.18)
        ctx.lineTo(0, -s * 0.38)
        ctx.lineTo(s * 0.09, -s * 0.18)
        ctx.lineTo(s * 0.18, -s * 0.32)
        ctx.lineTo(s * 0.2, -s * 0.12)
        ctx.lineTo(s * 0.14, s * 0.02)
        ctx.lineTo(-s * 0.14, s * 0.02)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(-s * 0.2, s * 0.35)
        ctx.lineTo(s * 0.2, s * 0.35)
        ctx.lineTo(s * 0.14, s * 0.02)
        ctx.lineTo(-s * 0.14, s * 0.02)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.ellipse(0, s * 0.38, s * 0.24, s * 0.08, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        break
        
      case 5: // King
        ctx.fillRect(-s * 0.04, -s * 0.52, s * 0.08, s * 0.18)
        ctx.fillRect(-s * 0.1, -s * 0.48, s * 0.2, s * 0.06)
        ctx.strokeRect(-s * 0.04, -s * 0.52, s * 0.08, s * 0.18)
        ctx.strokeRect(-s * 0.1, -s * 0.48, s * 0.2, s * 0.06)
        ctx.beginPath()
        ctx.moveTo(-s * 0.16, -s * 0.15)
        ctx.lineTo(-s * 0.18, -s * 0.35)
        ctx.lineTo(-s * 0.07, -s * 0.25)
        ctx.lineTo(0, -s * 0.38)
        ctx.lineTo(s * 0.07, -s * 0.25)
        ctx.lineTo(s * 0.18, -s * 0.35)
        ctx.lineTo(s * 0.16, -s * 0.15)
        ctx.lineTo(s * 0.12, s * 0.02)
        ctx.lineTo(-s * 0.12, s * 0.02)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(-s * 0.2, s * 0.35)
        ctx.lineTo(s * 0.2, s * 0.35)
        ctx.lineTo(s * 0.12, s * 0.02)
        ctx.lineTo(-s * 0.12, s * 0.02)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.ellipse(0, s * 0.38, s * 0.24, s * 0.08, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        break
    }
    
    ctx.restore()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = document.documentElement.scrollHeight
    }
    
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Initialize fish entities - 8 total for a tranquil pond
    for (let i = 0; i < 8; i++) {
      entitiesRef.current.push(createEntity(canvas.width, canvas.height, false))
    }

    // Initialize sparse matrix numbers - very few for subtle effect
    for (let i = 0; i < 10; i++) {
      matrixNumbersRef.current.push(createMatrixNumber(canvas.width, canvas.height))
    }

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Toggle moon visibility every 50 seconds
      if (time - lastMoonToggleRef.current > 50000) {
        moonVisibleRef.current = !moonVisibleRef.current
        lastMoonToggleRef.current = time
      }
      
      // Draw moon in top right corner with gentle glow
      if (moonVisibleRef.current) {
        const moonX = canvas.width - 80
        const moonY = 80
        const moonRadius = 35
        
        // Moon glow
        const gradient = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.5, moonX, moonY, moonRadius * 2.5)
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.15)")
        gradient.addColorStop(0.5, "rgba(200, 210, 220, 0.08)")
        gradient.addColorStop(1, "rgba(200, 210, 220, 0)")
        ctx.beginPath()
        ctx.arc(moonX, moonY, moonRadius * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
        
        // Moon body
        ctx.beginPath()
        ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2)
        ctx.fillStyle = "#e8eaed"
        ctx.globalAlpha = 0.9
        ctx.fill()
        
        // Moon craters (subtle)
        ctx.globalAlpha = 0.15
        ctx.fillStyle = "#9ca3af"
        ctx.beginPath()
        ctx.arc(moonX - 10, moonY - 8, 6, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(moonX + 8, moonY + 5, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(moonX - 5, moonY + 12, 5, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.globalAlpha = 1
      }
      
      // Draw matrix numbers with glow
      ctx.font = "bold 18px monospace"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      
      for (const num of matrixNumbersRef.current) {
        // Glow effect - white/gray tones
        ctx.shadowColor = "#e2e8f0"
        ctx.shadowBlur = 10
        ctx.globalAlpha = num.opacity
        ctx.fillStyle = "#f1f5f9"
        ctx.font = `bold ${num.size}px monospace`
        ctx.fillText(num.value, num.x, num.y)
        
        // Move down slowly
        num.y += num.speed
        
        // Occasionally change the number
        if (Math.random() < 0.005) {
          num.value = String(Math.floor(Math.random() * 10))
        }
        
        // Reset when off screen
        if (num.y > canvas.height + 30) {
          num.y = -30
          num.x = Math.random() * canvas.width
          num.value = String(Math.floor(Math.random() * 10))
        }
      }
      
      ctx.shadowBlur = 0
      
      // Draw melting entities - fish dissolving into falling code
      for (let i = meltingEntitiesRef.current.length - 1; i >= 0; i--) {
        const melt = meltingEntitiesRef.current[i]
        const elapsed = time - melt.startTime
        const meltDuration = 3000 // 3 seconds to fully melt
        const meltProgress = Math.min(elapsed / meltDuration, 1)
        
        // Draw the fading entity
        if (meltProgress < 0.8) {
          const fadeEntity = { ...melt.entity, opacity: melt.entity.opacity * (1 - meltProgress * 1.2) }
          if (fadeEntity.type === "fish") {
            switch (fadeEntity.variant) {
              case 0: drawShark(ctx, fadeEntity, time); break
              case 1: drawStingray(ctx, fadeEntity, time); break
              case 2: drawGar(ctx, fadeEntity, time); break
              default: drawRegularFish(ctx, fadeEntity, time)
            }
          } else {
            drawChessPiece(ctx, fadeEntity)
          }
        }
        
        // Draw falling code particles
        let allDone = true
        for (const p of melt.particles) {
          const particleElapsed = elapsed - p.delay
          if (particleElapsed < 0) {
            allDone = false
            continue
          }
          
          // Fade in then fall and fade out
          const fadeInDuration = 300
          const fallDuration = 4000
          const particleProgress = particleElapsed / fallDuration
          
          if (particleProgress < 1) {
            allDone = false
            p.y += p.vy
            
            // Fade in, then fade out as it falls
            if (particleElapsed < fadeInDuration) {
              p.opacity = (particleElapsed / fadeInDuration) * 0.6
            } else {
              p.opacity = 0.6 * (1 - (particleProgress - 0.2))
            }
            
            if (p.opacity > 0) {
              ctx.shadowColor = "#e2e8f0"
              ctx.shadowBlur = 8
              ctx.globalAlpha = Math.max(0, p.opacity)
              ctx.fillStyle = "#f1f5f9"
              ctx.font = `bold ${p.size}px monospace`
              ctx.fillText(p.value, p.x, p.y)
              
              // Occasionally change the digit
              if (Math.random() < 0.03) {
                p.value = String(Math.floor(Math.random() * 10))
              }
            }
          }
        }
        
        // Remove when all particles are done
        if (allDone || elapsed > 6000) {
          meltingEntitiesRef.current.splice(i, 1)
        }
      }
      
      ctx.shadowBlur = 0
      
      const entities = entitiesRef.current

      // Update and draw entities
      for (let i = entities.length - 1; i >= 0; i--) {
        const entity = entities[i]
        
        entity.x += entity.vx
        entity.y += entity.vy
        
        // Gentle swimming motion for fish
        if (entity.type === "fish") {
          entity.y += Math.sin(time * 0.001 + entity.tailPhase) * 0.3
        }
        
        // Slow rotation for chess pieces
        if (entity.type === "chess") {
          entity.rotation += 0.004
        }
        
        entity.flipX = entity.vx < 0
        
        // Check if entity is off screen
        const margin = 250
        if (
          entity.x < -margin ||
          entity.x > canvas.width + margin ||
          entity.y < -margin ||
          entity.y > canvas.height + margin
        ) {
          entities.splice(i, 1)
          entities.push(createEntity(canvas.width, canvas.height, true))
          continue
        }
        
        if (entity.type === "fish") {
          switch (entity.variant) {
            case 0:
              drawShark(ctx, entity, time)
              break
            case 1:
              drawStingray(ctx, entity, time)
              break
            case 2:
              drawGar(ctx, entity, time)
              break
            default:
              drawRegularFish(ctx, entity, time)
          }
        } else {
          drawChessPiece(ctx, entity)
        }
      }
      
      // Trigger melt effect every 10 seconds
      if (time - lastMeltRef.current > 10000 && entities.length > 0) {
        const randomIndex = Math.floor(Math.random() * entities.length)
        const randomEntity = entities[randomIndex]
        createMeltEffect(randomEntity, time)
        // Remove the entity that's melting
        entities.splice(randomIndex, 1)
        // Add a new one to replace it
        entities.push(createEntity(canvas.width, canvas.height, true))
        lastMeltRef.current = time
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [createEntity, createMatrixNumber, createMeltEffect, drawShark, drawStingray, drawGar, drawRegularFish, drawChessPiece])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background: "transparent" }}
    />
  )
}
