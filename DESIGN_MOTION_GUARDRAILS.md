# 🎨 Design & Motion Guardrails
## Technical Contract for Dada Sanat Akademisi

**Project**: Dada Sanat Akademisi  
**Domain**: dadasanatakademisi.com  
**Architecture**: Next.js 14 App Router + SSG + Sanity CMS  
**Status**: Pre-Design Phase — **DO NOT PROCEED WITH VISUALS UNTIL THESE RULES ARE UNDERSTOOD**

---

## ⚠️ CRITICAL: This Document is Non-Negotiable

This document defines **strict boundaries** that design and motion work **MUST** respect. If a design idea violates these rules, it **MUST** be rejected or redesigned.

**Why these rules exist:**
- Protect SEO rankings and crawlability
- Maintain Core Web Vitals (LCP, CLS, FID)
- Ensure accessibility and inclusive design
- Prevent overengineering and technical debt
- Guarantee production stability on Hostinger hosting

**Who must follow this:**
- Designers (visual and motion)
- Frontend developers
- Content editors (indirectly, through CMS constraints)
- Future maintainers

---

## 1️⃣ STATIC-FIRST GUARANTEE (NON-NEGOTIABLE)

### Core Principle

**This site is a STATIC site. All primary pages are pre-rendered at build time.**

### What This Means

#### Fully Static Pages (Build-Time Rendering)

These pages are **completely static** and must remain so:

- **Homepage** (`/`) — Pre-rendered with all content
- **Course Listing** (`/courses`) — Pre-rendered with all courses
- **Course Detail** (`/courses/[slug]`) — Pre-rendered per course
- **Application Page** (`/apply`) — Pre-rendered form structure
- **Blog Articles** (`/blog/[slug]`) — Pre-rendered per article

**How they work:**
- Content is fetched from Sanity CMS **only at build time**
- HTML is generated during `next build`
- No runtime data fetching for SEO-critical content
- JavaScript is **enhancement only**, not a requirement

#### Client-Side Components (Allowed, with Restrictions)

These components **may** be client-side (`'use client'`), but only for:

- **Decorative animations** (canvas, particles, backgrounds)
- **Interactive UI elements** (hover states, form validation)
- **Progressive enhancement** (smooth scrolling, lazy loading)

**Rules for client components:**
- Must have static fallbacks
- Must not block initial render
- Must not affect SEO-critical content
- Must respect `prefers-reduced-motion`

#### Why This Architecture

**SEO Benefits:**
- Search engines receive complete HTML immediately
- No JavaScript required for content discovery
- Faster initial page load (no API calls)
- Better crawlability and indexing

**Hosting Benefits:**
- Works on any static hosting (Hostinger shared/VPS)
- No server-side rendering overhead
- Lower hosting costs
- Better reliability (no runtime failures)

**Performance Benefits:**
- Instant page loads (pre-rendered HTML)
- Better Core Web Vitals scores
- Works on slow networks/devices
- Graceful degradation if JavaScript fails

### Implementation Rules

1. **Do not use `useEffect` for SEO-critical content fetching**
   - ❌ Bad: Fetching course data in `useEffect`
   - ✅ Good: Fetching course data in `async` page component

2. **Use Next.js `<Link>` for navigation (SEO-safe client-side routing)**
   - ❌ Bad: Custom client-side navigation that breaks without JS
   - ✅ Good: Next.js `<Link>` components (progressive enhancement, pre-rendered HTML)
   - **Note:** Next.js `<Link>` is allowed and SEO-safe—it pre-renders pages and enhances with client-side navigation when JavaScript is available.

3. **Do not hide content behind JavaScript**
   - ❌ Bad: Content only visible after JS loads
   - ✅ Good: All content in initial HTML, JS enhances it

---

## 2️⃣ SEO IMMUTABLE ZONES

### Definition

**SEO Immutable Zones** are areas of the page that:
- Must not be animated (entrance animations, delayed rendering)
- Must not shift layout (no CLS-causing changes)
- Must be **immediately available** to crawlers
- Must be **readable without JavaScript**

### Protected Zones

#### 1. H1 Heading (Primary Page Title)

**Location**: First `<h1>` on every page

**Rules:**
- ❌ **FORBIDDEN**: Fade-in, slide-in, or any entrance animation
- ❌ **FORBIDDEN**: Layout shifts (position changes, size changes)
- ❌ **FORBIDDEN**: Delayed rendering (must be in initial HTML)
- ✅ **ALLOWED**: Static styling (color, font, spacing)
- ✅ **ALLOWED**: Decorative elements around it (not affecting layout)

**Why:**
- H1 is the primary SEO signal for page topic
- Search engines use H1 for rich snippets
- Layout shifts hurt CLS (Cumulative Layout Shift)
- Delayed rendering hurts LCP (Largest Contentful Paint)

**Example (Homepage):**
```html
<!-- ✅ CORRECT: H1 is static, immediately available -->
<h1>Dada Sanat Akademisi</h1>

<!-- ❌ WRONG: H1 animates in -->
<h1 className="animate-fade-in">Dada Sanat Akademisi</h1>
```

#### 2. Intro Paragraph (First Text Block)

**Location**: First paragraph after H1 (or in hero section)

**Rules:**
- ❌ **FORBIDDEN**: Text animations (typewriter, fade-in, slide)
- ❌ **FORBIDDEN**: Layout shifts
- ❌ **FORBIDDEN**: Delayed rendering
- ✅ **ALLOWED**: Static styling
- ✅ **ALLOWED**: Background visuals (behind text, not affecting layout)

**Why:**
- Intro paragraph is used for meta descriptions
- Search engines extract key information from first paragraph
- Text animations delay content availability
- Layout shifts hurt user experience and SEO

#### 3. Primary CTA (Call-to-Action Button/Link)

**Location**: Main conversion element (e.g., "Apply Now", "View Courses")

**Rules:**
- ❌ **FORBIDDEN**: Entrance animations that delay visibility
- ❌ **FORBIDDEN**: Layout shifts
- ❌ **FORBIDDEN**: Hidden until animation completes
- ✅ **ALLOWED**: Hover states (after initial render)
- ✅ **ALLOWED**: Static styling
- ✅ **ALLOWED**: Subtle pulse/glow (non-layout-affecting)

**Why:**
- CTA must be immediately visible for conversion
- Hidden CTAs reduce conversion rates
- Layout shifts hurt CLS
- Delayed CTAs hurt user experience

#### 4. Above-the-Fold Textual Content

**Location**: All text visible without scrolling on desktop (first 600-800px)

**Rules:**
- ❌ **FORBIDDEN**: Any animation that delays text rendering
- ❌ **FORBIDDEN**: Layout shifts
- ❌ **FORBIDDEN**: Content that requires JavaScript to appear
- ✅ **ALLOWED**: Background visuals (canvas, gradients, images)
- ✅ **ALLOWED**: Static decorative elements

**Why:**
- Above-the-fold content is critical for SEO
- Search engines prioritize visible content
- Users expect immediate content availability
- Layout shifts hurt Core Web Vitals

### Design Workarounds

**How to make design feel premium without breaking SEO:**

1. **Animate backgrounds, not content**
   - ✅ Animate canvas/particles behind text
   - ❌ Animate text itself

2. **Use static decorative elements**
   - ✅ Static gradients, shapes, images
   - ❌ Animated text, shifting layouts

3. **Animate below the fold**
   - ✅ Entrance animations for content below initial viewport
   - ❌ Entrance animations for above-the-fold content

4. **Use CSS transforms (non-layout-affecting)**
   - ✅ `opacity`, `transform: translate/scale/rotate`
   - ❌ `width`, `height`, `margin`, `padding` (causes layout shifts)

---

## 3️⃣ MOTION PERMISSION MATRIX

### Allowed Motion (Design Guardrail)

#### ✅ Decorative Background Motion

**What:** Canvas animations, particle systems, gradient animations

**Rules:**
- Must be behind content (z-index lower than text)
- Must not affect layout
- Must respect `prefers-reduced-motion`
- Must have static fallback

**Examples:**
- Particle systems in hero background
- Animated gradients
- Canvas-based visual effects
- Parallax backgrounds (subtle, non-layout-shifting)

**CSS Properties Allowed:**
- `opacity` (fade in/out)
- `transform: translate()`, `transform: scale()`, `transform: rotate()`
- `background-position` (for parallax)
- `filter: blur()`, `filter: brightness()` (non-layout-affecting)

#### ✅ Hover Interactions

**What:** Interactive states on buttons, links, cards

**Rules:**
- Must not cause layout shifts
- Must be instant (no delay)
- Must work without JavaScript (CSS-only preferred)

**Examples:**
- Button hover states (color, scale)
- Card hover effects (lift, shadow)
- Link underline animations

**CSS Properties Allowed:**
- `transform: translateY()`, `transform: scale()`
- `box-shadow` changes
- `color`, `background-color` transitions
- `opacity` changes

#### ✅ Entrance Animations Below the Fold

**What:** Content that appears as user scrolls

**Rules:**
- Must not affect initial page load
- Must respect `prefers-reduced-motion`
- Must use `IntersectionObserver` (not time-based)

**Examples:**
- Fade-in on scroll for course cards
- Slide-in animations for sections
- Stagger animations for lists

**CSS Properties Allowed:**
- `opacity` (0 to 1)
- `transform: translateY()` (subtle, < 50px)
- `transform: scale()` (subtle, 0.95 to 1)

#### ✅ Non-Layout-Affecting Transforms

**What:** Animations that don't cause reflow

**Rules:**
- Must use `transform` or `opacity` only
- Must not change `width`, `height`, `margin`, `padding`
- Must use `will-change` sparingly (performance)

**CSS Properties Allowed:**
- `transform: translate()`, `transform: scale()`, `transform: rotate()`
- `opacity`
- `filter` (blur, brightness, contrast)

### Forbidden Motion (Design Guardrail)

#### ❌ Layout Shifts

**What:** Any animation that changes element dimensions or position in document flow

**Why Forbidden:**
- Hurts CLS (Cumulative Layout Shift) — Core Web Vital
- Breaks user experience (content jumps)
- Hurts SEO rankings

**CSS Properties Forbidden:**
- `width`, `height` (use `transform: scale()` instead)
- `margin`, `padding` (use `transform: translate()` instead)
- `top`, `left`, `right`, `bottom` (unless `position: fixed/absolute` with no layout impact)
- `font-size` (causes text reflow)

**Examples:**
- ❌ Expanding/collapsing sections (use `max-height` with `transform` instead)
- ❌ Animating width/height directly
- ❌ Margin/padding animations

#### ❌ Content Reflow

**What:** Any animation that causes text or content to reflow

**Why Forbidden:**
- Hurts readability
- Hurts CLS
- Breaks user experience

**Examples:**
- ❌ Text that changes size during animation
- ❌ Content that shifts position in document flow
- ❌ Images that change aspect ratio

#### ❌ Animations on LCP Element

**What:** Animating the Largest Contentful Paint element

**Why Forbidden:**
- Delays LCP (Largest Contentful Paint) — Core Web Vital
- Hurts performance scores
- Hurts SEO rankings

**Important:** LCP element must be **measured and verified** using Lighthouse or Web Vitals tools. Do not assume which element becomes LCP—it varies by page, device, and viewport.

**LCP Element is Typically:**
- Hero image
- Hero heading (H1)
- Hero text block

**Rules:**
- LCP element must be static (no entrance animations, no delayed rendering)
- No animations on the verified LCP element
- Background visuals are OK (if they don't delay LCP)
- **Verify LCP element** in Lighthouse before finalizing design

#### ❌ Motion That Hides or Delays Text

**What:** Any animation that prevents text from being immediately readable

**Why Forbidden:**
- Hurts SEO (content not immediately available)
- Hurts accessibility
- Hurts user experience

**Examples:**
- ❌ Text that fades in (delays availability)
- ❌ Text that slides in (delays availability)
- ❌ Text that requires animation to complete before being readable
- ❌ Text hidden behind animated overlays

### Motion Implementation Rules

1. **Always use `prefers-reduced-motion`**
   ```css
   @media (prefers-reduced-motion: reduce) {
     * {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```

2. **Use `will-change` sparingly**
   - Only for elements that will definitely animate
   - Remove `will-change` after animation completes
   - Don't use on many elements (performance cost)

3. **Prefer CSS animations over JavaScript**
   - CSS animations are more performant
   - Use JavaScript only for complex interactions
   - Use `requestAnimationFrame` for JavaScript animations

4. **Test on slow devices**
   - Animations must work on low-end devices
   - Reduce complexity on mobile
   - Consider disabling animations on very slow devices

---

## 4️⃣ HERO SECTION — DESIGN CONSTRAINTS

### Core Requirements

The hero section is the **most critical** part of the page. It must balance:
- Premium visual appeal
- SEO performance
- Accessibility
- Performance

### Constraint 1: Text Must Be Readable Without JavaScript

**Rule:** All hero text (H1, intro paragraph, CTA) must be:
- In initial HTML (server-rendered)
- Immediately visible (no animation delay)
- Readable with JavaScript disabled

**Implementation:**
```tsx
// ✅ CORRECT: Text is static, immediately available
export default function HomePage() {
  return (
    <section className="hero">
      <h1>Dada Sanat Akademisi</h1>
      <p>Intro paragraph text...</p>
      <a href="/apply">Apply Now</a>
      <HeroCanvas /> {/* Decorative, non-blocking */}
    </section>
  );
}

// ❌ WRONG: Text requires JavaScript to appear
export default function HomePage() {
  const [showText, setShowText] = useState(false);
  useEffect(() => setShowText(true), []);
  return showText ? <h1>Text</h1> : null;
}
```

### Constraint 2: Background Visuals Must Degrade Gracefully

**Rule:** Any canvas, WebGL, or advanced visual effect must:
- Have a static fallback (gradient, image, solid color)
- Not block initial render
- Not delay LCP
- Respect `prefers-reduced-motion`

**Implementation:**
```tsx
// ✅ CORRECT: Static fallback, canvas is enhancement
export function HeroSection() {
  return (
    <div className="hero-container">
      {/* Static fallback background */}
      <div className="hero-background-static" />
      
      {/* Canvas enhancement (client component) */}
      <HeroCanvas />
      
      {/* Text content (static, always visible) */}
      <div className="hero-content">
        <h1>Dada Sanat Akademisi</h1>
      </div>
    </div>
  );
}
```

### Constraint 3: Mobile Experience is Priority

**Rule:** Hero section must:
- Load fast on mobile (3G networks)
- Work on low-end devices
- Not require heavy JavaScript
- Be touch-friendly

**Implementation:**
- Disable canvas on mobile (or use simplified version)
- Reduce image sizes for mobile
- Minimize JavaScript for hero
- Test on real devices (not just desktop)

### Constraint 4: Premium Feel Without Breaking Performance

**How to achieve premium feel:**

1. **Static Visuals**
   - High-quality images (optimized, WebP/AVIF)
   - Subtle gradients
   - Static decorative elements

2. **Subtle Motion (Non-Blocking)**
   - Canvas particles (behind text, non-blocking)
   - Parallax backgrounds (subtle, CSS-only)
   - Hover interactions (after initial render)

3. **Typography & Spacing**
   - Premium fonts (already loaded: Inter, Playfair Display)
   - Generous spacing
   - Careful color contrast

4. **Progressive Enhancement**
   - Static base (works without JS)
   - Enhanced with JavaScript (if available)
   - Graceful degradation (if JS fails)

### What Happens If Motion Is Disabled

**Scenarios:**
1. **User has `prefers-reduced-motion` enabled**
   - All animations disabled
   - Static fallbacks shown
   - Site remains fully functional

2. **JavaScript is disabled**
   - Canvas/WebGL effects don't load
   - Static fallbacks shown
   - All content remains readable

3. **Slow device/network**
   - Heavy animations skipped
   - Simplified visuals shown
   - Site remains functional

**Design must account for all scenarios.**

---

## 5️⃣ CMS & DESIGN INTERACTION RULES

### Core Principle

**Design must remain stable regardless of content length or editor input.**

### Rule 1: No Design Dependent on Exact Text Length

**Problem:** Design that breaks if text is too long or too short

**Examples:**
- ❌ Fixed-height cards that overflow
- ❌ Text that must be exactly 50 characters
- ❌ Layouts that break with long words

**Solution:**
- ✅ Flexible containers (min-height, not fixed height)
- ✅ Text truncation with ellipsis (CSS `text-overflow`)
- ✅ Responsive typography (scales with content)
- ✅ Overflow handling (scroll, wrap, truncate)

**Implementation:**
```css
/* ✅ CORRECT: Flexible, handles any content length */
.card {
  min-height: 200px; /* Not fixed height */
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ❌ WRONG: Fixed height breaks with long content */
.card {
  height: 200px; /* Fixed, breaks if content is longer */
}
```

### Rule 2: No Fixed Heights for CMS-Driven Blocks

**Problem:** Fixed heights cause layout breaks when content varies

**Solution:**
- ✅ Use `min-height` (allows growth)
- ✅ Use flexbox/grid (natural sizing)
- ✅ Use `aspect-ratio` for images (maintains proportions)

**Implementation:**
```css
/* ✅ CORRECT: Flexible height */
.cms-content-block {
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

/* ❌ WRONG: Fixed height breaks */
.cms-content-block {
  height: 300px; /* Breaks if content is longer */
}
```

### Rule 3: All Rich Content is Constrained and Styled

**Problem:** CMS editors can add content that breaks layout

**Solution:**
- ✅ Constrain rich text rendering (max-width, typography)
- ✅ Style all CMS content types (headings, lists, images)
- ✅ Validate content in CMS schema (max length, required fields)
- ✅ Provide editor guidelines (content length recommendations)

**Implementation:**
```css
/* ✅ CORRECT: Constrained rich text */
.cms-rich-text {
  max-width: 65ch; /* Readable line length */
  line-height: 1.6;
}

.cms-rich-text h2 {
  margin-top: 2em;
  margin-bottom: 1em;
}

.cms-rich-text img {
  max-width: 100%;
  height: auto;
  aspect-ratio: 16/9; /* Maintains proportions */
}
```

### Rule 4: Image Handling

**Problem:** Images from CMS can break layout (wrong size, missing alt text)

**Solution:**
- ✅ Constrain image dimensions (max-width, aspect-ratio)
- ✅ Require alt text in CMS schema
- ✅ Use Next.js Image component (optimization, lazy loading)
- ✅ Provide image size guidelines to editors

**Implementation:**
```tsx
// ✅ CORRECT: Constrained, optimized images
<Image
  src={cmsImageUrl}
  alt={cmsImageAlt} // Required in CMS schema
  width={1200}
  height={675}
  style={{ maxWidth: '100%', height: 'auto' }}
/>
```

### Rule 5: Content Validation in CMS

**Prevent layout breaks at the source:**

- **Text length limits** (e.g., title: 60 chars, description: 160 chars)
- **Required fields** (prevent empty content)
- **Image aspect ratio constraints** (prevent distorted images)
- **Rich text field limits** (prevent extremely long content)

**Example (Sanity Schema):**
```typescript
{
  name: 'title',
  type: 'string',
  validation: (Rule) => Rule.required().max(60), // Prevents long titles
}
```

### How Design Remains Stable

1. **Flexible Layouts**
   - Use CSS Grid/Flexbox (natural sizing)
   - Avoid fixed dimensions
   - Allow content to flow naturally

2. **Constrained Typography**
   - Max-width for readability
   - Responsive font sizes
   - Line-height for readability

3. **Overflow Handling**
   - Text truncation where needed
   - Scroll containers for long content
   - Image constraints (max-width, aspect-ratio)

4. **CMS Validation**
   - Prevent problematic content at source
   - Provide editor guidelines
   - Test with edge cases (very long/short content)

---

## 6️⃣ CONVERSION & UX PRE-CHECK

### Primary Conversion Goal

**Goal:** User applies to the academy (fills out application form)

**Secondary Goals:**
- User views course details
- User browses courses
- User reads blog articles (content marketing)

### User Journey

1. **Landing (Homepage)**
   - User sees value proposition immediately
   - User understands what the academy offers
   - User sees clear path to apply

2. **Course Discovery**
   - User browses courses
   - User views course details
   - User is motivated to apply

3. **Application**
   - User fills out application form
   - User submits application
   - User receives confirmation

### Design Rules for Conversion

#### Rule 1: CTA Must Be Visible Without Scrolling

**Requirement:** Primary CTA (e.g., "Apply Now") must be:
- Visible in initial viewport (above the fold)
- Immediately clickable (no animation delay)
- Clearly styled (stands out, but not obnoxious)

**Implementation:**
- Place CTA in hero section (above the fold)
- Use high contrast (meets WCAG AA)
- Make it large enough to tap (mobile-friendly)
- Test on various screen sizes

#### Rule 2: CTA Must Not Depend on Animation to Be Noticed

**Requirement:** CTA must be:
- Visible immediately (no fade-in, slide-in)
- Styled to stand out (color, size, position)
- Not hidden behind animations

**Why:**
- Users may not wait for animations
- Animations may be disabled
- Immediate visibility increases conversion

**Implementation:**
```tsx
// ✅ CORRECT: CTA is immediately visible
<a href="/apply" className="cta-primary">
  Apply Now
</a>

// ❌ WRONG: CTA requires animation to appear
<a href="/apply" className="cta-primary animate-fade-in">
  Apply Now
</a>
```

#### Rule 3: Design Must Guide Attention Calmly

**Requirement:** Design should:
- Use visual hierarchy (size, color, spacing)
- Guide eye naturally (F-pattern, Z-pattern)
- Not distract with excessive motion
- Focus attention on conversion points

**How:**
- **Visual Hierarchy:** H1 > Intro > CTA (size, contrast)
- **Spacing:** Generous whitespace around CTA
- **Color:** CTA uses accent color (gold), stands out
- **Motion:** Subtle, non-distracting (background only)

**Forbidden:**
- ❌ Excessive animations that distract
- ❌ Competing CTAs (too many calls to action)
- ❌ Motion that draws attention away from CTA

### Secondary Actions

**Secondary CTAs (less prominent):**
- "View Courses" (navigation)
- "Read More" (blog articles)
- "Contact Us" (footer)

**Rules:**
- Less prominent than primary CTA
- Still accessible and clear
- Not competing for attention

### Conversion Principles

1. **Clarity Over Cleverness**
   - Clear value proposition
   - Clear path to conversion
   - No confusing navigation

2. **Speed Over Showmanship**
   - Fast page loads
   - Immediate content availability
   - No delays for animations

3. **Accessibility Over Aesthetics**
   - Accessible to all users
   - Works with assistive technologies
   - Respects user preferences (reduced motion)

4. **Mobile-First**
   - Mobile experience is priority
   - Touch-friendly CTAs
   - Fast on mobile networks

---

## 7️⃣ HOSTING & PRODUCTION LIMITS

### Hosting Constraints

**Assumed Hosting:** Hostinger shared hosting or VPS

**Limitations:**
- Limited server resources (CPU, memory)
- No edge rendering (static site only)
- Limited bandwidth (optimize assets)
- No serverless functions (use static generation)

### Design & Motion Must Be Lightweight

#### Rule 1: Avoid Heavy Libraries

**Forbidden:**
- ❌ Large animation libraries (unless tree-shaken)
- ❌ Heavy JavaScript frameworks
- ❌ Unoptimized images/videos
- ❌ Large font files (already optimized: Inter, Playfair Display)

**Allowed:**
- ✅ Lightweight libraries (Framer Motion — tree-shaken)
- ✅ CSS animations (native, performant)
- ✅ Optimized images (WebP/AVIF, Next.js Image)
- ✅ System fonts as fallbacks

**Current Setup:**
- Framer Motion is tree-shaken (see `next.config.js`)
- Images optimized via Next.js Image component
- Fonts optimized (preload, display: swap)

#### Rule 2: Avoid Unnecessary Client JavaScript

**Forbidden:**
- ❌ JavaScript for content that should be static
- ❌ Heavy client-side computations
- ❌ Unnecessary API calls
- ❌ Unjustified bundle size increases (monitor and justify)

**Allowed:**
- ✅ Progressive enhancement (JS enhances, doesn't replace)
- ✅ Lazy loading (images, below-fold content)
- ✅ Code splitting (route-based, component-based)

**Current Setup:**
- Client components only for interactive elements
- Server components for content (default)
- Code splitting via Next.js App Router

#### Rule 3: Optimize Assets

**Requirements:**
- Images: WebP/AVIF, responsive sizes, lazy loading
- Fonts: Preloaded, subsetted, display: swap
- JavaScript: Minified, tree-shaken, code-split
- CSS: Minified, purged unused styles

**Current Setup:**
- Next.js Image optimization (see `next.config.js`)
- Font optimization (preload, display: swap in `layout.tsx`)
- Bundle optimization (tree-shaking in `next.config.js`)

### Why These Constraints Matter

1. **Performance**
   - Faster page loads
   - Better Core Web Vitals
   - Better SEO rankings

2. **Cost**
   - Lower bandwidth usage
   - Lower server resource usage
   - Lower hosting costs

3. **Reliability**
   - Works on slow networks
   - Works on low-end devices
   - Fewer server failures

4. **User Experience**
   - Faster perceived performance
   - Works for all users
   - Better accessibility

### Production Checklist

Before deploying:
- [ ] Bundle size monitored and justified (track initial load, avoid regressions)
- [ ] Images optimized (WebP/AVIF, responsive)
- [ ] Fonts optimized (preloaded, subsetted)
- [ ] JavaScript minified and tree-shaken
- [ ] CSS purged (no unused styles)
- [ ] Tested on slow 3G network
- [ ] Tested on low-end device
- [ ] Lighthouse score > 90 (all categories)
- [ ] Bundle size regression check (compare against baseline)

---

## 📋 DESIGNER CHECKLIST

**Before starting any design work, verify:**

### Static-First
- [ ] All primary pages are static (pre-rendered)
- [ ] No runtime data fetching for SEO-critical content
- [ ] JavaScript is enhancement only

### SEO Immutable Zones
- [ ] H1 heading is static (no animation)
- [ ] Intro paragraph is static (no animation)
- [ ] Primary CTA is static (no animation)
- [ ] Above-the-fold content is static (no animation)

### Motion Permission
- [ ] No layout shifts (no width/height/margin/padding animations)
- [ ] No content reflow
- [ ] No animations on LCP element
- [ ] No motion that hides/delays text
- [ ] All motion respects `prefers-reduced-motion`

### Hero Section
- [ ] Text is readable without JavaScript
- [ ] Background visuals have static fallback
- [ ] Mobile experience is priority
- [ ] Premium feel without breaking performance

### CMS & Design
- [ ] No design dependent on exact text length
- [ ] No fixed heights for CMS-driven blocks
- [ ] All rich content is constrained and styled
- [ ] Images are constrained (max-width, aspect-ratio)

### Conversion & UX
- [ ] CTA is visible without scrolling
- [ ] CTA does not depend on animation
- [ ] Design guides attention calmly
- [ ] Mobile-first approach

### Hosting & Production
- [ ] No heavy libraries (or tree-shaken and justified)
- [ ] No unnecessary client JavaScript
- [ ] Assets are optimized (images, fonts, JS, CSS)
- [ ] Bundle size monitored (no regressions without justification)
- [ ] Tested on slow network/device

---

## 🚫 COMMON MISTAKES TO AVOID

### Mistake 1: Animating H1 or Intro Text
**Why it's wrong:** Delays SEO-critical content, hurts LCP  
**Fix:** Animate backgrounds, not text

### Mistake 2: Layout Shifts
**Why it's wrong:** Hurts CLS, breaks user experience  
**Fix:** Use `transform` and `opacity`, not `width`/`height`/`margin`/`padding`

### Mistake 3: Fixed Heights for CMS Content
**Why it's wrong:** Breaks layout when content varies  
**Fix:** Use `min-height` and flexible layouts

### Mistake 4: Heavy JavaScript for Static Content
**Why it's wrong:** Unnecessary, hurts performance  
**Fix:** Use server components, JavaScript only for interactivity

### Mistake 5: CTA Hidden Behind Animation
**Why it's wrong:** Reduces conversion, hurts UX  
**Fix:** CTA must be immediately visible

### Mistake 6: No Static Fallback for Canvas/WebGL
**Why it's wrong:** Breaks if JavaScript fails or is disabled  
**Fix:** Always provide static fallback (gradient, image, color)

### Mistake 7: Ignoring `prefers-reduced-motion`
**Why it's wrong:** Accessibility issue, can cause motion sickness  
**Fix:** Always respect user preferences

---

## 📚 REFERENCE DOCUMENTS

- **Next.js 14 App Router Docs:** https://nextjs.org/docs/app
- **Core Web Vitals:** https://web.dev/vitals/
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **CSS Animations Best Practices:** https://web.dev/animations/
- **Sanity CMS Docs:** https://www.sanity.io/docs

---

## ✅ FINAL REMINDER

**This document is a contract. If a design idea violates these rules, it MUST be rejected or redesigned.**

**Questions?** Refer to this document first. If still unclear, discuss with the technical lead before proceeding.

**Last Updated:** Pre-Design Phase  
**Next Phase:** Visual Design & Motion Design (following these guardrails)

---

**End of Design & Motion Guardrails Document**

