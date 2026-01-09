import { BentoGridItem, type BentoGridItemData } from './BentoGridItem';
import { BentoGridClient } from './BentoGridClient';
import { getClient } from '@/lib/sanity/client';
import { BENTO_GRID_ITEMS_QUERY } from '@/lib/sanity/queries';

/**
 * Bento Grid Component (Server Component)
 * 
 * WHY: This component fetches data from CMS (Sanity) on the server.
 * The grid items are rendered as client components for interactivity.
 * 
 * Architecture:
 * - Server Component: Fetches data, renders structure
 * - Client Component: Handles animations and interactions
 * - Fallback: Static data if CMS fails
 * 
 * Glassmorphism: Creates depth while maintaining the luxury aesthetic.
 * The slight expansion on hover creates micro-interactions that feel intentional.
 */

// Fallback data (used if CMS fails or during development)
const FALLBACK_ITEMS: BentoGridItemData[] = [
  {
    id: '1',
    title: 'Müzik Atölyesi',
    description: 'Sesinle dokun, tellerle konuş. Her enstrüman, seninle birlikte nefes alır.',
    href: '/courses',
    size: 'large',
  },
  {
    id: '2',
    title: 'Görsel Üretim Atölyesi',
    description: 'Boş tuval, sonsuz olasılık. Görünmeyeni görünür kılan eller.',
    href: '/courses',
    size: 'large',
  },
  {
    id: '3',
    title: 'Performans Atölyesi',
    description: 'Bedenin şiiri, hareketin manifestosu. Fiziksel sınırları aşarak ruhsal özgürlüğe ulaşmak.',
    href: '/courses',
    size: 'large',
  },
];


async function fetchBentoGridItems(): Promise<BentoGridItemData[]> {
  try {
    // getClient() handles configuration validation internally
    // Returns null if NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET are missing
    const client = getClient();
    if (!client) {
      // Graceful fallback: use static data
      return FALLBACK_ITEMS;
    }

    const items = await client.fetch<Array<{
      _id: string;
      title: string;
      description: string;
      slug?: string;
      href?: string;
      size: 'small' | 'medium' | 'large';
      imageUrl?: string;
    }>>(BENTO_GRID_ITEMS_QUERY);

    if (!items || items.length === 0) {
      return FALLBACK_ITEMS;
    }

    // Transform CMS data to component format
    return items.map((item) => ({
      id: item._id,
      title: item.title,
      description: item.description,
      href: item.href || item.slug || '#',
      size: item.size || 'large',
      imageUrl: item.imageUrl,
    }));
  } catch (error) {
    console.error('Failed to fetch Bento Grid items from CMS:', error);
    // Graceful degradation: return fallback data
    return FALLBACK_ITEMS;
  }
}

export async function BentoGrid() {
  const items = await fetchBentoGridItems();

  return (
    <section className="py-32 px-6 bg-ivory" aria-labelledby="bento-grid-heading">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 id="bento-grid-heading" className="text-4xl md:text-5xl font-serif font-medium mb-4 text-charcoal">
            Atölye Kapıları
          </h2>
          <p className="text-xl text-charcoal/70 max-w-2xl mx-auto">
            Her atölye, kendi dünyasına açılan bir kapı. İçeri gir, keşfet, üret.
          </p>
        </div>

        {/* Bento Grid (Client Component for animations) */}
        <BentoGridClient items={items} />
      </div>
    </section>
  );
}

