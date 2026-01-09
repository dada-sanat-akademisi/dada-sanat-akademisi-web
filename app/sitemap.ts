/**
 * Dynamic Sitemap Generator
 * 
 * WHY: Auto-updating sitemap that includes:
 * - Homepage
 * - Course listing pages
 * - Course detail pages (from Sanity)
 * - Blog articles (from Sanity)
 * 
 * IMPORTANT: 
 * - Updates automatically when CMS content changes
 * - Uses correct canonical URLs (production domain only)
 * - Proper priority and change frequency for SEO
 * - Lastmod dates for better crawl efficiency
 * 
 * HOW IT UPDATES:
 * - Next.js regenerates this on each build
 * - If using ISR, it regenerates on revalidation
 * - Sanity webhooks can trigger rebuilds on content changes
 * 
 * TO EXTEND LATER:
 * - Add category pages: /courses/music, /courses/visual-arts
 * - Add instructor pages: /instructors/[slug]
 * - Add tag pages: /blog/tag/[tag]
 * - Split into multiple sitemaps if > 50k URLs (sitemap index)
 */

import { MetadataRoute } from 'next';
import { getClient } from '@/lib/sanity/client';
import { COURSES_QUERY } from '@/lib/sanity/queries';

const PRODUCTION_DOMAIN = 'https://dadasanatakademisi.com';

interface Course {
  _id: string;
  slug: string;
  _updatedAt: string;
}

interface BlogArticle {
  _id: string;
  slug: string;
  _updatedAt: string;
  publishedAt: string;
}

/**
 * Fetch all published courses from Sanity
 */
async function getCourses(): Promise<Course[]> {
  const client = getClient();
  if (!client) {
    return [];
  }

  try {
    const courses = await client.fetch<Course[]>(
      `*[_type == "course" && defined(slug.current) && !(_id in path("drafts.**"))] | order(_updatedAt desc) {
        _id,
        "slug": slug.current,
        _updatedAt
      }`
    );
    return courses || [];
  } catch (error) {
    console.error('Error fetching courses for sitemap:', error);
    return [];
  }
}

/**
 * Fetch all published blog articles from Sanity
 */
async function getBlogArticles(): Promise<BlogArticle[]> {
  const client = getClient();
  if (!client) {
    return [];
  }

  try {
    const articles = await client.fetch<BlogArticle[]>(
      `*[_type == "blogArticle" && defined(slug.current) && !(_id in path("drafts.**")) && defined(publishedAt)] | order(publishedAt desc) {
        _id,
        "slug": slug.current,
        _updatedAt,
        publishedAt
      }`
    );
    return articles || [];
  } catch (error) {
    console.error('Error fetching blog articles for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = PRODUCTION_DOMAIN;

  // Fetch dynamic content
  const [courses, blogArticles] = await Promise.all([
    getCourses(),
    getBlogArticles(),
  ]);

  // Homepage (highest priority)
  const homepage: MetadataRoute.Sitemap[0] = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  };

  // Course listing page
  const coursesPage: MetadataRoute.Sitemap[0] = {
    url: `${baseUrl}/courses`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  };

  // Individual course pages
  const coursePages: MetadataRoute.Sitemap = courses.map((course) => ({
    url: `${baseUrl}/courses/${course.slug}`,
    lastModified: course._updatedAt ? new Date(course._updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Blog listing page (if exists - can be added later)
  // For now, we'll skip if no blog route exists

  // Individual blog article pages
  const blogPages: MetadataRoute.Sitemap = blogArticles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: article._updatedAt
      ? new Date(article._updatedAt)
      : article.publishedAt
      ? new Date(article.publishedAt)
      : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Application page
  const applyPage: MetadataRoute.Sitemap[0] = {
    url: `${baseUrl}/apply`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  };

  // Combine all URLs
  return [homepage, coursesPage, ...coursePages, ...blogPages, applyPage];
}

/**
 * PRIORITY EXPLANATION:
 * 
 * 1.0 - Homepage (most important)
 * 0.9 - Main category/listing pages (high visibility)
 * 0.8 - Individual course pages (core content)
 * 0.7 - Blog articles (content marketing)
 * 0.6 - Application/contact pages (lower priority)
 * 
 * CHANGE FREQUENCY:
 * 
 * daily - Homepage, listing pages (frequently updated content)
 * weekly - Course pages (content may be updated)
 * monthly - Blog articles, static pages (less frequent changes)
 * 
 * These are hints to search engines, not strict rules.
 * Google determines actual crawl frequency based on site activity.
 */
