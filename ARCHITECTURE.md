# Architecture Documentation

## High-Level Architecture

### Philosophy
This architecture balances **Dadaism's controlled chaos** with **clockwork precision**. Every technical decision serves this contrast.

### Core Principles

1. **Server Components First**
   - WHY: Better performance, SEO, and initial load times
   - Client components only when interaction is required
   - Reduces JavaScript bundle size

2. **Musical Timing**
   - All animations use 300ms (beat), 150ms (half-beat), or 600ms (whole-beat)
   - WHY: Creates rhythm that feels intentional, not "webby"
   - Consistent easing: `[0.4, 0, 0.2, 1]` for smooth, musical feel

3. **Composition Over Complexity**
   - Small, reusable components
   - Motion variants extracted to library
   - Utility functions for common patterns

4. **Feature-Based Organization**
   - Components grouped by purpose, not type
   - Easier to find and maintain
   - Scales better than type-based structure

## Folder Structure Explained

```
├── app/                          # Next.js App Router (Server Components)
│   ├── layout.tsx               # Root layout with fonts, metadata, global structure
│   ├── page.tsx                 # Home page (server component)
│   ├── courses/                 # Course pages (dynamic routes)
│   │   ├── page.tsx            # Course listing
│   │   └── [slug]/page.tsx      # Individual course pages
│   └── globals.css              # Global styles, design tokens
│
├── components/
│   ├── layout/                  # Layout components (Header, Footer)
│   │   ├── Header.tsx          # Navigation with scroll detection
│   │   └── Footer.tsx          # Footer with links
│   ├── sections/                # Page sections (Hero, BentoGrid)
│   │   ├── HeroSection.tsx     # Interactive canvas hero
│   │   └── BentoGrid.tsx       # Bento grid for courses
│   ├── ui/                      # shadcn/ui components
│   │   └── button.tsx          # Button with variants
│   └── seo/                     # SEO components
│       └── StructuredData.tsx   # JSON-LD structured data
│
├── lib/
│   ├── utils.ts                 # Utility functions (cn, timing, easing)
│   └── motion-variants.ts       # Reusable Framer Motion variants
│
└── types/                        # TypeScript definitions
    └── index.ts                 # Shared types
```

## Component Architecture

### Hero Section (`components/sections/HeroSection.tsx`)

**Why Canvas?**
- 60fps performance for smooth particle animations
- Creates abstract, artistic effects that align with Dada philosophy
- Better performance than heavy 3D libraries
- Allows for custom visual metaphors (pianist fingers + brush strokes)

**Technical Decisions:**
- Spring physics for mouse tracking (feels natural, not janky)
- Parallax layers for depth without 3D complexity
- Particle system with subtle mouse attraction (controlled chaos)
- Trail system for brush stroke effect

**Performance:**
- Canvas cleared with fade effect (not full clear) for smooth trails
- Particle count optimized (50 particles)
- RequestAnimationFrame for smooth 60fps

### Bento Grid (`components/sections/BentoGrid.tsx`)

**Why Bento Grid?**
- Creates visual rhythm and hierarchy
- Each card feels like a musical note
- Responsive and accessible
- Glassmorphism adds depth while maintaining luxury aesthetic

**Animation Timing:**
- Stagger children: 0.1s (musical timing between cards)
- Hover scale: 1.02 (subtle, not aggressive)
- Transition: 300ms (beat timing)

**Responsive Strategy:**
- Mobile: Single column
- Tablet: 2-3 columns
- Desktop: Full bento grid with varying sizes

## Motion System

### Timing Constants (`lib/utils.ts`)

```typescript
timing = {
  beat: 300,        // Quarter note
  halfBeat: 150,    // Eighth note
  wholeBeat: 600,   // Half note
  measure: 1200,    // Whole note (4/4 time)
}
```

**Why These Values?**
- 300ms is the sweet spot for perceived responsiveness
- Creates consistent rhythm across all interactions
- Feels intentional, not random

### Easing Functions

```typescript
easing = {
  inOut: [0.4, 0, 0.2, 1],  // Smooth, musical
  out: [0, 0, 0.2, 1],      // Gentle release
  in: [0.4, 0, 1, 1],       // Gentle attack
}
```

**Why These Curves?**
- `[0.4, 0, 0.2, 1]` is a custom bezier that feels smooth and musical
- Not the default "ease" which feels too webby
- Creates luxury feel through precision

### Motion Variants (`lib/motion-variants.ts`)

Centralized variants ensure consistency:
- `fadeIn`, `slideUp`, `slideDown`, `scaleIn`
- `staggerContainer` for list animations
- `hoverScale`, `hoverGlow` for interactions
- `pageTransition` for route changes

## SEO Strategy

### Metadata (`app/layout.tsx`)

- Comprehensive Open Graph tags
- Twitter Card support
- Semantic HTML5 structure
- One H1 per page

### Structured Data (`components/seo/StructuredData.tsx`)

- JSON-LD format (Google recommended)
- Course ratings (AggregateRating)
- Instructor profiles (Person)
- Organization info (EducationalOrganization)

**Why JSON-LD?**
- Easier to maintain than inline microdata
- Can be added to any page
- Better for complex nested data

## Performance Optimizations

### Next.js Configuration

1. **Image Optimization**
   - AVIF and WebP formats
   - Sanity.io CDN domain whitelisted
   - Lazy loading by default

2. **Font Optimization**
   - `display: swap` for better CLS
   - Preload critical fonts
   - Variable fonts where possible

3. **Code Splitting**
   - Automatic with App Router
   - Dynamic imports for heavy components
   - Optimized package imports

### CSS Strategy

1. **Tailwind CSS**
   - Purge unused styles in production
   - Custom design tokens in config
   - Utility classes for consistency

2. **Custom Properties**
   - CSS variables for theming
   - Easy to maintain and extend
   - Better performance than JS-based theming

## Accessibility (WCAG 2.1 AA)

### Semantic HTML
- Proper heading hierarchy (H1 → H2 → H3)
- ARIA labels where needed
- Keyboard navigation support

### Color Contrast
- Charcoal (#0E0E0E) on Ivory (#F6F4EF): 15.8:1 (AAA)
- Gold (#D4AF37) on Charcoal: 4.5:1 (AA)

### Motion
- Respects `prefers-reduced-motion`
- Can be disabled if needed
- Focus indicators on all interactive elements

## Future Considerations

### Sanity.io Integration
- Schema definitions for courses, instructors, blog posts
- Image optimization pipeline
- Real-time preview mode

### Sound Previews
- User consent required
- Respects browser autoplay policies
- Low volume, subtle implementation

### Analytics
- Privacy-first approach
- Performance monitoring
- User behavior insights (with consent)

## Scaling Strategy

### Adding New Pages
1. Create route in `app/` directory
2. Add to navigation in `Header.tsx`
3. Create page-specific components in `components/sections/`
4. Add structured data if needed

### Adding New Components
1. Determine if server or client component
2. Place in appropriate folder (`layout/`, `sections/`, `ui/`)
3. Use motion variants from library
4. Follow musical timing principles

### Performance Monitoring
- Core Web Vitals tracking
- Bundle size monitoring
- Image optimization audits
- Lighthouse CI in pipeline

---

This architecture is designed to scale while maintaining the artistic philosophy and performance standards.

