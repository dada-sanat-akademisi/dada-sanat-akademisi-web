/**
 * Course Schema for Sanity CMS
 * 
 * WHY: Structured content for courses with:
 * - SEO optimization (meta fields)
 * - Trust signals (instructor, rating, reviews)
 * - Conversion elements (price, duration, spots)
 * - Validation rules (prevent layout breaks)
 * - Localization ready (TR first, EN-ready)
 */

export default {
  name: 'course',
  title: 'Course',
  type: 'document',
  fields: [
    // Identity
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required().max(60).warning('SEO best practice: Keep titles under 60 characters'),
      description: 'Course title (max 60 chars for SEO)',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        // Sanity automatically enforces uniqueness for slugs within the same document type
      },
      validation: (Rule: any) => Rule.required().error('Slug is required and must be unique'),
      description: 'URL-friendly identifier (auto-generated from title). Must be unique across all courses.',
    },
    {
      name: 'code',
      title: 'Course Code',
      type: 'string',
      validation: (Rule: any) => Rule.max(10),
      description: 'Optional course code (e.g., "PIY-101")',
    },

    // Content
    {
      name: 'description',
      title: 'Short Description',
      type: 'text',
      validation: (Rule: any) => Rule.required().max(200).warning('Meta description should be under 200 characters'),
      description: 'Short description for cards and meta tags (max 200 chars)',
    },
    {
      name: 'longDescription',
      title: 'Full Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            // No H4+ to prevent deep nesting
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
      validation: (Rule: any) => Rule.required().min(1).error('Course description is required'),
      description: 'Rich text content for course detail page. Use H2 and H3 headings only (no H4+).',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Music', value: 'music' },
          { title: 'Visual Arts', value: 'visual-arts' },
          { title: 'Photography', value: 'photography' },
          { title: 'Mixed Media', value: 'mixed-media' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
      description: 'Course category',
    },
    {
      name: 'level',
      title: 'Level',
      type: 'string',
      options: {
        list: [
          { title: 'Beginner', value: 'beginner' },
          { title: 'Intermediate', value: 'intermediate' },
          { title: 'Advanced', value: 'advanced' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
      description: 'Course difficulty level',
    },

    // Media
    {
      name: 'image',
      title: 'Hero Image',
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
      description: 'Main course image (16:9 aspect ratio recommended)',
    },
    {
      name: 'gallery',
      title: 'Gallery Images',
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
      validation: (Rule: any) => Rule.max(5).warning('Maximum 5 gallery images recommended for performance'),
      description: 'Additional course images (max 5, 16:9 aspect ratio recommended)',
    },

    // Trust Signals
    {
      name: 'instructor',
      title: 'Instructor',
      type: 'reference',
      to: [{ type: 'instructor' }],
      validation: (Rule: any) => Rule.required(),
      description: 'Course instructor',
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule: any) => Rule.min(0).max(5),
      description: 'Average rating (0-5)',
    },
    {
      name: 'reviewCount',
      title: 'Review Count',
      type: 'number',
      validation: (Rule: any) => Rule.min(0),
      description: 'Number of reviews',
    },

    // Conversion
    {
      name: 'price',
      title: 'Price (TRY)',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
      description: 'Course price in Turkish Lira',
    },
    {
      name: 'duration',
      title: 'Duration',
      type: 'string',
      validation: (Rule: any) => Rule.required().max(50).error('Duration is required (max 50 characters)'),
      description: 'Course duration (e.g., "12 hafta", "6 ay"). Maximum 50 characters.',
      placeholder: 'e.g., "12 hafta" or "6 ay"',
    },
    {
      name: 'spotsAvailable',
      title: 'Spots Available',
      type: 'number',
      validation: (Rule: any) => Rule.min(0),
      description: 'Number of available spots (for scarcity signal)',
    },
    {
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      description: 'Next cohort start date',
    },

    // SEO
    {
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      validation: (Rule: any) => Rule.max(60).warning('SEO best practice: Keep titles under 60 characters'),
      description: 'Custom SEO title (optional, defaults to title)',
    },
    {
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      validation: (Rule: any) => Rule.max(160).warning('SEO best practice: Keep descriptions under 160 characters'),
      description: 'Custom SEO description (optional, defaults to description)',
    },
    {
      name: 'seoKeywords',
      title: 'SEO Keywords',
      type: 'array',
      of: [
        {
          type: 'string',
          validation: (Rule: any) => Rule.max(30).warning('Keep keywords under 30 characters each'),
        },
      ],
      validation: (Rule: any) => Rule.max(10).warning('Maximum 10 keywords recommended'),
      description: 'SEO keywords (optional, max 10 keywords, 30 chars each)',
    },

    // Localization (future-ready)
    {
      name: 'locale',
      title: 'Locale',
      type: 'string',
      options: {
        list: [
          { title: 'Turkish', value: 'tr' },
          { title: 'English', value: 'en' },
        ],
      },
      initialValue: 'tr',
      validation: (Rule: any) => Rule.required(),
      description: 'Content language (Turkish first, English ready)',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'image',
    },
  },
};

