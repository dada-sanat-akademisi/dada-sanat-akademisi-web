import { Metadata } from 'next';
import { CourseGrid } from '@/components/courses/CourseGrid';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { StructuredData } from '@/components/seo/StructuredData';
import { getClient } from '@/lib/sanity/client';
import { COURSES_QUERY } from '@/lib/sanity/queries';
import { normalizeCourseCategory, normalizeCourseLevel } from '@/lib/seo/normalizeCourseCategory';
import type { Course } from '@/types';
import type { BreadcrumbItem } from '@/components/seo/StructuredData';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Kurslar',
  description: 'Müzik, görsel sanatlar ve fotoğrafçılık kursları. Profesyonel eğitim programları.',
  canonicalUrl: '/courses',
  keywords: ['sanat kursu', 'müzik kursu', 'görsel sanatlar kursu', 'fotoğrafçılık kursu'],
});

/**
 * Courses Page - Server Component
 * 
 * Phase 4 Implementation: Static course listing page with SSG.
 * 
 * Architecture:
 * - Server-rendered at build time (SSG)
 * - Fetches courses from Sanity CMS at build time
 * - Graceful fallback if CMS fails
 * - SEO-optimized with proper heading hierarchy
 * 
 * SEO:
 * - Single H1 per page ("Kurslarımız")
 * - Semantic HTML structure
 * - Structured data (breadcrumbs)
 * - All content in initial HTML
 */

interface CourseQueryResult {
  _id: string;
  title: string;
  description: string;
  slug: string;
  imageUrl?: string;
  category?: string;
  level?: string;
  rating?: number;
  instructor?: {
    _id: string;
    name: string;
    imageUrl?: string;
    specialization?: string;
  };
}

async function fetchCourses(): Promise<Course[]> {
  try {
    // getClient() handles configuration validation internally
    // Returns null if NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET are missing
    const client = getClient();
    if (!client) {
      // Graceful fallback: return empty array (page still renders)
      return [];
    }

    const courses = await client.fetch<CourseQueryResult[]>(COURSES_QUERY);
    console.log('COURSES FROM SANITY:', courses);

    if (!courses || courses.length === 0) {
      return [];
    }

    // Transform to Course type
    return courses.map((course) => ({
      slug: course.slug,
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl,
      category: normalizeCourseCategory(course.category),
      level: normalizeCourseLevel(course.level),
      rating: course.rating,
      instructor: course.instructor
        ? {
            id: course.instructor._id,
            name: course.instructor.name,
            imageUrl: course.instructor.imageUrl,
            specialization: course.instructor.specialization,
          }
        : undefined,
    }));
  } catch (error) {
    console.error('Failed to fetch courses from CMS:', error);
    // Graceful degradation: return empty array (page still renders)
    return [];
  }
}

export default async function CoursesPage() {
  const courses = await fetchCourses();

  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Kurslar', url: '/courses' },
  ];

  return (
    <div className="min-h-screen bg-ivory">
      <StructuredData type="breadcrumb" data={breadcrumbs} />
      
      {/* Page Header */}
      <section className="py-20 md:py-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-5xl md:text-6xl font-serif font-medium mb-6 text-center text-charcoal">
            Kurslarımız
          </h1>
          <p className="text-xl text-charcoal/70 text-center max-w-2xl mx-auto mb-16">
            Müzik, görsel sanatlar, performans. Her disiplin, kendi dilini konuşur.
            Sen de bu dillerden birini veya birkaçını keşfetmek istersen, burada başla.
          </p>
        </div>
      </section>

      {/* Course Grid */}
      <section className="px-6 pb-24" aria-labelledby="courses-heading">
        <div className="container mx-auto max-w-7xl">
          {courses.length > 0 ? (
            <>
              <h2 id="courses-heading" className="sr-only">
                Kurs Listesi
              </h2>
              <CourseGrid courses={courses} />
            </>
          ) : (
            <div className="text-center py-24">
              <p className="text-xl text-charcoal/70">
                Şu anda kayıtlı kurs bulunmamaktadır.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
