import { Metadata } from 'next';
import Link from 'next/link';
import { getClient } from '@/lib/sanity/client';
import { ANNOUNCEMENTS_QUERY } from '@/lib/sanity/queries';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { StructuredData } from '@/components/seo/StructuredData';
import type { BreadcrumbItem } from '@/components/seo/StructuredData';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Duyurular',
  description: 'Dada Sanat Akademisi duyuruları ve haberleri. Güncel etkinlikler, kurs açılışları ve önemli bilgilendirmeler.',
  canonicalUrl: '/announcements',
  keywords: ['duyuru', 'haber', 'etkinlik', 'kurs açılışı', 'sanat akademisi'],
});

/**
 * Announcements Page - Server Component
 * 
 * Architecture:
 * - Server-rendered at build time (SSG)
 * - Fetches announcements from Sanity CMS at build time
 * - Graceful fallback if CMS fails
 * - SEO-optimized with proper heading hierarchy
 * 
 * SEO:
 * - Single H1 per page ("Duyurular")
 * - Semantic HTML structure
 * - Structured data (breadcrumbs)
 * - All content in initial HTML
 */

interface AnnouncementQueryResult {
  _id: string;
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
}

async function fetchAnnouncements(): Promise<AnnouncementQueryResult[]> {
  try {
    // getClient() handles configuration validation internally
    // Returns null if NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET are missing
    const client = getClient();
    if (!client) {
      // Graceful fallback: return empty array (page still renders)
      return [];
    }

    const announcements = await client.fetch<AnnouncementQueryResult[]>(ANNOUNCEMENTS_QUERY);

    if (!announcements || announcements.length === 0) {
      return [];
    }

    return announcements;
  } catch (error) {
    console.error('Failed to fetch announcements from CMS:', error);
    // Graceful degradation: return empty array (page still renders)
    return [];
  }
}

export default async function AnnouncementsPage() {
  const announcements = await fetchAnnouncements();

  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Duyurular', url: '/announcements' },
  ];

  return (
    <div className="min-h-screen bg-ivory">
      <StructuredData type="breadcrumb" data={breadcrumbs} />
      
      {/* Page Header */}
      <section className="py-20 md:py-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-5xl md:text-6xl font-serif font-medium mb-6 text-center text-charcoal">
            Duyurular
          </h1>
          <p className="text-xl text-charcoal/70 text-center max-w-2xl mx-auto mb-16">
            Güncel duyurular, etkinlikler ve önemli bilgilendirmeler.
          </p>
        </div>
      </section>

      {/* Announcements List */}
      <section className="px-6 pb-24" aria-labelledby="announcements-heading">
        <div className="container mx-auto max-w-4xl">
          {announcements.length > 0 ? (
            <>
              <h2 id="announcements-heading" className="sr-only">
                Duyuru Listesi
              </h2>
              <ul className="space-y-10">
                {announcements.map((announcement) => (
                  <li key={announcement._id}>
                    <article className="border-b border-charcoal/10 pb-8 last:border-b-0">
                      <time
                        dateTime={announcement.publishedAt}
                        className="text-sm text-charcoal/60 mb-2 block"
                      >
                        {new Date(announcement.publishedAt).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                      <h3 className="text-2xl md:text-3xl font-serif font-medium mb-3 text-charcoal">
                        <Link
                          href={`/announcements/${announcement.slug}`}
                          className="hover:text-gold transition-colors"
                        >
                          {announcement.title}
                        </Link>
                      </h3>
                      <p className="text-lg text-charcoal/70 mb-4 leading-relaxed">
                        {announcement.excerpt}
                      </p>
                      <Link
                        href={`/announcements/${announcement.slug}`}
                        className="text-gold hover:text-gold-100 underline underline-offset-2 font-medium"
                      >
                        Devamını oku →
                      </Link>
                    </article>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="text-center py-24">
              <p className="text-xl text-charcoal/70">
                Şu anda duyuru bulunmamaktadır.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

