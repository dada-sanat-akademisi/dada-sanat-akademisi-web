/**
 * Blog Article Schema for Sanity CMS
 * 
 * WHY: SEO content and thought leadership with:
 * - Rich content (portable text)
 * - SEO optimization (title, description, keywords)
 * - Engagement metrics (read time, view count)
 * - Author attribution
 */

export default {
  name: 'blogArticle',
  title: 'Blog Article',
  type: 'document',
  fields: [
    // Identity
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required().max(80),
      description: 'Article title (max 80 chars)',
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
      description: 'URL-friendly identifier (auto-generated from title). Must be unique across all blog articles.',
    },

    // Content
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      validation: (Rule: any) => Rule.required().max(200),
      description: 'Short preview text (max 200 chars)',
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            // No H4+ to prevent deep nesting and maintain readability
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
      validation: (Rule: any) => Rule.required().min(1).error('Article content is required'),
      description: 'Rich text article content. Use H2 and H3 headings only (no H4+). Minimum 500 characters recommended.',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'News', value: 'news' },
          { title: 'Education', value: 'education' },
          { title: 'Art', value: 'art' },
          { title: 'Academy', value: 'academy' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
      description: 'Article category',
    },

    // Media
    {
      name: 'featuredImage',
      title: 'Featured Image',
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
      description: 'Hero image for article (16:9 aspect ratio recommended)',
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'instructor' }],
      description: 'Article author (optional)',
    },

    // Metadata
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
      description: 'Publication date',
    },
    {
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      description: 'Last update date',
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

    // Engagement (computed or manual)
    {
      name: 'readTime',
      title: 'Read Time (minutes)',
      type: 'number',
      validation: (Rule: any) => Rule.min(1).max(120).warning('Read time should be between 1-120 minutes'),
      description: 'Estimated reading time in minutes (1-120 minutes)',
    },
    {
      name: 'viewCount',
      title: 'View Count',
      type: 'number',
      validation: (Rule: any) => Rule.min(0),
      description: 'Number of views (for analytics)',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'featuredImage',
      publishedAt: 'publishedAt',
    },
    prepare({ title, subtitle, media, publishedAt }: any) {
      return {
        title,
        subtitle: `${subtitle} • ${publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Draft'}`,
        media,
      };
    },
  },
};

