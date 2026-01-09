'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useReducedMotion } from '@/lib/motion/hooks';

export interface BentoGridItemData {
  id: string;
  title: string;
  description: string;
  href: string;
  size: 'small' | 'medium' | 'large';
  imageUrl?: string;
}

interface BentoGridItemProps {
  item: BentoGridItemData;
  index: number;
}

export function BentoGridItem({ item, index }: BentoGridItemProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="md:col-span-1"
    >
      <Link href={item.href} className="block h-full group" aria-label={item.title}>
        <motion.div
          className="h-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
          whileHover={prefersReducedMotion ? {} : { y: -4 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Visual Area */}
          <motion.div
            className="relative h-64 md:h-80 overflow-hidden"
            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {item.imageUrl ? (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${item.imageUrl})`,
                }}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-ivory-100 via-ivory-50 to-ivory-200">
                <div className="absolute inset-0 opacity-30" style={{
                  backgroundImage: `radial-gradient(circle at 30% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
                                   radial-gradient(circle at 70% 50%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)`,
                }} />
              </div>
            )}
          </motion.div>

          {/* Content Area */}
          <div className="p-8 md:p-10 flex flex-col flex-1">
            <motion.div
              className="flex-1"
              whileHover={prefersReducedMotion ? {} : { y: -2 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <h3 className="text-2xl md:text-3xl font-serif font-medium mb-4 text-charcoal leading-tight">
                {item.title}
              </h3>
              <p className="text-charcoal/70 text-base md:text-lg leading-relaxed mb-8">
                {item.description}
              </p>
            </motion.div>

            {/* CTA */}
            <div className="pt-4 border-t border-charcoal/10">
              <span className="text-gold font-medium text-sm tracking-wide group-hover:translate-x-1 inline-block transition-transform duration-300">
                Keşfet →
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

