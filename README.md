# Dada Sanat Akademisi

A living digital art gallery for a Music & Visual Arts Academy.

## 🧠 Core Philosophy

This project balances:
- **Dadaism's controlled chaos & artistic rebellion**
- **Clockwork precision, rhythm, discipline, and structure**

Every design and technical decision serves this contrast.

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Animation**: Framer Motion (primary), GSAP (for complex sequences only)
- **Fonts**:
  - Headings: Playfair Display
  - Body: Inter
- **CMS**: Sanity.io (to be configured)
- **Rendering**: SEO-first SSR, optimized LCP & CLS
- **Accessibility**: WCAG 2.1 AA minimum

## 🎨 Design System

- **Color Palette**:
  - Charcoal Black (#0E0E0E)
  - Ivory White (#F6F4EF)
  - Brushed Gold accents (#D4AF37)
- **UI Tone**: Luxury, calm, confident, artistic
- **Motion**: Musical timing (200-400ms beats), not "webby"

## 📁 Architecture

### Folder Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with fonts & metadata
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles & design tokens
├── components/
│   ├── layout/            # Header, Footer
│   ├── sections/          # Hero, BentoGrid
│   ├── ui/                # shadcn/ui components
│   └── seo/               # Structured data, metadata
├── lib/
│   ├── utils.ts           # Utility functions (cn, timing, easing)
│   └── motion-variants.ts # Reusable motion variants
└── types/                 # TypeScript definitions
```

### Why This Structure?

1. **Feature-based organization**: Components grouped by purpose, not type
2. **Server components by default**: Only client components where interaction is needed
3. **Composition over complexity**: Small, reusable pieces
4. **Type safety**: Centralized types prevent inconsistencies

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🎯 Key Features

### Hero Section
- Interactive canvas with particle system
- Mouse-responsive parallax effects
- Visual metaphor: Pianist fingers + painter brush strokes
- Smooth spring physics for natural movement

### Bento Grid
- Glassmorphism cards
- Musical timing animations (300ms beats)
- Responsive grid layout
- Hover effects with subtle expansion

### Performance
- Optimized images (AVIF/WebP)
- Font preloading
- Code splitting
- Lazy loading for below-fold content

### SEO
- Semantic HTML5
- Structured data (JSON-LD)
- Metadata optimization
- One H1 per page

## 🧑‍💻 Development Principles

1. **Musical Timing**: All animations use 300ms (beat), 150ms (half-beat), or 600ms (whole-beat)
2. **Composition**: Extract reusable motion variants
3. **Server First**: Use server components unless interaction is needed
4. **Accessibility**: WCAG 2.1 AA minimum
5. **Performance**: Optimize for LCP, CLS, FID

## 🔒 Authentication & Security

**IMPORTANT**: This project intentionally has **NO authentication system**.

- No user accounts
- No login/signin pages
- No profile pages
- No session management
- No auth providers or contexts

This is a **static CMS site** with:
- Public content (courses, blog, academy info)
- No user-specific data
- No protected routes
- No authentication flows

**If you see errors about authentication chunks** (e.g., `ChunkLoadError: Loading chunk src_container_profile_authentication_overview_SignIn_js failed`):
- This is from **browser cache** trying to load old Create React App chunks
- **Solution**: Clear browser cache and service workers
- The codebase contains **zero authentication code**

## 📝 Next Steps

1. Configure Sanity.io CMS
2. Add course listing pages
3. Implement blog/academy section
4. Add sound previews (with user consent)
5. Performance testing & optimization

## 🎨 Design Decisions Explained

### Why Canvas for Hero?
- 60fps performance for smooth animations
- Creates abstract, artistic effects
- Better than heavy 3D libraries for this use case

### Why Bento Grid?
- Creates visual rhythm without clutter
- Each card feels like a musical note
- Responsive and accessible

### Why Glassmorphism?
- Adds depth while maintaining luxury aesthetic
- Creates visual hierarchy
- Aligns with artistic, modern feel

---

Built with precision and artistic intent.

