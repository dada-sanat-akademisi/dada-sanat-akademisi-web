/**
 * Homepage Section Schema for Sanity CMS
 * 
 * WHY: Flexible homepage content without code changes:
 * - Hero section (title, subtitle, CTA)
 * - Bento grid items (featured courses/programs)
 * - CTA sections (conversion-focused)
 * - Testimonials (trust signals)
 * - Featured instructors (social proof)
 */

export default {
  name: 'homepageSection',
  title: 'Homepage Section',
  type: 'document',
  fields: [
    {
      name: 'sectionType',
      title: 'Section Type',
      type: 'string',
      options: {
        list: [
          { title: 'Hero', value: 'hero' },
          { title: 'Bento Grid', value: 'bentoGrid' },
          { title: 'CTA Section', value: 'cta' },
          { title: 'Testimonials', value: 'testimonials' },
          { title: 'Featured Instructors', value: 'instructors' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
      description: 'Type of homepage section',
    },

    // Hero Section Fields
    {
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      validation: (Rule: any) => Rule.max(60),
      description: 'Main hero title (e.g., "Kontrollü Kaos")',
      hidden: ({ parent }: any) => parent?.sectionType !== 'hero',
    },
    {
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      validation: (Rule: any) => Rule.max(100),
      description: 'Hero subtitle/tagline',
      hidden: ({ parent }: any) => parent?.sectionType !== 'hero',
    },
    {
      name: 'heroCtaText',
      title: 'Hero CTA Text',
      type: 'string',
      validation: (Rule: any) => Rule.max(30),
      description: 'Call-to-action button text (e.g., "Hemen Başvur")',
      hidden: ({ parent }: any) => parent?.sectionType !== 'hero',
    },
    {
      name: 'heroCtaHref',
      title: 'Hero CTA Link',
      type: 'string',
      validation: (Rule: any) => Rule.required().custom((value: string) => {
        if (!value) return 'CTA link is required';
        if (!value.startsWith('/') && !value.startsWith('http')) {
          return 'Link must start with / (internal) or http (external)';
        }
        return true;
      }),
      description: 'CTA button destination. Use "/" for internal links (e.g., "/apply") or full URL for external links.',
      placeholder: 'e.g., "/apply"',
      hidden: ({ parent }: any) => parent?.sectionType !== 'hero',
    },
    {
      name: 'heroBackgroundImage',
      title: 'Hero Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule: any) => Rule.required().error('Alt text is required for accessibility'),
          description: 'Describe the image for screen readers',
        },
      ],
      description: 'Optional hero background image (16:9 aspect ratio recommended, alt text required)',
      hidden: ({ parent }: any) => parent?.sectionType !== 'hero',
    },

    // Bento Grid Item Fields
    {
      name: 'bentoItems',
      title: 'Bento Grid Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule: any) => Rule.required().max(40),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              validation: (Rule: any) => Rule.required().max(120).min(10).error('Description must be between 10-120 characters'),
              description: 'Short description for the grid item (10-120 characters)',
            },
            {
              name: 'href',
              title: 'Link',
              type: 'string',
              validation: (Rule: any) => Rule.required().custom((value: string) => {
                if (!value) return 'Link is required';
                if (!value.startsWith('/') && !value.startsWith('http')) {
                  return 'Link must start with / (internal) or http (external)';
                }
                return true;
              }),
              description: 'Link destination. Use "/" for internal links (e.g., "/courses") or full URL for external links.',
              placeholder: 'e.g., "/courses" or "https://example.com"',
            },
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              validation: (Rule: any) => Rule.max(30).warning('Icon name should be under 30 characters'),
              description: 'Icon name (optional, max 30 characters). Must match available icon names.',
              placeholder: 'e.g., "music", "palette", "camera"',
            },
            {
              name: 'size',
              title: 'Size',
              type: 'string',
              options: {
                list: [
                  { title: 'Small', value: 'small' },
                  { title: 'Medium', value: 'medium' },
                  { title: 'Large', value: 'large' },
                ],
              },
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                  validation: (Rule: any) => Rule.required().error('Alt text is required for accessibility'),
                  description: 'Describe the image for screen readers',
                },
              ],
              description: 'Optional image (16:9 aspect ratio recommended, alt text required)',
            },
            {
              name: 'order',
              title: 'Order',
              type: 'number',
              validation: (Rule: any) => Rule.required().min(0),
              description: 'Display order',
            },
          ],
        },
      ],
      hidden: ({ parent }: any) => parent?.sectionType !== 'bentoGrid',
    },

    // CTA Section Fields
    {
      name: 'ctaTitle',
      title: 'CTA Title',
      type: 'string',
      validation: (Rule: any) => Rule.max(60),
      hidden: ({ parent }: any) => parent?.sectionType !== 'cta',
    },
    {
      name: 'ctaDescription',
      title: 'CTA Description',
      type: 'text',
      validation: (Rule: any) => Rule.max(200),
      hidden: ({ parent }: any) => parent?.sectionType !== 'cta',
    },
    {
      name: 'ctaButtonText',
      title: 'CTA Button Text',
      type: 'string',
      validation: (Rule: any) => Rule.required().max(30),
      hidden: ({ parent }: any) => parent?.sectionType !== 'cta',
    },
    {
      name: 'ctaButtonHref',
      title: 'CTA Button Link',
      type: 'string',
      validation: (Rule: any) => Rule.required().custom((value: string) => {
        if (!value) return 'CTA link is required';
        if (!value.startsWith('/') && !value.startsWith('http')) {
          return 'Link must start with / (internal) or http (external)';
        }
        return true;
      }),
      description: 'CTA button destination. Use "/" for internal links or full URL for external links.',
      placeholder: 'e.g., "/apply"',
      hidden: ({ parent }: any) => parent?.sectionType !== 'cta',
    },

    // Testimonials Fields
    {
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'quote',
              title: 'Quote',
              type: 'text',
              validation: (Rule: any) => Rule.required().max(300).min(20).error('Quote must be between 20-300 characters'),
              description: 'Testimonial quote text (20-300 characters)',
            },
            {
              name: 'author',
              title: 'Author Name',
              type: 'string',
              validation: (Rule: any) => Rule.required().max(50).error('Author name is required (max 50 characters)'),
              description: 'Name of the person giving the testimonial',
              placeholder: 'e.g., "Ahmet Yılmaz"',
            },
            {
              name: 'role',
              title: 'Author Role',
              type: 'string',
              validation: (Rule: any) => Rule.max(50).warning('Role should be under 50 characters'),
              description: 'Author role or title (e.g., "Student", "Graduate", "Former Student")',
              placeholder: 'e.g., "Öğrenci" or "Mezun"',
            },
            {
              name: 'image',
              title: 'Author Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                  validation: (Rule: any) => Rule.required().error('Alt text is required for accessibility'),
                  description: 'Describe the image for screen readers',
                },
              ],
            },
          ],
        },
      ],
      hidden: ({ parent }: any) => parent?.sectionType !== 'testimonials',
    },

    // Featured Instructors Fields
    {
      name: 'featuredInstructors',
      title: 'Featured Instructors',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'instructor' }],
        },
      ],
      validation: (Rule: any) => Rule.max(6).warning('Maximum 6 featured instructors'),
      hidden: ({ parent }: any) => parent?.sectionType !== 'instructors',
    },
  ],
  preview: {
    select: {
      sectionType: 'sectionType',
      heroTitle: 'heroTitle',
      ctaTitle: 'ctaTitle',
    },
    prepare({ sectionType, heroTitle, ctaTitle }: any) {
      const titles: Record<string, string> = {
        hero: heroTitle || 'Hero Section',
        bentoGrid: 'Bento Grid',
        cta: ctaTitle || 'CTA Section',
        testimonials: 'Testimonials',
        instructors: 'Featured Instructors',
      };
      return {
        title: titles[sectionType] || 'Homepage Section',
        subtitle: sectionType,
      };
    },
  },
};

