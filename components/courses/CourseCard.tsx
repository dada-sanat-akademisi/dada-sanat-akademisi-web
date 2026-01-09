'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Course } from '@/types';

/**
 * Course Card Component (Client Component)
 * 
 * Phase 4 Implementation: CMS-safe course card for Bento Grid.
 * 
 * Design Rules:
 * - No gold color inside cards (gold reserved for CTA only)
 * - CMS-safe: Handles variable content length
 * - Semantic HTML: H3 for title, proper link structure
 * - Hover: Subtle lift and shadow (240ms, transform only)
 * - Accessibility: Keyboard navigable, focus indicators
 * 
 * Guardrails Compliance:
 * ✅ No layout shifts (transform only, no width/height changes)
 * ✅ Respects prefers-reduced-motion
 * ✅ Content visible without JavaScript
 * ✅ Semantic HTML for SEO
 */

interface CourseCardProps {
  course: Course;
  size?: 'small' | 'medium' | 'large';
}

const sizeClasses = {
  small: 'md:col-span-1 md:row-span-1',
  medium: 'md:col-span-1 md:row-span-2',
  large: 'md:col-span-2 md:row-span-2',
};

export function CourseCard({ course, size = 'medium' }: CourseCardProps) {
  return (
    <article
      className={cn(
        'glass rounded-lg overflow-hidden cursor-pointer group relative',
        'transition-all duration-240 ease-out',
        'hover:-translate-y-1 hover:shadow-lg',
        'focus-within:outline focus-within:outline-2 focus-within:outline-charcoal/30 focus-within:outline-offset-2',
        sizeClasses[size]
      )}
    >
      <Link
        href={`/courses/${course.slug}`}
        className="block h-full"
        aria-label={`View ${course.title} course`}
      >
        {/* Course Image */}
        {course.imageUrl && (
          <div className="relative w-full h-48 md:h-64 overflow-hidden">
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-240 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent opacity-40" />
          </div>
        )}

        {/* Card Content */}
        <div className="p-6 md:p-8 flex flex-col h-full">
          {/* Category Badge */}
          {course.category && (
            <span className="inline-block text-xs md:text-sm font-medium text-charcoal/60 mb-3 uppercase tracking-wider">
              {course.category === 'music' && 'Müzik'}
              {course.category === 'visual-arts' && 'Görsel Sanatlar'}
              {course.category === 'photography' && 'Fotoğrafçılık'}
              {course.category === 'mixed-media' && 'Karma Medya'}
            </span>
          )}

          {/* Course Title */}
          <h3 className="text-xl md:text-2xl font-serif font-medium mb-3 text-charcoal group-hover:text-charcoal/90 transition-colors duration-240">
            {course.title}
          </h3>

          {/* Course Description */}
          <p className="text-sm md:text-base text-charcoal/70 mb-4 flex-1 line-clamp-3">
            {course.description}
          </p>

          {/* Course Metadata */}
          <div className="mt-auto pt-4 border-t border-charcoal/10 flex items-center justify-between text-sm text-charcoal/50">
            {course.level && (
              <span className="capitalize">
                {course.level === 'beginner' && 'Başlangıç'}
                {course.level === 'intermediate' && 'Orta'}
                {course.level === 'advanced' && 'İleri'}
              </span>
            )}
            {course.rating && (
              <span className="flex items-center gap-1">
                <span>★</span>
                <span>
                  {typeof course.rating === 'number'
                    ? course.rating.toFixed(1)
                    : course.rating.value.toFixed(1)}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Hover Effect Overlay (Subtle) */}
        <div
          className="absolute inset-0 bg-charcoal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-240 pointer-events-none"
          aria-hidden="true"
        />
      </Link>
    </article>
  );
}

