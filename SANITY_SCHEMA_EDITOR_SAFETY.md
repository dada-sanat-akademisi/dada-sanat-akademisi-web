# Sanity Schema Editor Safety Review

**Project**: Dada Sanat Akademisi  
**Status**: ✅ Editor Safety Review Complete

---

## 🎯 OBJECTIVE

Ensure content editors can safely use Sanity Studio without:
- Breaking layout
- Harming SEO
- Entering uncontrolled content

---

## ✅ VALIDATION RULES ADDED

### 1. Course Schema (`course.ts`)

#### Title Validation
- ✅ **Max 60 characters**: Enforced with `.max(60)`
- ✅ **Required**: Cannot be empty
- ✅ **Warning on exceed**: Shows helpful message

**Why**: Title appears in `<title>` tag. Google truncates at ~60 chars.

#### Description Validation
- ✅ **Max 200 characters**: Enforced with `.max(200)`
- ✅ **Required**: Cannot be empty
- ✅ **Warning on exceed**: Meta description guidance

**Why**: Used for meta description and course cards. Should be concise.

#### Slug Validation
- ✅ **Required**: Cannot be empty
- ✅ **Auto-generated**: From title (editor-friendly)
- ✅ **Max 96 characters**: URL length constraint
- ✅ **Uniqueness**: Sanity enforces uniqueness per document type

**Why**: URL structure, SEO, prevents duplicate routes.

#### Long Description (Portable Text) Constraints
- ✅ **Heading depth limited**: Only H2 and H3 allowed (no H4+)
- ✅ **Allowed styles**: Normal, H2, H3
- ✅ **Allowed marks**: Strong, Emphasis
- ✅ **Links controlled**: URL validation
- ✅ **Required**: Cannot be empty

**Why**:
- Prevents excessive heading nesting (bad for SEO and readability)
- Maintains consistent heading hierarchy
- Prevents layout breaks from deep nesting

#### Image Constraints
- ✅ **Hero image**: Required, alt text required
- ✅ **Gallery images**: Max 5, alt text required for each
- ✅ **Alt text**: Required (accessibility + SEO)

**Why**: Accessibility (WCAG), SEO (image alt), layout consistency.

#### Metadata Validation
- ✅ **Duration**: Required, max 50 chars
- ✅ **Price**: Required, min 0 (non-negative)
- ✅ **Level**: Required (predefined options)
- ✅ **Category**: Required (predefined options)
- ✅ **Rating**: 0-5 range (bounded)
- ✅ **Review count**: Min 0 (non-negative)

**Why**: Prevents invalid data, ensures complete course information.

#### SEO Fields
- ✅ **SEO title**: Max 60 chars (fits meta tag)
- ✅ **SEO description**: Max 160 chars (fits meta description)
- ✅ **SEO keywords**: Max 10 keywords, 30 chars each

**Why**: Fits Google's recommended lengths for meta tags.

---

### 2. Blog Article Schema (`blogArticle.ts`)

#### Title Validation
- ✅ **Max 80 characters**: Blog titles can be slightly longer
- ✅ **Required**: Cannot be empty

**Why**: Blog titles need more space, but still reasonable.

#### Excerpt Validation
- ✅ **Max 200 characters**: Enforced
- ✅ **Required**: Cannot be empty

**Why**: Used for meta description and article previews.

#### Content (Portable Text) Constraints
- ✅ **Heading depth limited**: Only H2 and H3 allowed (no H4+)
- ✅ **Required**: Cannot be empty
- ✅ **Minimum length warning**: 500 characters recommended

**Why**: Prevents shallow articles, maintains heading hierarchy.

#### Slug Validation
- ✅ **Required**: Cannot be empty
- ✅ **Unique**: Enforced by Sanity
- ✅ **Auto-generated**: From title

**Why**: URL structure, SEO, prevents duplicate routes.

#### Featured Image
- ✅ **Required**: Cannot be empty
- ✅ **Alt text**: Required (accessibility + SEO)

**Why**: Article hero image is critical for SEO and social sharing.

#### Read Time
- ✅ **Range**: 1-120 minutes (bounded)
- ✅ **Warning**: Shows if outside reasonable range

**Why**: Prevents unrealistic read times.

---

### 3. Instructor Schema (`instructor.ts`)

#### Name Validation
- ✅ **Max 50 characters**: Enforced
- ✅ **Required**: Cannot be empty

**Why**: Profile name length, layout consistency.

#### Slug Validation
- ✅ **Required**: Cannot be empty
- ✅ **Unique**: Enforced by Sanity
- ✅ **Auto-generated**: From name

**Why**: URL structure, prevents duplicate instructor pages.

#### Bio (Portable Text) Constraints
- ✅ **Heading depth limited**: Only H2 and H3 allowed
- ✅ **Required**: Cannot be empty
- ✅ **Minimum length warning**: 100 characters recommended

**Why**: Ensures quality content, maintains heading hierarchy.

#### Specialization
- ✅ **Max 50 characters**: Enforced
- ✅ **Required**: Cannot be empty

**Why**: Layout consistency, prevents long strings breaking design.

#### Portfolio Images
- ✅ **Max 10 images**: Performance constraint
- ✅ **Alt text**: Required for each image

**Why**: Performance (too many images slow page), accessibility.

#### Education & Achievements Arrays
- ✅ **Education**: Max 5 entries, 100 chars each
- ✅ **Achievements**: Max 10 entries, 100 chars each

**Why**: Prevents excessive content, maintains layout consistency.

---

### 4. Homepage Section Schema (`homepageSection.ts`)

#### Field Visibility
- ✅ **Conditional fields**: Hidden when not relevant (based on section type)
- ✅ **Clear section type**: Required, predefined options

**Why**: Reduces editor confusion, prevents invalid combinations.

#### Hero Section Constraints
- ✅ **Hero title**: Max 60 chars
- ✅ **Hero subtitle**: Max 100 chars
- ✅ **CTA text**: Max 30 chars (button width)
- ✅ **CTA link**: Validated (must start with / or http)
- ✅ **Background image**: Alt text required if used

**Why**: Layout constraints, button sizing, link validation.

#### Bento Grid Constraints
- ✅ **Item title**: Max 40 chars, required
- ✅ **Item description**: 10-120 chars, required
- ✅ **Link validation**: Must start with / or http
- ✅ **Images**: Alt text required

**Why**: Grid layout constraints, prevents overflow, link safety.

#### Testimonials Constraints
- ✅ **Quote**: 20-300 characters (required)
- ✅ **Author**: Max 50 chars, required
- ✅ **Role**: Max 50 chars (optional)
- ✅ **Image**: Alt text required if used

**Why**: Prevents too-short or too-long testimonials, layout consistency.

#### Link Validation
- ✅ **Format validation**: Must start with `/` (internal) or `http` (external)
- ✅ **Error message**: Clear guidance on link format

**Why**: Prevents broken links, ensures proper link structure.

---

## 🔒 CONTENT CONSTRAINTS

### Portable Text Block Constraints

**Allowed Heading Levels**:
- ✅ H2 (section headings)
- ✅ H3 (subsection headings)
- ❌ H4+ (forbidden)

**Why Forbidden**:
- Deep heading nesting breaks visual hierarchy
- Hurts readability
- Can cause layout issues
- Not SEO-friendly (Google prefers 2-3 levels)

**Allowed Marks**:
- ✅ Strong (bold)
- ✅ Emphasis (italic)
- ✅ Links (with URL validation)

**Why Limited**:
- Prevents over-formatting
- Maintains design consistency
- Ensures semantic HTML

### Image Constraints

**All Images Require**:
- ✅ Alt text (required, not optional)
- ✅ Proper description

**Why**:
- WCAG 2.1 AA accessibility requirement
- SEO benefit (image search)
- Screen reader support

**Array Limits**:
- Gallery: Max 5 images
- Portfolio: Max 10 images

**Why**:
- Performance (too many images slow page load)
- Layout constraints (grids handle limited items)
- User experience (too many images is overwhelming)

---

## 📊 SEO SAFETY

### Title Fields

**Course**: Max 60 chars
**Blog Article**: Max 80 chars
**SEO Title**: Max 60 chars

**Why**:
- Google truncates titles at ~60 chars in search results
- Longer titles reduce click-through rate
- Meta tags have limited space

### Description Fields

**Course description**: Max 200 chars
**Blog excerpt**: Max 200 chars
**SEO description**: Max 160 chars

**Why**:
- Meta descriptions truncated at ~160 chars
- Shorter descriptions are more effective
- Prevents cut-off text in search results

### Slug Validation

**All content types**:
- ✅ Required
- ✅ Auto-generated from title/name
- ✅ Unique per document type
- ✅ Max 96 characters

**Why**:
- URL structure is critical for SEO
- Duplicate slugs break routing
- Long URLs are less shareable

---

## 🎨 EDITOR UX IMPROVEMENTS

### Field Ordering

**Logical Grouping**:
1. Identity fields (title, slug)
2. Content fields (description, long content)
3. Metadata (category, level)
4. Media (images)
5. Trust signals (instructor, rating)
6. Conversion (price, duration)
7. SEO (optional, at end)

**Why**: Editors work top-to-bottom, grouping related fields reduces confusion.

### Field Descriptions

**Enhanced Descriptions**:
- ✅ Clear purpose explanation
- ✅ Examples provided
- ✅ Character limits stated
- ✅ Format requirements specified

**Why**: Reduces editor questions, prevents mistakes.

### Placeholders

**Added Placeholders**:
- Duration: "e.g., '12 hafta'"
- Specialization: "e.g., 'Piyano'"
- Links: "e.g., '/apply'"

**Why**: Shows expected format, reduces errors.

### Error Messages

**Clear Error Messages**:
- ✅ Specific (what's wrong)
- ✅ Actionable (how to fix)
- ✅ Non-technical language

**Why**: Editors understand what to change, reduces support requests.

---

## ✅ EDITOR SAFETY DECISIONS

### Decision 1: Heading Depth Limit (H4+ Forbidden)

**Rationale**:
- Visual hierarchy: Too many heading levels confuse readers
- Layout: Deep nesting can break responsive layouts
- SEO: Google prefers 2-3 heading levels
- Readability: Shallow hierarchy is easier to scan

**Implementation**: Portable Text styles limited to H2 and H3 only.

### Decision 2: Required Alt Text for All Images

**Rationale**:
- Accessibility: WCAG 2.1 AA requirement
- SEO: Image search benefits from alt text
- Legal: Accessibility compliance
- UX: Screen readers need descriptions

**Implementation**: All image fields require alt text field with validation.

### Decision 3: Array Length Limits

**Rationale**:
- Performance: Too many items slow page load
- Layout: Grids have maximum capacity
- UX: Too many items overwhelm users
- Mobile: Limited screen space

**Implementation**:
- Gallery: Max 5 images
- Portfolio: Max 10 images
- Education: Max 5 entries
- Achievements: Max 10 entries
- SEO keywords: Max 10 keywords

### Decision 4: Link Format Validation

**Rationale**:
- Broken links: Invalid formats break navigation
- Security: Validates URL structure
- Clarity: Distinguishes internal vs external links

**Implementation**: Links must start with `/` (internal) or `http` (external).

### Decision 5: String Length Limits

**Rationale**:
- Layout: Long strings break design
- SEO: Meta tags have character limits
- Performance: Shorter strings render faster
- UX: Concise content is more effective

**Implementation**: Character limits enforced with warnings/errors.

---

## 🔍 STATIC-SITE FRIENDLINESS

### Content Stability

**No Dynamic Content**:
- ✅ All content is structured (no free-form HTML)
- ✅ No JavaScript dependencies
- ✅ No runtime calculations
- ✅ All fields have defaults or are required

**Why**: Static site generation requires predictable content structure.

### CMS Errors Don't Break Build

**Graceful Fallbacks**:
- ✅ Missing fields handled with defaults
- ✅ Invalid data prevented by validation
- ✅ Required fields ensure completeness

**Why**: Build process must succeed even with incomplete data.

### URL Structure

**Slug-Based URLs**:
- ✅ All content types have slugs
- ✅ Slugs are URL-friendly
- ✅ Slugs are unique
- ✅ Slugs are stable (don't change frequently)

**Why**: Static site generation requires predictable URLs.

---

## ✅ CONFIRMATION CHECKLIST

### CMS-Safe ✅

- [x] No layout-breaking content lengths
- [x] Image constraints prevent overflow
- [x] Array limits prevent excessive content
- [x] Required fields ensure completeness
- [x] Validation prevents invalid data

### SEO-Safe ✅

- [x] Title lengths fit meta tags
- [x] Description lengths fit meta descriptions
- [x] Slugs are unique and URL-friendly
- [x] Heading hierarchy is controlled
- [x] Alt text required for images

### Static-Site Friendly ✅

- [x] All content is structured
- [x] No dynamic calculations
- [x] Predictable URL structure
- [x] Graceful fallbacks for missing data
- [x] Build-safe validation

### Editor-Friendly ✅

- [x] Clear field labels
- [x] Helpful descriptions
- [x] Logical field ordering
- [x] Error messages are actionable
- [x] Examples and placeholders provided

---

## 📋 SCHEMA SUMMARY

### Course Schema
- **Required fields**: 9 (title, slug, description, longDescription, category, level, image, instructor, price, duration)
- **Validation rules**: 15+
- **Protected**: Layout, SEO, accessibility

### Blog Article Schema
- **Required fields**: 7 (title, slug, excerpt, content, category, featuredImage, publishedAt)
- **Validation rules**: 10+
- **Protected**: Layout, SEO, content quality

### Instructor Schema
- **Required fields**: 6 (name, slug, bio, specialization, image)
- **Validation rules**: 8+
- **Protected**: Layout, accessibility, content quality

### Homepage Section Schema
- **Required fields**: Varies by section type
- **Validation rules**: 12+
- **Protected**: Layout, link structure, content length

---

## ✅ REVIEW COMPLETE

All schemas have been reviewed and improved for editor safety:

- ✅ **Layout protection**: Content length limits, image constraints
- ✅ **SEO protection**: Title/description limits, slug uniqueness
- ✅ **Accessibility**: Alt text required, semantic structure
- ✅ **Content quality**: Minimum lengths, required fields
- ✅ **Editor UX**: Clear labels, helpful descriptions, examples

**Schemas are now safe for non-technical content editors.**

---

**Document Version**: 1.0  
**Last Updated**: Schema Editor Safety Review Complete

