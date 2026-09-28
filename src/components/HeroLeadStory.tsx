import React from 'react';
import { Article } from '../types';
import { useNews } from '../context/NewsContext';
import { DEFAULT_FALLBACK_IMAGE, CATEGORY_FALLBACK_IMAGES } from '../data/mockArticles';
import { MapPin, Clock, ArrowRight } from 'lucide-react';

interface HeroLeadStoryProps {
  article: Article;
}

export const HeroLeadStory: React.FC<HeroLeadStoryProps> = ({ article }) => {
  const { openArticle, selectLocationFilter } = useNews();

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const fallbackImg = CATEGORY_FALLBACK_IMAGES[article.category] || DEFAULT_FALLBACK_IMAGE;

  return (
    <article
      onClick={() => openArticle(article)}
      className="group cursor-pointer bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Large Cover Image (7 columns on desktop) */}
        <div className="lg:col-span-7 relative overflow-hidden bg-stone-100 dark:bg-stone-950 aspect-video lg:aspect-auto min-h-[300px] lg:min-h-[460px]">
          <img
            src={article.coverImage || fallbackImg}
            alt={article.title}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = fallbackImg;
            }}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent lg:hidden" />
          
          {/* Mobile Overlay location */}
          <div className="absolute bottom-3 left-4 lg:hidden text-white flex items-center gap-2 text-xs font-medium">
            {article.cityName && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {article.cityName} - {article.stateSigla}
              </span>
            )}
          </div>
        </div>

        {/* Lead Content (5 columns on desktop) */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            {/* Unboxed Metadata Strip */}
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-3 flex-wrap">
              <span className="text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
                {article.category}
              </span>
              <span aria-hidden="true">·</span>
              {article.scope === 'Municipal' && article.cityName ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (article.stateSigla) selectLocationFilter(article.stateSigla, article.cityName);
                  }}
                  className="inline-flex items-center gap-1 text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors font-medium"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{article.cityName} ({article.stateSigla})</span>
                </button>
              ) : article.stateSigla ? (
                <span className="text-stone-600 dark:text-stone-300 font-medium">
                  {article.stateName || article.stateSigla}
                </span>
              ) : (
                <span className="text-stone-600 dark:text-stone-300 font-medium">Cobertura Nacional</span>
              )}
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 font-mono tabular-nums">
                <Clock className="w-3 h-3" />
                {article.readTimeMinutes} min de leitura
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-editorial text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors leading-[1.2] mb-4 text-balance">
              {article.title}
            </h1>

            {/* Subtitle / Excerpt */}
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-4">
              {article.subtitle}
            </p>
          </div>

          {/* Author and Action Footer */}
          <div className="pt-6 mt-6 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <div className="text-xs">
              <p className="font-semibold text-stone-900 dark:text-stone-100">Por {article.author.name}</p>
              <p className="text-stone-600 dark:text-stone-300">{formattedDate}</p>
            </div>

            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
              Ler reportagem completa
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
