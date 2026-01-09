/**
 * Sanity Preview Mode Route Handler
 * 
 * WHY: Allows content editors to preview draft content from Sanity.
 * These preview routes MUST have noindex to prevent indexing draft content.
 * 
 * IMPORTANT: Preview routes should:
 * - Set noindex robots meta tag
 * - Require authentication (Sanity token)
 * - Only work in development or with proper auth in production
 * 
 * This route enables Sanity's preview mode for Next.js.
 */

import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  // Validate secret token (should match SANITY_PREVIEW_SECRET env var)
  if (!secret || secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid secret', { status: 401 });
  }

  // Enable draft mode
  draftMode().enable();

  // Redirect to the slug (with preview mode enabled)
  redirect(slug || '/');
}

/**
 * DISABLE PREVIEW MODE
 * 
 * Use this route to exit preview mode:
 * /api/exit-preview
 */
