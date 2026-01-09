/**
 * Next.js Middleware for SEO Safety
 * 
 * WHY: Handle preview/draft routes with noindex at the middleware level.
 * This ensures draft content is never indexed, even if routes are accessed.
 * 
 * IMPORTANT: 
 * - Preview routes must return noindex headers
 * - Draft content should never be indexed
 * - This is an extra safety layer beyond robots.txt
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Check if we're in draft/preview mode
  // In preview mode, add noindex header
  const isDraft = request.nextUrl.searchParams.has('preview') || 
                  request.nextUrl.searchParams.has('previewSecret') ||
                  request.nextUrl.pathname.startsWith('/preview') ||
                  request.nextUrl.pathname.startsWith('/draft');

  if (isDraft) {
    // Add noindex header for preview/draft routes
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
}

export const config = {
  // Match all routes except static files and API routes
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
