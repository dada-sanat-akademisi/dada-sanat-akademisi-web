/**
 * Hero Background - Server Component
 * 
 * Phase 3 Implementation: CSS-only background with gradient and subtle noise overlay.
 * 
 * Architecture (Phase 1):
 * - Layer 1: Static background layer
 * - Server-rendered (no JavaScript)
 * - CSS-only gradient and noise
 * - Respects prefers-reduced-motion via CSS media query
 * - Static on mobile (no animation)
 * 
 * Design (Phase 2):
 * - Base: Deep charcoal (#0E0E0E)
 * - Gradient: Subtle shift to warmer charcoal (#1A1A1A) at edges
 * - Motion: Gradient position slowly shifts (20s loop, desktop only)
 * - Texture: Very subtle noise overlay (2-3% opacity, barely visible)
 * 
 * Performance:
 * - Pure CSS (GPU-accelerated)
 * - No JavaScript overhead
 * - Works without JavaScript
 * - Mobile: Static only (no animation)
 */
export function HeroBackground() {
  return (
    <div 
      className="hero-background-static absolute inset-0 z-0"
      aria-hidden="true"
    />
  );
}

