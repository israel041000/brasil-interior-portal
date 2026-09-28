import React from 'react';
import { useNews } from '../context/NewsContext';
import { Article } from '../types';
import { Clock, MapPin, Eye, ArrowRight, Sparkles } from 'lucide-react';

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
      <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
          <h2 className="text-xl sm:text-2xl font-bold font-editorial text-stone-900 dark:text-stone-100">
            Feed em Tempo Real
          </h2>
        </div>
        <span className="text-xs text-stone-500 font-mono tabular-nums">
          {sortedArticles.length} despachos jornalísticos
        </span>
      </div>

      <div className="divide-y divide-stone-100 dark:divide-stone-800">
        {sortedArticles.map(article => {
          const date = new Date(article.publishedAt);
          const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

          return (
            <article
              key={article.id}
              onClick={() => openArticle(article)}
              className="py-4 group cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-stone-50/70 dark:hover:bg-stone-900/50 px-3 rounded-lg transition-colors"
            >
              <div className="flex items-start gap-4 flex-1">
                {/* Time Indicator */}
                <div className="shrink-0 text-left sm:text-right pt-0.5 min-w-[70px]">
                  <span className="block text-xs font-bold font-mono text-emerald-800 dark:text-emerald-400">
                    {timeStr}
                  </span>
                  <span className="block text-[11px] text-stone-600 dark:text-stone-300">
                    {dateStr}
                  </span>
                </div>

                {/* Article Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-stone-500 flex-wrap">
                    <span className="font-semibold text-stone-700 dark:text-stone-300 uppercase text-[11px]">
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
                        className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:underline font-medium"
                      >
                        <MapPin className="w-3 h-3" />
                        {article.cityName} ({article.stateSigla})
                      </button>
                    ) : (
                      <span>Nacional</span>
                    )}
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 font-mono tabular-nums text-[11px]">
                      <Eye className="w-3 h-3 text-stone-400" />
                      {article.views.toLocaleString('pt-BR')} leituras
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-editorial text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                    {article.subtitle}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 self-end sm:self-center">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                  Ler <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
