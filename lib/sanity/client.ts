import { createClient, type SanityClient } from 'next-sanity';

/**
 * Sanity.io Client Configuration
 * 
 * WHY: Centralized client configuration ensures:
 * - Type safety
 * - Environment variable validation (lazy, only when used)
 * - Consistent API version
 * - CDN usage in production
 * 
 * This client is used for all Sanity queries across the application.
 * 
 * IMPORTANT: Client creation is lazy to allow the app to work without
 * Sanity configured (uses fallback data instead).
 * 
 * ENVIRONMENT VARIABLES (Required for Next.js app):
 * - NEXT_PUBLIC_SANITY_PROJECT_ID: Your Sanity project ID (required)
 * - NEXT_PUBLIC_SANITY_DATASET: Your Sanity dataset (required, typically 'production')
 * - NEXT_PUBLIC_SANITY_API_VERSION: API version (optional, defaults to '2024-01-01')
 * 
 * NOTE: SANITY_STUDIO_* variables are used by Sanity Studio only (separate folder).
 * Next.js app requires NEXT_PUBLIC_* prefix to expose variables to the browser.
 * 
 * DATA FLOW (SSG - Static Site Generation):
 * 
 * 1. Content Editor → Sanity Studio (/sanity-studio folder)
 *    - Uses: SANITY_STUDIO_PROJECT_ID, SANITY_STUDIO_DATASET
 *    - Publishes content to Sanity Cloud
 * 
 * 2. Build Time → Next.js SSG (runs during `next build`)
 *    - Uses: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
 *    - Fetches published content from Sanity Cloud via GROQ API
 *    - Executes COURSES_QUERY in app/courses/page.tsx
 *    - Generates static HTML files
 * 
 * 3. Runtime → Static HTML served
 *    - No runtime API calls to Sanity
 *    - No client-side fetching
 *    - Fully static pages (no backend required)
 * 
 * IMPORTANT: This is a static-first architecture. Data is fetched at build time,
 * not at runtime. To see new content, rebuild and redeploy.
 */

let _client: SanityClient | null = null;
let _previewClient: SanityClient | null = null;

/**
 * Check if Sanity is properly configured for Next.js app
 * 
 * WHY: Validates that required NEXT_PUBLIC_* environment variables are set.
 * This check ensures the client can be created successfully.
 * 
 * IMPORTANT: Only checks NEXT_PUBLIC_* variables (not SANITY_STUDIO_*).
 * SANITY_STUDIO_* variables are scoped to the Studio app only.
 * 
 * Checks:
 * - NEXT_PUBLIC_SANITY_PROJECT_ID (required)
 * - NEXT_PUBLIC_SANITY_DATASET (validated, but defaults to 'production' in getClient() if not set)
 */
export function isSanityConfigured(): boolean {
  // Check both PROJECT_ID and DATASET
  // PROJECT_ID is required (no default)
  // DATASET is validated here, but getClient() will use 'production' as default if not set
  return !!(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
    process.env.NEXT_PUBLIC_SANITY_DATASET
  );
}

/**
 * Get the main Sanity client (lazy initialization)
 * 
 * WHY: Lazy initialization allows the app to work without Sanity configured.
 * Components should check if client is available before using it.
 * 
 * Returns null if configuration is invalid (graceful degradation).
 * Never throws in production builds.
 */
export function getClient(): SanityClient | null {
  // Return null if required env vars are missing (graceful degradation)
  if (!isSanityConfigured()) {
    // In development: log clear warning to help developers
    // In production: fail silently (no console noise)
    if (process.env.NODE_ENV === 'development') {
      const missingVars: string[] = [];
      if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
        missingVars.push('NEXT_PUBLIC_SANITY_PROJECT_ID');
      }
      if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
        missingVars.push('NEXT_PUBLIC_SANITY_DATASET');
      }
      
      console.warn(
        '[Sanity Client] Missing required environment variables:\n' +
        `  - ${missingVars.join('\n  - ')}\n` +
        '\n' +
        'Please add these to your .env.local file at the project root.\n' +
        'NOTE: SANITY_STUDIO_* variables are for Studio only, not the Next.js app.\n' +
        'The Next.js app requires NEXT_PUBLIC_* prefix to expose variables to the browser.'
      );
    }
    return null;
  }

  // Create client on first use
  if (!_client) {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!; // Required (validated by isSanityConfigured)
    const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

    // TEMPORARY DEBUG LOG (remove after verification)
    // Logs configuration to help diagnose env variable issues
    if (process.env.NODE_ENV === 'development') {
      console.log('[Sanity Client] Initializing with:', {
        projectId: projectId.substring(0, 8) + '...', // Partial ID for security
        dataset,
        apiVersion,
      });
    }

    _client = createClient({
      projectId,
      dataset,
      apiVersion, // Use env var if provided, otherwise default
      useCdn: process.env.NODE_ENV === 'production', // CDN for production, fresh data for dev
      perspective: 'published', // Only fetch published content
    });
  }

  return _client;
}

/**
 * Get the preview client (for content editors)
 * 
 * WHY: Allows content editors to preview draft content before publishing.
 * This client bypasses CDN and fetches draft content.
 * 
 * Returns null if configuration is invalid (graceful degradation).
 * Never throws in production builds.
 */
export function getPreviewClient(): SanityClient | null {
  // Return null if required env vars are missing (graceful degradation)
  if (!isSanityConfigured()) {
    return null;
  }

  // Create preview client on first use
  if (!_previewClient) {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!; // Required (validated by isSanityConfigured)
    const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

    _previewClient = createClient({
      projectId,
      dataset,
      apiVersion, // Use env var if provided, otherwise default
      useCdn: false, // Always fresh data for previews
      perspective: 'drafts', // Fetch draft content
      token: process.env.SANITY_API_TOKEN, // Optional for draft access
    });
  }

  return _previewClient;
}

/**
 * Get the appropriate client based on preview mode
 * 
 * @deprecated Use getClient() or getPreviewClient() directly
 */
export function getClientForPreview(preview?: boolean): SanityClient | null {
  if (preview && process.env.SANITY_API_TOKEN) {
    return getPreviewClient();
  }
  return getClient();
}


/**
 * Default client export (lazy, throws only when accessed if not configured)
 * 
 * @deprecated Use getClient() instead for better error handling.
 * This export is kept for backward compatibility.
 * 
 * IMPORTANT: Accessing properties on this will throw if Sanity is not configured.
 * Use getClient() which returns null gracefully.
 */
export const client = new Proxy({} as SanityClient, {
  get(_target, prop) {
    const clientInstance = getClient();
    if (!clientInstance) {
      throw new Error(
        'Sanity client is not configured. ' +
        'Please set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET ' +
        'in your .env.local file at the project root. ' +
        'NOTE: SANITY_STUDIO_* variables are for Studio only, not the Next.js app. ' +
        'The app will use fallback data until Sanity is configured.'
      );
    }
    const value = (clientInstance as any)[prop];
    // If it's a function, bind it to the client instance
    if (typeof value === 'function') {
      return value.bind(clientInstance);
    }
    return value;
  },
});

