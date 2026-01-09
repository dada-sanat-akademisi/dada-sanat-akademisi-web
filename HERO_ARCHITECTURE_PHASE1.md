# Hero Section Architecture - Phase 1
## Design & Motion Guardrails Compliance

**Project**: Dada Sanat Akademisi  
**Phase**: Hero Design & Motion (Phase 1)  
**Architecture**: Next.js 14 App Router + SSG + Sanity  
**Status**: Architecture & Constraints Definition

---

## 🎯 EXECUTIVE SUMMARY

This document defines the **correct architecture** for the hero section, ensuring:
- ✅ Static, SEO-first content (H1, intro, CTA) renders immediately
- ✅ LCP element is static and verified
- ✅ Motion is decorative only, never structural
- ✅ Zero layout shifts (CLS = 0)
- ✅ Full accessibility compliance (prefers-reduced-motion, no-JS fallback)
- ✅ Mobile performance protection

**Critical Rule**: Hero text (H1, intro, CTA) must be **server-rendered** and **immediately visible** - no animation delays, no JavaScript dependencies.

---

## 1️⃣ HERO ARCHITECTURE (LAYERED APPROACH)

### Three-Layer System

The hero section uses a **strictly layered architecture** to separate concerns and protect SEO:

```
┌─────────────────────────────────────────┐
│ Layer 3: Static Content Layer           │
│ (H1, Intro, CTA) - Server Component     │
│ ✅ Immediately visible                   │
│ ✅ SEO-critical                          │
│ ✅ No animation                          │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ Layer 2: Decorative Motion Layer        │
│ (Canvas, Particles, Background)         │
│ ✅ Client Component                      │
│ ✅ Non-blocking                         │
│ ✅ Respects reduced-motion              │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ Layer 1: Static Background Layer        │
│ (CSS Gradient/Image)                    │
│ ✅ CSS-only (no JS)                     │
│ ✅ Static fallback                      │
│ ✅ Immediate render                     │
└─────────────────────────────────────────┘
```

### Component Structure

```
app/page.tsx (Server Component)
  └── HeroSection.tsx (Server Component - Wrapper)
      ├── HeroBackground.tsx (Server Component - Static CSS)
      ├── HeroMotion.tsx (Client Component - Decorative)
      └── HeroContent.tsx (Server Component - Static Text)
          ├── <h1> (LCP Element)
          ├── <p> (Intro paragraph)
          └── <a> (CTA button)
```

### Why This Architecture?

1. **SEO Protection**: Content layer is server-rendered, immediately available to crawlers
2. **Performance**: LCP element (H1) renders without waiting for JavaScript
3. **Progressive Enhancement**: Motion layer enhances but never blocks
4. **Accessibility**: Static fallback works without JavaScript or reduced-motion
5. **Maintainability**: Clear separation of concerns

---

## 2️⃣ LCP ELEMENT IDENTIFICATION

### LCP Element: Hero H1 Heading

**Element**: `<h1>` in `HeroContent.tsx`

**Why This Element is LCP:**
- Largest text element on initial viewport
- Highest visual weight (font-size: 6xl-9xl)
- First semantic content encountered
- Server-rendered (available in initial HTML)
- No layout shifts (static positioning)

### Verification Requirements

Before finalizing design, **MUST verify** using:

1. **Lighthouse LCP Audit**
   ```bash
   npm run build
   npm start
   # Run Lighthouse audit locally
   ```

2. **Web Vitals Real User Monitoring**
   - Monitor LCP in production
   - Target: LCP < 2.5s
   - 75th percentile measurement

3. **Manual Inspection**
   - View page source (HTML) - H1 must be present
   - Disable JavaScript - H1 must be visible
   - Network throttling (3G) - H1 must load quickly

### LCP Protection Rules

✅ **ALLOWED**:
- Static CSS styling (color, font, spacing)
- Server-side rendering (in initial HTML)
- Static background behind H1

❌ **FORBIDDEN**:
- Any entrance animation on H1
- Delayed rendering of H1
- Layout shifts affecting H1 position/size
- JavaScript dependency for H1 visibility
- Background images that delay LCP (use CSS gradients)

### LCP Optimization Strategy

1. **Preload Critical Fonts** (already done in `layout.tsx`)
   - Playfair Display (H1 font) is preloaded
   - `display: swap` prevents invisible text

2. **Minimize Critical CSS**
   - Hero styles inlined or critical path
   - Non-critical styles loaded asynchronously

3. **No Render-Blocking Resources**
   - No blocking JavaScript for H1
   - No blocking CSS (except critical styles)

---

## 3️⃣ MOTION STRATEGY

### Decision: CSS-Based Background Motion (Primary) + Optional Canvas (Enhancement)

**Justification:**

1. **Performance**: CSS animations are hardware-accelerated, more performant than JavaScript
2. **Bundle Size**: CSS-only animations don't increase JavaScript bundle
3. **Progressive Enhancement**: Canvas can enhance but CSS provides base
4. **Accessibility**: CSS animations respect `prefers-reduced-motion` natively
5. **Mobile Performance**: CSS animations perform better on low-end devices

### Motion Implementation Hierarchy

```
Level 1: CSS Gradient Animation (Always Available)
  └── Subtle gradient shift (background-position or opacity)
  └── Zero JavaScript overhead
  └── Works with JavaScript disabled

Level 2: CSS Transform-Based Particles (Optional)
  └── Pure CSS particles (pseudo-elements + animations)
  └── Minimal performance impact
  └── Can be disabled on mobile for performance

Level 3: Canvas Enhancement (Progressive Enhancement)
  └── Only loads on capable devices
  └── Detects device capabilities
  └── Degrades gracefully if unsupported
```

### Allowed Motion Techniques

#### ✅ CSS Background Motion

**What**: Animated gradients, subtle parallax backgrounds

**Implementation**:
```css
/* Subtle gradient animation */
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hero-background {
  background: linear-gradient(135deg, #0E0E0E 0%, #1a1a1a 100%);
  background-size: 200% 200%;
  animation: gradient-shift 20s ease infinite;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .hero-background {
    animation: none;
  }
}
```

**Performance Impact**: Minimal (GPU-accelerated)

**Why Allowed**: 
- Doesn't affect layout
- Doesn't delay content
- Can be disabled with CSS media query
- Works without JavaScript

#### ✅ Canvas Particles (Progressive Enhancement)

**What**: Decorative particle system behind content

**Rules**:
- Must load **after** initial render (doesn't block LCP)
- Must have static fallback (gradient background)
- Must respect `prefers-reduced-motion`
- Must detect device capabilities (disable on low-end devices)
- Must pause when tab is hidden

**Implementation Strategy**:
```typescript
// Load canvas only after:
// 1. Initial render complete
// 2. Device capabilities checked
// 3. Reduced motion preference checked
// 4. Performance budget allows
```

**Performance Impact**: Moderate (CPU-bound, but non-blocking)

**Why Allowed**: 
- Decorative only (doesn't affect content)
- Progressive enhancement (not required)
- Can be disabled conditionally

#### ✅ Hover Effects on CTA (After Initial Render)

**What**: Button hover states, subtle scale/glow

**Rules**:
- Only triggers **after** user interaction
- Uses CSS-only hover (no JavaScript required)
- Non-layout-affecting transforms only

**Implementation**:
```css
.cta-button {
  transition: transform 240ms ease, box-shadow 240ms ease;
}

.cta-button:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3);
}
```

**Performance Impact**: Negligible (only on interaction)

**Why Allowed**: 
- Doesn't affect initial render
- Progressive enhancement
- Improves perceived interactivity

### Forbidden Motion Techniques

#### ❌ Animating H1 or Intro Text

**Why Forbidden**:
- Delays content availability (hurts SEO)
- Can delay LCP (if H1 is LCP element)
- Breaks accessibility (content not immediately readable)

**Correct Approach**: H1 and intro are static. Motion only on background.

#### ❌ Layout-Affecting Animations

**Why Forbidden**:
- Causes CLS (Cumulative Layout Shift)
- Hurts Core Web Vitals scores
- Breaks user experience

**Forbidden Properties**:
- `width`, `height` (use `transform: scale()` instead)
- `margin`, `padding` (use `transform: translate()` instead)
- `top`, `left`, `right`, `bottom` (unless `position: fixed/absolute`)

#### ❌ Animations on LCP Element

**Why Forbidden**:
- Delays LCP metric
- Hurts performance scores
- Breaks SEO rankings

**Rule**: LCP element must be static. Verify LCP element before finalizing any animations.

### Motion Timing Strategy

All motion timing follows the **musical timing system** (from `lib/motion/constants.ts`):

- **Background Motion**: 20s (slow, ambient - doesn't distract)
- **Hover Effects**: 240ms (fast, responsive - `MOTION.HOVER`)
- **Entrance Animations**: None (content is static)
- **Canvas Particles**: 60fps (smooth, but non-blocking)

**Why This Timing**:
- Background motion is slow to avoid distraction
- Hover effects are fast to feel responsive
- No entrance animations to protect SEO/performance
- Canvas runs at 60fps but doesn't block rendering

---

## 4️⃣ STATIC FALLBACK STRATEGY

### Fallback Hierarchy

```
1. Full Experience (JavaScript enabled, capable device)
   └── Canvas particles + CSS gradient + static content

2. Enhanced Experience (JavaScript enabled, reduced motion)
   └── CSS gradient + static content (no canvas)

3. Standard Experience (JavaScript disabled)
   └── CSS gradient + static content (no canvas, no JS)

4. Minimal Experience (Very old browser)
   └── Static gradient + static content
```

### Static Background Fallback

**Always Present**: CSS gradient background

**Implementation**:
```css
.hero-background-static {
  /* Always rendered - no JavaScript required */
  background: linear-gradient(
    135deg,
    #0E0E0E 0%,
    #1a1a1a 50%,
    #0E0E0E 100%
  );
  
  /* Subtle animated version (if motion allowed) */
  @media (prefers-reduced-motion: no-preference) {
    background-size: 200% 200%;
    animation: gradient-shift 20s ease infinite;
  }
}
```

**Why This Works**:
- ✅ Always renders (even without JavaScript)
- ✅ Provides visual interest even without canvas
- ✅ Respects `prefers-reduced-motion`
- ✅ Zero JavaScript overhead

### Canvas Fallback Detection

**Detection Strategy**:

1. **Feature Detection**: Check if canvas is supported
   ```typescript
   if (typeof HTMLCanvasElement === 'undefined') {
     // Fallback to static background
   }
   ```

2. **Performance Detection**: Check device capabilities
   ```typescript
   // Detect low-end devices
   const isLowEndDevice = navigator.hardwareConcurrency <= 2;
   if (isLowEndDevice) {
     // Disable canvas, use CSS-only
   }
   ```

3. **Motion Preference**: Check `prefers-reduced-motion`
   ```typescript
   const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   if (prefersReducedMotion) {
     // Disable canvas, use static background
   }
   ```

### Mobile-Specific Fallbacks

**Mobile Strategy**: Simplified visuals for performance

1. **Disable Canvas on Mobile** (default)
   - Canvas is CPU-intensive
   - Mobile devices have limited resources
   - CSS-only motion is sufficient

2. **Responsive Background**
   - Lighter gradient on mobile (less visual noise)
   - Optimized for smaller screens

3. **Touch-Friendly Interactions**
   - Larger touch targets
   - No hover states (mobile doesn't have hover)

**Implementation**:
```css
/* Mobile: Simplified background */
@media (max-width: 768px) {
  .hero-background {
    /* Simpler gradient, no animation */
    background: linear-gradient(135deg, #0E0E0E 0%, #1a1a1a 100%);
    animation: none; /* Disable animation on mobile */
  }
}
```

---

## 5️⃣ PERFORMANCE & SEO CHECKLIST

### Pre-Development Checklist

Before writing any hero code:

- [ ] **LCP Element Identified**: H1 is confirmed as LCP element
- [ ] **Motion Strategy Decided**: CSS-first, canvas as enhancement
- [ ] **Fallback Strategy Defined**: Static gradient always present
- [ ] **Mobile Strategy Defined**: Simplified visuals for mobile
- [ ] **Accessibility Plan**: `prefers-reduced-motion` handling

### Development Checklist

During development:

- [ ] **H1 is Server-Rendered**: Verified in page source HTML
- [ ] **No Entrance Animations on H1**: Static on first paint
- [ ] **No Layout Shifts**: CLS = 0 (verified in Lighthouse)
- [ ] **Static Fallback Present**: Works with JavaScript disabled
- [ ] **Reduced Motion Respected**: Tested with `prefers-reduced-motion: reduce`
- [ ] **Mobile Performance**: Tested on low-end device (3G network)
- [ ] **Canvas is Non-Blocking**: Loads after initial render

### Performance Metrics Checklist

Before deployment:

- [ ] **LCP < 2.5s**: Verified in Lighthouse
- [ ] **CLS = 0**: No layout shifts (verified in Lighthouse)
- [ ] **FCP < 1.8s**: First Contentful Paint target
- [ ] **TTI < 3.8s**: Time to Interactive (if applicable)
- [ ] **Bundle Size**: Hero-related JS < 50KB (gzipped)
- [ ] **Mobile Lighthouse Score**: > 90 (all categories)

### SEO Checklist

- [ ] **H1 in Initial HTML**: Verified in page source
- [ ] **H1 is Unique**: Only one H1 per page
- [ ] **H1 Contains Keywords**: Relevant to page content
- [ ] **Intro Paragraph Visible**: Immediately readable (no animation delay)
- [ ] **CTA Visible**: Immediately clickable (no animation delay)
- [ ] **Structured Data**: Correctly implemented (if applicable)
- [ ] **Meta Description**: Uses intro paragraph content

### Accessibility Checklist

- [ ] **Reduced Motion**: All animations respect `prefers-reduced-motion`
- [ ] **Keyboard Navigation**: CTA is keyboard accessible
- [ ] **Screen Reader**: H1 and intro are properly announced
- [ ] **Color Contrast**: WCAG AA minimum (4.5:1 for text)
- [ ] **Focus Indicators**: Visible focus states on interactive elements
- [ ] **No-JS Experience**: Full functionality without JavaScript

### Mobile-Specific Checklist

- [ ] **Touch Targets**: CTA button ≥ 44x44px
- [ ] **Viewport Meta**: Correctly configured
- [ ] **Font Size**: Readable on mobile (≥ 16px base)
- [ ] **Canvas Disabled**: Or simplified for mobile
- [ ] **Performance**: Loads quickly on 3G network
- [ ] **Layout**: No horizontal scrolling

---

## 6️⃣ MINIMAL EXAMPLE STRUCTURE

### File Structure

```
components/
  sections/
    HeroSection.tsx          # Server Component (wrapper)
    HeroBackground.tsx       # Server Component (static CSS)
    HeroMotion.tsx          # Client Component (decorative)
    HeroContent.tsx         # Server Component (static text)
```

### Component Implementation (Minimal Example)

#### `HeroSection.tsx` (Server Component - Wrapper)

```typescript
import { HeroBackground } from './HeroBackground';
import { HeroContent } from './HeroContent';
import { HeroMotion } from './HeroMotion';

/**
 * Hero Section - Server Component Wrapper
 * 
 * Architecture: Three-layer system
 * 1. Static background (CSS gradient)
 * 2. Decorative motion (client-side, non-blocking)
 * 3. Static content (H1, intro, CTA)
 */
export function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Layer 1: Static Background (always present) */}
      <HeroBackground />
      
      {/* Layer 2: Decorative Motion (progressive enhancement) */}
      <HeroMotion />
      
      {/* Layer 3: Static Content (SEO-critical, no animation) */}
      <HeroContent />
    </section>
  );
}
```

#### `HeroBackground.tsx` (Server Component - Static CSS)

```typescript
/**
 * Hero Background - Server Component
 * 
 * Static CSS gradient background with optional animation.
 * Always renders, even without JavaScript.
 * Respects prefers-reduced-motion via CSS media query.
 */
export function HeroBackground() {
  return (
    <div 
      className="absolute inset-0 hero-background-static"
      aria-hidden="true"
    />
  );
}
```

**CSS (in `globals.css`)**:
```css
.hero-background-static {
  background: linear-gradient(
    135deg,
    #0E0E0E 0%,
    #1a1a1a 50%,
    #0E0E0E 100%
  );
}

/* Optional: Subtle animation if motion is allowed */
@media (prefers-reduced-motion: no-preference) {
  .hero-background-static {
    background-size: 200% 200%;
    animation: gradient-shift 20s ease infinite;
  }
  
  @keyframes gradient-shift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
}
```

#### `HeroContent.tsx` (Server Component - Static Text)

```typescript
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Hero Content - Server Component
 * 
 * CRITICAL: This component contains the LCP element (H1).
 * Must be:
 * - Server-rendered (in initial HTML)
 * - Immediately visible (no animation delay)
 * - Static (no layout shifts)
 * - Accessible (works without JavaScript)
 */
export function HeroContent() {
  return (
    <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
      {/* LCP Element: H1 - MUST BE STATIC */}
      <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold mb-6 text-balance">
        Kontrollü Kaos
      </h1>

      {/* Intro Paragraph - MUST BE STATIC */}
      <p className="text-xl md:text-2xl text-ivory/80 mb-12 max-w-2xl mx-auto">
        Müzik ve görsel sanatların saat gibi hassas ritimle buluştuğu
        yaşayan dijital sanat galerisi.
      </p>

      {/* Primary CTA - MUST BE STATIC */}
      <Button
        asChild
        size="lg"
        className="text-lg px-12 py-6"
      >
        <Link href="/apply">Hemen Başvur</Link>
      </Button>
    </div>
  );
}
```

#### `HeroMotion.tsx` (Client Component - Decorative)

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/lib/motion/hooks';

/**
 * Hero Motion - Client Component (Progressive Enhancement)
 * 
 * Decorative motion layer that:
 * - Loads AFTER initial render (doesn't block LCP)
 * - Respects prefers-reduced-motion
 * - Has static fallback (CSS background)
 * - Can be disabled on low-end devices
 */
export function HeroMotion() {
  const prefersReducedMotion = useReducedMotion();
  const [shouldRenderCanvas, setShouldRenderCanvas] = useState(false);

  useEffect(() => {
    // Only load canvas after initial render
    // Check device capabilities
    // Respect reduced motion
    if (prefersReducedMotion) {
      return;
    }

    // Detect low-end devices
    const isLowEndDevice = navigator.hardwareConcurrency <= 2;
    if (isLowEndDevice) {
      return; // Use CSS-only background
    }

    // Load canvas after hydration
    setShouldRenderCanvas(true);
  }, [prefersReducedMotion]);

  // Don't render canvas if conditions not met
  if (!shouldRenderCanvas || prefersReducedMotion) {
    return null; // Static CSS background will show instead
  }

  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      {/* Canvas or CSS-based particles here */}
      {/* This is decorative only - static background is fallback */}
    </div>
  );
}
```

### Usage in `app/page.tsx`

```typescript
import { HeroSection } from '@/components/sections/HeroSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      {/* Other sections... */}
    </>
  );
}
```

---

## 7️⃣ CRITICAL CONSTRAINTS SUMMARY

### Non-Negotiable Rules

1. **H1 Must Be Static**
   - ❌ No entrance animations
   - ❌ No delayed rendering
   - ❌ No layout shifts
   - ✅ Server-rendered, immediately visible

2. **LCP Protection**
   - ✅ LCP element (H1) must be verified
   - ✅ No animations on LCP element
   - ✅ LCP < 2.5s target

3. **Motion is Decorative Only**
   - ✅ Background motion only
   - ✅ Never affects content layout
   - ✅ Always has static fallback

4. **Accessibility First**
   - ✅ Respects `prefers-reduced-motion`
   - ✅ Works without JavaScript
   - ✅ Keyboard accessible

5. **Mobile Performance**
   - ✅ Simplified visuals on mobile
   - ✅ Canvas disabled or simplified
   - ✅ Fast load on 3G network

---

## 8️⃣ VERIFICATION PROCESS

### Step 1: Development Verification

```bash
# Build and test locally
npm run build
npm start

# Run Lighthouse audit
# Verify LCP element
# Check CLS = 0
# Test with JavaScript disabled
# Test with prefers-reduced-motion
```

### Step 2: Performance Verification

- **Lighthouse Audit**: All categories > 90
- **Web Vitals**: LCP < 2.5s, CLS = 0, FID < 100ms
- **Bundle Size**: Hero JS < 50KB (gzipped)
- **Network**: Test on 3G throttling

### Step 3: Accessibility Verification

- **Keyboard Navigation**: Tab through hero section
- **Screen Reader**: Test with NVDA/JAWS
- **Reduced Motion**: Toggle in OS settings
- **No-JS**: Disable JavaScript, verify functionality

### Step 4: SEO Verification

- **Page Source**: H1 present in HTML
- **Crawler Test**: Google Search Console
- **Structured Data**: Validate with Google's tool
- **Meta Tags**: Verify correct implementation

---

## 9️⃣ NEXT STEPS (Post-Phase 1)

After Phase 1 architecture is approved:

1. **Visual Design** (Phase 2)
   - Typography system
   - Color palette application
   - Spacing and layout
   - Visual hierarchy

2. **Motion Design** (Phase 2)
   - Specific animation details
   - Particle system design
   - Interaction micro-animations
   - Timing refinement

3. **Implementation** (Phase 3)
   - Build components following this architecture
   - Test and verify all checklists
   - Optimize performance
   - Deploy and monitor

---

## ✅ PHASE 1 COMPLETION CRITERIA

This document is complete when:

- [x] Hero architecture is defined (three-layer system)
- [x] LCP element is identified and protected
- [x] Motion strategy is decided and justified
- [x] Static fallback strategy is defined
- [x] Performance & SEO checklist is comprehensive
- [x] Minimal example structure is provided
- [x] All constraints are documented

**Status**: ✅ Phase 1 Complete - Ready for Visual Design (Phase 2)

---

## ⚠️ CURRENT IMPLEMENTATION STATUS

**Note**: The existing hero implementation (`components/sections/HeroSection.tsx`) has a **critical violation** that must be addressed:

**Issue**: `HeroContent` is wrapped in a `motion.div` with entrance animations:
```typescript
// ❌ CURRENT (VIOLATES GUARDRAILS)
<motion.div
  initial={{ opacity: 0, y: 30 }}  // Delays/hides content
  animate={{ opacity: 1, y: 0 }}
>
  <HeroContent />
</motion.div>
```

**Problem**: This delays the H1 visibility, which:
- ❌ Violates SEO guardrails (content not immediately available)
- ❌ Can delay LCP (if H1 is LCP element)
- ❌ Breaks no-JS fallback (requires JavaScript to be visible)

**Fix Required**: Remove entrance animation wrapper. Hero content must be static (as defined in this architecture document). Motion should only be on background layers.

**When to Fix**: During Phase 3 (Implementation), before deployment.

---

**Document Version**: 1.0  
**Last Updated**: Phase 1 - Architecture Definition  
**Next Phase**: Visual Design & Motion Design (following these guardrails)

