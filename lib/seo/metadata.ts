/**
 * SEO Metadata Utilities
 * 
 * WHY: Centralized metadata generation ensures:
 * - Consistent canonical URLs (production domain only)
 * - Optimized title lengths (50-60 chars for CTR)
 * - Meta descriptions (150-160 chars, no empty)
 * - Absolute Open Graph image URLs
 * - Proper locale handling (Turkish)
 * 
 * IMPORTANT:
 * - Canonical URLs prevent duplicate content penalties
 * - Title length optimized for CTR, not keyword stuffing
 * - OG images must be absolute URLs (1200x630 recommended)
 * 
 * TITLE DECISIONS:
 * - Max 60 chars (Google truncates at ~60)
 * - Include brand at end: "Page | Dada Sanat Akademisi"
 * - Template in layout.tsx handles this automatically
 * 
 * CANONICAL PLACEMENT:
 * - In <head>, before other meta tags
 * - Next.js Metadata API handles this automatically
 * - Always use production domain, never trailing slash issues
 */

import { Metadata } from 'next';
import { urlFor } from '@/lib/sanity/image';

const PRODUCTION_DOMAIN = 'https://dadasanatakademisi.com';
const DEFAULT_OG_IMAGE = `${PRODUCTION_DOMAIN}/og-default.jpg`; // Should be created: 1200x630px

export interface SEOConfig {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noindex?: boolean;
  keywords?: string[];
}

/**
 * Generate optimized metadata for a page
 * 
 * @param config - SEO configuration
 * @returns Next.js Metadata object
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    canonicalUrl,
    ogImage,
    ogImageAlt,
    ogType = 'website',
    publishedTime,
    modifiedTime,
    author,
    noindex = false,
    keywords = [],
  } = config;

  // Ensure description is not empty (SEO requirement)
  const metaDescription = description.trim() || 'Dada Sanat Akademisi - Müzik & Görsel Sanatlar Akademisi';
  
  // Ensure title is not empty
  const metaTitle = title.trim() || 'Dada Sanat Akademisi';

  // Canonical URL (must be absolute)
  const canonical = canonicalUrl
    ? canonicalUrl.startsWith('http')
      ? canonicalUrl
      : `${PRODUCTION_DOMAIN}${canonicalUrl.startsWith('/') ? canonicalUrl : `/${canonicalUrl}`}`
    : undefined;

  // Open Graph image (must be absolute URL)
  const ogImageUrl = ogImage
    ? ogImage.startsWith('http')
      ? ogImage
      : ogImage.startsWith('//')
      ? `https:${ogImage}`
      : `${PRODUCTION_DOMAIN}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`
    : DEFAULT_OG_IMAGE;

  const metadata: Metadata = {
    title: metaTitle,
    description: metaDescription,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: author ? [{ name: author }] : undefined,
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: ogType,
      locale: 'tr_TR',
      url: canonical || PRODUCTION_DOMAIN,
      siteName: 'Dada Sanat Akademisi',
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogImageAlt || metaTitle,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: canonical || PRODUCTION_DOMAIN,
    },
  };

  return metadata;
}

/**
 * Generate metadata for a course page
 */
export function generateCourseMetadata(
  courseTitle: string,
  courseDescription: string,
  courseSlug: string,
  courseImage?: string,
  seoTitle?: string,
  seoDescription?: string
): Metadata {
  const title = seoTitle || courseTitle;
  const description = seoDescription || courseDescription;

  let ogImageUrl: string | undefined;
  if (courseImage) {
    try {
      ogImageUrl = urlFor(courseImage).width(1200).height(630).url();
    } catch (error) {
      // Sanity might not be configured, use default
      ogImageUrl = DEFAULT_OG_IMAGE;
    }
  }

  return generateMetadata({
    title,
    description,
    canonicalUrl: `/courses/${courseSlug}`,
    ogImage: ogImageUrl,
    ogImageAlt: courseTitle,
    ogType: 'website',
    keywords: ['sanat kursu', 'müzik eğitimi', courseTitle],
  });
}

/**
 * Generate metadata for a blog article
 */
export function generateBlogMetadata(
  articleTitle: string,
  articleExcerpt: string,
  articleSlug: string,
  articleImage?: string,
  publishedAt?: string,
  updatedAt?: string,
  author?: string,
  seoTitle?: string,
  seoDescription?: string,
  keywords?: string[]
): Metadata {
  const title = seoTitle || articleTitle;
  const description = seoDescription || articleExcerpt;

  let ogImageUrl: string | undefined;
  if (articleImage) {
    try {
      ogImageUrl = urlFor(articleImage).width(1200).height(630).url();
    } catch (error) {
      // Sanity might not be configured, use default
      ogImageUrl = DEFAULT_OG_IMAGE;
    }
  }

  return generateMetadata({
    title,
    description,
    canonicalUrl: `/blog/${articleSlug}`,
    ogImage: ogImageUrl,
    ogImageAlt: articleTitle,
    ogType: 'article',
    publishedTime: publishedAt,
    modifiedTime: updatedAt || publishedAt,
    author,
    keywords: keywords || ['sanat', 'eğitim', 'blog'],
  });
}

/**
 * Sanitize and truncate text for SEO
 */
export function truncateForSEO(text: string, maxLength: number): string {
  if (!text) return '';
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  
  // Truncate at word boundary
  const truncated = trimmed.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}

/**
 * Generate breadcrumb structured data URLs
 */
export function generateBreadcrumbUrls(paths: Array<{ name: string; url: string }>) {
  return paths.map((path, index) => ({
    name: path.name,
    url: path.url.startsWith('http') ? path.url : `${PRODUCTION_DOMAIN}${path.url}`,
    position: index + 1,
  }));
}
