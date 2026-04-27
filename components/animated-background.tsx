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

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const entitiesRef = useRef<Entity[]>([])
  const animationFrameRef = useRef<number>(0)

  const createEntity = useCallback((width: number, height: number, fromEdge = true): Entity => {
    const isChess = Math.random() > 0.5
    const type: "fish" | "chess" = isChess ? "chess" : "fish"
    
    let x: number, y: number, vx: number, vy: number
    
    if (fromEdge) {
      const edge = Math.floor(Math.random() * 4)
      switch (edge) {
        case 0: // Left
          x = -100
          y = Math.random() * height
          vx = (isChess ? 2.5 : 0.8) + Math.random() * (isChess ? 2 : 0.6)
          vy = (Math.random() - 0.5) * (isChess ? 2 : 0.4)
          break
        case 1: // Right
          x = width + 100
          y = Math.random() * height
          vx = -(isChess ? 2.5 : 0.8) - Math.random() * (isChess ? 2 : 0.6)
          vy = (Math.random() - 0.5) * (isChess ? 2 : 0.4)
          break
        case 2: // Top
          x = Math.random() * width
          y = -100
          vx = (Math.random() - 0.5) * (isChess ? 2 : 0.4)
          vy = (isChess ? 2.5 : 0.8) + Math.random() * (isChess ? 2 : 0.6)
          break
        default: // Bottom
          x = Math.random() * width
          y = height + 100
          vx = (Math.random() - 0.5) * (isChess ? 2 : 0.4)
          vy = -(isChess ? 2.5 : 0.8) - Math.random() * (isChess ? 2 : 0.6)
      }
    } else {
      x = Math.random() * width
      y = Math.random() * height
      vx = (Math.random() - 0.5) * (isChess ? 3 : 1.2)
      vy = (Math.random() - 0.5) * (isChess ? 3 : 1.2)
    }

    return {
      x,
      y,
      vx,
      vy,
      size: isChess ? 80 + Math.random() * 40 : 100 + Math.random() * 50,
      type,
      variant: Math.floor(Math.random() * 6),
      opacity: 0.2 + Math.random() * 0.15,
      rotation: Math.random() * Math.PI * 2,
      flipX: vx < 0,
    }
  }, [])

  // Draw a properly proportioned fish
  const drawFish = useCallback((ctx: CanvasRenderingContext2D, entity: Entity) => {
    ctx.save()
    ctx.translate(entity.x, entity.y)
    ctx.scale(entity.flipX ? -1 : 1, 1)
    ctx.globalAlpha = entity.opacity
    
    const s = entity.size
    const bodyColor = "#d1d5db"
    const finColor = "#9ca3af"
    const outlineColor = "#6b7280"
    
    // Main body - natural fish oval shape
    ctx.beginPath()
    ctx.moveTo(s * 0.5, 0) // Nose
    ctx.bezierCurveTo(s * 0.45, -s * 0.25, s * 0.1, -s * 0.35, -s * 0.2, -s * 0.25)
    ctx.bezierCurveTo(-s * 0.35, -s * 0.15, -s * 0.4, 0, -s * 0.4, 0)
    ctx.bezierCurveTo(-s * 0.4, 0, -s * 0.35, s * 0.15, -s * 0.2, s * 0.25)
    ctx.bezierCurveTo(s * 0.1, s * 0.35, s * 0.45, s * 0.25, s * 0.5, 0)
    ctx.fillStyle = bodyColor
    ctx.fill()
    ctx.strokeStyle = outlineColor
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Tail fin - forked
    ctx.beginPath()
    ctx.moveTo(-s * 0.35, 0)
    ctx.lineTo(-s * 0.6, -s * 0.25)
    ctx.lineTo(-s * 0.5, 0)
    ctx.lineTo(-s * 0.6, s * 0.25)
    ctx.closePath()
    ctx.fillStyle = finColor
    ctx.fill()
    ctx.strokeStyle = outlineColor
    ctx.lineWidth = 1.5
    ctx.stroke()
    
    // Dorsal fin (top)
    ctx.beginPath()
    ctx.moveTo(s * 0.1, -s * 0.28)
    ctx.quadraticCurveTo(0, -s * 0.45, -s * 0.15, -s * 0.3)
    ctx.lineTo(s * 0.1, -s * 0.28)
    ctx.fillStyle = finColor
    ctx.fill()
    ctx.stroke()
    
    // Pectoral fin (side)
    ctx.beginPath()
    ctx.moveTo(s * 0.15, s * 0.1)
    ctx.quadraticCurveTo(s * 0.2, s * 0.3, 0, s * 0.28)
    ctx.lineTo(s * 0.15, s * 0.1)
    ctx.fillStyle = finColor
    ctx.fill()
    ctx.stroke()
    
    // Eye
    ctx.beginPath()
    ctx.arc(s * 0.3, -s * 0.05, s * 0.06, 0, Math.PI * 2)
    ctx.fillStyle = "#1f2937"
    ctx.fill()
    
    // Eye highlight
    ctx.beginPath()
    ctx.arc(s * 0.32, -s * 0.07, s * 0.02, 0, Math.PI * 2)
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
    ctx.lineWidth = 2
    
    switch (entity.variant) {
      case 0: // Pawn
        // Head
        ctx.beginPath()
        ctx.arc(0, -s * 0.3, s * 0.15, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        // Neck
        ctx.beginPath()
        ctx.moveTo(-s * 0.08, -s * 0.15)
        ctx.lineTo(s * 0.08, -s * 0.15)
        ctx.lineTo(s * 0.06, 0)
        ctx.lineTo(-s * 0.06, 0)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        // Body
        ctx.beginPath()
        ctx.moveTo(-s * 0.2, s * 0.35)
        ctx.lineTo(s * 0.2, s * 0.35)
        ctx.lineTo(s * 0.12, 0)
        ctx.lineTo(-s * 0.12, 0)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        // Base
        ctx.beginPath()
        ctx.ellipse(0, s * 0.38, s * 0.25, s * 0.08, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        break
        
      case 1: // Rook
        // Tower body
        ctx.fillRect(-s * 0.15, -s * 0.2, s * 0.3, s * 0.5)
        ctx.strokeRect(-s * 0.15, -s * 0.2, s * 0.3, s * 0.5)
        // Crenellations
        ctx.fillRect(-s * 0.2, -s * 0.38, s * 0.12, s * 0.18)
        ctx.fillRect(-s * 0.06, -s * 0.38, s * 0.12, s * 0.18)
        ctx.fillRect(s * 0.08, -s * 0.38, s * 0.12, s * 0.18)
        ctx.strokeRect(-s * 0.2, -s * 0.38, s * 0.12, s * 0.18)
        ctx.strokeRect(-s * 0.06, -s * 0.38, s * 0.12, s * 0.18)
        ctx.strokeRect(s * 0.08, -s * 0.38, s * 0.12, s * 0.18)
        // Base
        ctx.beginPath()
        ctx.ellipse(0, s * 0.35, s * 0.22, s * 0.08, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        break
        
      case 2: // Knight
        ctx.beginPath()
        // Head shape
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
        // Ear
        ctx.beginPath()
        ctx.moveTo(s * 0.05, -s * 0.35)
        ctx.lineTo(s * 0.1, -s * 0.48)
        ctx.lineTo(s * 0.15, -s * 0.35)
        ctx.fill()
        ctx.stroke()
        // Eye
        ctx.beginPath()
        ctx.arc(s * 0.18, -s * 0.18, s * 0.04, 0, Math.PI * 2)
        ctx.fillStyle = "#374151"
        ctx.fill()
        ctx.fillStyle = "#e5e7eb"
        // Base
        ctx.beginPath()
        ctx.ellipse(0, s * 0.35, s * 0.18, s * 0.08, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        break
        
      case 3: // Bishop
        // Top point
        ctx.beginPath()
        ctx.arc(0, -s * 0.42, s * 0.07, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        // Head
        ctx.beginPath()
        ctx.moveTo(0, -s * 0.35)
        ctx.bezierCurveTo(s * 0.18, -s * 0.3, s * 0.18, -s * 0.05, s * 0.12, s * 0.02)
        ctx.lineTo(-s * 0.12, s * 0.02)
        ctx.bezierCurveTo(-s * 0.18, -s * 0.05, -s * 0.18, -s * 0.3, 0, -s * 0.35)
        ctx.fill()
        ctx.stroke()
        // Slit
        ctx.beginPath()
        ctx.moveTo(-s * 0.02, -s * 0.32)
        ctx.lineTo(s * 0.08, -s * 0.1)
        ctx.strokeStyle = "#4b5563"
        ctx.lineWidth = 2.5
        ctx.stroke()
        ctx.strokeStyle = "#6b7280"
        ctx.lineWidth = 2
        // Body
        ctx.beginPath()
        ctx.moveTo(-s * 0.18, s * 0.35)
        ctx.lineTo(s * 0.18, s * 0.35)
        ctx.lineTo(s * 0.12, s * 0.02)
        ctx.lineTo(-s * 0.12, s * 0.02)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        // Base
        ctx.beginPath()
        ctx.ellipse(0, s * 0.38, s * 0.22, s * 0.08, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        break
        
      case 4: // Queen
        // Crown points
        for (let i = 0; i < 5; i++) {
          const angle = -Math.PI / 2 + (i - 2) * 0.4
          const px = Math.cos(angle) * s * 0.2
          const py = -s * 0.32 + Math.sin(angle) * s * 0.12
          ctx.beginPath()
          ctx.arc(px, py, s * 0.05, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
        }
        // Crown body
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
        // Body
        ctx.beginPath()
        ctx.moveTo(-s * 0.2, s * 0.35)
        ctx.lineTo(s * 0.2, s * 0.35)
        ctx.lineTo(s * 0.14, s * 0.02)
        ctx.lineTo(-s * 0.14, s * 0.02)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        // Base
        ctx.beginPath()
        ctx.ellipse(0, s * 0.38, s * 0.24, s * 0.08, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        break
        
      case 5: // King
        // Cross
        ctx.fillRect(-s * 0.04, -s * 0.52, s * 0.08, s * 0.18)
        ctx.fillRect(-s * 0.1, -s * 0.48, s * 0.2, s * 0.06)
        ctx.strokeRect(-s * 0.04, -s * 0.52, s * 0.08, s * 0.18)
        ctx.strokeRect(-s * 0.1, -s * 0.48, s * 0.2, s * 0.06)
        // Crown
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
        // Body
        ctx.beginPath()
        ctx.moveTo(-s * 0.2, s * 0.35)
        ctx.lineTo(s * 0.2, s * 0.35)
        ctx.lineTo(s * 0.12, s * 0.02)
        ctx.lineTo(-s * 0.12, s * 0.02)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        // Base
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

    // Initialize entities
    for (let i = 0; i < 8; i++) {
      entitiesRef.current.push(createEntity(canvas.width, canvas.height, false))
    }

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const entities = entitiesRef.current

      // Update and draw entities
      for (let i = entities.length - 1; i >= 0; i--) {
        const entity = entities[i]
        
        entity.x += entity.vx
        entity.y += entity.vy
        
        // Gentle wave motion for fish
        if (entity.type === "fish") {
          entity.y += Math.sin(time * 0.002 + entity.x * 0.01) * 0.4
        }
        
        // Slow rotation for chess pieces
        if (entity.type === "chess") {
          entity.rotation += 0.006
        }
        
        entity.flipX = entity.vx < 0
        
        // Check if entity is off screen
        const margin = 150
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

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [createEntity, drawFish, drawChessPiece])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background: "transparent" }}
    />
  )
}
