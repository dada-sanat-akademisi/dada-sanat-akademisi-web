# Sanity Studio Setup Guide

**Project**: Dada Sanat Akademisi  
**Status**: ✅ Studio Setup Complete

---

## 📋 OVERVIEW

Sanity Studio has been added as a **separate application** from the Next.js app. It provides a visual content editor for managing all CMS content.

**Location**: `sanity-studio/` folder (separate from Next.js app)

---

## 🚀 QUICK START

### 1. Install Dependencies

```bash
cd sanity-studio
npm install
```

### 2. Configure Environment Variables

The Studio uses the **same Sanity project** as the Next.js app. You can either:

**Option A**: Use Studio-specific variables (recommended)
```env
SANITY_STUDIO_PROJECT_ID=your_project_id
SANITY_STUDIO_DATASET=production
```

**Option B**: Use Next.js app variables (if already set in parent `.env.local`)
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

Create `sanity-studio/.env.local` with one of these options.

### 3. Run the Studio

```bash
cd sanity-studio
npm run dev
```

Studio will be available at: **http://localhost:3333/studio**

---

## 📁 FOLDER STRUCTURE

```
sanity-studio/
├── package.json          # Studio dependencies (Sanity v3)
├── sanity.config.ts      # Config entry point (exports app.tsx)
├── app.tsx               # Main Studio configuration
├── schemas/
│   └── index.ts          # Imports schemas from parent ../sanity/schemas/
├── tsconfig.json         # TypeScript configuration
├── .gitignore            # Git ignore rules
├── README.md             # Studio documentation
└── .env.local            # Environment variables (create this)
```

---

## 🔗 CONNECTION TO NEXT.JS APP

### Same Project, Same Dataset

The Studio connects to the **exact same Sanity project** as the Next.js app:

- **Project ID**: Same (`NEXT_PUBLIC_SANITY_PROJECT_ID` or `SANITY_STUDIO_PROJECT_ID`)
- **Dataset**: Same (`production` by default)

### Schema Sharing

Schemas are **not duplicated**. The Studio imports schemas from the parent project:

```typescript
// sanity-studio/schemas/index.ts
import course from '../../sanity/schemas/course';
import instructor from '../../sanity/schemas/instructor';
// ... etc
```

**Why This Works**:
- ✅ Single source of truth (schemas in `sanity/schemas/`)
- ✅ No duplication
- ✅ Changes to schemas reflect in both apps
- ✅ TypeScript resolves relative imports correctly

---

## ✅ VERIFICATION CHECKLIST

After setup, verify:

- [ ] **Studio runs**: `npm run dev` in `sanity-studio/` starts without errors
- [ ] **Studio accessible**: http://localhost:3333/studio loads
- [ ] **All schemas visible**: Course, Instructor, Blog Article, Homepage Section appear in Studio
- [ ] **Next.js still works**: `npm run build` in parent directory succeeds
- [ ] **Environment variables**: Project ID and dataset are set correctly

---

## 🎨 AVAILABLE CONTENT TYPES

The Studio includes these content types:

1. **Course** (`course`)
   - Course listings with details
   - Pricing, duration, instructor
   - SEO fields

2. **Instructor** (`instructor`)
   - Instructor profiles
   - Bio, portfolio, specialization
   - Trust signals

3. **Blog Article** (`blogArticle`)
   - Blog posts
   - Rich text content
   - Author attribution

4. **Homepage Section** (`homepageSection`)
   - Hero sections
   - Bento grid items
   - CTA sections
   - Testimonials

---

## 📝 USAGE

1. **Start Studio**: `cd sanity-studio && npm run dev`
2. **Open Browser**: Navigate to http://localhost:3333/studio
3. **Sign In**: Use your Sanity account credentials
4. **Edit Content**: Click on any content type to start editing

### Content Updates

**How it works**:
1. Editor makes changes in Studio
2. Changes saved to Sanity CMS
3. Developer runs `next build` in parent directory
4. Next.js fetches latest content from Sanity
5. Static HTML generated with new content
6. Deploy updated static files

**Important**: Content changes require a **rebuild** of the Next.js app (SSG).

---

## 🔒 SEPARATION FROM NEXT.JS

### ✅ Completely Separate

- Studio code is in `sanity-studio/` folder only
- No Studio code in `app/` directory
- No backend/server logic added
- Studio is a **content editor**, not a page builder

### ✅ No Breaking Changes

- Next.js app builds exactly as before
- No changes to existing Next.js code
- Studio is additive (doesn't modify existing functionality)

---

## 🧪 TESTING

### Test Studio Setup

```bash
# 1. Navigate to studio folder
cd sanity-studio

# 2. Install dependencies
npm install

# 3. Create .env.local with your project ID
# (See configuration section above)

# 4. Start Studio
npm run dev

# 5. Verify Studio loads at http://localhost:3333/studio
```

### Test Next.js Still Works

```bash
# From parent directory
npm run build
npm run start

# Verify Next.js app still builds and runs
```

---

## 🆘 TROUBLESHOOTING

### Studio Won't Start

**Error**: "Missing Sanity Project ID"
- **Solution**: Create `.env.local` in `sanity-studio/` folder with `SANITY_STUDIO_PROJECT_ID`

**Error**: "Cannot find module"
- **Solution**: Run `npm install` in `sanity-studio/` folder

**Error**: TypeScript errors
- **Solution**: Check `tsconfig.json` includes parent schemas folder (`../sanity/schemas/**/*.ts`)

### Schemas Not Visible

**Issue**: Content types don't appear in Studio
- **Check**: Verify `sanity-studio/schemas/index.ts` imports are correct
- **Check**: Verify parent `sanity/schemas/` folder exists
- **Check**: No TypeScript errors in schema files

### Can't Connect to Sanity

**Issue**: Studio can't connect to Sanity project
- **Check**: Project ID is correct
- **Check**: Dataset name matches (`production` by default)
- **Check**: You have access to the Sanity project (check sanity.io dashboard)

---

## 📚 RESOURCES

- [Sanity Studio Documentation](https://www.sanity.io/docs/sanity-studio)
- [Schema Types Reference](https://www.sanity.io/docs/schema-types)
- [Environment Variables](https://www.sanity.io/docs/environment-variables)

---

## ✅ SETUP COMPLETE

**Status**: ✅ Sanity Studio is ready to use

**Next Steps**:
1. Install dependencies: `cd sanity-studio && npm install`
2. Configure environment variables
3. Run `npm run dev`
4. Start editing content!

---

**Document Version**: 1.0  
**Last Updated**: Sanity Studio Setup Complete

