# Sanity Studio

Content management interface for Dada Sanat Akademisi.

This is a **separate application** from the Next.js app. It provides a visual editor for managing content in Sanity CMS.

## 📋 Prerequisites

- Node.js 18+ installed
- Sanity project ID and dataset configured

## 🚀 Setup

1. **Install dependencies**:
   ```bash
   cd sanity-studio
   npm install
   ```

2. **Configure environment variables**:

   Create `.env.local` file (or use parent `.env.local`):
   ```env
   SANITY_STUDIO_PROJECT_ID=your_project_id
   SANITY_STUDIO_DATASET=production
   ```

   Or use the same variables as the Next.js app:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

   **Important**: The Studio connects to the **same project and dataset** as the Next.js app.

3. **Run the Studio**:
   ```bash
   npm run dev
   ```

   Studio will be available at: **http://localhost:3333/studio**

## 📁 Folder Structure

```
sanity-studio/
├── package.json          # Studio dependencies
├── sanity.config.ts      # Studio configuration
├── schemas/
│   └── index.ts          # Imports schemas from parent project
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

## 🎨 Available Content Types

The Studio includes these content types (schemas imported from parent project):

- **Course** - Course listings with details, pricing, instructor
- **Instructor** - Instructor profiles with bio, portfolio
- **Blog Article** - Blog posts and articles
- **Homepage Section** - Homepage content sections

## 🔧 Configuration

### Project Connection

The Studio connects to the same Sanity project as the Next.js app:
- **Project ID**: From `SANITY_STUDIO_PROJECT_ID` or `NEXT_PUBLIC_SANITY_PROJECT_ID`
- **Dataset**: From `SANITY_STUDIO_DATASET` or `NEXT_PUBLIC_SANITY_DATASET` (defaults to `production`)

### Schema Location

Schemas are imported from `../sanity/schemas/` (parent directory) to avoid duplication.

## 🚀 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Deploy to sanity.studio (optional)
npm run deploy
```

## 📝 Usage

1. Open http://localhost:3333/studio in your browser
2. Sign in with your Sanity account
3. Start editing content!

**Important Notes**:
- Changes are saved to Sanity CMS
- Next.js app must be rebuilt to see changes (SSG)
- No preview mode configured (static site generation only)

## 🔒 Separation from Next.js

- Studio is completely separate from Next.js app
- No Studio code in `app/` directory
- No backend/server logic added
- This is a **content editor**, not a page builder

## ✅ Verification

After setup, verify:
- ✅ Studio runs on http://localhost:3333/studio
- ✅ All schemas are visible in Studio
- ✅ Next.js app still builds successfully (`npm run build` in parent directory)
- ✅ Both applications use the same Sanity project

## 🆘 Troubleshooting

**Studio won't start**:
- Check environment variables are set correctly
- Verify project ID is correct
- Check Node.js version (18+ required)

**Schemas not visible**:
- Check `sanity-studio/schemas/index.ts` imports are correct
- Verify parent `sanity/schemas/` folder exists
- Check for TypeScript errors

**Can't connect to Sanity**:
- Verify project ID is correct
- Check dataset name matches (`production` by default)
- Ensure you have access to the Sanity project

## 📚 Resources

- [Sanity Studio Documentation](https://www.sanity.io/docs/sanity-studio)
- [Schema Documentation](https://www.sanity.io/docs/schema-types)

