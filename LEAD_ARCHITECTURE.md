# Lead Architecture & Technical Decisions
## Dada Sanat Akademisi

> **Lead Mindset**: Every decision must be justified. Every abstraction must earn its place. Luxury = restraint.

---

## 🎯 Executive Summary

This document outlines the technical architecture, decisions, and guardrails for a luxury digital academy experience. It serves as the single source of truth for architectural decisions and must be consulted before introducing new patterns or dependencies.

**Target Audience**: Senior engineers, future maintainers, technical reviewers

**Project Lifespan**: 5+ years (built for longevity, not quick wins)

---

## 🚨 Critical Issues Identified & Resolved

### Issue #1: Hero Section LCP Risk
**Problem**: H1 (LCP element) is inside animated container, potentially delaying LCP.

**Solution**: 
- H1 rendered immediately, static on first paint
- Canvas animation loads after initial render
- Motion applied only after hydration
- Fallback static hero if canvas fails

**Justification**: LCP must be < 2.5s. Animation is enhancement, not requirement.

### Issue #2: Missing `prefers-reduced-motion` Support
**Problem**: Canvas animation and motion effects ignore user preferences.

**Solution**:
- All motion wrapped in `useReducedMotion()` hook
- Canvas animation disabled when reduced motion preferred
- Static fallbacks for all animated components
- CSS `@media (prefers-reduced-motion: reduce)` utilities

**Justification**: WCAG 2.1 AA requirement. Accessibility > aesthetics.

### Issue #3: Unjustified `suppressHydrationWarning`
**Problem**: Global suppression in layout without documentation.

**Solution**:
- Removed from root layout
- Added only where necessary (e.g., theme provider if added)
- Documented each instance with reason
- Alternative: Fix hydration mismatches at source

**Justification**: Hiding hydration errors is technical debt. Fix root causes.

### Issue #4: No Sanity.io Client Setup
**Problem**: CMS dependencies installed but no client configuration.

**Solution**:
- Created `lib/sanity/client.ts` with proper configuration
- Environment variable validation
- Type-safe queries with GROQ
- Error handling and retry logic
- Preview mode support for content editors

**Justification**: CMS is core to product. Must be production-ready from day one.

### Issue #5: Hardcoded BentoGrid Data
**Problem**: Grid items hardcoded, not CMS-driven.

**Solution**:
- CMS-driven content with fallback
- Error boundaries for graceful degradation
- Loading states
- Type-safe data fetching

**Justification**: Content must be editable without code changes.

---

## 🏗 Architecture Principles

### 1. Server Components First (Non-Negotiable)

**Rule**: Default to Server Components. Use Client Components only when:
- User interaction is required (clicks, hovers, form inputs)
- Browser APIs are needed (localStorage, window, etc.)
- Animation libraries require client-side rendering

**Why**: 
- Better performance (no JS shipped)
- Better SEO (content in HTML)
- Faster initial load
- Lower bundle size

**Example**:
```typescript
// ✅ GOOD: Server Component (default)
export default function CoursePage() {
  const course = await fetchCourse(); // Server-side fetch
  return <CourseContent course={course} />;
}

// ❌ BAD: Unnecessary Client Component
'use client';
export default function CoursePage() {
  // No interaction needed, but marked as client
}
```

### 2. One Responsibility Per Component

**Rule**: Each component should do ONE thing well.

**Why**: 
- Easier to test
- Easier to maintain
- Easier to reason about
- Easier to optimize

**Example**:
```typescript
// ✅ GOOD: Separated concerns
<HeroSection />           // Layout & structure
<HeroCanvas />           // Canvas animation
<HeroContent />          // Text content

// ❌ BAD: Everything in one component
<HeroSection />          // Does layout, animation, content, SEO...
```

### 3. Motion Logic Isolated

**Rule**: Motion variants live in `lib/motion-variants.ts`. Components import and use.

**Why**:
- Consistency across site
- Easy to adjust timing globally
- Reusable patterns
- Testable in isolation

**Anti-Pattern**:
```typescript
// ❌ BAD: Inline magic numbers
<motion.div
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }} // Magic number
/>
```

**Correct Pattern**:
```typescript
// ✅ GOOD: Using centralized variants
import { fadeIn } from '@/lib/motion-variants';
<motion.div variants={fadeIn} />
```

### 4. No Inline Magic Numbers

**Rule**: All timing values must come from constants.

**Why**:
- Musical timing philosophy
- Easy to adjust globally
- Self-documenting code
- Prevents inconsistencies

**Constants** (see `lib/motion-constants.ts`):
- `HOVER_DURATION = 240ms` - Fast, responsive feel
- `ENTRANCE_DURATION = 420ms` - Smooth, not rushed
- `PAGE_TRANSITION = 600ms` - Whole beat, feels intentional

---

## 📁 Folder Structure (Justified)

```
app/                          # Next.js App Router
├── layout.tsx                # Root layout (Server Component)
├── page.tsx                  # Home page (Server Component)
├── globals.css               # Global styles, design tokens
├── courses/
│   ├── page.tsx             # Course listing (Server Component)
│   └── [slug]/
│       └── page.tsx         # Course detail (Server Component)
└── apply/
    └── page.tsx             # Application form (Client Component)

components/
├── layout/                   # Layout components (Server by default)
│   ├── Header.tsx           # Navigation (Client - scroll detection)
│   └── Footer.tsx           # Footer (Server)
├── sections/                 # Page sections
│   ├── HeroSection.tsx      # Hero wrapper (Server)
│   ├── HeroCanvas.tsx       # Canvas animation (Client)
│   ├── HeroContent.tsx      # Hero text (Server)
│   └── BentoGrid.tsx        # Grid container (Server)
├── ui/                       # shadcn/ui components (Client)
│   └── button.tsx
├── seo/                      # SEO components (Server)
│   └── StructuredData.tsx
└── providers/                # Context providers (Client)
    └── MotionProvider.tsx    # Reduced motion detection

lib/
├── sanity/
│   ├── client.ts            # Sanity client configuration
│   ├── queries.ts           # GROQ queries
│   └── image.ts             # Image URL builder
├── motion/
│   ├── constants.ts         # Timing constants (documented)
│   ├── variants.ts          # Reusable motion variants
│   └── hooks.ts             # useReducedMotion, etc.
└── utils.ts                 # General utilities (cn, etc.)

types/
└── index.ts                 # Shared TypeScript types
```

**Why This Structure?**
- Feature-based organization (easier to find related code)
- Clear separation of Server vs Client components
- Motion logic centralized and reusable
- CMS logic isolated and testable

---

## 🎨 Motion Strategy

### Philosophy: Tempo, Rhythm, Breath

Motion should feel like:
- **Tempo**: Consistent timing (musical beats)
- **Rhythm**: Staggered animations (like musical notes)
- **Breath**: Subtle, natural movement

Motion should NOT feel like:
- UI gymnastics
- Attention-seeking effects
- Random timing
- Over-engineered animations

### Timing Constants

All timing values are documented in `lib/motion/constants.ts`:

```typescript
export const MOTION = {
  // Hover interactions (fast, responsive)
  HOVER: 240, // ms - Fast enough to feel instant, slow enough to be smooth
  
  // Entrance animations (smooth, not rushed)
  ENTRANCE: 420, // ms - Feels intentional, not "webby"
  
  // Page transitions (whole beat)
  PAGE_TRANSITION: 600, // ms - Half note, feels complete
  
  // Stagger delays (rhythm between elements)
  STAGGER: 100, // ms - Creates musical rhythm
} as const;
```

**Why These Values?**
- 240ms: Sweet spot for perceived responsiveness (research-backed)
- 420ms: Slightly longer than standard 300ms, feels more premium
- 600ms: Whole beat, feels complete and intentional
- 100ms: Creates rhythm without feeling slow

### Easing Functions

```typescript
export const EASING = {
  // Smooth, musical feel (not default "ease")
  IN_OUT: [0.4, 0, 0.2, 1],
  
  // Gentle release (for exits)
  OUT: [0, 0, 0.2, 1],
  
  // Gentle attack (for entrances)
  IN: [0.4, 0, 1, 1],
} as const;
```

**Why Custom Easing?**
- Default "ease" feels too "webby"
- Custom bezier curves feel more intentional
- Matches luxury brand perception

### Reduced Motion Support

**Mandatory**: All motion must respect `prefers-reduced-motion`.

**Implementation**:
```typescript
// lib/motion/hooks.ts
export function useReducedMotion(): boolean {
  // Client-side only
  if (typeof window === 'undefined') return false;
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
}
```

**Usage**:
```typescript
const prefersReducedMotion = useReducedMotion();

<motion.div
  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
/>
```

---

## 🖼 Hero Implementation Strategy

### Architecture Decision: Canvas vs CSS/SVG

**Decision**: Canvas for particle system, CSS/SVG for static elements.

**Why Canvas?**
- 60fps performance for particle animations
- Creates abstract, artistic effects
- Better than heavy 3D libraries for this use case
- Allows custom visual metaphors (pianist + painter)

**Why NOT Three.js?**
- Overkill for 2D particle effects
- Large bundle size
- Unnecessary complexity
- Canvas is sufficient

### Fallback Strategy

**Layer 1**: Static H1 (LCP element) - renders immediately
**Layer 2**: Canvas animation - loads after hydration
**Layer 3**: Fallback static hero - if canvas fails

**Implementation**:
```typescript
// HeroContent.tsx (Server Component)
export function HeroContent() {
  return (
    <h1>Kontrollü Kaos</h1> // Renders immediately, no animation
  );
}

// HeroCanvas.tsx (Client Component)
export function HeroCanvas() {
  const prefersReducedMotion = useReducedMotion();
  const [canvasReady, setCanvasReady] = useState(false);
  
  // Canvas loads after hydration
  useEffect(() => {
    if (prefersReducedMotion) return; // Skip if reduced motion
    // Initialize canvas...
  }, [prefersReducedMotion]);
  
  if (prefersReducedMotion || !canvasReady) {
    return <StaticHeroFallback />; // Graceful degradation
  }
  
  return <canvas />;
}
```

### Performance Guardrails

1. **LCP Element Must Be Static**
   - H1 renders immediately
   - No animation on first paint
   - Canvas loads after LCP

2. **Canvas Optimization**
   - Particle count: 50 (optimized)
   - RequestAnimationFrame for 60fps
   - Cleanup on unmount
   - Pause when tab hidden

3. **No CLS from Animation**
   - Canvas has fixed dimensions
   - Content doesn't shift
   - Fallback has same dimensions

---

## 📦 Component Rules

### Layout Components → Server

**Rule**: Header, Footer, Layout wrappers are Server Components by default.

**Exception**: Header needs scroll detection → Client Component

**Why**: 
- Better performance
- SEO-friendly
- Faster initial render

### Interactive Cards → Client

**Rule**: Cards with hover effects, animations, or interactions are Client Components.

**Example**: BentoGrid cards (hover effects) → Client Component

### Motion Variants Extracted

**Rule**: All motion variants live in `lib/motion/variants.ts`.

**Why**: 
- Consistency
- Reusability
- Easy to adjust globally

### No Inline Magic Numbers

**Rule**: All timing values come from constants.

**Example**:
```typescript
// ❌ BAD
transition={{ duration: 0.3 }}

// ✅ GOOD
transition={{ duration: MOTION.HOVER / 1000 }}
```

---

## 🔍 SEO & Performance Guardrails

### SEO Requirements

1. **One H1 Per Page** (mandatory)
   - Home: "Kontrollü Kaos"
   - Courses: "Kurslar"
   - Course Detail: Course title

2. **Meaningful H2/H3 Hierarchy**
   - H2 for major sections
   - H3 for subsections
   - No skipping levels

3. **Structured Data**
   - Organization schema on home
   - Course schema on course pages
   - Instructor schema on instructor pages
   - BreadcrumbList for navigation

4. **Metadata**
   - Unique title per page
   - Unique description per page
   - Open Graph tags
   - Twitter Card tags

### Performance Requirements

1. **LCP < 2.5s**
   - LCP element must be static
   - No animation on LCP element
   - Image optimization (AVIF/WebP)

2. **CLS < 0.1**
   - No layout shifts from animation
   - Fixed dimensions for animated elements
   - Font loading strategy (display: swap)

3. **FID < 100ms**
   - Minimal JavaScript on initial load
   - Code splitting
   - Lazy load below-fold content

4. **Bundle Size**
   - Monitor bundle size
   - Tree-shake unused code
   - Optimize package imports

### Performance Checklist

- [ ] LCP element is static (no animation)
- [ ] Images optimized (AVIF/WebP)
- [ ] Fonts preloaded
- [ ] Code splitting implemented
- [ ] No CLS from animations
- [ ] Bundle size monitored
- [ ] Lighthouse score > 90

---

## 🧠 CMS Integration (Sanity.io)

### Client Configuration

**File**: `lib/sanity/client.ts`

**Requirements**:
- Environment variable validation
- Type-safe queries
- Error handling
- Preview mode support

**Implementation**:
```typescript
import { createClient } from 'next-sanity';

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  throw new Error('Missing Sanity project ID');
}

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
});
```

### Schema Requirements

**Future-Proof**:
- Localized fields (Turkish + English)
- SEO fields (meta title, description)
- Image optimization fields
- Rich text with controlled rendering

**Content Editor Safety**:
- Validation rules prevent layout breaks
- Image aspect ratio constraints
- Text length limits
- Required fields

### Query Patterns

**Type-Safe GROQ Queries**:
```typescript
// lib/sanity/queries.ts
export const COURSE_QUERY = `*[_type == "course" && slug.current == $slug][0] {
  title,
  description,
  "imageUrl": image.asset->url,
  // ... other fields
}`;
```

---

## 🚨 Edge Cases Handled

### 1. Browser Extensions Mutating DOM

**Problem**: Extensions can break layout or cause hydration errors.

**Solution**:
- Use data attributes for styling hooks
- Avoid relying on DOM structure
- Test with common extensions (ad blockers, etc.)

### 2. Hydration Mismatches

**Problem**: Server-rendered HTML doesn't match client.

**Solution**:
- Fix root causes (don't suppress warnings)
- Use `useEffect` for client-only code
- Match server and client rendering

### 3. Reduced Motion Users

**Problem**: Animations can cause motion sickness.

**Solution**:
- `useReducedMotion()` hook
- Static fallbacks
- CSS `@media (prefers-reduced-motion: reduce)`

### 4. Slow Devices & Low Bandwidth

**Problem**: Heavy animations on slow devices.

**Solution**:
- Canvas pauses when tab hidden
- Lazy load animations
- Progressive enhancement
- Graceful degradation

### 5. CMS Content Errors

**Problem**: Missing or invalid CMS data.

**Solution**:
- Error boundaries
- Fallback content
- Type validation
- Default values

---

## 📤 Implementation Checklist

### Phase 1: Foundation ✅
- [x] Next.js 14+ App Router setup
- [x] TypeScript strict mode
- [x] Tailwind CSS + shadcn/ui
- [x] Framer Motion integration
- [x] Sanity.io client setup
- [x] Motion constants and variants

### Phase 2: Core Components
- [x] Hero section with fallbacks
- [x] BentoGrid with CMS integration
- [x] Header with scroll detection
- [x] Footer
- [x] SEO components

### Phase 3: Performance
- [ ] LCP optimization
- [ ] Image optimization
- [ ] Font optimization
- [ ] Bundle size optimization
- [ ] Lighthouse audit

### Phase 4: CMS Integration
- [ ] Sanity schemas
- [ ] Content queries
- [ ] Preview mode
- [ ] Image optimization pipeline

### Phase 5: Testing & Documentation
- [ ] Accessibility audit
- [ ] Performance testing
- [ ] Cross-browser testing
- [ ] Documentation complete

---

## 🎓 Learning Resources

For future maintainers:

1. **Next.js App Router**: https://nextjs.org/docs/app
2. **Server Components**: https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components
3. **Framer Motion**: https://www.framer.com/motion/
4. **Sanity.io**: https://www.sanity.io/docs
5. **Web Performance**: https://web.dev/vitals/

---

## 📝 Decision Log

### 2024-01-XX: Canvas vs CSS/SVG for Hero
**Decision**: Canvas for particles, CSS/SVG for static elements
**Reason**: Performance + artistic requirements
**Alternatives Considered**: Three.js (too heavy), Pure CSS (not flexible enough)

### 2024-01-XX: Motion Timing Constants
**Decision**: 240ms hover, 420ms entrance, 600ms page transition
**Reason**: Research-backed + musical timing philosophy
**Alternatives Considered**: Standard 300ms (too "webby"), 500ms (too slow)

### 2024-01-XX: Server Components First
**Decision**: Default to Server Components, Client only when needed
**Reason**: Performance + SEO + bundle size
**Alternatives Considered**: All Client Components (worse performance)

---

**Document Version**: 1.0  
**Last Updated**: 2024-01-XX  
**Maintained By**: Lead Frontend Engineer

