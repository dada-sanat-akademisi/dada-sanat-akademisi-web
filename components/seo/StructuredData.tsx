import { Course, Instructor, Organization, BlogPost } from '@/types';

const PRODUCTION_DOMAIN = 'https://dadasanatakademisi.com';

/**
 * Structured Data Component
 * 
 * WHY: SEO-first approach. Structured data helps search engines understand
 * the content, improving visibility for course listings, blog posts, and instructor profiles.
 * 
 * This follows JSON-LD format as recommended by Google (JSON-LD only, no microdata).
 * 
 * SCHEMA TYPES SUPPORTED:
 * - Organization: Homepage, about pages
 * - Course: Course detail pages (enables rich results in search)
 * - BlogPosting: Blog article pages (enables article rich results)
 * - BreadcrumbList: Navigation breadcrumbs (enables breadcrumb rich results)
 * - Person: Instructor profiles
 * 
 * WHICH PAGES BENEFIT MOST:
 * - Homepage: Organization schema
 * - Course pages: Course + BreadcrumbList schemas
 * - Blog posts: BlogPosting + BreadcrumbList schemas
 * - Instructor pages: Person schema (if implemented)
 */

interface StructuredDataProps {
  type: 'organization' | 'course' | 'instructor' | 'blogPost' | 'breadcrumb';
  data: Organization | Course | Instructor | BlogPost | BreadcrumbItem[];
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'organization':
        const org = data as Organization;
        return {
          '@context': 'https://schema.org',
          '@type': 'EducationalOrganization',
          name: 'Dada Sanat Akademisi',
          description: org.description || 'Müzik & Görsel Sanatlar Akademisi',
          url: PRODUCTION_DOMAIN,
          logo: `${PRODUCTION_DOMAIN}/logo.png`,
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'TR',
            addressLocality: org.location || 'İstanbul',
          },
          sameAs: org.socialLinks || [],
        };

      case 'course':
        const course = data as Course;
        const courseSchema: any = {
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: course.title,
          description: course.description,
          provider: {
            '@type': 'EducationalOrganization',
            name: 'Dada Sanat Akademisi',
            url: PRODUCTION_DOMAIN,
          },
          url: `${PRODUCTION_DOMAIN}/courses/${course.slug || course.id}`,
        };

        if (course.code) {
          courseSchema.courseCode = course.code;
        }

        if (course.level) {
          // Map to schema.org educational level
          const levelMap: Record<string, string> = {
            beginner: 'Beginner',
            intermediate: 'Intermediate',
            advanced: 'Advanced',
          };
          courseSchema.educationalLevel = levelMap[course.level] || course.level;
        }

        if (course.rating) {
          const ratingValue = typeof course.rating === 'number' 
            ? course.rating 
            : course.rating.value;
          const reviewCount = typeof course.rating === 'number' 
            ? 0 
            : course.rating.count;
          
          courseSchema.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue,
            reviewCount,
          };
        }

        if (course.instructor) {
          courseSchema.instructor = {
            '@type': 'Person',
            name: course.instructor.name,
            ...(course.instructor.bio && { description: course.instructor.bio }),
          };
        }

        if (course.imageUrl) {
          courseSchema.image = course.imageUrl.startsWith('http')
            ? course.imageUrl
            : `${PRODUCTION_DOMAIN}${course.imageUrl}`;
        }

        return courseSchema;

      case 'blogPost':
        const blogPost = data as BlogPost;
        const blogSchema: any = {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: blogPost.title,
          description: blogPost.excerpt,
          url: `${PRODUCTION_DOMAIN}/blog/${blogPost.slug}`,
          datePublished: blogPost.publishedAt,
          publisher: {
            '@type': 'Organization',
            name: 'Dada Sanat Akademisi',
            logo: {
              '@type': 'ImageObject',
              url: `${PRODUCTION_DOMAIN}/logo.png`,
            },
          },
        };

        if (blogPost.author) {
          blogSchema.author = {
            '@type': 'Person',
            name: blogPost.author.name,
          };
        }

        if (blogPost.image) {
          blogSchema.image = {
            '@type': 'ImageObject',
            url: blogPost.image.startsWith('http') 
              ? blogPost.image 
              : `${PRODUCTION_DOMAIN}${blogPost.image}`,
          };
        }

        return blogSchema;

      case 'breadcrumb':
        const breadcrumbs = data as BreadcrumbItem[];
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url.startsWith('http') 
              ? item.url 
              : `${PRODUCTION_DOMAIN}${item.url}`,
          })),
        };

      case 'instructor':
        const instructor = data as Instructor;
        return {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: instructor.name,
          jobTitle: 'Sanat Eğitmeni',
          description: instructor.bio,
          ...(instructor.imageUrl && { image: instructor.imageUrl }),
          worksFor: {
            '@type': 'EducationalOrganization',
            name: 'Dada Sanat Akademisi',
            url: PRODUCTION_DOMAIN,
          },
        };

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  // Remove undefined properties to ensure valid JSON-LD
  const cleanData = JSON.parse(JSON.stringify(structuredData));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanData) }}
    />
  );
}

