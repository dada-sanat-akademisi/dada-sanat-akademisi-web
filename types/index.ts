/**
 * Type Definitions
 * 
 * WHY: Strong typing ensures consistency across the codebase and prevents
 * runtime errors. These types align with Sanity.io schema structure.
 */

export interface Course {
  slug?: string;
  id?: string; // For backwards compatibility
  title: string;
  description: string;
  imageUrl?: string;
  category?: 'music' | 'visual-arts' | 'photography' | 'mixed-media' | 'other';
  level?: 'beginner' | 'intermediate' | 'advanced';
  rating?: number | { value: number; count: number };
  code?: string;
  instructor?: Instructor;
}

export interface Instructor {
  id: string;
  name: string;
  imageUrl?: string;
  specialization?: string;
  bio?: string;
}

export interface Organization {
  name: string;
  description: string;
  location: string;
  socialLinks: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: Instructor;
  publishedAt: string;
  image?: string;
  tags: string[];
}

