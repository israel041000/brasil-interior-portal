import React from 'react';
import { useNews } from '../context/NewsContext';
import { MapPin, X, ArrowLeft, RefreshCw, Filter } from 'lucide-react';
import { BRAZIL_STATES } from '../data/brazilLocations';

interface ActiveFilterBannerProps {
  totalResults: number;
}

export const ActiveFilterBanner: React.FC<ActiveFilterBannerProps> = ({ totalResults }) => {
  const {
    selectedState,
    selectedCity,
    clearRegionalFilter,
    selectLocationFilter,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useNews();

  const stateObj = BRAZIL_STATES.find(s => s.sigla === selectedState);

  const hasFilter = Boolean(selectedState || selectedCity || searchQuery || selectedCategory);

  if (!hasFilter) return null;

  return (
    <div className="bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200/80 dark:border-emerald-900/60 py-3 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold text-xs uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtro Ativo:</span>
          </div>

          {selectedState && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white dark:bg-stone-900 border border-emerald-300 dark:border-emerald-800 text-xs text-stone-800 dark:text-stone-200 shadow-2xs">
              <MapPin className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
              <span>
                {selectedCity ? `${selectedCity} (${selectedState})` : `${stateObj?.nome || selectedState} (${selectedState})`}
              </span>
              {selectedCity && (
                <button
                  onClick={() => selectLocationFilter(selectedState)}
                  className="ml-1 text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                  title="Expandir para todo o estado"
                >
                  (Ver todo o Estado)
                </button>
              )}
            </div>
          )}

          {selectedCategory && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white dark:bg-stone-900 border border-emerald-300 dark:border-emerald-800 text-xs text-stone-800 dark:text-stone-200 shadow-2xs">
              <span>Editoria: {selectedCategory}</span>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {searchQuery && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white dark:bg-stone-900 border border-emerald-300 dark:border-emerald-800 text-xs text-stone-800 dark:text-stone-200 shadow-2xs">
              <span>Busca: "{searchQuery}"</span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <span className="text-xs text-stone-500 dark:text-stone-400 font-mono tabular-nums">
            {totalResults} {totalResults === 1 ? 'notícia encontrada' : 'notícias encontradas'}
          </span>
        </div>

        <button
          onClick={() => {
            clearRegionalFilter();
            setSearchQuery('');
            setSelectedCategory(null);
          }}
          className="text-xs font-medium text-emerald-900 dark:text-emerald-300 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
        >
          <X className="w-3.5 h-3.5" />
          <span>Limpar todos os filtros</span>
        </button>
      </div>
    </div>
  );
};
