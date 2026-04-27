"use client"

import { useEffect, useRef, useCallback } from "react"

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

interface MatrixColumn {
  x: number
  y: number
  speed: number
  chars: string[]
  opacity: number
}

interface MatrixParticle {
  x: number
  y: number
  vx: number
  vy: number
  chars: string[]
  opacity: number
  targetX: number
  targetY: number
  phase: "explode" | "disperse"
  life: number
  speed: number
}

interface ButtonTarget {
  x: number
  y: number
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const entitiesRef = useRef<Entity[]>([])
  const matrixColumnsRef = useRef<MatrixColumn[]>([])
  const particlesRef = useRef<MatrixParticle[]>([])
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
        })
      }
    })
    buttonTargetsRef.current = targets
  }, [])

  const createMatrixColumn = useCallback((width: number, height: number): MatrixColumn => {
    const charCount = 5 + Math.floor(Math.random() * 8)
    const chars: string[] = []
    for (let i = 0; i < charCount; i++) {
      chars.push(Math.random() > 0.5 ? "1" : "0")
    }
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      speed: 0.3 + Math.random() * 0.5,
      chars,
      opacity: 0.1 + Math.random() * 0.2,
    }
  }, [])

  const createEntity = useCallback((width: number, height: number, fromEdge = true): Entity => {
    const isChess = Math.random() > 0.5
    const type: "fish" | "chess" = isChess ? "chess" : "fish"
    
    let x: number, y: number, vx: number, vy: number
    
    if (fromEdge) {
      const edge = Math.floor(Math.random() * 4)
      switch (edge) {
        case 0:
          x = -80
          y = Math.random() * height
          vx = (isChess ? 2 : 0.6) + Math.random() * (isChess ? 2.5 : 0.8)
          vy = (Math.random() - 0.5) * (isChess ? 3 : 0.6)
          break
        case 1:
          x = width + 80
          y = Math.random() * height
          vx = -(isChess ? 2 : 0.6) - Math.random() * (isChess ? 2.5 : 0.8)
          vy = (Math.random() - 0.5) * (isChess ? 3 : 0.6)
          break
        case 2:
          x = Math.random() * width
          y = -80
          vx = (Math.random() - 0.5) * (isChess ? 3 : 0.6)
          vy = (isChess ? 2 : 0.6) + Math.random() * (isChess ? 2.5 : 0.8)
          break
        default:
          x = Math.random() * width
          y = height + 80
          vx = (Math.random() - 0.5) * (isChess ? 3 : 0.6)
          vy = -(isChess ? 2 : 0.6) - Math.random() * (isChess ? 2.5 : 0.8)
      }
    } else {
      x = Math.random() * width
      y = Math.random() * height
      vx = (Math.random() - 0.5) * (isChess ? 3 : 1.5)
      vy = (Math.random() - 0.5) * (isChess ? 3 : 1.5)
    }

    return {
      x,
      y,
      vx,
      vy,
      size: isChess ? 45 + Math.random() * 25 : 55 + Math.random() * 25,
      type,
      variant: Math.floor(Math.random() * 6),
      opacity: 0.18 + Math.random() * 0.15,
      rotation: Math.random() * Math.PI * 2,
      flipX: vx < 0,
    }
  }, [])

  const createExplosion = useCallback((entity: Entity) => {
    const particleCount = 12 + Math.floor(Math.random() * 8)
    const targets = buttonTargetsRef.current
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5
      const speed = 2 + Math.random() * 3
      const target = targets.length > 0 
        ? targets[Math.floor(Math.random() * targets.length)]
        : { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }
      
      // Create matrix-style vertical binary string
      const charCount = 4 + Math.floor(Math.random() * 6)
      const chars: string[] = []
      for (let j = 0; j < charCount; j++) {
        chars.push(Math.random() > 0.5 ? "1" : "0")
      }
      
      particlesRef.current.push({
        x: entity.x,
        y: entity.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        chars,
        opacity: 1,
        targetX: target.x,
        targetY: target.y - window.scrollY,
        phase: "explode",
        life: 200,
        speed: 0.5 + Math.random() * 0.5,
      })
    }
  }, [])

  // Draw a properly proportioned fish - classic fish shape with good width-to-height ratio
  const drawFish = useCallback((ctx: CanvasRenderingContext2D, entity: Entity) => {
    ctx.save()
    ctx.translate(entity.x, entity.y)
    ctx.scale(entity.flipX ? -1 : 1, 1)
    ctx.globalAlpha = entity.opacity
    
    const w = entity.size // width
    const h = entity.size * 0.6 // height - fish are typically wider than tall
    const bodyColor = "#d1d5db"
    const finColor = "#9ca3af"
    const outlineColor = "#6b7280"
    
    // Main body - oval fish shape
    ctx.beginPath()
    // Start at nose (right side)
    ctx.moveTo(w * 0.4, 0)
    // Top curve from nose to back
    ctx.bezierCurveTo(
      w * 0.35, -h * 0.45,
      -w * 0.1, -h * 0.5,
      -w * 0.3, 0
    )
    // Bottom curve from back to nose
    ctx.bezierCurveTo(
      -w * 0.1, h * 0.5,
      w * 0.35, h * 0.45,
      w * 0.4, 0
    )
    ctx.fillStyle = bodyColor
    ctx.fill()
    ctx.strokeStyle = outlineColor
    ctx.lineWidth = 1.5
    ctx.stroke()
    
    // Tail fin - forked tail
    ctx.beginPath()
    ctx.moveTo(-w * 0.25, 0)
    ctx.lineTo(-w * 0.5, -h * 0.4)
    ctx.quadraticCurveTo(-w * 0.42, 0, -w * 0.5, h * 0.4)
    ctx.closePath()
    ctx.fillStyle = finColor
    ctx.fill()
    ctx.strokeStyle = outlineColor
    ctx.lineWidth = 1
    ctx.stroke()
    
    // Dorsal fin (top)
    ctx.beginPath()
    ctx.moveTo(w * 0.1, -h * 0.35)
    ctx.quadraticCurveTo(-w * 0.05, -h * 0.65, -w * 0.15, -h * 0.38)
    ctx.lineTo(w * 0.1, -h * 0.35)
    ctx.fillStyle = finColor
    ctx.fill()
    ctx.stroke()
    
    // Pectoral fin (side)
    ctx.beginPath()
    ctx.moveTo(w * 0.1, h * 0.15)
    ctx.quadraticCurveTo(w * 0.15, h * 0.45, -w * 0.05, h * 0.35)
    ctx.lineTo(w * 0.1, h * 0.15)
    ctx.fillStyle = finColor
    ctx.fill()
    ctx.stroke()
    
    // Eye
    ctx.beginPath()
    ctx.arc(w * 0.22, -h * 0.08, w * 0.06, 0, Math.PI * 2)
    ctx.fillStyle = "#1f2937"
    ctx.fill()
    
    // Eye highlight
    ctx.beginPath()
    ctx.arc(w * 0.24, -h * 0.12, w * 0.02, 0, Math.PI * 2)
    ctx.fillStyle = "#ffffff"
    ctx.fill()
    
    ctx.restore()
  }, [])

  // Draw properly proportioned chess pieces
  const drawChessPiece = useCallback((ctx: CanvasRenderingContext2D, entity: Entity) => {
    ctx.save()
    ctx.translate(entity.x, entity.y)
    ctx.rotate(entity.rotation)
    ctx.globalAlpha = entity.opacity
    
    const s = entity.size
    ctx.fillStyle = "#e5e7eb"
    ctx.strokeStyle = "#6b7280"
    ctx.lineWidth = 1.5
    
    switch (entity.variant) {
      case 0: // Pawn
        // Head
        ctx.beginPath()
        ctx.arc(0, -s * 0.28, s * 0.14, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        // Neck
        ctx.beginPath()
        ctx.moveTo(-s * 0.08, -s * 0.14)
        ctx.lineTo(s * 0.08, -s * 0.14)
        ctx.lineTo(s * 0.06, -s * 0.02)
        ctx.lineTo(-s * 0.06, -s * 0.02)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        // Body
        ctx.beginPath()
        ctx.moveTo(-s * 0.18, s * 0.35)
        ctx.lineTo(s * 0.18, s * 0.35)
        ctx.lineTo(s * 0.12, -s * 0.02)
        ctx.lineTo(-s * 0.12, -s * 0.02)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        // Base
        ctx.beginPath()
        ctx.ellipse(0, s * 0.35, s * 0.22, s * 0.06, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        break
        
      case 1: // Rook
        // Tower body
        ctx.fillRect(-s * 0.14, -s * 0.25, s * 0.28, s * 0.5)
        ctx.strokeRect(-s * 0.14, -s * 0.25, s * 0.28, s * 0.5)
        // Crenellations
        ctx.fillRect(-s * 0.18, -s * 0.38, s * 0.1, s * 0.13)
        ctx.fillRect(s * 0.08, -s * 0.38, s * 0.1, s * 0.13)
        ctx.fillRect(-s * 0.05, -s * 0.38, s * 0.1, s * 0.13)
        ctx.strokeRect(-s * 0.18, -s * 0.38, s * 0.1, s * 0.13)
        ctx.strokeRect(s * 0.08, -s * 0.38, s * 0.1, s * 0.13)
        ctx.strokeRect(-s * 0.05, -s * 0.38, s * 0.1, s * 0.13)
        // Base
        ctx.beginPath()
        ctx.ellipse(0, s * 0.3, s * 0.2, s * 0.06, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        break
        
      case 2: // Knight
        ctx.beginPath()
        // Head
        ctx.moveTo(s * 0.15, -s * 0.35)
        ctx.quadraticCurveTo(s * 0.25, -s * 0.3, s * 0.2, -s * 0.15)
        // Snout
        ctx.lineTo(s * 0.28, -s * 0.12)
        ctx.quadraticCurveTo(s * 0.3, -s * 0.05, s * 0.2, 0)
        // Neck
        ctx.lineTo(s * 0.12, s * 0.08)
        ctx.lineTo(s * 0.1, s * 0.25)
        ctx.lineTo(-s * 0.1, s * 0.25)
        ctx.lineTo(-s * 0.12, -s * 0.1)
        // Mane
        ctx.quadraticCurveTo(-s * 0.08, -s * 0.25, 0, -s * 0.35)
        ctx.quadraticCurveTo(s * 0.08, -s * 0.4, s * 0.15, -s * 0.35)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        // Ear
        ctx.beginPath()
        ctx.moveTo(s * 0.05, -s * 0.35)
        ctx.lineTo(s * 0.1, -s * 0.45)
        ctx.lineTo(s * 0.15, -s * 0.35)
        ctx.fill()
        ctx.stroke()
        // Eye
        ctx.beginPath()
        ctx.arc(s * 0.18, -s * 0.2, s * 0.03, 0, Math.PI * 2)
        ctx.fillStyle = "#374151"
        ctx.fill()
        ctx.fillStyle = "#e5e7eb"
        // Base
        ctx.beginPath()
        ctx.ellipse(0, s * 0.3, s * 0.16, s * 0.06, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        break
        
      case 3: // Bishop
        // Top point
        ctx.beginPath()
        ctx.arc(0, -s * 0.38, s * 0.06, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        // Head
        ctx.beginPath()
        ctx.moveTo(0, -s * 0.32)
        ctx.bezierCurveTo(s * 0.15, -s * 0.28, s * 0.15, -s * 0.08, s * 0.1, 0)
        ctx.lineTo(-s * 0.1, 0)
        ctx.bezierCurveTo(-s * 0.15, -s * 0.08, -s * 0.15, -s * 0.28, 0, -s * 0.32)
        ctx.fill()
        ctx.stroke()
        // Slit
        ctx.beginPath()
        ctx.moveTo(-s * 0.02, -s * 0.28)
        ctx.lineTo(s * 0.06, -s * 0.12)
        ctx.strokeStyle = "#4b5563"
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.strokeStyle = "#6b7280"
        ctx.lineWidth = 1.5
        // Body
        ctx.beginPath()
        ctx.moveTo(-s * 0.16, s * 0.3)
        ctx.lineTo(s * 0.16, s * 0.3)
        ctx.lineTo(s * 0.1, 0)
        ctx.lineTo(-s * 0.1, 0)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        // Base
        ctx.beginPath()
        ctx.ellipse(0, s * 0.32, s * 0.18, s * 0.06, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        break
        
      case 4: // Queen
        // Crown points
        for (let i = 0; i < 5; i++) {
          const angle = -Math.PI / 2 + (i - 2) * 0.35
          const px = Math.cos(angle) * s * 0.18
          const py = -s * 0.28 + Math.sin(angle) * s * 0.12
          ctx.beginPath()
          ctx.arc(px, py, s * 0.04, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
        }
        // Crown body
        ctx.beginPath()
        ctx.moveTo(-s * 0.18, -s * 0.15)
        ctx.lineTo(-s * 0.15, -s * 0.28)
        ctx.lineTo(-s * 0.08, -s * 0.18)
        ctx.lineTo(0, -s * 0.32)
        ctx.lineTo(s * 0.08, -s * 0.18)
        ctx.lineTo(s * 0.15, -s * 0.28)
        ctx.lineTo(s * 0.18, -s * 0.15)
        ctx.lineTo(s * 0.12, 0)
        ctx.lineTo(-s * 0.12, 0)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        // Body
        ctx.beginPath()
        ctx.moveTo(-s * 0.18, s * 0.32)
        ctx.lineTo(s * 0.18, s * 0.32)
        ctx.lineTo(s * 0.12, 0)
        ctx.lineTo(-s * 0.12, 0)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        // Base
        ctx.beginPath()
        ctx.ellipse(0, s * 0.34, s * 0.2, s * 0.06, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        break
        
      case 5: // King
        // Cross
        ctx.fillRect(-s * 0.03, -s * 0.48, s * 0.06, s * 0.14)
        ctx.fillRect(-s * 0.08, -s * 0.44, s * 0.16, s * 0.05)
        ctx.strokeRect(-s * 0.03, -s * 0.48, s * 0.06, s * 0.14)
        ctx.strokeRect(-s * 0.08, -s * 0.44, s * 0.16, s * 0.05)
        // Crown
        ctx.beginPath()
        ctx.moveTo(-s * 0.14, -s * 0.18)
        ctx.lineTo(-s * 0.16, -s * 0.32)
        ctx.lineTo(-s * 0.06, -s * 0.25)
        ctx.lineTo(0, -s * 0.34)
        ctx.lineTo(s * 0.06, -s * 0.25)
        ctx.lineTo(s * 0.16, -s * 0.32)
        ctx.lineTo(s * 0.14, -s * 0.18)
        ctx.lineTo(s * 0.1, 0)
        ctx.lineTo(-s * 0.1, 0)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        // Body
        ctx.beginPath()
        ctx.moveTo(-s * 0.18, s * 0.32)
        ctx.lineTo(s * 0.18, s * 0.32)
        ctx.lineTo(s * 0.1, 0)
        ctx.lineTo(-s * 0.1, 0)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        // Base
        ctx.beginPath()
        ctx.ellipse(0, s * 0.34, s * 0.2, s * 0.06, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        break
    }
    
    ctx.restore()
  }, [])

  // Draw matrix column with glow
  const drawMatrixColumn = useCallback((ctx: CanvasRenderingContext2D, col: MatrixColumn) => {
    const charHeight = 18
    const charWidth = 12
    
    ctx.save()
    ctx.font = "14px monospace"
    
    col.chars.forEach((char, i) => {
      const y = col.y + i * charHeight
      const glowIntensity = col.opacity * (1 - i * 0.08)
      
      // Glow effect
      ctx.shadowColor = "#ffffff"
      ctx.shadowBlur = 8
      ctx.globalAlpha = glowIntensity * 0.6
      ctx.fillStyle = "#ffffff"
      ctx.fillText(char, col.x, y)
      
      // Main character
      ctx.shadowBlur = 4
      ctx.globalAlpha = glowIntensity
      ctx.fillStyle = "#e5e7eb"
      ctx.fillText(char, col.x, y)
    })
    
    ctx.restore()
  }, [])

  // Draw matrix particle (vertical binary column)
  const drawMatrixParticle = useCallback((ctx: CanvasRenderingContext2D, particle: MatrixParticle) => {
    const charHeight = 14
    
    ctx.save()
    ctx.font = "12px monospace"
    
    particle.chars.forEach((char, i) => {
      const y = particle.y + i * charHeight
      
      // Glow effect
      ctx.shadowColor = "#ffffff"
      ctx.shadowBlur = 10
      ctx.globalAlpha = particle.opacity * 0.7
      ctx.fillStyle = "#ffffff"
      ctx.fillText(char, particle.x, y)
      
      // Main character
      ctx.shadowBlur = 5
      ctx.globalAlpha = particle.opacity
      ctx.fillStyle = "#f3f4f6"
      ctx.fillText(char, particle.x, y)
    })
    
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

    // Initialize entities - fewer for less clutter
    for (let i = 0; i < 6; i++) {
      entitiesRef.current.push(createEntity(canvas.width, canvas.height, false))
    }
    
    // Initialize matrix columns - sparse for subtle effect
    for (let i = 0; i < 18; i++) {
      matrixColumnsRef.current.push(createMatrixColumn(canvas.width, canvas.height))
    }

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const entities = entitiesRef.current
      const particles = particlesRef.current
      const matrixColumns = matrixColumnsRef.current

      // Draw matrix columns
      for (const col of matrixColumns) {
        col.y += col.speed
        
        // Reset column when it goes off screen
        if (col.y > canvas.height + 100) {
          col.y = -100
          col.x = Math.random() * canvas.width
          col.opacity = 0.1 + Math.random() * 0.2
        }
        
        // Occasionally change a character
        if (Math.random() < 0.01) {
          const idx = Math.floor(Math.random() * col.chars.length)
          col.chars[idx] = Math.random() > 0.5 ? "1" : "0"
        }
        
        drawMatrixColumn(ctx, col)
      }

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
        
        entity.x += entity.vx
        entity.y += entity.vy
        
        if (entity.type === "fish") {
          entity.y += Math.sin(time * 0.002 + entity.x * 0.01) * 0.3
        }
        
        if (entity.type === "chess") {
          entity.rotation += 0.008
        }
        
        entity.flipX = entity.vx < 0
        
        const margin = 120
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
        
        if (particle.phase === "explode" && particle.life < 150) {
          particle.phase = "disperse"
        }
        
        if (particle.phase === "explode") {
          particle.x += particle.vx
          particle.y += particle.vy
          particle.vx *= 0.96
          particle.vy *= 0.96
        } else {
          const dx = particle.targetX - particle.x
          const dy = particle.targetY - particle.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist > 5) {
            particle.x += dx * 0.025
            particle.y += dy * 0.025
          }
          particle.opacity = Math.min(1, particle.life / 80)
        }
        
        // Update binary characters occasionally
        if (Math.random() < 0.05) {
          const idx = Math.floor(Math.random() * particle.chars.length)
          particle.chars[idx] = Math.random() > 0.5 ? "1" : "0"
        }
        
        drawMatrixParticle(ctx, particle)
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("scroll", getButtonTargets)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [createEntity, createExplosion, createMatrixColumn, drawFish, drawChessPiece, drawMatrixColumn, drawMatrixParticle, getButtonTargets])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  )
}
