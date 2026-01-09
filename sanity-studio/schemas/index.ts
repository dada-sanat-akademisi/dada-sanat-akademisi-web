/**
 * Sanity Studio Schema Index
 * 
 * Imports schemas from the local schemas folder.
 * All schemas are copied from the parent Next.js project to maintain consistency.
 */

import course from './course';
import instructor from './instructor';
import blogArticle from './blogArticle';
import homepageSection from './homepageSection';
import announcement from './announcement';

export default [
  course,
  instructor,
  blogArticle,
  homepageSection,
  announcement,
];

