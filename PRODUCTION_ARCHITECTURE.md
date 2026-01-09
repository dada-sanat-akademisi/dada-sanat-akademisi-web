# Production Architecture: Dada Sanat Akademisi
## Lead-First Technical Decisions & Justifications

> **Domain**: dadasanatakademisi.com  
> **Hosting**: Hostinger (Linux-based, Node.js)  
> **Lifespan**: 5+ years (built for longevity, not quick wins)

---

## 🎯 Executive Summary

This document serves as the **single source of truth** for all production decisions. Every technical choice is justified with business goals, performance impact, and maintenance considerations.

**Target Audience**: Senior engineers, future maintainers, technical reviewers, product owners

**Core Principles**:
1. **Conversion > Cool**: If it hurts conversion or performance, reject it
2. **Simplicity > Cleverness**: Choose the simplest solution that survives production
3. **Documentation > Assumptions**: Every decision must be documented with WHY
4. **Accessibility > Aesthetics**: WCAG 2.1 AA is non-negotiable

---

## 1️⃣ HERO MOTION DECISION MATRIX

### Current Implementation Analysis

**Technology**: Canvas API (2D)  
**Location**: `components/sections/HeroCanvas.tsx`  
**Status**: ✅ APPROVED (with conditions)

### Decision Justification

#### ✅ Why Canvas (Not Three.js, Not Pure CSS)

**Business Goal**: Create visual metaphor of pianist fingers + painter brush strokes merging abstractly

**Technical Requirements**:
- 60fps particle animations (50 particles)
- Mouse-responsive effects (subtle attraction)
- Trail system (brush stroke effect)
- Parallax layers for depth

**Decision Matrix**:

| Technology | Bundle Size | Performance | Flexibility | Maintenance | Decision |
|------------|-------------|-------------|-------------|-------------|----------|
| **Canvas 2D** | ~0 KB (native) | 60fps ✅ | Full control ✅ | Medium | ✅ **CHOSEN** |
| Three.js | ~500 KB | 60fps ✅ | Overkill ❌ | High | ❌ Rejected |
| Pure CSS | ~0 KB | 30-45fps ⚠️ | Limited ❌ | Low | ❌ Rejected |
| Framer Motion | ~50 KB | 60fps ✅ | Limited ❌ | Low | ❌ Rejected |
| GSAP | ~100 KB | 60fps ✅ | Overkill ❌ | Medium | ❌ Rejected |

**Why Canvas Wins**:
- ✅ Native browser API (no bundle cost)
- ✅ 60fps performance for particle systems
- ✅ Full control over visual metaphor
- ✅ Better than heavy 3D libraries for 2D effects
- ✅ Degrades gracefully (returns null if fails)

**Alternatives Considered**:
- **Three.js**: Overkill for 2D particles, large bundle size, unnecessary complexity
- **Pure CSS**: Not flexible enough for particle physics, performance limitations
- **Framer Motion**: Not designed for particle systems, limited control
- **GSAP**: Timeline-heavy, not needed for simple particle system

### Hero Architecture (Server vs Client)

**Current Architecture**: ✅ CORRECT

```
HeroSection (Client Component - wrapper)
├── HeroContent (Server Component - LCP element)
│   └── H1 "Kontrollü Kaos" (renders immediately, static)
├── HeroCanvas (Client Component - enhancement)
│   └── Canvas animation (loads after hydration)
└── Parallax layers (Client Component - enhancement)
```

**Why This Architecture**:
1. **LCP Protection**: H1 renders immediately (Server Component)
2. **Progressive Enhancement**: Canvas loads after hydration (doesn't block LCP)
3. **Graceful Degradation**: Returns null if reduced motion or canvas fails
4. **Separation of Concerns**: Content separate from animation

**LCP Element Choice**: H1 "Kontrollü Kaos"  
**Why It Loads Fast**:
- Server-rendered (no JavaScript required)
- No animation on first paint
- Font preloaded (`next/font` with `preload: true`)
- No layout shifts (fixed dimensions)

### Fallback Strategy

**Layer 1**: Static H1 (LCP element) - renders immediately ✅  
**Layer 2**: Canvas animation - loads after hydration ✅  
**Layer 3**: Static hero fallback - if canvas fails ✅

**Implementation**:
```typescript
// HeroCanvas.tsx
if (prefersReducedMotion || canvasError || !canvasReady) {
  return null; // Graceful degradation - static hero remains
}
```

**Performance Guardrails**:
1. ✅ LCP element is static (no animation)
2. ✅ Canvas loads after initial render (doesn't block LCP)
3. ✅ Particle count optimized (50 particles)
4. ✅ Pauses when tab hidden (performance optimization)
5. ✅ Respects `prefers-reduced-motion` (accessibility)

### Motion Technology Rules (Default Hierarchy)

**Rule**: Default to simplest solution, escalate only when necessary

1. **Framer Motion** (first choice)
   - Use for: Page transitions, hover effects, entrance animations
   - Why: Declarative, React-friendly, good performance
   - Bundle: ~50 KB (acceptable)

2. **CSS & SVG** (when possible)
   - Use for: Static animations, simple transitions
   - Why: Zero JavaScript, best performance
   - Bundle: 0 KB (ideal)

3. **GSAP** (timeline-heavy sequences only)
   - Use for: Complex multi-step animations, orchestrated sequences
   - Why: Powerful timeline control
   - Bundle: ~100 KB (only when justified)

4. **Three.js** (ONLY if no simpler alternative)
   - Use for: 3D models, complex 3D scenes
   - Why: Overkill for 2D effects
   - Bundle: ~500 KB (avoid unless absolutely necessary)

5. **Canvas API** (current hero implementation)
   - Use for: Particle systems, custom 2D animations
   - Why: Native, performant, full control
   - Bundle: 0 KB (native)

**Current Status**: ✅ Hero uses Canvas (justified)

---

## 2️⃣ SANITY CMS – LEAD-LEVEL CONTENT ARCHITECTURE

### Schema Design Philosophy

**Core Principles**:
1. **Editors Cannot Break Layout**: Validation rules prevent layout breaks
2. **SEO Fields Mandatory**: Every content type has SEO fields
3. **Localization Ready**: TR first, EN-ready (structured for future i18n)
4. **Structured Content**: No free chaos - controlled, typed content

### Schema Architecture

#### 1. Course Schema

**Business Goal**: Sell courses, build trust, provide clarity

**Fields**:
```typescript
{
  // Identity
  title: string (required, max 60 chars) // SEO + clarity
  slug: slug (required, unique) // URL structure
  code: string (optional, max 10 chars) // Course code
  
  // Content
  description: text (required, max 200 chars) // Meta description
  longDescription: portableText (required) // Rich content
  category: string (required, predefined) // Music, Visual Arts, Photography
  level: string (required, predefined) // Beginner, Intermediate, Advanced
  
  // Media
  image: image (required, aspect ratio 16:9) // Hero image
  gallery: array[image] (optional, max 5) // Course gallery
  
  // Trust Signals
  instructor: reference[instructor] (required) // Instructor profile
  rating: number (optional, 0-5) // Aggregate rating
  reviewCount: number (optional) // Number of reviews
  
  // Conversion
  price: number (required) // Course price
  duration: string (required) // "12 hafta", "6 ay"
  spotsAvailable: number (optional) // Scarcity signal
  startDate: date (optional) // Next cohort start
  
  // SEO
  seoTitle: string (optional, max 60 chars) // Custom SEO title
  seoDescription: text (optional, max 160 chars) // Custom SEO description
  seoKeywords: array[string] (optional) // Keywords
  
  // Localization (future-ready)
  locale: string (default: "tr") // Turkish first
  // Future: enTitle, enDescription, etc.
}
```

**Why This Structure**:
- ✅ **SEO Fields**: Every course has meta title/description
- ✅ **Trust Signals**: Instructor, rating, reviews build credibility
- ✅ **Conversion**: Price, duration, spots available guide decisions
- ✅ **Validation**: Aspect ratio constraints prevent layout breaks
- ✅ **Localization**: Structured for future i18n without breaking changes

**Validation Rules**:
- Image aspect ratio: 16:9 (prevents layout breaks)
- Title max 60 chars (SEO best practice)
- Description max 200 chars (meta description length)
- Slug required and unique (URL structure)

#### 2. Instructor Schema

**Business Goal**: Build trust, showcase expertise

**Fields**:
```typescript
{
  // Identity
  name: string (required, max 50 chars)
  slug: slug (required, unique)
  
  // Content
  bio: portableText (required, min 100 chars) // Rich text bio
  specialization: string (required) // "Piyano", "Resim", etc.
  
  // Media
  image: image (required, aspect ratio 1:1) // Profile photo
  portfolio: array[image] (optional, max 10) // Portfolio images
  
  // Trust Signals
  experience: number (optional) // Years of experience
  education: array[string] (optional) // Education background
  achievements: array[string] (optional) // Awards, recognitions
  
  // Social Proof
  courses: array[reference[course]] (computed) // Courses taught
  studentCount: number (optional) // Number of students
  
  // SEO
  seoTitle: string (optional)
  seoDescription: text (optional)
}
```

**Why This Structure**:
- ✅ **Trust Building**: Experience, education, achievements
- ✅ **Social Proof**: Student count, courses taught
- ✅ **Visual Identity**: Profile photo (1:1 aspect ratio)
- ✅ **Portfolio**: Showcase work (max 10 images)

#### 3. Blog Article Schema

**Business Goal**: SEO content, thought leadership, engagement

**Fields**:
```typescript
{
  // Identity
  title: string (required, max 80 chars)
  slug: slug (required, unique)
  
  // Content
  excerpt: text (required, max 200 chars) // Preview text
  content: portableText (required, min 500 chars) // Rich content
  category: string (required, predefined) // "Haberler", "Eğitim", "Sanat"
  
  // Media
  featuredImage: image (required, aspect ratio 16:9) // Hero image
  author: reference[instructor] (optional) // Author
  
  // Metadata
  publishedAt: datetime (required) // Publication date
  updatedAt: datetime (optional) // Last update
  
  // SEO
  seoTitle: string (optional, max 60 chars)
  seoDescription: text (optional, max 160 chars)
  seoKeywords: array[string] (optional)
  
  // Engagement
  readTime: number (computed) // Minutes to read
  viewCount: number (optional) // Analytics
}
```

**Why This Structure**:
- ✅ **SEO Optimized**: Title, description, keywords
- ✅ **Content Quality**: Min 500 chars ensures substantial content
- ✅ **Engagement**: Read time, view count
- ✅ **Visual**: Featured image (16:9 aspect ratio)

#### 4. Homepage Sections Schema

**Business Goal**: Flexible homepage without code changes

**Sections**:
- Hero (title, subtitle, CTA)
- Bento Grid (featured courses/programs)
- CTA Section (conversion-focused)
- Testimonials (trust signals)
- Featured Instructors (social proof)

**Hero Section Schema**:
```typescript
{
  title: string (required, max 60 chars) // "Kontrollü Kaos"
  subtitle: string (optional, max 100 chars) // Tagline
  ctaText: string (required, max 30 chars) // "Hemen Başvur"
  ctaHref: string (required) // "/apply"
  backgroundImage: image (optional) // Hero background
}
```

**Bento Grid Item Schema**:
```typescript
{
  title: string (required, max 40 chars)
  description: text (required, max 120 chars)
  href: string (required) // Link destination
  icon: string (optional) // Icon name
  size: string (required, predefined) // "small", "medium", "large"
  image: image (optional, aspect ratio 16:9)
  order: number (required) // Display order
}
```

**Why This Structure**:
- ✅ **Editor Control**: Non-technical editors can update homepage
- ✅ **Validation**: Size constraints prevent layout breaks
- ✅ **Flexibility**: Order field allows reordering
- ✅ **Conversion**: CTA fields mandatory

### Rich Text Rendering

**Technology**: Portable Text (Sanity's structured content format)

**Why Portable Text**:
- ✅ Fully typed (TypeScript support)
- ✅ Controlled components (no raw HTML injection)
- ✅ Structured content (not free chaos)
- ✅ SEO-friendly (semantic HTML)

**Implementation**:
```typescript
// lib/sanity/portable-text.tsx
import { PortableText } from '@portabletext/react';
import { components } from './portable-text-components';

export function SanityRichText({ content }: { content: any }) {
  return (
    <PortableText
      value={content}
      components={components} // Controlled, typed components
    />
  );
}
```

**Component Mapping**:
- Headings → Semantic HTML (h2, h3, h4)
- Links → Next.js Link component
- Images → Next.js Image component (optimized)
- Lists → Semantic ul/ol
- Blockquotes → Styled blockquotes

**Why Controlled Components**:
- ✅ No XSS vulnerabilities (no raw HTML)
- ✅ Consistent styling (design system)
- ✅ Performance (optimized images)
- ✅ Accessibility (semantic HTML)

---

## 3️⃣ CONVERSION PSYCHOLOGY (ART + BUSINESS)

### Visual Hierarchy

**Goal**: Guide user attention to conversion points

**Hierarchy**:
1. **H1** (Hero): "Kontrollü Kaos" - Brand statement
2. **CTA** (Hero): "Hemen Başvur" - Primary action
3. **Trust Signals** (Below fold): Instructors, reviews, experience
4. **Scarcity** (Strategic): Limited spots, program dates
5. **Social Proof** (Throughout): Testimonials, student count

**Why This Order**:
- ✅ **Brand First**: Establishes identity
- ✅ **Action Second**: CTA immediately visible
- ✅ **Trust Third**: Builds credibility before asking for commitment
- ✅ **Scarcity Fourth**: Creates urgency (not aggressive)
- ✅ **Social Proof**: Reinforces decision throughout journey

### Trust Signals

**Implementation**:
1. **Instructor Profiles**: Real photos, experience, specialization
2. **Student Count**: "500+ öğrenci" (social proof)
3. **Reviews/Ratings**: Aggregate rating, review count
4. **Experience**: "10+ yıl deneyim" (credibility)
5. **Portfolio**: Showcase work (visual proof)

**Why These Work**:
- ✅ **Human Connection**: Real instructors, not faceless
- ✅ **Social Proof**: Numbers build trust
- ✅ **Visual Proof**: Portfolio shows quality
- ✅ **Credibility**: Experience signals expertise

### Scarcity & Clarity

**Scarcity Signals** (Subtle, Not Aggressive):
- "Sınırlı kontenjan: 15 kişi" (Limited spots)
- "Son başvuru: 15 Mart" (Deadline)
- "Bir sonraki program: Nisan 2024" (Next cohort)

**Why Subtle**:
- ✅ **Luxury Brand**: No aggressive sales tactics
- ✅ **Respectful**: Doesn't pressure users
- ✅ **Effective**: Creates urgency without annoyance

**Clarity Signals**:
- Clear pricing (no hidden fees)
- Program duration (transparency)
- What's included (value proposition)
- Prerequisites (manages expectations)

### CTA Strategy

#### Primary CTA: "Hemen Başvur" (Apply Now)

**Placement**:
1. **Hero Section** (Above fold) ✅
2. **Sticky Header** (Always reachable) ✅
3. **Course Cards** (Contextual) ✅
4. **Floating CTA** (Mobile, after scroll) ⚠️

**Why This Placement**:
- ✅ **Hero**: First impression, highest visibility
- ✅ **Sticky Header**: Always accessible (conversion best practice)
- ✅ **Course Cards**: Contextual (user is interested)
- ⚠️ **Floating CTA**: Use sparingly (can annoy)

**Floating CTA Rules**:
- ✅ Only on mobile (screen space limited)
- ✅ Appears after 50% scroll (not immediately)
- ✅ Dismissible (user control)
- ✅ Respects reduced motion (no animation if disabled)

**CTA Copy Justification**:
- **"Hemen Başvur"**: Direct, action-oriented, Turkish (localized)
- **Why Not "Kayıt Ol"**: "Başvur" implies application process (premium feel)
- **Why Not "Ücretsiz Deneme"**: Doesn't match brand (luxury, not freemium)

**CTA Motion Timing**:
- **Hover**: 240ms (fast, responsive)
- **Click**: Immediate feedback (no delay)
- **Entrance**: 420ms (smooth, not rushed)

**Why This Timing**:
- ✅ **Fast Response**: 240ms feels instant
- ✅ **Smooth Entrance**: 420ms feels intentional
- ✅ **No Distraction**: Motion guides, doesn't distract

---

## 4️⃣ ARCHITECTURE RULES

### Next.js 14+ App Router

**Rules**:
1. **Server Components by Default** (non-negotiable)
2. **Client Components Only for Interaction**
3. **Motion Isolated from Layout**
4. **Feature-Based Folder Structure**
5. **TypeScript Strict Mode**

### Server Components First

**Rule**: Default to Server Components. Use Client Components only when:
- User interaction is required (clicks, hovers, form inputs)
- Browser APIs are needed (localStorage, window, etc.)
- Animation libraries require client-side rendering

**Why**:
- ✅ Better performance (no JS shipped)
- ✅ Better SEO (content in HTML)
- ✅ Faster initial load
- ✅ Lower bundle size

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

### Motion Logic Isolated

**Rule**: Motion variants live in `lib/motion-variants.ts`. Components import and use.

**Why**:
- ✅ Consistency across site
- ✅ Easy to adjust timing globally
- ✅ Reusable patterns
- ✅ Testable in isolation

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

### No Inline Magic Numbers

**Rule**: All timing values must come from constants.

**Constants** (see `lib/motion/constants.ts`):
- `HOVER_DURATION = 240ms` - Fast, responsive feel
- `ENTRANCE_DURATION = 420ms` - Smooth, not rushed
- `PAGE_TRANSITION = 600ms` - Whole beat, feels intentional

### Hydration Error Handling

**Rule**: Never globally suppress hydration errors unless:
- Reason is documented
- Scope is minimal
- Extension-related only

**Current Status**: ⚠️ `suppressHydrationWarning` in `app/layout.tsx` (line 68)

**Justification Needed**: Document why this is necessary, or remove it.

**Recommendation**: Remove unless there's a documented reason (e.g., browser extension compatibility).

---

## 5️⃣ SEO & PERFORMANCE GUARDRAILS

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

#### LCP (Largest Contentful Paint) < 2.5s

**LCP Element**: H1 "Kontrollü Kaos" (Hero section)

**Why It Loads Fast**:
- ✅ Server-rendered (no JavaScript required)
- ✅ Font preloaded (`next/font` with `preload: true`)
- ✅ No animation on first paint
- ✅ No layout shifts (fixed dimensions)

**Optimization Checklist**:
- [x] Font preloading
- [x] Static H1 (no animation)
- [x] Image optimization (AVIF/WebP)
- [ ] LCP element above fold
- [ ] Critical CSS inlined

#### CLS (Cumulative Layout Shift) < 0.1

**Prevention**:
- ✅ Fixed dimensions for animated elements
- ✅ Font loading strategy (`display: swap`)
- ✅ Image dimensions specified
- ✅ No layout shifts from animations

**Optimization Checklist**:
- [x] Font display: swap
- [x] Image dimensions specified
- [x] Fixed canvas dimensions
- [ ] Reserve space for dynamic content

#### FID (First Input Delay) < 100ms

**Optimization**:
- ✅ Minimal JavaScript on initial load
- ✅ Code splitting (automatic with App Router)
- ✅ Lazy load below-fold content
- ✅ Optimize package imports

**Optimization Checklist**:
- [x] Server Components (reduce JS)
- [x] Code splitting
- [x] Optimized package imports
- [ ] Defer non-critical scripts

### Bundle Size

**Target**: < 200 KB initial JS bundle

**Current Dependencies**:
- Framer Motion: ~50 KB
- GSAP: ~100 KB (only if used)
- Sanity Client: ~30 KB
- Next.js: ~100 KB (framework)

**Optimization**:
- ✅ Tree-shake unused code
- ✅ Optimize package imports (`next.config.js`)
- ✅ Dynamic imports for heavy components
- ✅ Server Components (reduce client bundle)

---

## 6️⃣ HOSTINGER + PRODUCTION CONFIG

### Hostinger Environment Assumptions

**Infrastructure**:
- Shared or VPS Hostinger environment
- Linux-based (Ubuntu/CentOS)
- Node.js support (version compatibility required)
- Limited resources compared to Vercel

**Constraints**:
- Memory limits (shared hosting)
- CPU limits (shared hosting)
- No edge functions (unlike Vercel)
- Manual deployment process

### Production Configuration

#### next.config.js Production Settings

**Current Status**: Basic configuration exists

**Required Additions**:
- Image domain configuration (Sanity CDN)
- Cache headers for static assets
- Compression enabled
- Production optimizations

**Recommended Configuration** (see `next.config.js` updates below)

#### Environment Variables

**Required** (`.env.production`):
```bash
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token

# Next.js
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://dadasanatakademisi.com

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_ga_id
```

**Security**:
- ✅ Never commit `.env.production` to Git
- ✅ Use Hostinger's environment variable management
- ✅ Rotate tokens regularly

#### Node Version Compatibility

**Recommended**: Node.js 18.x LTS or 20.x LTS

**Why**:
- ✅ Next.js 14+ requires Node 18+
- ✅ LTS versions (long-term support)
- ✅ Better performance
- ✅ Security updates

**Hostinger Setup**:
1. Check Node version: `node --version`
2. Update if needed (via Hostinger control panel)
3. Verify: `npm run build` works locally

#### Build & Start Scripts

**package.json**:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

**Hostinger Deployment**:
1. Build: `npm run build` (or `npm ci && npm run build`)
2. Start: `npm start` (or use PM2 for process management)
3. Port: Configure in Hostinger (default: 3000)

**PM2 Setup** (Recommended for VPS):
```bash
npm install -g pm2
pm2 start npm --name "dada-akademisi" -- start
pm2 save
pm2 startup
```

### Deployment Process

**Step-by-Step**:

1. **Pre-Deployment**:
   - [ ] Run `npm run build` locally (verify no errors)
   - [ ] Test production build: `npm start`
   - [ ] Verify environment variables
   - [ ] Check Node version compatibility

2. **Build on Hostinger**:
   ```bash
   npm ci --production=false
   npm run build
   ```

3. **Start Application**:
   ```bash
   npm start
   # Or with PM2:
   pm2 start npm --name "dada-akademisi" -- start
   ```

4. **Verify Deployment**:
   - [ ] Check site loads: `https://dadasanatakademisi.com`
   - [ ] Verify Sanity CMS connection
   - [ ] Test Core Web Vitals (Lighthouse)
   - [ ] Check error logs

### What Can Break

**Common Issues**:

1. **Memory Limits** (Shared Hosting)
   - **Symptom**: Build fails, "out of memory"
   - **Solution**: Use VPS or increase memory limit
   - **Prevention**: Optimize bundle size, use Server Components

2. **Node Version Mismatch**
   - **Symptom**: Build errors, runtime errors
   - **Solution**: Update Node version on Hostinger
   - **Prevention**: Document required Node version

3. **Environment Variables Missing**
   - **Symptom**: Sanity CMS errors, broken features
   - **Solution**: Configure environment variables in Hostinger
   - **Prevention**: Document all required variables

4. **Port Conflicts**
   - **Symptom**: Application won't start
   - **Solution**: Configure correct port in Hostinger
   - **Prevention**: Use environment variable for port

5. **CDN Issues** (Sanity Images)
   - **Symptom**: Images don't load
   - **Solution**: Verify `next.config.js` image domains
   - **Prevention**: Test image loading in production

### Debugging Production Issues

**Logs**:
- Application logs: `pm2 logs` (if using PM2)
- Hostinger error logs: Check control panel
- Next.js logs: Check console output

**Common Debugging Steps**:
1. Check Node version: `node --version`
2. Check environment variables: `echo $NEXT_PUBLIC_SANITY_PROJECT_ID`
3. Check build output: `npm run build` (look for errors)
4. Check runtime: `npm start` (look for errors)
5. Check network: Verify Sanity CDN access

**Performance Monitoring**:
- Use Lighthouse (Chrome DevTools)
- Monitor Core Web Vitals (Google Search Console)
- Check bundle size (Next.js build output)

---

## 7️⃣ EDGE CASES HANDLED

### 1. Browser Extensions Mutating DOM

**Problem**: Extensions (ad blockers, password managers) can break layout or cause hydration errors.

**Solution**:
- ✅ Use data attributes for styling hooks (not class names)
- ✅ Avoid relying on DOM structure
- ✅ Test with common extensions (uBlock Origin, LastPass, etc.)
- ✅ Graceful degradation (layout doesn't break)

**Implementation**:
```typescript
// ✅ GOOD: Data attributes
<div data-section="hero" className="hero-section">

// ❌ BAD: Relying on DOM structure
document.querySelector('.hero-section > h1')
```

### 2. Hydration Mismatches

**Problem**: Server-rendered HTML doesn't match client.

**Solution**:
- ✅ Fix root causes (don't suppress warnings)
- ✅ Use `useEffect` for client-only code
- ✅ Match server and client rendering
- ✅ Document any necessary suppressions

**Current Status**: ⚠️ `suppressHydrationWarning` in layout (needs justification)

**Recommendation**: Remove unless documented reason exists.

### 3. Reduced Motion Users

**Problem**: Animations can cause motion sickness.

**Solution**:
- ✅ `useReducedMotion()` hook (all motion respects preference)
- ✅ Static fallbacks (canvas returns null)
- ✅ CSS `@media (prefers-reduced-motion: reduce)`
- ✅ No animation if reduced motion preferred

**Implementation**:
```typescript
const prefersReducedMotion = useReducedMotion();

if (prefersReducedMotion) {
  return <StaticHero />; // Fallback
}
```

### 4. Slow Networks & Low Bandwidth

**Problem**: Heavy animations on slow devices/networks.

**Solution**:
- ✅ Canvas pauses when tab hidden (performance)
- ✅ Lazy load animations (below fold)
- ✅ Progressive enhancement (static first, enhance after)
- ✅ Graceful degradation (works without JS)

**Implementation**:
```typescript
// Canvas pauses when tab hidden
const handleVisibilityChange = () => {
  isPaused = document.hidden;
};
document.addEventListener('visibilitychange', handleVisibilityChange);
```

### 5. CMS Content Errors

**Problem**: Missing or invalid CMS data.

**Solution**:
- ✅ Error boundaries (graceful degradation)
- ✅ Fallback content (hardcoded defaults)
- ✅ Type validation (TypeScript + runtime)
- ✅ Default values (prevent crashes)

**Implementation**:
```typescript
// Error boundary
<ErrorBoundary fallback={<FallbackContent />}>
  <CMSContent />
</ErrorBoundary>

// Fallback data
const courses = cmsData || FALLBACK_COURSES;
```

### 6. Hosting Limitations

**Problem**: Shared hosting has memory/CPU limits.

**Solution**:
- ✅ Optimize bundle size (Server Components)
- ✅ Use CDN for images (Sanity CDN)
- ✅ Cache static assets (Next.js automatic)
- ✅ Monitor resource usage

**Prevention**:
- Document resource requirements
- Recommend VPS for production
- Optimize build process

---

## 📤 IMPLEMENTATION CHECKLIST

### Phase 1: Foundation ✅
- [x] Next.js 14+ App Router setup
- [x] TypeScript strict mode
- [x] Tailwind CSS + shadcn/ui
- [x] Framer Motion integration
- [x] Sanity.io client setup
- [x] Motion constants and variants

### Phase 2: Core Components ✅
- [x] Hero section with fallbacks
- [x] BentoGrid with CMS integration
- [x] Header with scroll detection
- [x] Footer
- [x] SEO components

### Phase 3: CMS Integration (In Progress)
- [ ] Sanity schemas (Course, Instructor, Blog, Homepage)
- [ ] Content queries (GROQ)
- [ ] Preview mode setup
- [ ] Image optimization pipeline
- [ ] Rich text rendering (Portable Text)

### Phase 4: Production Configuration
- [ ] Update `next.config.js` (Hostinger optimizations)
- [ ] Environment variables template
- [ ] Deployment documentation
- [ ] PM2 setup (if VPS)
- [ ] Error monitoring setup

### Phase 5: Performance & SEO
- [ ] LCP optimization (verify < 2.5s)
- [ ] CLS optimization (verify < 0.1)
- [ ] FID optimization (verify < 100ms)
- [ ] Structured data (all pages)
- [ ] Lighthouse audit (> 90 score)

### Phase 6: Testing & Documentation
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Cross-browser testing
- [ ] Performance testing (slow networks)
- [ ] CMS content validation
- [ ] Production deployment test

---

## 📝 DECISION LOG

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

### 2024-01-XX: Sanity CMS Schema Design
**Decision**: Structured, validated, SEO-optimized schemas  
**Reason**: Editor safety + SEO + localization ready  
**Alternatives Considered**: Free-form content (too chaotic)

---

**Document Version**: 1.0  
**Last Updated**: 2024-01-XX  
**Maintained By**: Lead Frontend Engineer  
**Next Review**: After production deployment

