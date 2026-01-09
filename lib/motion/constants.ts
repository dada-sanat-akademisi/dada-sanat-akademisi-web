/**
 * Motion Timing Constants
 * 
 * WHY: All timing values must come from documented constants to ensure:
 * - Consistency across the site
 * - Musical timing philosophy (tempo, rhythm, breath)
 * - Easy global adjustments
 * - Self-documenting code
 * 
 * These values are research-backed and feel intentional, not "webby".
 */

export const MOTION = {
  /**
   * Hover interactions (240ms)
   * 
   * Fast enough to feel instant, slow enough to be smooth.
   * Research shows 200-300ms is the sweet spot for perceived responsiveness.
   * 
   * Use for: Button hovers, card hovers, link underlines
   */
  HOVER: 240, // ms

  /**
   * Entrance animations (420ms)
   * 
   * Slightly longer than standard 300ms to feel more premium and intentional.
   * Not rushed, but not slow. Creates a sense of rhythm.
   * 
   * Use for: Page entrances, section reveals, modal opens
   */
  ENTRANCE: 420, // ms

  /**
   * Page transitions (600ms)
   * 
   * Whole beat timing. Feels complete and intentional.
   * Long enough to feel smooth, short enough to not feel slow.
   * 
   * Use for: Route transitions, page changes, major state changes
   */
  PAGE_TRANSITION: 600, // ms

  /**
   * Stagger delays (100ms)
   * 
   * Creates musical rhythm between elements.
   * Short enough to feel connected, long enough to create rhythm.
   * 
   * Use for: List animations, grid reveals, card sequences
   */
  STAGGER: 100, // ms

  /**
   * Half-beat timing (150ms)
   * 
   * For very quick interactions that need to feel snappy.
   * 
   * Use for: Icon state changes, micro-interactions
   */
  HALF_BEAT: 150, // ms
} as const;

/**
 * Easing Functions
 * 
 * WHY: Custom bezier curves feel more intentional than default "ease".
 * These curves create a luxury feel through precision.
 */

export const EASING = {
  /**
   * Smooth, musical feel (not default "ease")
   * 
   * Custom bezier: [0.4, 0, 0.2, 1]
   * - Gentle acceleration
   * - Smooth deceleration
   * - Feels intentional, not "webby"
   * 
   * Use for: Most animations (default)
   */
  IN_OUT: [0.4, 0, 0.2, 1] as const,

  /**
   * Gentle release (for exits)
   * 
   * Custom bezier: [0, 0, 0.2, 1]
   * - Quick start
   * - Smooth end
   * 
   * Use for: Element exits, dismissals
   */
  OUT: [0, 0, 0.2, 1] as const,

  /**
   * Gentle attack (for entrances)
   * 
   * Custom bezier: [0.4, 0, 1, 1]
   * - Smooth start
   * - Quick end
   * 
   * Use for: Element entrances, reveals
   */
  IN: [0.4, 0, 1, 1] as const,
} as const;

