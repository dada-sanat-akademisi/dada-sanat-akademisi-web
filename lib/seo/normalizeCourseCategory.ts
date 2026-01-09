/**
 * Course Category Normalizer
 * 
 * WHY: Sanity CMS returns free-form strings for categories, but
 * structured data requires strict union types for SEO correctness.
 * 
 * This utility normalizes editor-entered values (including multilingual)
 * to valid schema.org-compatible category values.
 * 
 * CMS Input = Flexible (editors can enter "Music", "Müzik", "music", etc.)
 * SEO Output = Strict (must be one of the union type values)
 * 
 * This approach:
 * - Preserves editor freedom in CMS
 * - Ensures type safety in structured data
 * - Maintains SEO integrity
 * - Never throws (always returns valid value)
 */

export type CourseCategory = 'music' | 'visual-arts' | 'photography' | 'mixed-media' | 'other';

/**
 * Normalize a course category string to a valid union type
 * 
 * @param category - Raw category string from CMS (or undefined)
 * @returns Valid CourseCategory union value (defaults to 'other')
 * 
 * Normalization logic:
 * - Case-insensitive matching
 * - Handles Turkish translations
 * - Handles common variations
 * - Unknown values → 'other' (safe default)
 */
export function normalizeCourseCategory(category: string | undefined): CourseCategory {
  if (!category) {
    return 'other';
  }

  const normalized = category.trim().toLowerCase();

  // Music category variations
  if (
    normalized === 'music' ||
    normalized === 'müzik' ||
    normalized === 'muzik' ||
    normalized === 'musik'
  ) {
    return 'music';
  }

  // Visual Arts category variations
  if (
    normalized === 'visual-arts' ||
    normalized === 'visual arts' ||
    normalized === 'visualarts' ||
    normalized === 'görsel sanatlar' ||
    normalized === 'gorsel sanatlar' ||
    normalized === 'resim' ||
    normalized === 'sanat'
  ) {
    return 'visual-arts';
  }

  // Photography category variations
  if (
    normalized === 'photography' ||
    normalized === 'fotoğraf' ||
    normalized === 'fotograf' ||
    normalized === 'fotoğrafçılık' ||
    normalized === 'fotografcilik' ||
    normalized === 'photo'
  ) {
    return 'photography';
  }

  // Mixed Media category variations
  if (
    normalized === 'mixed-media' ||
    normalized === 'mixed media' ||
    normalized === 'mixedmedia' ||
    normalized === 'karma medya' ||
    normalized === 'karma'
  ) {
    return 'mixed-media';
  }

  // Explicit 'other' category
  if (normalized === 'other' || normalized === 'diğer' || normalized === 'diger') {
    return 'other';
  }

  // Unknown value → safe default
  return 'other';
}

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * Normalize a course level string to a valid union type
 * 
 * @param level - Raw level string from CMS (or undefined)
 * @returns Valid CourseLevel union value (or undefined if invalid)
 * 
 * Normalization logic:
 * - Case-insensitive matching
 * - Handles common variations
 * - Invalid values → undefined (safe default)
 */
export function normalizeCourseLevel(level: string | undefined): CourseLevel | undefined {
  if (!level) {
    return undefined;
  }

  const normalized = level.trim().toLowerCase();

  if (normalized === 'beginner' || normalized === 'başlangıç' || normalized === 'baslangic') {
    return 'beginner';
  }

  if (normalized === 'intermediate' || normalized === 'orta') {
    return 'intermediate';
  }

  if (normalized === 'advanced' || normalized === 'ileri') {
    return 'advanced';
  }

  // Unknown value → undefined (safe default)
  return undefined;
}

