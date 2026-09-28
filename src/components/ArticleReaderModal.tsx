import React, { useState, useEffect } from 'react';
import { useNews } from '../context/NewsContext';
import { ArticleContentRenderer } from './ArticleContentRenderer';
import { AdBanner } from './AdBanner';
import { DEFAULT_FALLBACK_IMAGE, CATEGORY_FALLBACK_IMAGES } from '../data/mockArticles';
import { 
  X, 
  MapPin, 
  Clock, 
  Share2, 
  Copy, 
  Check, 
  Eye, 
  Calendar,
  ChevronLeft,
  Bookmark,
  Building
} from 'lucide-react';

export const ArticleReaderModal: React.FC = () => {
  const { selectedArticle, isArticleModalOpen, closeArticle, articles, openArticle, selectLocationFilter } = useNews();
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeArticle();
    };
    if (isArticleModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isArticleModalOpen, closeArticle]);

  if (!isArticleModalOpen || !selectedArticle) return null;

  const formattedDate = new Date(selectedArticle.publishedAt).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Related articles from same region/category
  const relatedArticles = articles
    .filter(a => a.id !== selectedArticle.id)
    .slice(0, 3);

  const paragraphs = selectedArticle.content.split('\n\n').filter(p => p.trim());

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative flex flex-col my-auto transition-colors"
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky Reading Header Bar */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-stone-500 truncate max-w-[70%]">
            <button
              onClick={closeArticle}
              className="text-stone-700 dark:text-stone-300 hover:text-emerald-700 flex items-center gap-1 font-medium cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Voltar ao Portal</span>
            </button>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span className="hidden sm:inline font-semibold text-emerald-800 dark:text-emerald-400">
              {selectedArticle.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copiar link da reportagem"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copiado!' : 'Compartilhar'}</span>
            </button>

            <button
              onClick={() => setSaved(!saved)}
              className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                saved
                  ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
              title="Salvar para ler depois"
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={closeArticle}
              className="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Fechar artigo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-10 lg:p-12 overflow-y-auto max-h-[85vh] custom-scrollbar">
          {/* Header Metadata */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-3 flex-wrap">
              <span className="font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest text-[11px]">
                {selectedArticle.category}
              </span>
              <span aria-hidden="true">·</span>
              {selectedArticle.cityName ? (
                <button
                  onClick={() => {
                    if (selectedArticle.stateSigla) {
                      selectLocationFilter(selectedArticle.stateSigla, selectedArticle.cityName);
                      closeArticle();
                    }
                  }}
                  className="inline-flex items-center gap-1 text-stone-800 dark:text-stone-200 hover:text-emerald-700 font-semibold cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {selectedArticle.cityName} ({selectedArticle.stateSigla})
                </button>
              ) : (
                <span className="text-stone-700 dark:text-stone-300 font-medium">Cobertura Nacional</span>
              )}
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{selectedArticle.readTimeMinutes} min de leitura</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-editorial text-stone-900 dark:text-stone-100 leading-tight mb-4 text-balance">
              {selectedArticle.title}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed font-sans mb-6">
              {selectedArticle.subtitle}
            </p>

            {/* Byline / Credits */}
            <div className="py-4 border-y border-stone-200 dark:border-stone-800 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  Por {selectedArticle.author.name}
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {selectedArticle.author.role}
                </p>
              </div>

              <div className="text-right text-[11px] text-stone-500 dark:text-stone-400">
                <p className="capitalize">{formattedDate}</p>
                <p className="flex items-center gap-1 justify-end font-mono tabular-nums">
                  <Eye className="w-3 h-3" />
                  {selectedArticle.views.toLocaleString('pt-BR')} visualizações
                </p>
              </div>
            </div>
          </div>

          {/* Cover Media */}
          <div className="max-w-3xl mx-auto mb-8 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
            <img
              src={selectedArticle.coverImage || (CATEGORY_FALLBACK_IMAGES[selectedArticle.category] || DEFAULT_FALLBACK_IMAGE)}
              alt={selectedArticle.title}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = CATEGORY_FALLBACK_IMAGES[selectedArticle.category] || DEFAULT_FALLBACK_IMAGE;
              }}
              className="w-full aspect-video object-cover"
            />
            {selectedArticle.cityName && (
              <div className="p-2.5 bg-stone-50 dark:bg-stone-900 border-t border-stone-200/80 dark:border-stone-800 text-xs text-stone-500 italic flex items-center justify-between">
                <span>Registro fotográfico regional · Reportagem especial</span>
                <span>{selectedArticle.cityName} - {selectedArticle.stateSigla}</span>
              </div>
            )}
          </div>

          {/* Long-form Reading Prose (Constrained to 65-75ch max-w-2xl) */}
          <div className="max-w-2xl mx-auto space-y-6">
            <ArticleContentRenderer content={selectedArticle.content} enableDropCap={true} />
          </div>

          {/* Bottom Article Banner */}
          <div className="max-w-2xl mx-auto">
            <AdBanner location="bottomArticle" />
          </div>

          {/* Tags */}
          <div className="max-w-2xl mx-auto mt-10 pt-6 border-t border-stone-200 dark:border-stone-800">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2">
              Palavras-chave e Tópicos
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedArticle.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Related Articles Section */}
          <div className="max-w-2xl mx-auto mt-12 pt-8 border-t border-stone-200 dark:border-stone-800">
            <h3 className="text-lg font-bold font-editorial text-stone-900 dark:text-stone-100 mb-4">
              Mais Notícias do Brasil &amp; Interior
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => openArticle(rel)}
                  className="cursor-pointer group p-3 rounded-lg border border-stone-200 dark:border-stone-800 hover:border-emerald-600 transition-colors"
                >
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                    {rel.category}
                  </span>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 line-clamp-2 mt-1">
                    {rel.title}
                  </h4>
                  <span className="text-[10px] text-stone-500 block mt-2">
                    {rel.cityName ? `${rel.cityName} (${rel.stateSigla})` : 'Nacional'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
