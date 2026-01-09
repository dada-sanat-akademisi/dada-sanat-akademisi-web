'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/motion/hooks';

/**
 * Hero Canvas Component (Client Component)
 * 
 * WHY: Canvas animation is an enhancement, not a requirement.
 * This component:
 * - Respects prefers-reduced-motion
 * - Degrades gracefully if canvas fails
 * - Loads after initial render (doesn't block LCP)
 * - Pauses when tab is hidden
 * 
 * Technical decisions:
 * - Canvas for 60fps particle animations
 * - Spring physics for natural mouse tracking
 * - Parallax layers for depth without 3D complexity
 * - Particle system with subtle mouse attraction
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

interface Trail {
  x: number;
  y: number;
  life: number;
  maxLife: number;
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [canvasError, setCanvasError] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Handle mouse movement directly on canvas container
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;

     const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mousePositionRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  useEffect(() => {
    // Skip canvas if reduced motion is preferred
    if (prefersReducedMotion) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      setCanvasError(true);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setCanvasError(true);
      return;
    }

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation variables
    let animationId: number;
    let particles: Particle[] = [];
    let trails: Trail[] = [];
    let isPaused = false;

    // Store canvas reference for use in Particle class
    // TypeScript knows canvas is non-null here because we checked above
    const canvasElement: HTMLCanvasElement = canvas;

    // Particle class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.color = Math.random() > 0.7
          ? `rgba(212, 175, 55, ${this.opacity})`
          : `rgba(246, 244, 239, ${this.opacity * 0.3})`;
      }

      update(mouseX: number, mouseY: number) {
        if (isPaused) return;

        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200) {
          const force = (200 - distance) / 200;
          this.vx += (dx / distance) * force * 0.01;
          this.vy += (dy / distance) * force * 0.01;
        }

        this.vx *= 0.98;
        this.vy *= 0.98;
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = canvasElement.width;
        if (this.x > canvasElement.width) this.x = 0;
        if (this.y < 0) this.y = canvasElement.height;
        if (this.y > canvasElement.height) this.y = 0;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Trail class
    class Trail {
      x: number;
      y: number;
      life: number;
      maxLife: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.maxLife = 30;
        this.life = this.maxLife;
      }

      update() {
        this.life--;
      }

      draw(ctx: CanvasRenderingContext2D, mouseX: number, mouseY: number) {
        if (this.life <= 0) return;

        const opacity = this.life / this.maxLife;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = `rgba(212, 175, 55, ${opacity * 0.2})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Initialize particles
    for (let i = 0; i < 50; i++) {
      particles.push(
        new Particle(
          Math.random() * canvas.width,
          Math.random() * canvas.height
        )
      );
    }

    // Initialize mouse position to center
    mousePositionRef.current = {
      x: canvas.width / 2,
      y: canvas.height / 2,
    };

    // Pause when tab is hidden (performance optimization)
    const handleVisibilityChange = () => {
      isPaused = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Animation loop
    const animate = () => {
      if (isPaused) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      ctx.fillStyle = 'rgba(14, 14, 14, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const currentMouseX = mousePositionRef.current.x;
      const currentMouseY = mousePositionRef.current.y;

      particles.forEach((particle) => {
        particle.update(currentMouseX, currentMouseY);
        particle.draw(ctx);
      });

      if (isHoveringRef.current) {
        trails.push(new Trail(currentMouseX, currentMouseY));
      }

      trails = trails.filter((trail) => {
        trail.update();
        trail.draw(ctx, currentMouseX, currentMouseY);
        return trail.life > 0;
      });

      animationId = requestAnimationFrame(animate);
    };

    // Start animation after initial render (doesn't block LCP)
    setCanvasReady(true);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationId);
    };
  }, [prefersReducedMotion]);



  // Don't render canvas if reduced motion or error
  if (prefersReducedMotion || canvasError || !canvasReady) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => (isHoveringRef.current = true)}
      onMouseLeave={() => (isHoveringRef.current = false)}
      className="absolute inset-0 w-full h-full overflow-hidden z-0"
      style={{ pointerEvents: 'auto' }}
    >
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: 'screen' }}
        aria-hidden="true"
      />
    </div>
  );
}

