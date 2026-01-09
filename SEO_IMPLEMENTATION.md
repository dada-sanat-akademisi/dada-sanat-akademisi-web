# Technical SEO Implementation Guide
## Dada Sanat Akademisi - Production SEO

> **Purpose**: Complete technical SEO implementation for production website  
> **Domain**: dadasanatakademisi.com  
> **Framework**: Next.js 14+ (App Router)  
> **Hosting**: Hostinger

---

## 🎯 SEO First Principles

This implementation ensures:

✅ Google understands what the site is and what each page is about  
✅ Bots are never accidentally blocked  
✅ SEO works without JavaScript (SSR/SSG)  
✅ No duplicate content penalties  
✅ Rich results eligibility (structured data)  
✅ Fast indexing of new content  

---

## 1️⃣ ROBOTS.TXT

**Location**: `/app/robots.txt/route.ts`  
**Served at**: `https://dadasanatakademisi.com/robots.txt`

### Rules Explanation

```
User-agent: *
Allow: /              → Homepage (always index)
Allow: /courses       → Course listing (important)
Allow: /courses/*     → Individual courses (core content)
Allow: /blog          → Blog listing (if exists)
Allow: /blog/*        → Blog articles (content marketing)
Allow: /apply         → Application page

Disallow: /api/       → Internal API routes (no public content)
Disallow: /_next/     → Next.js internals (not for indexing)
Disallow: /preview/   → Draft preview routes (NEVER index)
Disallow: /draft/     → Draft content (NEVER index)
Disallow: /admin/     → Admin panel (if exists)
```

### Routes That MUST NEVER Be Indexed

1. **API Routes** (`/api/*`)
   - Internal functionality only
   - No public-facing content
   - Could expose sensitive endpoints

2. **Preview/Draft Routes** (`/preview/*`, `/draft/*`)
   - Unpublished content
   - Could cause duplicate content issues
   - Should require authentication

3. **Admin Routes** (`/admin/*`)
   - Internal tools
   - Not meant for public consumption

4. **Next.js Internals** (`/_next/*`)
   - Framework files
   - No SEO value

### Sitemap Reference

The robots.txt explicitly references the sitemap location:
```
Sitemap: https://dadasanatakademisi.com/sitemap.xml
```

This helps search engines discover all pages quickly.

---

## 2️⃣ SITEMAP.XML (Dynamic)

**Location**: `/app/sitemap.ts`  
**Served at**: `https://dadasanatakademisi.com/sitemap.xml`

### What's Included

- **Homepage** (priority: 1.0, changeFrequency: daily)
- **Course Listing** (`/courses`, priority: 0.9, daily)
- **Individual Courses** (priority: 0.8, weekly)
  - Fetched from Sanity CMS
  - Only published courses (excludes drafts)
  - Uses `_updatedAt` for lastModified
- **Blog Articles** (priority: 0.7, monthly)
  - Fetched from Sanity CMS
  - Only published articles
  - Uses `publishedAt` or `_updatedAt` for lastModified
- **Application Page** (`/apply`, priority: 0.6, monthly)

### How It Updates

1. **On Build**: Next.js regenerates sitemap during `npm run build`
2. **On Revalidation**: If using ISR, regenerates on revalidation period
3. **Via Webhooks**: Sanity webhooks can trigger rebuilds when content changes

**Recommendation**: Set up Sanity webhooks to trigger rebuilds on:
- Course publish/update
- Blog article publish/update
- Course deletion (to remove from sitemap)

### Priority System

- **1.0**: Homepage (highest priority)
- **0.9**: Main listing pages
- **0.8**: Individual course pages (core content)
- **0.7**: Blog articles (content marketing)
- **0.6**: Utility pages (apply, contact)

These are hints to search engines, not strict rules. Google determines actual crawl frequency based on site activity.

### To Extend Later

If the site grows beyond 50,000 URLs, split into multiple sitemaps:

```
sitemap-courses.xml
sitemap-blog.xml
sitemap-index.xml (references all sitemaps)
```

---

## 3️⃣ META & CANONICAL STRATEGY

**Location**: `/lib/seo/metadata.ts`

### Title Length Decisions

- **Max 60 characters**: Google truncates at ~60 chars
- **Format**: "Page Title | Dada Sanat Akademisi"
- **Template**: Defined in `app/layout.tsx` with `template: '%s | Dada Sanat Akademisi'`
- **Rationale**: Optimized for CTR, not keyword stuffing
  - Includes brand for recognition
  - Short enough to display fully in search results
  - Descriptive enough to communicate page content

### Meta Description Rules

- **Length**: 150-160 characters (optimal)
- **Never empty**: Falls back to default description
- **Unique per page**: No duplicates across pages
- **Includes CTA or value proposition**: Encourages clicks

### Canonical URLs

**Why Canonical is Critical**:
- Prevents duplicate content penalties
- Consolidates ranking signals
- Tells Google which URL is the "master" version

**Canonical Placement**:
- Next.js Metadata API handles this automatically
- Placed in `<head>` via `alternates.canonical`
- Always uses production domain (`https://dadasanatakademisi.com`)
- No trailing slash inconsistencies

**Example**:
```typescript
alternates: {
  canonical: 'https://dadasanatakademisi.com/courses/piyano'
}
```

### Per-Page Overrides

Each page can override default metadata:

```typescript
// app/page.tsx
export const metadata = generateSEOMetadata({
  title: 'Ana Sayfa',
  description: 'Custom description...',
  canonicalUrl: '/',
  keywords: ['custom', 'keywords'],
});
```

---

## 4️⃣ OPEN GRAPH & SOCIAL SHARING

**Location**: `/lib/seo/metadata.ts` (via `generateMetadata`)

### Implementation

All pages include:

```typescript
openGraph: {
  type: 'website' | 'article',
  locale: 'tr_TR',
  url: 'https://dadasanatakademisi.com/...',
  siteName: 'Dada Sanat Akademisi',
  title: 'Page Title',
  description: 'Page Description',
  images: [{
    url: 'https://dadasanatakademisi.com/...', // Absolute URL required
    width: 1200,
    height: 630,
    alt: 'Image Description',
  }],
}
```

### Image Requirements

- **Size**: 1200x630px (recommended by Facebook/Twitter)
- **Format**: WebP or JPG (optimized)
- **Absolute URL**: Must start with `https://`
- **Alt Text**: Required for accessibility and SEO

### Default Social Image

If a page doesn't specify an OG image, it uses:
```
https://dadasanatakademisi.com/og-default.jpg
```

**Action Required**: Create this image (1200x630px) with:
- Brand logo
- Site name
- Professional design matching brand aesthetic

### How It Improves CTR

- **Rich Previews**: Attractive preview cards in social feeds
- **Higher Engagement**: Visual content gets more clicks
- **Brand Recognition**: Consistent imagery builds trust
- **Professional Appearance**: Increases click-through rates by 20-30%

### Twitter Cards

Also included:
```typescript
twitter: {
  card: 'summary_large_image',
  title: 'Page Title',
  description: 'Page Description',
  images: ['https://...'],
}
```

---

## 5️⃣ STRUCTURED DATA (JSON-LD)

**Location**: `/components/seo/StructuredData.tsx`

### Why JSON-LD Only

- ✅ Google's recommended format
- ✅ Easy to maintain (no HTML attributes)
- ✅ Doesn't affect page design
- ✅ Can be validated independently

### Schema Types Implemented

#### 1. Organization Schema
**Used on**: Homepage  
**Purpose**: Tells Google about the business
```json
{
  "@type": "EducationalOrganization",
  "name": "Dada Sanat Akademisi",
  "url": "https://dadasanatakademisi.com",
  "logo": "https://dadasanatakademisi.com/logo.png"
}
```

#### 2. Course Schema
**Used on**: Course detail pages (`/courses/[slug]`)  
**Purpose**: Enables rich results in search (ratings, price, duration)
```json
{
  "@type": "Course",
  "name": "Piyano Eğitimi",
  "provider": {
    "@type": "EducationalOrganization",
    "name": "Dada Sanat Akademisi"
  },
  "aggregateRating": { ... }
}
```

**Benefits**:
- Star ratings in search results
- Course information preview
- Higher CTR (rich results get 2x clicks)

#### 3. BlogPosting Schema
**Used on**: Blog article pages (`/blog/[slug]`)  
**Purpose**: Article rich results (publish date, author, image)
```json
{
  "@type": "BlogPosting",
  "headline": "Article Title",
  "datePublished": "2024-01-15",
  "author": { "@type": "Person", "name": "..." }
}
```

**Benefits**:
- Article preview in search
- Date and author information
- Better visibility for blog content

#### 4. BreadcrumbList Schema
**Used on**: All content pages  
**Purpose**: Breadcrumb navigation in search results
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "position": 1, "name": "Ana Sayfa", "item": "https://..." },
    { "position": 2, "name": "Kurslar", "item": "https://..." },
    { "position": 3, "name": "Piyano", "item": "https://..." }
  ]
}
```

**Benefits**:
- Breadcrumb navigation in search results
- Better UX (users see page hierarchy)
- Improved click-through rates

### Validation

Test structured data using:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

---

## 6️⃣ PAGE INDEXING SAFETY

### Draft/Preview Routes

**Location**: 
- `/app/api/preview/route.ts` (Sanity preview mode)
- `/middleware.ts` (adds noindex headers)

**Implementation**:
- Preview routes automatically set `noindex` robots header
- Draft mode routes blocked via robots.txt
- Middleware adds `X-Robots-Tag: noindex, nofollow` header

**How Search Engines Interpret**:
- `noindex`: Don't index this page
- `nofollow`: Don't follow links on this page
- Combined: Complete blocking of draft content

### HTTP Status Codes

**404 (Not Found)**:
- Returns proper 404 status when course/article not found
- Includes noindex in metadata
- Google removes from index after re-crawl

**410 (Gone)** (Future):
- For permanently deleted content
- Tells Google to remove immediately

**Implementation**:
```typescript
// app/courses/[slug]/page.tsx
if (!course) {
  return {
    title: 'Kurs Bulunamadı',
    robots: { index: false, follow: false },
  };
}
```

---

## 7️⃣ PERFORMANCE & SEO

### Largest Contentful Paint (LCP) Optimization

**Target**: LCP < 2.5s (Google's "Good" threshold)

**LCP Element**: Hero image or main course image

**Optimizations**:
1. **Image Optimization**: 
   - Next.js Image component (automatic WebP/AVIF)
   - Sanity CDN with image transformation
   - Proper sizing (no layout shift)

2. **Font Optimization**:
   - `display: swap` (prevents invisible text)
   - Preloaded fonts
   - Subset to Latin only

3. **Server Components**:
   - Default rendering mode (faster than client components)
   - Reduced JavaScript bundle

### Font Optimization

**Implementation** (in `app/layout.tsx`):
```typescript
const inter = Inter({
  display: 'swap', // Prevents FOIT (Flash of Invisible Text)
  preload: true,   // Loads font early
});
```

**Why Stable LCP**:
- Fonts load early with preload
- Fallback fonts visible immediately (swap)
- No layout shift from font loading

### Image Optimization

**Implementation**:
- Next.js `<Image>` component
- Sanity CDN with width/height parameters
- Modern formats (AVIF > WebP > JPG)

**Example**:
```typescript
<Image
  src={course.imageUrl}
  width={1200}
  height={630}
  alt={course.title}
  priority // For above-the-fold images
/>
```

### Cumulative Layout Shift (CLS)

**Target**: CLS < 0.1 (Good)

**Prevention**:
- Fixed image dimensions (no layout shift)
- Font loading with swap (no text shift)
- No dynamic content above the fold

---

## 8️⃣ HOSTINGER SEO CONSIDERATIONS

### Traditional Hosting vs Edge Network

**Hostinger Limitations**:
- No global edge network (unlike Vercel)
- Single server location
- Traditional Node.js deployment

### Build Output

**Configuration** (in `next.config.js`):
```javascript
output: 'standalone' // Optimized for traditional hosting
```

**Why Standalone**:
- Smaller build output
- Faster server startup
- Better for Hostinger's resource limits

### Caching Headers

**Implementation** (in `next.config.js`):
```javascript
headers: [
  {
    source: '/_next/static/:path*',
    headers: [{
      key: 'Cache-Control',
      value: 'public, max-age=31536000, immutable'
    }]
  }
]
```

**Benefits**:
- Static assets cached for 1 year
- Reduces server load
- Faster repeat visits

### Gzip/Brotli Compression

**Next.js Handles**:
- Automatic compression (`compress: true`)
- Gzip for older browsers
- Brotli for modern browsers (if supported by Hostinger)

**What Hostinger Might Limit**:
- Memory usage (Node.js apps)
- CPU usage (build process)
- Storage space (static files)

**How to Avoid SEO Penalties**:
1. **Optimize Build Size**: Use standalone output
2. **Cache Aggressively**: Long cache times for static assets
3. **Monitor Performance**: Use Core Web Vitals monitoring
4. **CDN for Images**: Use Sanity CDN (already implemented)

### Verification

After deployment, verify:
1. Response times < 2s for server-rendered pages
2. Static assets load from cache
3. No 5xx errors in Google Search Console
4. Sitemap accessible and valid

---

## 📤 VERIFICATION CHECKLIST

### Before Going Live

- [ ] **robots.txt** accessible at `/robots.txt`
- [ ] **sitemap.xml** accessible at `/sitemap.xml`
- [ ] All pages have unique `<title>` tags
- [ ] All pages have meta descriptions (no empty)
- [ ] All pages have canonical URLs
- [ ] OG images are absolute URLs (start with `https://`)
- [ ] Structured data validated via Google Rich Results Test
- [ ] No duplicate content (check canonical URLs)
- [ ] Preview routes return noindex
- [ ] Default OG image created (`/og-default.jpg`)

### Google Search Console Setup

1. **Add Property**: Add `dadasanatakademisi.com`
2. **Verify Ownership**: Use DNS verification or HTML file
3. **Submit Sitemap**: `https://dadasanatakademisi.com/sitemap.xml`
4. **Request Indexing**: Submit homepage and key pages
5. **Monitor Coverage**: Check for indexing errors
6. **Check Core Web Vitals**: Ensure good performance scores

### Testing Tools

1. **Google Rich Results Test**: 
   - Test any page: https://search.google.com/test/rich-results
   - Verify structured data is valid

2. **PageSpeed Insights**:
   - https://pagespeed.web.dev/
   - Check LCP, CLS, FID scores
   - Ensure all "Good" thresholds met

3. **Google Search Console**:
   - Monitor indexing status
   - Check for crawl errors
   - View search performance

4. **robots.txt Tester**:
   - In Google Search Console
   - Verify bots can access important pages

5. **Mobile-Friendly Test**:
   - https://search.google.com/test/mobile-friendly
   - Ensure mobile usability

### Monthly Maintenance

- [ ] Check Google Search Console for errors
- [ ] Review sitemap for broken links
- [ ] Monitor Core Web Vitals scores
- [ ] Update sitemap when adding new content types
- [ ] Review and update meta descriptions (if CTR is low)
- [ ] Check for duplicate content issues

---

## 🔧 EXTENDING THE SYSTEM

### Adding New Content Types

**Example**: Instructor Pages

1. **Add to Sitemap** (`app/sitemap.ts`):
```typescript
const instructorPages = await getInstructors();
instructorPages.map(instructor => ({
  url: `${baseUrl}/instructors/${instructor.slug}`,
  priority: 0.7,
}));
```

2. **Add to robots.txt** (`app/robots.txt/route.ts`):
```
Allow: /instructors/
Allow: /instructors/*
```

3. **Add Metadata** (`app/instructors/[slug]/page.tsx`):
```typescript
export const metadata = generateSEOMetadata({
  title: instructor.name,
  description: instructor.bio,
  canonicalUrl: `/instructors/${instructor.slug}`,
});
```

4. **Add Structured Data**:
```typescript
<StructuredData type="instructor" data={instructorData} />
```

### Adding Blog Routes

1. Create `/app/blog/page.tsx` (listing)
2. Create `/app/blog/[slug]/page.tsx` (article detail)
3. Use `generateBlogMetadata()` from metadata utils
4. Add BlogPosting structured data
5. Add breadcrumbs

---

## 🎯 KEY TAKEAWAYS

1. **Canonical URLs**: Always use production domain, never empty
2. **Structured Data**: JSON-LD only, validate with Google tools
3. **Noindex Drafts**: Critical to prevent indexing unpublished content
4. **Performance**: LCP < 2.5s, CLS < 0.1 (affects rankings)
5. **Social Sharing**: Absolute OG image URLs required
6. **Sitemap**: Updates automatically, includes only published content
7. **robots.txt**: Blocks internal routes, allows important pages

---

## 🚨 COMMON MISTAKES TO AVOID

❌ **Don't**: Use relative URLs for OG images  
✅ **Do**: Always use absolute URLs starting with `https://`

❌ **Don't**: Index preview/draft routes  
✅ **Do**: Always set noindex for preview mode

❌ **Don't**: Duplicate titles across pages  
✅ **Do**: Unique, descriptive titles per page

❌ **Don't**: Empty meta descriptions  
✅ **Do**: Always provide 150-160 char descriptions

❌ **Don't**: Forget canonical URLs  
✅ **Do**: Every page must have a canonical URL

❌ **Don't**: Skip structured data validation  
✅ **Do**: Test with Google Rich Results Test before launch

---

## 📞 SUPPORT

For questions or issues:
1. Check Google Search Console for errors
2. Validate structured data with Google tools
3. Review this documentation
4. Test in staging before production changes

**Remember**: SEO mistakes cost money in lost rankings. Always test before deploying to production.

