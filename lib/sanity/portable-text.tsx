import React from 'react';

/**
 * Portable Text Renderer for Sanity Content
 * 
 * Phase 5 Implementation: Simple, static-first Portable Text renderer.
 * 
 * Architecture:
 * - Server Component (no client-side JavaScript)
 * - Renders to static HTML at build time
 * - Semantic HTML only (h2, h3, p, ul, ol, etc.)
 * - No animations, no interactivity
 * 
 * Design:
 * - Reading-first experience
 * - Clean, semantic markup
 * - SEO-friendly (proper heading hierarchy)
 * 
 * Note: This is a simplified renderer. For complex content, consider
 * using @portabletext/react, but this version works for static rendering.
 */

interface PortableTextBlock {
  _type: string;
  _key?: string;
  style?: string;
  children?: Array<{
    _type: string;
    text: string;
    marks?: string[];
  }>;
  level?: number;
  listItem?: string;
  markDefs?: Array<{
    _key: string;
    _type: string;
    href?: string;
  }>;
}

interface PortableTextProps {
  value: PortableTextBlock[] | null | undefined;
}

/**
 * Extract plain text from Portable Text array
 * 
 * WHY: Sometimes we need plain text (e.g., for previews, excerpts, meta descriptions)
 * instead of full rich text rendering.
 * 
 * @param value - Portable Text array
 * @param maxLength - Optional maximum length (truncates with ellipsis)
 * @returns Plain text string
 */
export function portableTextToPlainText(
  value: PortableTextBlock[] | null | undefined,
  maxLength?: number
): string {
  if (!value || !Array.isArray(value)) {
    return '';
  }

  const textParts: string[] = [];

  value.forEach((block) => {
    if (block._type === 'block' && block.children) {
      block.children.forEach((child) => {
        if (child.text) {
          textParts.push(child.text);
        }
      });
    }
  });

  const fullText = textParts.join(' ').trim();
  
  if (maxLength && fullText.length > maxLength) {
    return fullText.substring(0, maxLength) + '...';
  }
  
  return fullText;
}

export function PortableText({ value }: PortableTextProps) {
  if (!value || !Array.isArray(value)) {
    return null;
  }

  const renderBlock = (block: PortableTextBlock, index: number) => {
    if (block._type !== 'block') {
      return null;
    }

    const style = block.style || 'normal';
    const children = block.children || [];
    const textContent = children.map((child) => child.text).join('');

    if (!textContent.trim()) {
      return null;
    }

    // Handle headings
    if (style === 'h1') {
      return (
        <h2 key={block._key || index} className="text-3xl md:text-4xl font-serif font-bold mb-4 mt-8 first:mt-0 text-ivory">
          {textContent}
        </h2>
      );
    }
    if (style === 'h2') {
      return (
        <h2 key={block._key || index} className="text-2xl md:text-3xl font-serif font-bold mb-4 mt-8 first:mt-0 text-ivory">
          {textContent}
        </h2>
      );
    }
    if (style === 'h3') {
      return (
        <h3 key={block._key || index} className="text-xl md:text-2xl font-serif font-semibold mb-3 mt-6 first:mt-0 text-ivory">
          {textContent}
        </h3>
      );
    }
    if (style === 'h4') {
      return (
        <h4 key={block._key || index} className="text-lg md:text-xl font-serif font-semibold mb-2 mt-4 first:mt-0 text-ivory">
          {textContent}
        </h4>
      );
    }

    // Handle lists
    if (style === 'blockquote') {
      return (
        <blockquote key={block._key || index} className="border-l-4 border-gold/30 pl-4 py-2 my-4 italic text-ivory/80">
          {textContent}
        </blockquote>
      );
    }

    // Regular paragraphs
    return (
      <p key={block._key || index} className="text-base md:text-lg text-ivory/80 leading-relaxed mb-4">
        {renderText(children, block.markDefs || [])}
      </p>
    );
  };

  const renderText = (
    children: Array<{ _type: string; text: string; marks?: string[] }>,
    markDefs: Array<{ _key: string; _type: string; href?: string }>
  ) => {
    return children.map((child, index) => {
      let element: React.ReactNode = child.text;

      if (child.marks && child.marks.length > 0) {
        child.marks.forEach((mark) => {
          if (mark === 'strong' || mark === 'b') {
            element = <strong key={index}>{element}</strong>;
          } else if (mark === 'em' || mark === 'i') {
            element = <em key={index}>{element}</em>;
          } else {
            // Handle links
            const linkDef = markDefs.find((def) => def._key === mark);
            if (linkDef && linkDef.href) {
              element = (
                <a
                  key={index}
                  href={linkDef.href}
                  className="text-gold hover:text-gold-100 underline underline-offset-2"
                  target={linkDef.href.startsWith('http') ? '_blank' : undefined}
                  rel={linkDef.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {element}
                </a>
              );
            }
          }
        });
      }

      return element;
    });
  };

  // Handle lists (group consecutive list items)
  const groupedBlocks: PortableTextBlock[][] = [];
  let currentList: PortableTextBlock[] = [];

  value.forEach((block) => {
    if (block._type === 'block' && (block.listItem === 'bullet' || block.listItem === 'number')) {
      currentList.push(block);
    } else {
      if (currentList.length > 0) {
        groupedBlocks.push(currentList);
        currentList = [];
      }
      groupedBlocks.push([block]);
    }
  });

  if (currentList.length > 0) {
    groupedBlocks.push(currentList);
  }

  return (
    <div className="prose prose-invert max-w-none">
      {groupedBlocks.map((group, groupIndex) => {
        if (group[0]?._type === 'block' && (group[0].listItem === 'bullet' || group[0].listItem === 'number')) {
          const ListTag = group[0].listItem === 'number' ? 'ol' : 'ul';
          return (
            <ListTag key={`list-${groupIndex}`} className="list-disc list-inside md:list-outside mb-4 ml-4 md:ml-6 space-y-2 text-ivory/80">
              {group.map((block, blockIndex) => {
                const children = block.children || [];
                const textContent = children.map((child) => child.text).join('');
                return (
                  <li key={block._key || blockIndex} className="leading-relaxed">
                    {renderText(children, block.markDefs || [])}
                  </li>
                );
              })}
            </ListTag>
          );
        }
        return group.map((block, blockIndex) => renderBlock(block, blockIndex));
      })}
    </div>
  );
}

