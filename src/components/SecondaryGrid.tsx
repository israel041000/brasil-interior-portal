import React from 'react';
import { Article } from '../types';
import { useNews } from '../context/NewsContext';
import { DEFAULT_FALLBACK_IMAGE, CATEGORY_FALLBACK_IMAGES } from '../data/mockArticles';
import { Clock, MapPin, ArrowRight } from 'lucide-react';

interface SecondaryGridProps {
  articles: Article[];
}

export const SecondaryGrid: React.FC<SecondaryGridProps> = ({ articles }) => {
  const { openArticle, selectLocationFilter } = useNews();

  if (articles.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map(article => {
        const formattedDate = new Date(article.publishedAt).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short',
        });
        const fallbackImg = CATEGORY_FALLBACK_IMAGES[article.category] || DEFAULT_FALLBACK_IMAGE;

        return (
          <article
            key={article.id}
            onClick={() => openArticle(article)}
            className="group cursor-pointer bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-emerald-600/50 hover:shadow-md transition-all duration-200"
          >
            <div>
              {/* Image thumbnail (16:9 ratio) */}
              <div className="relative aspect-video overflow-hidden bg-stone-100 dark:bg-stone-950">
                <img
                  src={article.coverImage || fallbackImg}
                  alt={article.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = fallbackImg;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {article.cityName && (
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-900/80 text-white backdrop-blur-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    {article.cityName}
                  </span>
                )}
              </div>

              {/* Text Body */}
              <div className="p-5">
                {/* Unboxed metadata */}
                <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-2 flex-wrap">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-[11px]">
                    {article.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums text-[11px]">{formattedDate}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[11px]">{article.readTimeMinutes} min</span>
                </div>

                {/* Title */}
                <h3 className="font-bold font-editorial text-lg text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2 mb-2 text-balance">
                  {article.title}
                </h3>

                {/* Subtitle / Excerpt */}
                <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed">
                  {article.subtitle}
                </p>
              </div>
            </div>

            {/* Bottom Card Action */}
            <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-stone-100 dark:border-stone-800/80 text-xs">
              <span className="text-stone-600 dark:text-stone-300 truncate max-w-[150px]">
                {article.author.name}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openArticle(article);
                }}
                className="inline-flex items-center gap-1 font-semibold text-emerald-800 dark:text-emerald-400 group-hover:underline cursor-pointer"
              >
                <span>Ler mais</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
};
