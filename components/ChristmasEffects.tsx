'use client'

import { useEffect, useRef, useMemo } from 'react'
import gsap from 'gsap'

interface Snowflake {
  element: HTMLDivElement
  x: number
  y: number
  size: number
  speed: number
  wind: number
  opacity: number
  wobble: number
  wobbleSpeed: number
}

export function ChristmasEffects() {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const snowflakesRef = useRef<Snowflake[]>([])

  // Generate initial positions only once
  const initialPositions = useMemo(() => {
    return Array.from({ length: 35 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * -100,
      size: Math.random() * 3 + 2,
      speed: Math.random() * 0.3 + 0.15, // Much slower speed
      wind: Math.random() * 0.1 - 0.05, // Subtle wind
      opacity: Math.random() * 0.4 + 0.3,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.01,
    }))
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const snowflakes: Snowflake[] = []
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    // Create snowflakes with GPU-accelerated properties
    initialPositions.forEach((pos) => {
      const element = document.createElement('div')
      
      element.style.cssText = `
        position: absolute;
        width: ${pos.size}px;
        height: ${pos.size}px;
        background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 40%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        will-change: transform, opacity;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
      `

      container.appendChild(element)

      const snowflake: Snowflake = {
        element,
        x: (pos.x / 100) * windowWidth,
        y: (pos.y / 100) * windowHeight,
        size: pos.size,
        speed: pos.speed,
        wind: pos.wind,
        opacity: pos.opacity,
        wobble: pos.wobble,
        wobbleSpeed: pos.wobbleSpeed,
      }

      snowflakes.push(snowflake)

      // Initial position with GSAP
      gsap.set(element, {
        x: snowflake.x,
        y: snowflake.y,
        opacity: snowflake.opacity,
      })
    })

    snowflakesRef.current = snowflakes

    // Optimized animation using GSAP ticker for smooth 60fps
    const animate = () => {
      snowflakes.forEach((flake) => {
        // Natural falling motion
        flake.y += flake.speed
        flake.wobble += flake.wobbleSpeed
        
        // Gentle swaying motion
        const sway = Math.sin(flake.wobble) * 0.3
        flake.x += flake.wind + sway

        // Reset when off screen
        if (flake.y > windowHeight + 10) {
          flake.y = -10
          flake.x = Math.random() * windowWidth
        }

        // Wrap horizontally
        if (flake.x > windowWidth + 10) {
          flake.x = -10
        } else if (flake.x < -10) {
          flake.x = windowWidth + 10
        }

        // Use transform3d for GPU acceleration
        flake.element.style.transform = `translate3d(${flake.x}px, ${flake.y}px, 0)`
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animationRef.current = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      snowflakes.forEach((flake) => {
        flake.element.remove()
      })
    }
  }, [initialPositions])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[55] overflow-hidden"
      aria-hidden="true"
    />
  )
}
