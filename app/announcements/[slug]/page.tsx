import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getClient } from '@/lib/sanity/client';
import { ANNOUNCEMENT_BY_SLUG_QUERY, ANNOUNCEMENT_SLUGS_QUERY } from '@/lib/sanity/queries';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { StructuredData } from '@/components/seo/StructuredData';
import { PortableText } from '@/lib/sanity/portable-text';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/components/seo/StructuredData';

/**
 * Announcement Detail Page - Server Component (SSG)
 * 
 * Architecture:
 * - All data fetched at build time (generateStaticParams)
 * - Fully static HTML output
 * - No runtime fetching
 * - No backend required
 * 
 * SEO:
 * - Unique title & meta description per announcement
 * - Canonical URL
 * - Breadcrumb schema
 * 
 * Content:
 * - Single H1 per page
 * - All text visible in initial HTML
 * - Portable Text rendered safely
 * - Optional CTA rendered only if both text + link exist
 */

interface AnnouncementPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface AnnouncementQueryResult {
  _id: string;
  title: string;
  excerpt: string;
  slug: string;
  content: any; // Portable Text
  publishedAt: string;
  ctaText?: string;
  ctaLink?: string;
}

/**
 * Generate static params for all announcements at build time
 * 
 * Why this is safe without a backend:
 * - Runs only during `next build`
 * - Fetches from Sanity CMS (content source)
 * - If CMS fails, build continues with empty array (graceful)
 * - No runtime execution (pages are pre-generated)
 * 
 * How new announcements are added:
 * 1. Content editor adds announcement in Sanity CMS
 * 2. Developer runs `next build` (or CI/CD triggers build)
 * 3. This function fetches all announcement slugs
 * 4. Next.js generates static HTML for each slug
 * 5. Static files are deployed
 */
export async function generateStaticParams() {
  try {
    // getClient() handles configuration validation internally
    // Returns null if NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET are missing
    const client = getClient();
    if (!client) {
      // Graceful fallback: build continues without announcement pages
      return [];
    }

    const announcements = await client.fetch<Array<{ slug: string }>>(ANNOUNCEMENT_SLUGS_QUERY);
    if (!announcements || announcements.length === 0) {
      return [];
    }

    return announcements.map((announcement) => ({
      slug: announcement.slug,
    }));
  } catch (error) {
    console.error('Error fetching announcement slugs for static generation:', error);
    // Graceful fallback: build continues, but no announcement pages generated
    // This prevents build failures if CMS is temporarily unavailable
    return [];
  }
}

/**
 * Generate metadata for each announcement at build time
 */
export async function generateMetadata({ params }: AnnouncementPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    // getClient() handles configuration validation internally
    const client = getClient();
    if (!client) {
      return {
        title: 'Duyuru Bulunamadı | Dada Sanat Akademisi',
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const announcement = await client.fetch<AnnouncementQueryResult>(ANNOUNCEMENT_BY_SLUG_QUERY, {
      slug,
    });

    if (!announcement) {
      return {
        title: 'Duyuru Bulunamadı | Dada Sanat Akademisi',
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    return generateSEOMetadata({
      title: announcement.title,
      description: announcement.excerpt,
      canonicalUrl: `/announcements/${announcement.slug}`,
      ogType: 'article',
      publishedTime: announcement.publishedAt,
    });
  } catch (error) {
    console.error('Error fetching announcement for metadata:', error);
    return {
      title: 'Duyuru Bulunamadı | Dada Sanat Akademisi',
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function AnnouncementPage({ params }: AnnouncementPageProps) {
  const { slug } = await params;

  let announcement: AnnouncementQueryResult | null = null;

  try {
    // getClient() handles configuration validation internally
    const client = getClient();
    if (!client) {
      notFound();
    }

    announcement = await client.fetch<AnnouncementQueryResult>(ANNOUNCEMENT_BY_SLUG_QUERY, {
      slug,
    });
  } catch (error) {
    console.error('Error fetching announcement:', error);
    notFound();
  }

  if (!announcement) {
    notFound();
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Duyurular', url: '/announcements' },
    { name: announcement.title, url: `/announcements/${announcement.slug}` },
  ];

  // Determine if CTA should be shown (both text and link must exist)
  const showCTA = announcement.ctaText && announcement.ctaLink;

  return (
    <div className="min-h-screen bg-ivory">
      <StructuredData type="breadcrumb" data={breadcrumbs} />

      {/* Announcement Header */}
      <section className="pt-24 pb-12 px-6 border-b border-charcoal/10">
        <div className="container mx-auto max-w-4xl">
          {/* Publication Date */}
          <time
            dateTime={announcement.publishedAt}
            className="text-sm text-charcoal/60 mb-4 block"
          >
            {new Date(announcement.publishedAt).toLocaleDateString('tr-TR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>

          {/* H1 - Single H1 per page */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium mb-6 text-charcoal leading-tight">
            {announcement.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl md:text-2xl text-charcoal/70 mb-8 leading-relaxed max-w-3xl">
            {announcement.excerpt}
          </p>
        </div>
      </section>

      {/* Announcement Content */}
      <article className="container mx-auto max-w-4xl px-6 py-12">
        {/* Portable Text Content */}
        {announcement.content && (
          <div className="mb-12">
            <div className="prose max-w-none">
              <PortableText value={announcement.content} />
            </div>
          </div>
        )}

        {/* Optional CTA - Only rendered if both text and link exist */}
        {showCTA && (
          <div className="pt-8 border-t border-charcoal/10 text-center">
            <Button
              asChild
              size="lg"
              className="text-base md:text-lg px-8 md:px-12 py-6 min-h-[44px]"
            >
              <Link
                href={announcement.ctaLink!}
                {...(announcement.ctaLink!.startsWith('http')
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {announcement.ctaText}
              </Link>
            </Button>
          </div>
        )}

        {/* Back to Announcements */}
        <div className="pt-8 border-t border-charcoal/10 text-center">
          <Link
            href="/announcements"
            className="text-gold hover:text-gold-100 underline underline-offset-2 font-medium"
          >
            ← Tüm duyurulara dön
          </Link>
        </div>
      </article>
    </div>
  );
}

