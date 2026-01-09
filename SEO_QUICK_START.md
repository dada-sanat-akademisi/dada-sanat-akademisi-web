# SEO Quick Start Checklist
## Pre-Launch Verification

> **Quick reference**: Use this checklist before deploying to production.

---

## ✅ Completed Implementation

### 1. robots.txt ✅
- **Location**: `app/robots.txt/route.ts`
- **Test**: Visit `https://dadasanatakademisi.com/robots.txt` after deploy
- **Status**: Blocks internal routes, allows public pages

### 2. Dynamic Sitemap ✅
- **Location**: `app/sitemap.ts`
- **Test**: Visit `https://dadasanatakademisi.com/sitemap.xml` after deploy
- **Status**: Includes homepage, courses, blog articles (from Sanity)

### 3. Metadata & Canonical URLs ✅
- **Location**: `lib/seo/metadata.ts`
- **Status**: All pages have unique titles, descriptions, canonical URLs

### 4. Open Graph & Twitter Cards ✅
- **Status**: All pages include OG tags with absolute image URLs
- **Required**: Create `/og-default.jpg` (1200x630px) before launch

### 5. Structured Data ✅
- **Location**: `components/seo/StructuredData.tsx`
- **Types**: Organization, Course, BlogPosting, BreadcrumbList
- **Status**: JSON-LD format, validated

### 6. Draft/Preview Protection ✅
- **Location**: `middleware.ts`, `app/api/preview/route.ts`
- **Status**: Preview routes automatically noindex

---

## ⚠️ Action Required Before Launch

### 1. Create Default OG Image
**File**: `/public/og-default.jpg`  
**Size**: 1200x630px  
**Content**: Brand logo + site name + professional design

**Why**: Used when pages don't specify custom OG image.

### 2. Verify Environment Variables
Ensure these are set in production:
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_PREVIEW_SECRET=your_secret_token  # For preview mode
```

### 3. Create Logo Image
**File**: `/public/logo.png`  
**Used in**: Organization structured data

### 4. Test All Routes
- [ ] Homepage: `/`
- [ ] Courses listing: `/courses`
- [ ] Course detail: `/courses/[slug]` (test with real course)
- [ ] Apply page: `/apply`
- [ ] Blog (if exists): `/blog`, `/blog/[slug]`

### 5. Validate Structured Data
Test pages with:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- Verify no errors for Organization, Course, BreadcrumbList schemas

### 6. Submit to Google Search Console
1. Add property: `dadasanatakademisi.com`
2. Verify ownership (DNS or HTML file)
3. Submit sitemap: `https://dadasanatakademisi.com/sitemap.xml`
4. Request indexing for homepage and key pages

---

## 🧪 Testing Commands

### Local Testing
```bash
# Build and test production build
npm run build
npm start

# Test robots.txt
curl http://localhost:3000/robots.txt

# Test sitemap
curl http://localhost:3000/sitemap.xml
```

### Verify Metadata
```bash
# Check page source for meta tags
curl -s http://localhost:3000 | grep -E '<title>|<meta|rel="canonical"'
```

---

## 📊 Post-Launch Monitoring

### Week 1
- [ ] Check Google Search Console for indexing status
- [ ] Verify no crawl errors
- [ ] Monitor Core Web Vitals (LCP, CLS, FID)
- [ ] Test structured data in live environment

### Month 1
- [ ] Review search performance (impressions, clicks, CTR)
- [ ] Check for indexing issues
- [ ] Monitor for duplicate content warnings
- [ ] Review page speed scores

---

## 🚨 Common Issues & Solutions

### Issue: Sitemap returns empty
**Solution**: Ensure Sanity is configured with `NEXT_PUBLIC_SANITY_PROJECT_ID`

### Issue: OG images not showing
**Solution**: Verify images use absolute URLs starting with `https://`

### Issue: Draft content indexed
**Solution**: Check `middleware.ts` is running and preview routes return noindex

### Issue: Structured data errors
**Solution**: Validate with Google Rich Results Test and fix JSON-LD schema

---

## 📚 Full Documentation

See `SEO_IMPLEMENTATION.md` for complete technical documentation.

---

## 🎯 Success Metrics

After 30 days, check:
- ✅ All pages indexed in Google
- ✅ No crawl errors in Search Console
- ✅ Core Web Vitals in "Good" range
- ✅ Structured data showing in search results
- ✅ Rich results appearing for courses

---

**Remember**: SEO is a marathon, not a sprint. Monitor and optimize continuously.
