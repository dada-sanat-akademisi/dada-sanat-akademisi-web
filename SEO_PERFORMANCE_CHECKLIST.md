# SEO & Performance Checklist
## Dada Sanat Akademisi

This checklist ensures the site meets SEO and performance standards. Review before each release.

---

## 🎯 Core Web Vitals

### Largest Contentful Paint (LCP)
**Target**: < 2.5s

- [ ] LCP element is static (no animation on first paint)
- [ ] Hero H1 renders immediately (server-rendered)
- [ ] Images optimized (AVIF/WebP formats)
- [ ] Fonts preloaded with `display: swap`
- [ ] No render-blocking JavaScript on LCP element
- [ ] Canvas animation loads after initial render

**Current Status**: ✅ Hero H1 is static, renders immediately

### Cumulative Layout Shift (CLS)
**Target**: < 0.1

- [ ] Fixed dimensions for animated elements
- [ ] Font loading strategy prevents layout shift
- [ ] Images have width/height attributes
- [ ] No content injection after initial render
- [ ] Canvas has fixed dimensions

**Current Status**: ✅ Canvas has fixed dimensions, fonts use `display: swap`

### First Input Delay (FID)
**Target**: < 100ms

- [ ] Minimal JavaScript on initial load
- [ ] Code splitting implemented
- [ ] Lazy load below-fold content
- [ ] Optimize package imports (Framer Motion, Lucide)

**Current Status**: ✅ Code splitting via App Router, optimized imports

---

## 🔍 SEO Requirements

### Technical SEO

- [ ] One H1 per page (mandatory)
  - Home: "Kontrollü Kaos"
  - Courses: "Kurslar"
  - Course Detail: Course title
- [ ] Meaningful H2/H3 hierarchy (no skipping levels)
- [ ] Semantic HTML5 structure
- [ ] Unique title per page (max 60 characters)
- [ ] Unique description per page (150-160 characters)
- [ ] Open Graph tags on all pages
- [ ] Twitter Card tags on all pages
- [ ] Canonical URLs configured
- [ ] Robots.txt configured
- [ ] Sitemap.xml generated

### Structured Data (JSON-LD)

- [ ] Organization schema on home page
- [ ] Course schema on course pages
- [ ] Instructor schema on instructor pages
- [ ] BreadcrumbList for navigation
- [ ] AggregateRating for courses (if applicable)
- [ ] Validated with Google Rich Results Test

### Accessibility (WCAG 2.1 AA)

- [ ] Color contrast: 15.8:1 (Charcoal/Ivory) - AAA ✅
- [ ] Color contrast: 4.5:1 (Gold/Charcoal) - AA ✅
- [ ] Focus indicators on all interactive elements
- [ ] Keyboard navigation support
- [ ] ARIA labels where needed
- [ ] Alt text for all images
- [ ] `prefers-reduced-motion` support ✅

---

## 🚀 Performance Optimizations

### Images

- [ ] Next.js Image component used (not `<img>`)
- [ ] AVIF format enabled
- [ ] WebP format enabled
- [ ] Lazy loading for below-fold images
- [ ] Proper sizing (not oversized)
- [ ] Sanity CDN configured

### Fonts

- [ ] Fonts preloaded in `<head>`
- [ ] `display: swap` to prevent CLS
- [ ] Variable fonts where possible
- [ ] Subset fonts (only needed characters)

### JavaScript

- [ ] Code splitting (automatic with App Router) ✅
- [ ] Tree-shaking enabled
- [ ] Bundle size monitored
- [ ] Dynamic imports for heavy components
- [ ] Optimized package imports ✅

### CSS

- [ ] Tailwind CSS purged in production
- [ ] Critical CSS inlined (if needed)
- [ ] Unused styles removed

### Caching

- [ ] Static pages cached
- [ ] API responses cached (if applicable)
- [ ] Image caching configured
- [ ] CDN configured (Vercel/Sanity)

---

## 📊 Monitoring & Testing

### Before Release

- [ ] Lighthouse audit (score > 90)
  - Performance: > 90
  - Accessibility: > 90
  - Best Practices: > 90
  - SEO: > 90
- [ ] Core Web Vitals tested
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Slow 3G network testing
- [ ] Reduced motion testing ✅

### Tools

- [ ] Google PageSpeed Insights
- [ ] WebPageTest
- [ ] Chrome DevTools Performance
- [ ] Lighthouse CI (if configured)
- [ ] Google Search Console
- [ ] Google Rich Results Test

---

## 🐛 Common Issues to Avoid

### SEO Issues

- ❌ Multiple H1s on a page
- ❌ Missing alt text on images
- ❌ Duplicate content
- ❌ Missing meta descriptions
- ❌ Broken internal links
- ❌ Missing structured data

### Performance Issues

- ❌ Large images not optimized
- ❌ Render-blocking JavaScript
- ❌ Unused CSS/JavaScript
- ❌ Missing font preloading
- ❌ Animation on LCP element
- ❌ Layout shifts from animations

---

## 📝 Page-Specific Checklists

### Home Page (`/`)

- [ ] H1: "Kontrollü Kaos"
- [ ] Meta title: "Dada Sanat Akademisi | Müzik & Görsel Sanatlar Akademisi"
- [ ] Meta description: Unique, 150-160 characters
- [ ] Organization structured data
- [ ] Open Graph image
- [ ] LCP: Hero H1 (static, no animation)

### Courses Page (`/courses`)

- [ ] H1: "Kurslar"
- [ ] Meta title: "Kurslar | Dada Sanat Akademisi"
- [ ] Meta description: Unique
- [ ] Course listing structured data
- [ ] Breadcrumb navigation

### Course Detail (`/courses/[slug]`)

- [ ] H1: Course title
- [ ] Meta title: "{Course Title} | Dada Sanat Akademisi"
- [ ] Meta description: Course description (150-160 chars)
- [ ] Course structured data (with rating if applicable)
- [ ] Instructor structured data
- [ ] Breadcrumb navigation
- [ ] Open Graph image: Course image

---

## 🔄 Regular Maintenance

### Monthly

- [ ] Review Core Web Vitals in Google Search Console
- [ ] Check for broken links
- [ ] Review Lighthouse scores
- [ ] Update structured data if schema changes

### Quarterly

- [ ] Full SEO audit
- [ ] Performance optimization review
- [ ] Accessibility audit
- [ ] Content freshness check

---

## ✅ Current Status

### Completed ✅

- Hero H1 is static (optimal LCP)
- Canvas animation loads after initial render
- `prefers-reduced-motion` support implemented
- Fonts use `display: swap`
- Code splitting via App Router
- Optimized package imports
- Color contrast meets WCAG AA/AAA

### In Progress 🚧

- Sanity CMS integration
- Structured data implementation
- Image optimization pipeline

### Pending ⏳

- Lighthouse CI setup
- Google Search Console verification
- Sitemap generation
- Robots.txt configuration

---

**Last Updated**: 2024-01-XX  
**Next Review**: 2024-02-XX

