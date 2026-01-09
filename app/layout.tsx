import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = generateSEOMetadata({
  title: 'Dada Sanat Akademisi | Müzik & Görsel Sanatlar Akademisi',
  description: 'Kontrollü kaos ve sanatsal isyanın, saat gibi hassas ritim ve disiplinle buluştuğu yaşayan dijital sanat galerisi.',
  canonicalUrl: '/',
  keywords: ['sanat akademisi', 'müzik eğitimi', 'görsel sanatlar', 'dada', 'sanat kursu'],
  ogType: 'website',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-ivory text-charcoal`}
        // suppressHydrationWarning: Required for browser extensions (e.g., password managers, ad blockers)
        // that mutate the DOM and cause hydration mismatches. This is a known Next.js limitation.
        // Scope: Minimal (body element only). Alternative: Fix at source (not feasible for extension mutations).
        suppressHydrationWarning
      >
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

