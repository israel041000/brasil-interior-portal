import React from 'react';
import { DEFAULT_FALLBACK_IMAGE } from '../data/mockArticles';

interface ArticleContentRendererProps {
  content: string;
  enableDropCap?: boolean;
}

export const ArticleContentRenderer: React.FC<ArticleContentRendererProps> = ({
  content,
  enableDropCap = true,
}) => {
  if (!content) return null;

  // Split blocks by double newline or single newline if followed by image/heading
  const rawBlocks = content.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);

  let hasRenderedFirstParagraph = false;

  return (
    <div className="space-y-6 text-stone-800 dark:text-stone-200 leading-relaxed text-base sm:text-lg font-sans">
      {rawBlocks.map((block, idx) => {
        // 1. Check for inline markdown image: ![caption](url)
        const imgMatch = block.match(/^!\[(.*?)\]\((.*?)\)$/);
        if (imgMatch) {
          const caption = imgMatch[1];
          const url = imgMatch[2];

          return (
            <figure
              key={`img-${idx}`}
              className="my-8 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 shadow-xs"
            >
              <div className="relative aspect-video max-h-[460px] bg-stone-100 dark:bg-stone-950 overflow-hidden">
                <img
                  src={url || DEFAULT_FALLBACK_IMAGE}
                  alt={caption || 'Imagem da reportagem'}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              {caption && (
                <figcaption className="p-3 text-xs text-stone-600 dark:text-stone-400 italic border-t border-stone-200/90 dark:border-stone-800 flex items-center justify-between bg-stone-100/60 dark:bg-stone-950/60">
                  <span className="flex items-center gap-1.5">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-400">📷 Foto:</span>
                    <span>{caption}</span>
                  </span>
                  <span className="font-mono text-[10px] text-stone-600 dark:text-stone-400 shrink-0 ml-2">
                    Arquivo Editorial
                  </span>
                </figcaption>
              )}
            </figure>
          );
        }

        // 2. Check for heading H2: ## Heading
        if (block.startsWith('## ')) {
          const title = block.replace(/^##\s+/, '');
          return (
            <h2
              key={`h2-${idx}`}
              className="pt-4 text-xl sm:text-2xl font-bold font-editorial text-stone-900 dark:text-stone-100 leading-snug border-b border-stone-200/60 dark:border-stone-800 pb-2"
            >
              {title}
            </h2>
          );
        }

        // 3. Check for Blockquote: > Quote
        if (block.startsWith('> ')) {
          const quoteText = block.replace(/^>\s+/, '').replace(/^["']|["']$/g, '');
          return (
            <blockquote
              key={`quote-${idx}`}
              className="my-8 py-4 px-6 border-l-4 border-emerald-700 bg-stone-100/70 dark:bg-stone-800/60 rounded-r-xl italic font-editorial text-lg sm:text-xl text-stone-900 dark:text-stone-100 leading-relaxed"
            >
              "{quoteText}"
            </blockquote>
          );
        }

        // 4. Check for bullet list: starts with '- ' or '* '
        if (block.startsWith('- ') || block.startsWith('* ')) {
          const items = block.split('\n').map(line => line.replace(/^[-*]\s+/, '').trim()).filter(Boolean);
          return (
            <ul key={`list-${idx}`} className="my-4 space-y-2 list-disc list-inside text-stone-700 dark:text-stone-300">
              {items.map((item, i) => (
                <li key={i} className="pl-1">
                  {renderFormattedInline(item)}
                </li>
              ))}
            </ul>
          );
        }

        // 5. Standard paragraph with drop cap on the very first text paragraph
        const shouldApplyDropCap = enableDropCap && !hasRenderedFirstParagraph;
        if (!hasRenderedFirstParagraph) {
          hasRenderedFirstParagraph = true;
        }

        return (
          <p
            key={`p-${idx}`}
            className={`leading-relaxed ${
              shouldApplyDropCap
                ? 'first-letter:text-5xl first-letter:font-editorial first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-emerald-900 dark:first-letter:text-emerald-400'
                : ''
            }`}
          >
            {renderFormattedInline(block)}
          </p>
        );
      })}
    </div>
  );
};

/**
 * Format inline bold **text** and italic *text*
 */
function renderFormattedInline(text: string): React.ReactNode {
  // Simple regex parser for **bold** and *italic*
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-bold text-stone-900 dark:text-stone-100">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index} className="italic text-stone-800 dark:text-stone-200">{part.slice(1, -1)}</em>;
    }
    return part;
  });
}
