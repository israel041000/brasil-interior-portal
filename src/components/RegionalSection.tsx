import React, { useState } from 'react';
import { useNews } from '../context/NewsContext';
import { BrazilianRegion } from '../types';
import { REGIONS, BRAZIL_STATES } from '../data/brazilLocations';
import { MapPin, ArrowRight, Building, Compass, Sparkles } from 'lucide-react';

export const RegionalSection: React.FC = () => {
  const { articles, openArticle, selectLocationFilter } = useNews();
  const [selectedRegion, setSelectedRegion] = useState<BrazilianRegion>('Sudeste');

  // Filter states in this region
  const regionStates = BRAZIL_STATES.filter(st => st.regiao === selectedRegion);

  // Articles corresponding to this region or its states
  const regionArticles = articles.filter(a => {
    if (!a.stateSigla) return false;
    const st = BRAZIL_STATES.find(s => s.sigla === a.stateSigla);
    return st?.regiao === selectedRegion;
  });

  return (
    <section className="bg-stone-100/70 dark:bg-stone-900/60 rounded-2xl p-6 sm:p-8 border border-stone-200/80 dark:border-stone-800 transition-colors">
      {/* Header of Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-1">
            <Compass className="w-4 h-4" />
            <span>Circuito Regional</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-editorial text-stone-900 dark:text-stone-100">
            Brasil &amp; Interior em Foco
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
            Acompanhe o pulsar econômico, ecológico e cultural dos municípios fora das capitais
          </p>
        </div>

        {/* Region Selector Tabs (Functional Segmented Control) */}
        <div className="flex items-center gap-1 p-1 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg overflow-x-auto custom-scrollbar">
          {REGIONS.map(reg => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedRegion === reg
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-900'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Quick City Hubs in this Region */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
        <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Building className="w-3.5 h-3.5" />
          Polos da Região {selectedRegion}:
        </span>
        <div className="flex items-center gap-1.5 flex-nowrap">
          {regionStates.flatMap(s => s.municipios.slice(0, 3).map(city => ({ city, sigla: s.sigla }))).slice(0, 10).map(({ city, sigla }) => (
            <button
              key={`${sigla}-${city}`}
              onClick={() => selectLocationFilter(sigla, city)}
              className="px-2.5 py-1 text-xs rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-emerald-600 hover:text-emerald-800 dark:hover:text-emerald-300 whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
            >
              {city} ({sigla})
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid for this Region */}
      {regionArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {regionArticles.map(article => (
            <div
              key={article.id}
              onClick={() => openArticle(article)}
              className="group cursor-pointer bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-600/60 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold uppercase text-[11px]">
                    {article.category}
                  </span>
                  {article.cityName && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (article.stateSigla) selectLocationFilter(article.stateSigla, article.cityName);
                      }}
                      className="inline-flex items-center gap-1 text-stone-700 dark:text-stone-300 font-medium hover:text-emerald-700"
                    >
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      {article.cityName} - {article.stateSigla}
                    </button>
                  )}
                </div>

                <h4 className="font-bold font-editorial text-base text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug mb-2">
                  {article.title}
                </h4>

                <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                  {article.subtitle}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <span className="text-stone-600 dark:text-stone-300 font-mono tabular-nums">
                  {new Date(article.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                </span>
                <span className="text-emerald-800 dark:text-emerald-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Ler <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-8 text-center">
          <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">
            Nenhuma reportagem cadastrada no momento especificamente para a região {selectedRegion}.
          </p>
          <div className="flex justify-center gap-2">
            {regionStates.slice(0, 3).map(st => (
              <button
                key={st.sigla}
                onClick={() => selectLocationFilter(st.sigla)}
                className="px-3 py-1.5 text-xs bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 transition-colors"
              >
                Ver notícias de {st.nome}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
