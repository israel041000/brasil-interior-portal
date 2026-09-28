import React, { useState, useEffect, useRef } from 'react';
import { Article } from '../types';
import { useNews } from '../context/NewsContext';
import { DEFAULT_FALLBACK_IMAGE, CATEGORY_FALLBACK_IMAGES } from '../data/mockArticles';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Clock, 
  MapPin, 
  ArrowRight,
  Pause,
  Play
} from 'lucide-react';

interface LatestCarouselProps {
  articles: Article[];
}

export const LatestCarousel: React.FC<LatestCarouselProps> = ({ articles }) => {
  const { openArticle, selectLocationFilter } = useNews();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Take top 6 published articles sorted chronologically
  const carouselArticles = [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 6);

  useEffect(() => {
    if (carouselArticles.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselArticles.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [carouselArticles.length, isPaused]);

  if (carouselArticles.length === 0) return null;

  const currentArticle = carouselArticles[currentIndex];
  const fallbackImg = CATEGORY_FALLBACK_IMAGES[currentArticle.category] || DEFAULT_FALLBACK_IMAGE;

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? carouselArticles.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % carouselArticles.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  const formattedDate = new Date(currentArticle.publishedAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <section 
      className="space-y-3"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-editorial text-stone-900 dark:text-stone-100">
            Manchetes Principais de Capa
          </h2>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer text-xs flex items-center gap-1 font-mono"
            title={isPaused ? 'Retomar rotação automática' : 'Pausar rotação'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPaused ? 'Pausado' : 'Automático'}</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="p-1.5 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer border border-stone-200 dark:border-stone-700"
              aria-label="Notícia anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer border border-stone-200 dark:border-stone-700"
              aria-label="Próxima notícia"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Banner Slide Container */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => openArticle(currentArticle)}
        className="relative bg-stone-900 text-white rounded-2xl overflow-hidden shadow-xl border border-stone-800 group cursor-pointer min-h-[360px] sm:min-h-[400px] flex flex-col justify-end transition-all duration-500"
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            key={currentArticle.id}
            src={currentArticle.coverImage || fallbackImg}
            alt={currentArticle.title}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = fallbackImg;
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-85"
          />
          {/* Gradient Overlay for Editorial Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-900/30" />
        </div>

        {/* Slide Content Overlay */}
        <div className="relative z-10 p-6 sm:p-8 md:p-10 max-w-4xl space-y-3">
          {/* Top Category & Location Badge */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="px-2.5 py-1 rounded-md bg-emerald-800 text-emerald-100 font-bold uppercase tracking-wider text-[11px] shadow-xs">
              {currentArticle.category}
            </span>

            {currentArticle.cityName && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (currentArticle.stateSigla) selectLocationFilter(currentArticle.stateSigla, currentArticle.cityName);
                }}
                className="px-2.5 py-1 rounded-md bg-stone-800/90 hover:bg-emerald-900/80 text-stone-200 hover:text-white font-medium flex items-center gap-1 backdrop-blur-xs transition-colors border border-stone-700/60"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currentArticle.cityName} ({currentArticle.stateSigla})</span>
              </button>
            )}

            <span className="text-stone-400 font-mono text-[11px] ml-auto sm:ml-0 flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              {formattedDate} · {currentArticle.readTimeMinutes} min
            </span>
          </div>

          {/* Article Title */}
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-editorial text-white leading-snug group-hover:text-emerald-300 transition-colors text-balance">
            {currentArticle.title}
          </h3>

          {/* Article Subtitle */}
          <p className="text-sm sm:text-base text-stone-300 leading-relaxed line-clamp-2 sm:line-clamp-3 font-sans max-w-3xl">
            {currentArticle.subtitle}
          </p>

          {/* Slide Footer / Read Action */}
          <div className="pt-3 flex items-center justify-between text-xs border-t border-stone-800/80">
            <span className="text-stone-400">
              Por <strong className="text-stone-200">{currentArticle.author.name}</strong>
            </span>

            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400 group-hover:translate-x-1.5 transition-transform">
              <span>Ler reportagem completa</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Progress Bar Timer for Current Slide */}
        {!isPaused && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-stone-800 z-20">
            <div 
              key={currentIndex}
              className="h-full bg-emerald-500 animate-[carouselProgress_5s_linear]"
            />
          </div>
        )}
      </div>

      {/* Thumbnails Navigator Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
        {carouselArticles.map((art, idx) => {
          const isActive = idx === currentIndex;
          const thumbFallback = CATEGORY_FALLBACK_IMAGES[art.category] || DEFAULT_FALLBACK_IMAGE;

          return (
            <button
              key={art.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-emerald-900/20 dark:bg-emerald-950/60 border-emerald-600 ring-2 ring-emerald-600/30'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 opacity-80 hover:opacity-100 hover:border-stone-400 dark:hover:border-stone-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-600 animate-pulse' : 'bg-stone-400'}`} />
                <span className="text-[10px] font-bold uppercase truncate text-stone-700 dark:text-stone-300">
                  {art.category}
                </span>
              </div>

              <p className="text-[11px] font-bold font-editorial text-stone-900 dark:text-stone-100 line-clamp-2 leading-tight">
                {art.title}
              </p>

              <span className="text-[10px] text-stone-500 mt-1 block truncate font-mono">
                {art.cityName || 'Nacional'}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
