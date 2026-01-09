import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Musical timing utilities
 * 
 * @deprecated Use MOTION constants from '@/lib/motion/constants' instead.
 * This is kept for backward compatibility but will be removed in a future version.
 */
export const timing = {
  beat: 300, // Quarter note
  halfBeat: 150, // Eighth note
  wholeBeat: 600, // Half note
  measure: 1200, // Whole note (4/4 time)
} as const;

/**
 * Easing functions that feel musical
 * 
 * @deprecated Use EASING constants from '@/lib/motion/constants' instead.
 * This is kept for backward compatibility but will be removed in a future version.
 */
export const easing = {
  inOut: [0.4, 0, 0.2, 1] as const, // Smooth, musical
  out: [0, 0, 0.2, 1] as const, // Gentle release
  in: [0.4, 0, 1, 1] as const, // Gentle attack
} as const;

