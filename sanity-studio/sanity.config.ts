/**
 * Sanity Studio Configuration
 * 
 * This is the main configuration file for Sanity Studio v3.
 * It connects to the same Sanity project and dataset as the Next.js app.
 * 
 * Environment Variables (read from project root .env.local):
 * - SANITY_STUDIO_PROJECT_ID (preferred for Studio)
 * - SANITY_STUDIO_DATASET (preferred for Studio, defaults to 'production')
 * 
 * NOTE: Studio can also use NEXT_PUBLIC_* variables as fallback, but SANITY_STUDIO_*
 * variables are scoped specifically for Studio usage. The Next.js app requires
 * NEXT_PUBLIC_* prefix and should NOT use SANITY_STUDIO_* variables.
 */

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import schemas from './schemas';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

if (!projectId) {
  throw new Error(
    'Missing Sanity Project ID. ' +
    'Please set SANITY_STUDIO_PROJECT_ID or NEXT_PUBLIC_SANITY_PROJECT_ID ' +
    'in your .env.local file at the project root (not in sanity-studio folder).'
  );
}

export default defineConfig({
  name: 'dada-sanat-akademisi-studio',
  title: 'Dada Sanat Akademisi CMS',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
    structureTool(), // Default desk structure
  ],
  schema: {
    types: schemas,
  },
});


