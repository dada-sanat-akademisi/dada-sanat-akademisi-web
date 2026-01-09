/**
 * Sanity Schema Index
 * 
 * WHY: Centralized schema exports for Sanity Studio.
 * Import all schemas here and export as a single array.
 * 
 * Usage in sanity.config.ts:
 * import schemas from './schemas';
 * export default { ...config, schema: { types: schemas } };
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

