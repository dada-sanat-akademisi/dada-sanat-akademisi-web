/**
 * Announcement Schema for Sanity CMS
 * 
 * WHY: Clean, safe announcement system for non-technical editors:
 * - Minimal fields (no unnecessary complexity)
 * - Strict validation (prevents layout breaks)
 * - Clear field descriptions (editor-friendly)
 * - SEO-safe (publishedAt for sorting, slug for URLs)
 * - CTA support (optional, validated)
 * 
 * Editor Safety:
 * - Character limits enforced
 * - Helpful validation messages
 * - Clear field descriptions
 * - No technical jargon
 */

export default {
  name: 'announcement',
  title: 'Announcement (Duyuru)',
  type: 'document',
  fields: [
    // Identity
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required().max(80).error('Title is required and must be 80 characters or less'),
      description: 'Announcement title (max 80 characters). This will be displayed as the main heading.',
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
      description: 'URL-friendly identifier (auto-generated from title). Must be unique across all announcements.',
    },

    // Content
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      validation: (Rule: any) => Rule.required().max(200).error('Excerpt is required and must be 200 characters or less'),
      description: 'Short preview text (max 200 characters). This appears in the announcement list.',
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
      validation: (Rule: any) => Rule.required().min(1).error('Content is required'),
      description: 'Rich text content. Use H2 and H3 headings only (no H4+). You can use bold, italic, and links.',
    },

    // Metadata
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule: any) => Rule.required().error('Published date is required'),
      description: 'Publication date and time. Announcements are sorted by this date (newest first).',
    },

    // CTA (Optional)
    {
      name: 'ctaText',
      title: 'CTA Text',
      type: 'string',
      validation: (Rule: any) => Rule.max(30).warning('CTA text should be 30 characters or less for best display'),
      description: 'Optional call-to-action button text (max 30 characters). Only shown if both CTA text and link are provided.',
    },
    {
      name: 'ctaLink',
      title: 'CTA Link',
      type: 'string',
      validation: (Rule: any) =>
        Rule.custom((value: string | undefined, context: any) => {
          // If ctaText is provided, ctaLink should also be provided
          if (context.parent?.ctaText && !value) {
            return 'CTA link is required when CTA text is provided';
          }
          // If ctaLink is provided, validate format
          if (value) {
            if (!value.startsWith('/') && !value.startsWith('http')) {
              return 'CTA link must start with "/" (internal link) or "http" (external link)';
            }
          }
          return true;
        }),
      description: 'Optional call-to-action link. Must start with "/" for internal links or "http" for external links. Only shown if both CTA text and link are provided.',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'excerpt',
      publishedAt: 'publishedAt',
    },
    prepare({ title, subtitle, publishedAt }: any) {
      return {
        title: title || 'Untitled Announcement',
        subtitle: publishedAt
          ? `${new Date(publishedAt).toLocaleDateString('tr-TR')} • ${subtitle ? subtitle.substring(0, 50) + '...' : 'No excerpt'}`
          : 'Draft',
      };
    },
  },
  orderings: [
    {
      title: 'Published Date, Newest',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Published Date, Oldest',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
  ],
};

