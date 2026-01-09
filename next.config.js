/**
 * Next.js Production Configuration
 * 
 * WHY: Optimized for Hostinger deployment with:
 * - Image optimization (Sanity CDN)
 * - Performance headers (caching, security)
 * - Bundle optimization (tree-shaking)
 * - Production-safe settings
 * 
 * IMPORTANT: This configuration is production-ready for Hostinger.
 * Test locally with `npm run build && npm start` before deploying.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // React strict mode (catches bugs in development)
  reactStrictMode: true,

  // Image optimization
  images: {
    // Sanity CDN domain (required for image optimization)
    domains: ['cdn.sanity.io'],
    // Modern formats (AVIF > WebP > fallback)
    formats: ['image/avif', 'image/webp'],
    // Image sizes (optimize for different screen sizes)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimum cache time (7 days)
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },

  // Performance optimizations
  experimental: {
    // Tree-shake unused exports from these packages
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },

  // Compression (gzip/brotli)
  compress: true,

  // Production optimizations
  swcMinify: true, // Use SWC minifier (faster than Terser)

  // Headers for performance and security
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          // DNS prefetch (performance)
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // Frame options (security)
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // Content type options (security)
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // XSS protection (security)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Referrer policy (privacy)
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      // Cache static image files
      {
        source: '/:path*\\.jpg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*\\.jpeg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*\\.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*\\.gif',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*\\.webp',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*\\.avif',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*\\.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*\\.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache font files
      {
        source: '/:path*\\.woff',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*\\.woff2',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*\\.ttf',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*\\.eot',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache Next.js static files
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Output configuration (for Hostinger)
  output: 'standalone', // Creates optimized standalone build (smaller, faster)
  
  // Power saving (optional, for Hostinger resource limits)
  // Reduces memory usage in production
  poweredByHeader: false, // Remove X-Powered-By header (security)
};

module.exports = nextConfig;

