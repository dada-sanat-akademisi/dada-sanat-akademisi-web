/**
 * Sanity GROQ Queries
 * 
 * WHY: Centralized queries ensure:
 * - Type safety (can be extended with generated types)
 * - Reusability
 * - Easy to maintain
 * - Consistent query patterns
 * 
 * These queries follow Sanity's GROQ syntax.
 */

/**
 * Fetch all courses (only published, excludes drafts)
 */
export const COURSES_QUERY = `*[_type == "course" && defined(slug.current) && !(_id in path("drafts.**"))] | order(_createdAt desc) {
  _id,
  title,
  "description": shortDescription,
  "slug": slug.current,
  "imageUrl": image.asset->url,
  category,
  level,
  rating,
  "instructor": instructor->{
    _id,
    name,
    "imageUrl": image.asset->url,
    specialization
  }
}`;

/**
 * Fetch a single course by slug
 */
export const COURSE_BY_SLUG_QUERY = `*[_type == "course" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
  _id,
  title,
  description,
  "slug": slug.current,
  "imageUrl": image.asset->url,
  "imageAlt": image.alt,
  category,
  level,
  rating,
  reviewCount,
  code,
  price,
  duration,
  spotsAvailable,
  startDate,
  seoTitle,
  seoDescription,
  seoKeywords,
  "instructor": instructor->{
    _id,
    name,
    bio,
    "imageUrl": image.asset->url,
    specialization
  },
  longDescription,
  _updatedAt
}`;

/**
 * Fetch all course slugs for static generation
 */
export const COURSE_SLUGS_QUERY = `*[_type == "course" && defined(slug.current) && !(_id in path("drafts.**"))] {
  "slug": slug.current
}`;

/**
 * Fetch courses by category (only published, excludes drafts)
 */
export const COURSES_BY_CATEGORY_QUERY = `*[_type == "course" && category == $category && defined(slug.current) && !(_id in path("drafts.**"))] | order(_createdAt desc) {
  _id,
  title,
  description,
  "slug": slug.current,
  "imageUrl": image.asset->url,
  category,
  level,
  rating
}`;

/**
 * Fetch all instructors
 */
export const INSTRUCTORS_QUERY = `*[_type == "instructor"] | order(name asc) {
  _id,
  name,
  bio,
  "imageUrl": image.asset->url,
  specialization
}`;

/**
 * Fetch bento grid items (courses featured on homepage)
 */
export const BENTO_GRID_ITEMS_QUERY = `*[_type == "bentoGridItem" && defined(slug.current)] | order(order asc) {
  _id,
  title,
  description,
  "slug": slug.current,
  "href": href,
  icon,
  size,
  color,
  "imageUrl": image.asset->url
}`;

/**
 * Fetch all published blog articles
 */
export const BLOG_ARTICLES_QUERY = `*[_type == "blogArticle" && defined(slug.current) && !(_id in path("drafts.**")) && defined(publishedAt)] | order(publishedAt desc) {
  _id,
  title,
  excerpt,
  "slug": slug.current,
  "featuredImageUrl": featuredImage.asset->url,
  "featuredImageAlt": featuredImage.alt,
  category,
  publishedAt,
  updatedAt,
  readTime,
  "author": author->{
    _id,
    name,
    "imageUrl": image.asset->url
  },
  seoTitle,
  seoDescription,
  seoKeywords
}`;

/**
 * Fetch a single blog article by slug
 */
export const BLOG_ARTICLE_BY_SLUG_QUERY = `*[_type == "blogArticle" && slug.current == $slug && !(_id in path("drafts.**")) && defined(publishedAt)][0] {
  _id,
  title,
  excerpt,
  "slug": slug.current,
  content,
  "featuredImageUrl": featuredImage.asset->url,
  "featuredImageAlt": featuredImage.alt,
  category,
  publishedAt,
  updatedAt,
  readTime,
  viewCount,
  "author": author->{
    _id,
    name,
    bio,
    "imageUrl": image.asset->url,
    specialization
  },
  seoTitle,
  seoDescription,
  seoKeywords
}`;

/**
 * Fetch blog articles by category
 */
export const BLOG_ARTICLES_BY_CATEGORY_QUERY = `*[_type == "blogArticle" && category == $category && defined(slug.current) && !(_id in path("drafts.**")) && defined(publishedAt)] | order(publishedAt desc) {
  _id,
  title,
  excerpt,
  "slug": slug.current,
  "featuredImageUrl": featuredImage.asset->url,
  category,
  publishedAt,
  readTime
}`;

/**
 * Fetch all published announcements (only published, excludes drafts)
 */
export const ANNOUNCEMENTS_QUERY = `*[_type == "announcement" && defined(slug.current) && !(_id in path("drafts.**")) && defined(publishedAt)] | order(publishedAt desc) {
  _id,
  title,
  excerpt,
  "slug": slug.current,
  publishedAt
}`;

/**
 * Fetch a single announcement by slug
 */
export const ANNOUNCEMENT_BY_SLUG_QUERY = `*[_type == "announcement" && slug.current == $slug && !(_id in path("drafts.**")) && defined(publishedAt)][0] {
  _id,
  title,
  excerpt,
  "slug": slug.current,
  content,
  publishedAt,
  ctaText,
  ctaLink
}`;

/**
 * Fetch all announcement slugs for static generation
 */
export const ANNOUNCEMENT_SLUGS_QUERY = `*[_type == "announcement" && defined(slug.current) && !(_id in path("drafts.**")) && defined(publishedAt)] {
  "slug": slug.current
}`;

