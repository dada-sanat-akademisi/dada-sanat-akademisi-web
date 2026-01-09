import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Hero Content Component (Server Component)
 * 
 * Phase 3 Implementation: Static content layer with H1, intro, and CTA.
 * 
 * Architecture (Phase 1):
 * - Server-rendered (in initial HTML)
 * - Immediately visible (no animation delay)
 * - No JavaScript dependency
 * - LCP element (H1) is static
 * 
 * Design (Phase 2):
 * - H1: Playfair Display, ivory, 9xl desktop, 5xl-6xl mobile
 * - Intro: Inter, ivory at 80%, xl-2xl
 * - CTA: Gold button, charcoal text, "Hemen Başvur"
 * - Typography spacing: 2rem H1-to-intro, 3rem intro-to-CTA
 * 
 * LCP Element: <h1> "Kontrollü Kaos"
 * - Why: Largest text element, highest visual weight, server-rendered
 * - Verification: Must be in initial HTML, immediately visible, static
 */
export function HeroContent() {
  return (
    <div className="relative z-10 text-center px-6 md:px-8 max-w-4xl mx-auto">
      {/* LCP Element: H1 - Must be static, no animation */}
      <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif font-medium mb-8 md:mb-6 text-balance leading-[1.1] tracking-[-0.02em]">
        <span className="block text-charcoal">Sanat Burada</span>
        <span className="block text-charcoal">Başlar</span>
      </h1>

      {/* Intro Paragraph - Must be static, no animation */}
      <p className="text-lg md:text-xl lg:text-2xl text-charcoal/70 mb-12 max-w-2xl mx-auto leading-relaxed">
        Sanat öğretilmez. Keşfedilir. DADA, kendi sesini bulmak isteyenler için
        bir yolculuk alanı.
      </p>

      {/* Primary CTA - Must be static, no animation, hover enhancement only */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          asChild
          size="lg"
          className="text-base md:text-lg px-8 md:px-12 py-6 min-h-[44px] transition-all duration-240 hover:scale-105 hover:shadow-lg hover:shadow-gold/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2"
        >
          <Link href="/courses">Yolculuğuna başla</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="text-base md:text-lg px-8 md:px-12 py-6 min-h-[44px]"
        >
          <Link href="/academy">Hikayemizi oku</Link>
        </Button>
      </div>
    </div>
  );
}

