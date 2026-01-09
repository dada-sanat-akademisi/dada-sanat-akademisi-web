'use client';

import { motion } from 'framer-motion';
import { BentoGridItem, type BentoGridItemData } from './BentoGridItem';
import { useReducedMotion } from '@/lib/motion/hooks';
import { MOTION, EASING } from '@/lib/motion/constants';

/**
 * Bento Grid Client Component
 * 
 * WHY: Handles animations and interactions (client-side only).
 * Separated from server component to maintain server/client boundary.
 */

interface BentoGridClientProps {
  items: BentoGridItemData[];
}

export function BentoGridClient({ items }: BentoGridClientProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-fr max-w-7xl mx-auto">
      {items.map((item, index) => (
        <BentoGridItem key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}

