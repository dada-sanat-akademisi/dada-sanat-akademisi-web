import { Variants } from 'framer-motion';
import { MOTION, EASING } from './motion/constants';

/**
 * Motion Variants Library
 * 
 * WHY: Centralized motion variants ensure consistent timing across the site.
 * All animations use musical timing constants and smooth easing that
 * feels intentional, not "webby".
 * 
 * These variants can be composed together for complex animations while
 * maintaining the artistic philosophy.
 */

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: MOTION.HOVER / 1000,
      ease: EASING.IN_OUT,
    },
  },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION.ENTRANCE / 1000,
      ease: EASING.OUT,
    },
  },
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION.ENTRANCE / 1000,
      ease: EASING.OUT,
    },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: MOTION.HOVER / 1000,
      ease: EASING.OUT,
    },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: MOTION.STAGGER / 1000,
      delayChildren: MOTION.HALF_BEAT / 1000,
    },
  },
};

export const hoverScale: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      duration: MOTION.HOVER / 1000,
      ease: EASING.IN_OUT,
    },
  },
};

export const hoverGlow: Variants = {
  rest: {
    boxShadow: '0 0 0px rgba(212, 175, 55, 0)',
  },
  hover: {
    boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)',
    transition: {
      duration: MOTION.HOVER / 1000,
      ease: EASING.IN_OUT,
    },
  },
};

/**
 * Page transition variants
 * WHY: Smooth page transitions maintain the luxury feel
 */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION.PAGE_TRANSITION / 1000,
      ease: EASING.OUT,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: MOTION.HOVER / 1000,
      ease: EASING.IN,
    },
  },
};

