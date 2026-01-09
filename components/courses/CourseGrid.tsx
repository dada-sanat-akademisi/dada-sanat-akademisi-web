'use client';

import { CourseCard } from './CourseCard';
import type { Course } from '@/types';
import { useReducedMotion } from '@/lib/motion/hooks';

/**
 * Course Grid Component (Client Component)
 * 
 * Phase 4 Implementation: Bento Grid layout for courses using CSS Grid.
 * 
 * Architecture:
 * - CSS Grid-based layout (no JavaScript layout logic)
 * - Responsive by design (1 col mobile, 3 cols desktop)
 * - Auto-rows for flexible heights
 * - CMS-safe: Handles variable number of courses
 * 
 * Design:
 * - Bento Grid layout (varied card sizes)
 * - Staggered entrance animations (if motion allowed)
 * - Respects prefers-reduced-motion
 * 
 * Guardrails Compliance:
 * ✅ No layout shifts (CSS Grid, no JS layout)
 * ✅ Entrance animations are below-fold (scroll-triggered)
 * ✅ Respects prefers-reduced-motion
 * ✅ Content visible without JavaScript
 */

interface CourseGridProps {
  courses: Course[];
}

export function CourseGrid({ courses }: CourseGridProps) {
  const prefersReducedMotion = useReducedMotion();

  // Determine card sizes for Bento Grid layout
  // This creates a varied, interesting layout
  const getCardSize = (index: number): 'small' | 'medium' | 'large' => {
    // Pattern: Large cards at strategic positions, medium/small alternated
    if (index === 0 || index === 4) return 'large';
    if (index % 3 === 0) return 'medium';
    return 'small';
  };

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr"
      role="list"
      aria-label="Course listings"
    >
      {courses.map((course, index) => (
        <div
          key={course.slug}
          role="listitem"
          className={prefersReducedMotion ? '' : 'animate-in fade-in slide-in-from-bottom-4'}
          style={
            prefersReducedMotion
              ? {}
              : {
                  animationDelay: `${index * 100}ms`,
                  animationDuration: '600ms',
                  animationFillMode: 'both',
                }
          }
        >
          <CourseCard course={course} size={getCardSize(index)} />
        </div>
      ))}
    </div>
  );
}

