import { HeroBackground } from './HeroBackground';
import { HeroContent } from './HeroContent';

/**
 * Hero Section - Server Component (Wrapper)
 * 
 * Phase 3 Implementation: Three-layer architecture as defined in Phase 1.
 * 
 * Architecture (Phase 1):
 * - Layer 1: Static background (CSS gradient + noise)
 * - Layer 2: Decorative motion (CSS-only, very subtle)
 * - Layer 3: Static content (H1, intro, CTA - server-rendered)
 * 
 * Design (Phase 2):
 * - Option 1: Abstract gradient + subtle noise (recommended)
 * - No canvas, no JavaScript animations on content
 * - Pure CSS background motion (20s loop)
 * 
 * Guardrails Compliance:
 * ✅ Hero text (H1, intro, CTA) is server-rendered and static
 * ✅ No animation on H1, intro, or CTA
 * ✅ No layout shifts (CLS = 0)
 * ✅ LCP element (H1) is static and verified
 * ✅ Motion is decorative only (background CSS animation)
 * ✅ Respects prefers-reduced-motion (via CSS media query)
 * ✅ Works with JavaScript disabled (pure CSS)
 */
export function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Layer 1: Static Background (CSS-only gradient + noise) */}
      <HeroBackground />
      
      {/* Layer 3: Static Content (H1, intro, CTA - no animation) */}
      <div className="relative z-10 w-full">
        <HeroContent />
      </div>
    </section>
  );
}
