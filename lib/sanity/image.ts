import imageUrlBuilder from '@sanity/image-url';
import { getClient } from './client';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

/**
 * Sanity Image URL Builder
 * 
 * WHY: Centralized image URL building ensures:
 * - Consistent image optimization
 * - Type safety
 * - Easy to adjust image settings globally
 * 
 * Usage:
 * ```typescript
 * const imageUrl = urlFor(image).width(800).height(600).url();
 * ```
 * 
 * NOTE: Returns null if Sanity is not configured.
 */

let _builder: ReturnType<typeof imageUrlBuilder> | null = null;

function getBuilder() {
  if (!_builder) {
    const client = getClient();
    if (!client) {
      throw new Error(
        'Sanity client is not configured. ' +
        'Please set NEXT_PUBLIC_SANITY_PROJECT_ID in your .env.local file.'
      );
    }
    _builder = imageUrlBuilder(client);
  }
  return _builder;
}

export function urlFor(source: SanityImageSource) {
  const builder = getBuilder();
  return builder.image(source);
}

/**
 * Get optimized image URL with default settings
 * 
 * WHY: Provides sensible defaults for common image use cases.
 * 
 * NOTE: Returns null if Sanity is not configured.
 */
export function getOptimizedImageUrl(
  source: SanityImageSource,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpg' | 'png';
  } = {}
) {
  const { width = 1200, height, quality = 85, format = 'webp' } = options;

  let imageBuilder = urlFor(source).width(width).quality(quality);

  if (height) {
    imageBuilder = imageBuilder.height(height);
  }

  // Sanity image-url builder accepts format as string, but TypeScript type is stricter
  // Cast to any to work around type mismatch (runtime behavior is correct)
  return (imageBuilder.format(format as any) as ReturnType<typeof urlFor>).url();
}

