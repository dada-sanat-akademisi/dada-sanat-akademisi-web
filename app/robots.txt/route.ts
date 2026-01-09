/**
 * robots.txt Route Handler
 * 
 * WHY: Production-safe robots.txt that:
 * - Allows all important routes (homepage, courses, blog)
 * - Blocks internal, non-public, and dev routes
 * - References sitemap.xml explicitly
 * - Prevents accidental indexing of admin/preview routes
 * 
 * IMPORTANT: This file is served at /robots.txt
 * Search engines check this FIRST before crawling.
 * 
 * ROUTES THAT MUST NEVER BE INDEXED:
 * - /api/* (internal API routes)
 * - /admin/* (if any admin panel exists)
 * - /_next/* (Next.js internals)
 * - /preview/* (draft content previews)
 * - Any internal utility pages
 * 
 * Google crawls robots.txt on every major crawl, so changes take effect quickly.
 */

import { NextResponse } from 'next/server';

const PRODUCTION_DOMAIN = 'https://dadasanatakademisi.com';

export function GET() {
  const robotsTxt = `# robots.txt for ${PRODUCTION_DOMAIN}


# Allow all major search engines
User-agent: *

# IMPORTANT PUBLIC ROUTES - Always allow indexing
Allow: /

# BLOCK INTERNAL/NON-PUBLIC ROUTES
# API routes (internal, no public content)
Disallow: /api/

# Next.js internal files (not for indexing)
Disallow: /_next/

# Preview/draft routes (should never be indexed)
Disallow: /preview/
Disallow: /preview/*
Disallow: /draft/
Disallow: /draft/*

# Admin routes (if any exist)
Disallow: /admin/
Disallow: /admin/*


# Sitemap location (explicit reference)
Sitemap: ${PRODUCTION_DOMAIN}/sitemap.xml

# Additional sitemaps (if we split into multiple later)
# Sitemap: ${PRODUCTION_DOMAIN}/sitemap-courses.xml
# Sitemap: ${PRODUCTION_DOMAIN}/sitemap-blog.xml
`;

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      // Cache for 24 hours (search engines respect this)
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
