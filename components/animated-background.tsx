"use client"

import { useEffect, useRef, useCallback } from "react"

// Code snippets for explosion effect
const CODE_SNIPPETS = [
  "const", "let", "function", "=>", "return", "if", "else", "for", "while",
  "import", "export", "async", "await", "try", "catch", "class", "extends",
  "useState", "useEffect", "props", "render", "component", "<div>", "</div>",
  "{...}", "[]", "()", "===", "!==", "&&", "||", "map", "filter", "reduce",
  "fetch", "api", "data", "error", "loading", "true", "false", "null", "void",
]

interface Entity {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  type: "fish" | "chess"
  variant: number
  opacity: number
  rotation: number
  flipX: boolean
}

interface CodeParticle {
  x: number
  y: number
  vx: number
  vy: number
  text: string
  opacity: number
  targetX: number
  targetY: number
  phase: "explode" | "disperse"
  life: number
  color: string
}

interface ButtonTarget {
  x: number
  y: number
  width: number
  height: number
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const entitiesRef = useRef<Entity[]>([])
  const particlesRef = useRef<CodeParticle[]>([])
  const lastExplosionRef = useRef(0)
  const buttonTargetsRef = useRef<ButtonTarget[]>([])
  const animationFrameRef = useRef<number>(0)

  const getButtonTargets = useCallback(() => {
    const buttons = document.querySelectorAll("button, a[href], [role='button']")
    const targets: ButtonTarget[] = []
    buttons.forEach((btn) => {
      const rect = btn.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        targets.push({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2 + window.scrollY,
          width: rect.width,
          height: rect.height,
        })
      }
    })
    buttonTargetsRef.current = targets
  }, [])

  const createEntity = useCallback((width: number, height: number, fromEdge = true): Entity => {
    const isChess = Math.random() > 0.5
    const type: "fish" | "chess" = isChess ? "chess" : "fish"
    
    let x: number, y: number, vx: number, vy: number
    
    if (fromEdge) {
      // Spawn from edges
      const edge = Math.floor(Math.random() * 4)
      switch (edge) {
        case 0: // Left
          x = -60
          y = Math.random() * height
          vx = (isChess ? 2 : 0.8) + Math.random() * (isChess ? 3 : 1.2)
          vy = (Math.random() - 0.5) * (isChess ? 4 : 1)
          break
        case 1: // Right
          x = width + 60
          y = Math.random() * height
          vx = -(isChess ? 2 : 0.8) - Math.random() * (isChess ? 3 : 1.2)
          vy = (Math.random() - 0.5) * (isChess ? 4 : 1)
          break
        case 2: // Top
          x = Math.random() * width
          y = -60
          vx = (Math.random() - 0.5) * (isChess ? 4 : 1)
          vy = (isChess ? 2 : 0.8) + Math.random() * (isChess ? 3 : 1.2)
          break
        default: // Bottom
          x = Math.random() * width
          y = height + 60
          vx = (Math.random() - 0.5) * (isChess ? 4 : 1)
          vy = -(isChess ? 2 : 0.8) - Math.random() * (isChess ? 3 : 1.2)
      }
    } else {
      x = Math.random() * width
      y = Math.random() * height
      vx = (Math.random() - 0.5) * (isChess ? 4 : 2)
      vy = (Math.random() - 0.5) * (isChess ? 4 : 2)
    }

    return {
      x,
      y,
      vx,
      vy,
      size: isChess ? 24 + Math.random() * 16 : 30 + Math.random() * 20,
      type,
      variant: Math.floor(Math.random() * (isChess ? 6 : 4)),
      opacity: 0.15 + Math.random() * 0.15,
      rotation: Math.random() * Math.PI * 2,
      flipX: vx < 0,
    }
  }, [])

  const createExplosion = useCallback((entity: Entity) => {
    const colors = ["#60a5fa", "#34d399", "#f472b6", "#a78bfa", "#fbbf24", "#f87171"]
    const particleCount = 15 + Math.floor(Math.random() * 10)
    const targets = buttonTargetsRef.current
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5
      const speed = 3 + Math.random() * 4
      const target = targets.length > 0 
        ? targets[Math.floor(Math.random() * targets.length)]
        : { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }
      
      particlesRef.current.push({
        x: entity.x,
        y: entity.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        text: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
        opacity: 1,
        targetX: target.x,
        targetY: target.y - window.scrollY,
        phase: "explode",
        life: 180,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }
  }, [])

  const drawFish = useCallback((ctx: CanvasRenderingContext2D, entity: Entity) => {
    ctx.save()
    ctx.translate(entity.x, entity.y)
    ctx.scale(entity.flipX ? -1 : 1, 1)
    ctx.globalAlpha = entity.opacity
    
    const s = entity.size
    const colors = [
      ["#60a5fa", "#3b82f6"], // Blue
      ["#34d399", "#10b981"], // Green
      ["#f472b6", "#ec4899"], // Pink
      ["#fbbf24", "#f59e0b"], // Yellow
    ]
    const [fill, stroke] = colors[entity.variant % colors.length]
    
    // Body
    ctx.beginPath()
    ctx.ellipse(0, 0, s * 0.5, s * 0.25, 0, 0, Math.PI * 2)
    ctx.fillStyle = fill
    ctx.fill()
    ctx.strokeStyle = stroke
    ctx.lineWidth = 1.5
    ctx.stroke()
    
    // Tail
    ctx.beginPath()
    ctx.moveTo(-s * 0.4, 0)
    ctx.lineTo(-s * 0.7, -s * 0.2)
    ctx.lineTo(-s * 0.7, s * 0.2)
    ctx.closePath()
    ctx.fillStyle = stroke
    ctx.fill()
    
    // Eye
    ctx.beginPath()
    ctx.arc(s * 0.2, -s * 0.05, s * 0.06, 0, Math.PI * 2)
    ctx.fillStyle = "#1e293b"
    ctx.fill()
    
    // Fin
    ctx.beginPath()
    ctx.moveTo(0, -s * 0.15)
    ctx.lineTo(s * 0.1, -s * 0.35)
    ctx.lineTo(-s * 0.1, -s * 0.15)
    ctx.closePath()
    ctx.fillStyle = stroke
    ctx.fill()
    
    ctx.restore()
  }, [])

  const drawChessPiece = useCallback((ctx: CanvasRenderingContext2D, entity: Entity) => {
    ctx.save()
    ctx.translate(entity.x, entity.y)
    ctx.rotate(entity.rotation)
    ctx.globalAlpha = entity.opacity
    
    const s = entity.size
    ctx.fillStyle = "#f8fafc"
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 1.5
    
    // Different chess piece shapes
    switch (entity.variant) {
      case 0: // Pawn
        ctx.beginPath()
        ctx.arc(0, -s * 0.3, s * 0.2, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(-s * 0.25, s * 0.4)
        ctx.lineTo(s * 0.25, s * 0.4)
        ctx.lineTo(s * 0.15, 0)
        ctx.lineTo(-s * 0.15, 0)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        break
      case 1: // Rook
        ctx.fillRect(-s * 0.2, -s * 0.4, s * 0.4, s * 0.7)
        ctx.strokeRect(-s * 0.2, -s * 0.4, s * 0.4, s * 0.7)
        // Crenellations
        ctx.fillRect(-s * 0.25, -s * 0.5, s * 0.12, s * 0.15)
        ctx.fillRect(s * 0.13, -s * 0.5, s * 0.12, s * 0.15)
        break
      case 2: // Knight
        ctx.beginPath()
        ctx.moveTo(-s * 0.1, s * 0.4)
        ctx.lineTo(-s * 0.2, 0)
        ctx.lineTo(-s * 0.1, -s * 0.2)
        ctx.lineTo(s * 0.1, -s * 0.4)
        ctx.lineTo(s * 0.2, -s * 0.3)
        ctx.lineTo(s * 0.15, 0)
        ctx.lineTo(s * 0.1, s * 0.4)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        break
      case 3: // Bishop
        ctx.beginPath()
        ctx.moveTo(0, -s * 0.45)
        ctx.lineTo(s * 0.2, 0)
        ctx.lineTo(s * 0.15, s * 0.4)
        ctx.lineTo(-s * 0.15, s * 0.4)
        ctx.lineTo(-s * 0.2, 0)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        // Slit
        ctx.beginPath()
        ctx.moveTo(-s * 0.05, -s * 0.3)
        ctx.lineTo(s * 0.05, -s * 0.2)
        ctx.strokeStyle = "#64748b"
        ctx.stroke()
        break
      case 4: // Queen
        ctx.beginPath()
        ctx.arc(0, -s * 0.35, s * 0.12, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(-s * 0.25, s * 0.4)
        ctx.lineTo(s * 0.25, s * 0.4)
        ctx.lineTo(s * 0.2, -s * 0.15)
        ctx.lineTo(0, -s * 0.2)
        ctx.lineTo(-s * 0.2, -s * 0.15)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        break
      case 5: // King
        ctx.fillRect(-s * 0.05, -s * 0.5, s * 0.1, s * 0.15)
        ctx.fillRect(-s * 0.1, -s * 0.45, s * 0.2, s * 0.05)
        ctx.beginPath()
        ctx.moveTo(-s * 0.25, s * 0.4)
        ctx.lineTo(s * 0.25, s * 0.4)
        ctx.lineTo(s * 0.2, -s * 0.2)
        ctx.lineTo(-s * 0.2, -s * 0.2)
        ctx.closePath()
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
      getButtonTargets()
    }
    
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("scroll", getButtonTargets)

    // Initialize entities
    const initialCount = 12
    for (let i = 0; i < initialCount; i++) {
      entitiesRef.current.push(createEntity(canvas.width, canvas.height, false))
    }

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const entities = entitiesRef.current
      const particles = particlesRef.current

      // Check for explosion trigger (every 10 seconds)
      if (time - lastExplosionRef.current > 10000 && entities.length > 0) {
        const randomIndex = Math.floor(Math.random() * entities.length)
        const entity = entities[randomIndex]
        createExplosion(entity)
        entities.splice(randomIndex, 1)
        entities.push(createEntity(canvas.width, canvas.height, true))
        lastExplosionRef.current = time
      }

      // Update and draw entities
      for (let i = entities.length - 1; i >= 0; i--) {
        const entity = entities[i]
        
        // Update position
        entity.x += entity.vx
        entity.y += entity.vy
        
        // Fish have slight wave motion
        if (entity.type === "fish") {
          entity.y += Math.sin(time * 0.002 + entity.x * 0.01) * 0.3
        }
        
        // Chess pieces rotate slowly
        if (entity.type === "chess") {
          entity.rotation += 0.01
        }
        
        // Update flip based on direction
        entity.flipX = entity.vx < 0
        
        // Remove if off screen and replace
        const margin = 100
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
        
        // Draw entity
        if (entity.type === "fish") {
          drawFish(ctx, entity)
        } else {
          drawChessPiece(ctx, entity)
        }
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i]
        particle.life--
        
        if (particle.life <= 0) {
          particles.splice(i, 1)
          continue
        }
        
        if (particle.phase === "explode" && particle.life < 140) {
          particle.phase = "disperse"
        }
        
        if (particle.phase === "explode") {
          particle.x += particle.vx
          particle.y += particle.vy
          particle.vx *= 0.95
          particle.vy *= 0.95
        } else {
          // Move toward target
          const dx = particle.targetX - particle.x
          const dy = particle.targetY - particle.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist > 5) {
            particle.x += dx * 0.03
            particle.y += dy * 0.03
          }
          particle.opacity = Math.min(1, particle.life / 60)
        }
        
        // Draw particle
        ctx.save()
        ctx.globalAlpha = particle.opacity * 0.8
        ctx.fillStyle = particle.color
        ctx.font = `bold ${10 + Math.random() * 4}px monospace`
        ctx.fillText(particle.text, particle.x, particle.y)
        ctx.restore()
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("scroll", getButtonTargets)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [createEntity, createExplosion, drawFish, drawChessPiece, getButtonTargets])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  )
}
