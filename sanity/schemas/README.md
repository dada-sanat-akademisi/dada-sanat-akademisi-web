# Sanity CMS Schemas
## Content Architecture for Dada Sanat Akademisi

> **Purpose**: Structured, validated, SEO-optimized content schemas  
> **Philosophy**: Editors cannot break layout, SEO fields mandatory, localization ready

---

## 📋 Schema Overview

### 1. Course Schema (`course.ts`)

**Purpose**: Course content with trust signals and conversion elements

**Key Features**:
- SEO fields (title, description, keywords)
- Trust signals (instructor, rating, reviews)
- Conversion elements (price, duration, spots available)
- Validation rules (prevent layout breaks)
- Localization ready (TR first, EN-ready)

**Required Fields**:
- `title` (max 60 chars for SEO)
- `slug` (unique, URL-friendly)
- `description` (max 200 chars for meta)
- `longDescription` (rich text)
- `category` (Music, Visual Arts, etc.)
- `level` (Beginner, Intermediate, Advanced)
- `image` (16:9 aspect ratio recommended)
- `instructor` (reference to instructor)
- `price` (required)
- `duration` (e.g., "12 hafta")

**Optional Fields**:
- `code` (course code)
- `gallery` (max 5 images)
- `rating` (0-5)
- `reviewCount`
- `spotsAvailable` (scarcity signal)
- `startDate` (next cohort)
- `seoTitle`, `seoDescription`, `seoKeywords`

### 2. Instructor Schema (`instructor.ts`)

**Purpose**: Build trust and showcase expertise

**Key Features**:
- Professional profile (photo, bio, specialization)
- Trust signals (experience, education, achievements)
- Social proof (student count, courses taught)
- SEO optimization

**Required Fields**:
- `name` (max 50 chars)
- `slug` (unique)
- `bio` (rich text, min 100 chars)
- `specialization` (e.g., "Piyano", "Resim")
- `image` (1:1 aspect ratio recommended)

**Optional Fields**:
- `portfolio` (max 10 images)
- `experience` (years)
- `education` (array of strings)
- `achievements` (array of strings)
- `studentCount` (social proof)
- `seoTitle`, `seoDescription`

### 3. Blog Article Schema (`blogArticle.ts`)

**Purpose**: SEO content and thought leadership

**Key Features**:
- Rich content (portable text)
- SEO optimization (title, description, keywords)
- Engagement metrics (read time, view count)
- Author attribution

**Required Fields**:
- `title` (max 80 chars)
- `slug` (unique)
- `excerpt` (max 200 chars)
- `content` (rich text, min 500 chars)
- `category` (News, Education, Art, Academy)
- `featuredImage` (16:9 aspect ratio)
- `publishedAt` (datetime)

**Optional Fields**:
- `author` (reference to instructor)
- `updatedAt` (datetime)
- `seoTitle`, `seoDescription`, `seoKeywords`
- `readTime` (minutes)
- `viewCount` (analytics)

### 4. Homepage Section Schema (`homepageSection.ts`)

**Purpose**: Flexible homepage content without code changes

**Section Types**:
- **Hero**: Title, subtitle, CTA
- **Bento Grid**: Featured courses/programs
- **CTA Section**: Conversion-focused
- **Testimonials**: Trust signals
- **Featured Instructors**: Social proof

**Hero Fields**:
- `heroTitle` (max 60 chars)
- `heroSubtitle` (max 100 chars)
- `heroCtaText` (max 30 chars, e.g., "Hemen Başvur")
- `heroCtaHref` (e.g., "/apply")
- `heroBackgroundImage` (optional)

**Bento Grid Fields**:
- `bentoItems` (array of items)
  - `title` (max 40 chars)
  - `description` (max 120 chars)
  - `href` (link destination)
  - `icon` (optional)
  - `size` (small, medium, large)
  - `image` (optional, 16:9)
  - `order` (display order)

**CTA Section Fields**:
- `ctaTitle` (max 60 chars)
- `ctaDescription` (max 200 chars)
- `ctaButtonText` (max 30 chars)
- `ctaButtonHref` (link destination)

**Testimonials Fields**:
- `testimonials` (array)
  - `quote` (max 300 chars)
  - `author` (name)
  - `role` (e.g., "Student", "Graduate")
  - `image` (optional)

**Featured Instructors Fields**:
- `featuredInstructors` (array of references, max 6)

---

## 🚀 Implementation Guide

### Step 1: Install Sanity Studio (if not already installed)

```bash
npm install -g @sanity/cli
sanity init
```

### Step 2: Configure Schemas

1. Copy schema files to your Sanity project:
   ```bash
   cp sanity/schemas/*.ts /path/to/sanity/schemas/
   ```

2. Update `sanity.config.ts`:
   ```typescript
   import { defineConfig } from 'sanity';
   import schemas from './schemas';

   export default defineConfig({
     // ... other config
     schema: {
       types: schemas,
     },
   });
   ```

### Step 3: Deploy Sanity Studio

```bash
sanity deploy
```

### Step 4: Add Content

1. Access Sanity Studio: `https://your-project.sanity.studio`
2. Add courses, instructors, blog articles
3. Configure homepage sections

---

## ✅ Validation Rules

### Why Validation Rules?

**Goal**: Prevent editors from breaking layout

**Examples**:
- Image aspect ratios (16:9 for hero, 1:1 for profile)
- Text length limits (SEO best practices)
- Required fields (prevent incomplete content)
- Max array lengths (prevent performance issues)

### Current Validation Rules

**Course**:
- Title: max 60 chars (SEO)
- Description: max 200 chars (meta description)
- Gallery: max 5 images (performance)
- Image: required (layout)

**Instructor**:
- Bio: min 100 chars (quality)
- Portfolio: max 10 images (performance)
- Image: required (layout)

**Blog Article**:
- Title: max 80 chars
- Excerpt: max 200 chars
- Content: min 500 chars (quality)
- Featured image: required (layout)

**Homepage Section**:
- Hero title: max 60 chars
- Hero subtitle: max 100 chars
- CTA text: max 30 chars
- Bento items: title max 40, description max 120
- Featured instructors: max 6 (layout)

---

## 🎨 Rich Text Rendering

### Portable Text

**Why Portable Text**:
- ✅ Fully typed (TypeScript support)
- ✅ Controlled components (no raw HTML injection)
- ✅ Structured content (not free chaos)
- ✅ SEO-friendly (semantic HTML)

**Implementation** (see `lib/sanity/portable-text.tsx`):

```typescript
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

---

## 🌍 Localization (Future-Ready)

### Current: Turkish First

All schemas have `locale` field (default: "tr")

### Future: English Support

**Option 1**: Separate documents per locale
- `course-tr`, `course-en`
- Query by locale: `*[_type == "course" && locale == "tr"]`

**Option 2**: Localized fields in same document
- `title`, `titleEn`
- `description`, `descriptionEn`
- Query: `*[_type == "course"] { title, "titleEn": titleEn }`

**Recommendation**: Option 1 (cleaner, easier to maintain)

---

## 📊 SEO Optimization

### Every Content Type Has SEO Fields

**Required**:
- `title` (for H1, meta title)
- `description` (for meta description)

**Optional**:
- `seoTitle` (custom SEO title, overrides title)
- `seoDescription` (custom SEO description, overrides description)
- `seoKeywords` (keywords array)

**Why**:
- ✅ Better search visibility
- ✅ Customizable per page
- ✅ Follows Google recommendations

---

## 🔒 Content Editor Safety

### Validation Prevents Layout Breaks

**Image Aspect Ratios**:
- Hero images: 16:9 (prevents layout shifts)
- Profile photos: 1:1 (consistent grid)

**Text Length Limits**:
- Titles: max 60-80 chars (SEO, layout)
- Descriptions: max 200 chars (meta description)
- CTAs: max 30 chars (button width)

**Array Limits**:
- Gallery: max 5 images (performance)
- Portfolio: max 10 images (performance)
- Featured instructors: max 6 (layout)

**Why**:
- ✅ Prevents layout breaks
- ✅ Maintains design consistency
- ✅ Protects performance

---

## 📝 Content Guidelines

### For Content Editors

1. **Images**:
   - Use recommended aspect ratios (16:9 for hero, 1:1 for profile)
   - Add alt text (accessibility)
   - Optimize file size (Sanity auto-optimizes)

2. **Text**:
   - Keep titles under character limits (SEO)
   - Write clear, concise descriptions
   - Use rich text for long-form content

3. **SEO**:
   - Fill in SEO fields (title, description, keywords)
   - Use custom SEO fields if needed
   - Keep keywords relevant

4. **Trust Signals**:
   - Add instructor profiles (builds trust)
   - Include ratings/reviews (social proof)
   - Highlight experience (credibility)

---

## 🐛 Troubleshooting

### Schema Not Appearing in Studio

**Solution**: 
1. Check `sanity.config.ts` imports schemas correctly
2. Restart Sanity Studio: `sanity start`
3. Check for TypeScript errors

### Validation Errors

**Solution**:
1. Check field requirements (required fields)
2. Check character limits (max lengths)
3. Check array limits (max items)

### Images Not Loading

**Solution**:
1. Verify `next.config.js` has `domains: ['cdn.sanity.io']`
2. Check image URLs in Sanity Studio
3. Verify Sanity project ID is correct

---

## 📚 Resources

- **Sanity Docs**: https://www.sanity.io/docs
- **Portable Text**: https://www.sanity.io/docs/block-content
- **Schema Types**: https://www.sanity.io/docs/schema-types
- **Validation**: https://www.sanity.io/docs/validation

---

**Last Updated**: 2024-01-XX  
**Maintained By**: Lead Frontend Engineer

