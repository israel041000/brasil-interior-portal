import React from 'react';
import { useNews } from '../context/NewsContext';
import { Article } from '../types';
import { DEFAULT_FALLBACK_IMAGE, CATEGORY_FALLBACK_IMAGES } from '../data/mockArticles';
import { MapPin, Eye, ArrowRight } from 'lucide-react';

interface LatestNewsFeedProps {
  articles: Article[];
}

export const LatestNewsFeed: React.FC<LatestNewsFeedProps> = ({ articles }) => {
  const { openArticle, selectLocationFilter } = useNews();

  // Sort chronologically
  const sortedArticles = [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <div className="space-y-4">
      {/* Feed Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
          <h2 className="text-xl sm:text-2xl font-bold font-editorial text-stone-900 dark:text-stone-100">
            Últimas Notícias em Tempo Real
          </h2>
        </div>
        <span className="text-xs text-stone-500 font-mono tabular-nums">
          {sortedArticles.length} matérias no feed
        </span>
      </div>

      {/* Articles List with Small Thumbnail alongside description */}
      <div className="divide-y divide-stone-200/80 dark:divide-stone-800/80">
        {sortedArticles.map(article => {
          const date = new Date(article.publishedAt);
          const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
          const fallbackImg = CATEGORY_FALLBACK_IMAGES[article.category] || DEFAULT_FALLBACK_IMAGE;

          return (
            <article
              key={article.id}
              onClick={() => openArticle(article)}
              className="py-4 group cursor-pointer flex flex-col sm:flex-row items-start justify-between gap-4 hover:bg-stone-100/60 dark:hover:bg-stone-900/60 p-3.5 rounded-xl transition-all duration-200"
            >
              {/* Left Side: Time Badge + Small Photo + Text */}
              <div className="flex items-start gap-3 sm:gap-4 flex-1 w-full">
                {/* Time Indicator */}
                <div className="shrink-0 text-left pt-0.5 min-w-[60px] sm:min-w-[65px]">
                  <span className="block text-xs font-bold font-mono text-emerald-700 dark:text-emerald-400">
                    {timeStr}
                  </span>
                  <span className="block text-[11px] text-stone-500 font-sans">
                    {dateStr}
                  </span>
                </div>

                {/* Small Thumbnail Image alongside description */}
                <div className="shrink-0 w-24 h-20 sm:w-32 sm:h-22 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 relative group-hover:border-emerald-600/60 transition-colors">
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
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-stone-900/85 text-white flex items-center gap-0.5 backdrop-blur-xs sm:hidden">
                      <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                      {article.cityName}
                    </span>
                  )}
                </div>

                {/* Article Metadata, Title and Description */}
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-stone-500 flex-wrap">
                    <span className="font-bold text-emerald-800 dark:text-emerald-400 uppercase text-[11px] tracking-wide">
                      {article.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    {article.cityName ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (article.stateSigla) selectLocationFilter(article.stateSigla, article.cityName);
                        }}
                        className="inline-flex items-center gap-1 text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium transition-colors"
                      >
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{article.cityName} ({article.stateSigla})</span>
                      </button>
                    ) : (
                      <span className="text-stone-600 dark:text-stone-400">Nacional</span>
                    )}
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 font-mono tabular-nums text-[11px]">
                      <Eye className="w-3 h-3 text-stone-400" />
                      {article.views.toLocaleString('pt-BR')} leituras
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold font-editorial text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed font-sans">
                    {article.subtitle}
                  </p>
                </div>
              </div>

              {/* Right Side Action Button */}
              <div className="shrink-0 self-end sm:self-center hidden sm:block">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Ler</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
