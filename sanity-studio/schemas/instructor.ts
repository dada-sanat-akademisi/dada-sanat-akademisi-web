/**
 * Instructor Schema for Sanity CMS
 * 
 * WHY: Build trust and showcase expertise with:
 * - Professional profile (photo, bio, specialization)
 * - Trust signals (experience, education, achievements)
 * - Social proof (student count, courses taught)
 * - SEO optimization
 */

export default {
  name: 'instructor',
  title: 'Instructor',
  type: 'document',
  fields: [
    // Identity
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: any) => Rule.required().max(50),
      description: 'Instructor full name',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
        // Sanity automatically enforces uniqueness for slugs within the same document type
      },
      validation: (Rule: any) => Rule.required().error('Slug is required and must be unique'),
      description: 'URL-friendly identifier (auto-generated from name). Must be unique across all instructors.',
    },

    // Content
    {
      name: 'bio',
      title: 'Biography',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            // No H4+ to maintain readability
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule: any) => Rule.required(),
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: (Rule: any) => Rule.required().min(1).error('Biography is required'),
      description: 'Rich text biography. Use H2 and H3 headings only. Minimum 100 characters recommended.',
    },
    {
      name: 'specialization',
      title: 'Specialization',
      type: 'string',
      validation: (Rule: any) => Rule.required().max(50).error('Specialization is required (max 50 characters)'),
      description: 'Primary specialization (e.g., "Piyano", "Resim", "Fotoğraf"). Maximum 50 characters.',
      placeholder: 'e.g., "Piyano" or "Görsel Sanatlar"',
    },

    // Media
    {
      name: 'image',
      title: 'Profile Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
          description: 'Accessibility: Describe the image',
        },
      ],
      validation: (Rule: any) => Rule.required(),
      description: 'Profile photo (1:1 aspect ratio recommended)',
    },
    {
      name: 'portfolio',
      title: 'Portfolio Images',
      type: 'array',
      of: [
        {
          type: 'image',
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: (Rule: any) => Rule.required().error('Alt text is required for accessibility'),
              description: 'Describe the image for screen readers',
            },
          ],
          options: {
            hotspot: true,
          },
        },
      ],
      options: {
        layout: 'grid',
      },
      validation: (Rule: any) => Rule.max(10).warning('Maximum 10 portfolio images recommended for performance'),
      description: 'Portfolio showcase images (max 10, alt text required)',
    },

    // Trust Signals
    {
      name: 'experience',
      title: 'Years of Experience',
      type: 'number',
      validation: (Rule: any) => Rule.min(0),
      description: 'Years of teaching/professional experience',
    },
    {
      name: 'education',
      title: 'Education',
      type: 'array',
      of: [
        {
          type: 'string',
          validation: (Rule: any) => Rule.max(100).warning('Keep education entries under 100 characters'),
        },
      ],
      validation: (Rule: any) => Rule.max(5).warning('Maximum 5 education entries recommended'),
      description: 'Education background entries (e.g., "Conservatory, Istanbul University"). Max 5 entries, 100 chars each.',
    },
    {
      name: 'achievements',
      title: 'Achievements',
      type: 'array',
      of: [
        {
          type: 'string',
          validation: (Rule: any) => Rule.max(100).warning('Keep achievement entries under 100 characters'),
        },
      ],
      validation: (Rule: any) => Rule.max(10).warning('Maximum 10 achievements recommended'),
      description: 'Awards, recognitions, notable achievements. Max 10 entries, 100 chars each.',
    },

    // Social Proof
    {
      name: 'studentCount',
      title: 'Student Count',
      type: 'number',
      validation: (Rule: any) => Rule.min(0),
      description: 'Number of students taught (for social proof)',
    },

    // SEO
    {
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      validation: (Rule: any) => Rule.max(60),
      description: 'Custom SEO title (optional)',
    },
    {
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      validation: (Rule: any) => Rule.max(160),
      description: 'Custom SEO description (optional)',
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'specialization',
      media: 'image',
    },
  },
};

