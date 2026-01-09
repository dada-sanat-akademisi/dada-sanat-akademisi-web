import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getClient } from '@/lib/sanity/client';
import { COURSE_BY_SLUG_QUERY, COURSE_SLUGS_QUERY } from '@/lib/sanity/queries';
import { generateCourseMetadata } from '@/lib/seo/metadata';
import { StructuredData } from '@/components/seo/StructuredData';
import { PortableText, portableTextToPlainText } from '@/lib/sanity/portable-text';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/components/seo/StructuredData';
import { normalizeCourseCategory } from '@/lib/seo/normalizeCourseCategory';
import type { Course } from '@/types';

/**
 * Course Detail Page - Server Component (SSG)
 * 
 * Phase 5 Implementation: Static course detail page with full SSG support.
 * 
 * Architecture:
 * - All data fetched at build time (generateStaticParams)
 * - Fully static HTML output
 * - No runtime fetching
 * - No backend required
 * 
 * SEO:
 * - Unique title & meta description per course
 * - Canonical URL
 * - Course structured data (JSON-LD)
 * - Breadcrumb schema
 * 
 * Content:
 * - Single H1 per page
 * - All text visible in initial HTML
 * - No text animations
 * - Reading-first experience
 */

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface CourseQueryResult {
  _id: string;
  title: string;
  description: string;
  slug: string;
  imageUrl?: string;
  imageAlt?: string;
  category?: string;
  level?: string;
  rating?: number;
  reviewCount?: number;
  code?: string;
  price?: number;
  duration?: string;
  spotsAvailable?: number;
  startDate?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  instructor?: {
    _id: string;
    name: string;
    bio?: any; // Portable Text (array of blocks)
    imageUrl?: string;
    specialization?: string;
  };
  longDescription?: any; // Portable Text
  _updatedAt?: string;
}

/**
 * Generate static params for all courses at build time
 * 
 * Why this is safe without a backend:
 * - Runs only during `next build`
 * - Fetches from Sanity CMS (content source)
 * - If CMS fails, build continues with empty array (graceful)
 * - No runtime execution (pages are pre-generated)
 * 
 * How new courses are added:
 * 1. Content editor adds course in Sanity CMS
 * 2. Developer runs `next build` (or CI/CD triggers build)
 * 3. This function fetches all course slugs
 * 4. Next.js generates static HTML for each slug
 * 5. Static files are deployed to Hostinger
 */
export async function generateStaticParams() {
  try {
    // getClient() handles configuration validation internally
    // Returns null if NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET are missing
    const client = getClient();
    if (!client) {
      // Graceful fallback: build continues without course pages
      return [];
    }

    const courses = await client.fetch<Array<{ slug: string }>>(COURSE_SLUGS_QUERY);
    console.log('COURSES FROM SANITY:', courses);
    if (!courses || courses.length === 0) {
      return [];
    }

    return courses.map((course) => ({
      slug: course.slug,
    }));
  } catch (error) {
    console.error('Error fetching course slugs for static generation:', error);
    // Graceful fallback: build continues, but no course pages generated
    // This prevents build failures if CMS is temporarily unavailable
    return [];
  }
}

/**
 * Generate metadata for each course at build time
 */
export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    // getClient() handles configuration validation internally
    const client = getClient();
    if (!client) {
      return {
        title: 'Kurs Bulunamadı | Dada Sanat Akademisi',
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const course = await client.fetch<CourseQueryResult>(COURSE_BY_SLUG_QUERY, { slug });

    if (!course) {
      return {
        title: 'Kurs Bulunamadı | Dada Sanat Akademisi',
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    return generateCourseMetadata(
      course.title,
      course.description,
      course.slug,
      course.imageUrl,
      course.seoTitle,
      course.seoDescription
    );
  } catch (error) {
    console.error('Error fetching course for metadata:', error);
    return {
      title: 'Kurs Bulunamadı | Dada Sanat Akademisi',
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;

  let course: CourseQueryResult | null = null;

  try {
    // getClient() handles configuration validation internally
    const client = getClient();
    if (!client) {
      notFound();
    }

    course = await client.fetch<CourseQueryResult>(COURSE_BY_SLUG_QUERY, { slug });
  } catch (error) {
    console.error('Error fetching course:', error);
    notFound();
  }

  if (!course) {
    notFound();
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Kurslar', url: '/courses' },
    { name: course.title, url: `/courses/${course.slug}` },
  ];

  // Course structured data for JSON-LD
  // Normalize category to ensure type safety (CMS = flexible, SEO = strict)
  const courseStructuredData: Course = {
    slug: course.slug,
    title: course.title,
    description: course.description,
    imageUrl: course.imageUrl,
    category: normalizeCourseCategory(course.category),
    level: course.level as 'beginner' | 'intermediate' | 'advanced' | undefined,
    rating: course.rating
      ? {
          value: course.rating,
          count: course.reviewCount || 0,
        }
      : undefined,
    code: course.code,
    instructor: course.instructor
      ? {
          id: course.instructor._id,
          name: course.instructor.name,
          bio: course.instructor.bio,
          imageUrl: course.instructor.imageUrl,
          specialization: course.instructor.specialization,
        }
      : undefined,
  };

  return (
    <div className="min-h-screen bg-ivory">
      <StructuredData type="breadcrumb" data={breadcrumbs} />
      <StructuredData type="course" data={courseStructuredData} />

      {/* Course Hero Section */}
      <section className="pt-24 pb-12 px-6 border-b border-charcoal/10">
        <div className="container mx-auto max-w-4xl">
          {/* Category Badge */}
          {course.category && (
            <span className="inline-block text-sm font-medium text-charcoal/60 mb-4 uppercase tracking-wider">
              {course.category === 'music' && 'Müzik'}
              {course.category === 'visual-arts' && 'Görsel Sanatlar'}
              {course.category === 'photography' && 'Fotoğrafçılık'}
              {course.category === 'mixed-media' && 'Karma Medya'}
              {course.category === 'other' && 'Diğer'}
            </span>
          )}

          {/* H1 - Single H1 per page */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium mb-6 text-charcoal leading-tight">
            {course.title}
          </h1>

          {/* Short Summary */}
          <p className="text-xl md:text-2xl text-charcoal/70 mb-8 leading-relaxed max-w-3xl">
            {course.description}
          </p>

          {/* Primary CTA - Visible without scrolling (desktop) */}
          <div className="mb-8">
            <Button
              asChild
              size="lg"
              className="text-base md:text-lg px-8 md:px-12 py-6 min-h-[44px]"
            >
              <Link href="/apply">Hemen Başvur</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <article className="container mx-auto max-w-4xl px-6 py-12">
        {/* Course Image */}
        {course.imageUrl && (
          <div className="mb-12 rounded-lg overflow-hidden">
            <Image
              src={course.imageUrl}
              alt={course.imageAlt || course.title}
              width={1200}
              height={675}
              className="w-full h-auto"
              priority
            />
          </div>
        )}

        {/* Course Metadata */}
        <div className="grid md:grid-cols-2 gap-8 mb-12 p-6 bg-white rounded-lg border border-charcoal/10 shadow-sm">
          <div>
            <h2 className="text-xl font-serif font-medium mb-4 text-charcoal">
              Kurs Detayları
            </h2>
            <dl className="space-y-3 text-charcoal/70">
              {course.level && (
                <div>
                  <dt className="font-medium text-charcoal mb-1">Seviye:</dt>
                  <dd className="capitalize">
                    {course.level === 'beginner' && 'Başlangıç'}
                    {course.level === 'intermediate' && 'Orta'}
                    {course.level === 'advanced' && 'İleri'}
                  </dd>
                </div>
              )}
              {course.duration && (
                <div>
                  <dt className="font-medium text-charcoal mb-1">Süre:</dt>
                  <dd>{course.duration}</dd>
                </div>
              )}
              {course.price && (
                <div>
                  <dt className="font-medium text-charcoal mb-1">Ücret:</dt>
                  <dd>{course.price.toLocaleString('tr-TR')} ₺</dd>
                </div>
              )}
              {course.code && (
                <div>
                  <dt className="font-medium text-charcoal mb-1">Kurs Kodu:</dt>
                  <dd>{course.code}</dd>
                </div>
              )}
            </dl>
          </div>

          <div>
            <h2 className="text-xl font-serif font-medium mb-4 text-charcoal">
              Eğitmen
            </h2>
            {course.instructor ? (
              <div>
                <h3 className="text-lg font-medium text-charcoal mb-2">
                  {course.instructor.name}
                </h3>
                {course.instructor.specialization && (
                  <p className="text-charcoal/70 mb-2">{course.instructor.specialization}</p>
                )}
                {course.instructor.bio && (
                  <p className="text-charcoal/70 text-sm leading-relaxed">
                    {portableTextToPlainText(course.instructor.bio, 200)}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-charcoal/70">Eğitmen bilgisi yakında eklenecek.</p>
            )}
          </div>
        </div>

        {/* Course Description (Long-form Content) */}
        {course.longDescription && (
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-medium mb-6 text-charcoal">
              Program İçeriği
            </h2>
            <div className="prose max-w-none">
              <PortableText value={course.longDescription} />
            </div>
          </div>
        )}

        {/* Secondary CTA - At bottom of content */}
        <div className="pt-8 border-t border-charcoal/10 text-center">
          <Button
            asChild
            size="lg"
            className="text-base md:text-lg px-8 md:px-12 py-6 min-h-[44px]"
          >
            <Link href="/apply">Hemen Başvur</Link>
          </Button>
        </div>
      </article>
    </div>
  );
}
