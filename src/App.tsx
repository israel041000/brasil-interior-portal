/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { NewsProvider, useNews } from './context/NewsContext';
import { Header } from './components/Header';
import { ActiveFilterBanner } from './components/ActiveFilterBanner';
import { SecondaryGrid } from './components/SecondaryGrid';
import { LatestCarousel } from './components/LatestCarousel';
import { RegionalSection } from './components/RegionalSection';
import { LatestNewsFeed } from './components/LatestNewsFeed';
import { ArticleReaderModal } from './components/ArticleReaderModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { BRAZIL_STATES } from './data/brazilLocations';
import { MapPin, Newspaper, Compass, Flame } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    articles,
    activeView,
    selectedState,
    selectedCity,
    selectedCategory,
    searchQuery,
  } = useNews();

  // Filter articles based on active filters
  const publishedArticles = useMemo(() => {
    return articles.filter(a => a.status === 'publicado');
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return publishedArticles.filter(article => {
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          article.title.toLowerCase().includes(query) ||
          article.subtitle.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query) ||
          (article.cityName && article.cityName.toLowerCase().includes(query)) ||
          (article.stateName && article.stateName.toLowerCase().includes(query)) ||
          article.tags.some(t => t.toLowerCase().includes(query));
        if (!matchesQuery) return false;
      }

      // State filter
      if (selectedState) {
        if (article.scope === 'Nacional') {
          // If viewing state, allow national news only if no city is specified, or keep strictly state
          if (article.stateSigla !== selectedState && selectedCity) {
            return false;
          }
        } else if (article.stateSigla !== selectedState) {
          return false;
        }
      }

      // City filter
      if (selectedCity) {
        if (article.cityName !== selectedCity) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory && article.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [publishedArticles, searchQuery, selectedState, selectedCity, selectedCategory]);

  // Top stories for the hero carousel (up to 6)
  const carouselArticles = useMemo(() => {
    return filteredArticles.slice(0, 6);
  }, [filteredArticles]);

  // Secondary stories for Destaques em Pauta (up to 9 articles)
  const destaquesPautaArticles = useMemo(() => {
    if (filteredArticles.length <= 1) return filteredArticles;
    // Show next 9 articles after top main headline or top slice
    return filteredArticles.slice(1, 10);
  }, [filteredArticles]);

  // Remaining articles for lower feed
  const remainingStories = useMemo(() => {
    return filteredArticles.slice(10);
  }, [filteredArticles]);

  const hasSpecificFilter = Boolean(selectedState || selectedCity || searchQuery || selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      <Header />
      <ActiveFilterBanner totalResults={filteredArticles.length} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-12">
        {/* VIEW: ADMIN PANEL */}
        {activeView === 'admin' ? (
          <AdminPanel />
        ) : activeView === 'ultimas' ? (
          /* VIEW: LATEST FEED */
          <div className="max-w-4xl mx-auto py-4">
            <LatestNewsFeed articles={filteredArticles} />
          </div>
        ) : activeView === 'brasil_interior' ? (
          /* VIEW: BRASIL & INTERIOR HUB */
          <div className="space-y-10">
            <RegionalSection />
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Newspaper className="w-5 h-5 text-emerald-700 dark:text-emerald-500" />
                <h3 className="text-xl font-bold font-editorial text-stone-900 dark:text-stone-100">
                  Todas as Notícias do Interior
                </h3>
              </div>
              <SecondaryGrid articles={filteredArticles.slice(0, 6)} />
            </div>
          </div>
        ) : (
          /* VIEW: HOME PAGE */
          <>
            {/* If user filtered by a state or city, show tailored header */}
            {hasSpecificFilter && (
              <div className="pb-2 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-editorial text-stone-900 dark:text-stone-100">
                    {selectedCity
                      ? `Edição Regional de ${selectedCity} (${selectedState})`
                      : selectedState
                      ? `Notícias do Estado de ${BRAZIL_STATES.find(s => s.sigla === selectedState)?.nome || selectedState}`
                      : 'Resultados da Busca'}
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Jornalismo local apurado diretamente com correspondentes da região
                  </p>
                </div>
              </div>
            )}

            {filteredArticles.length === 0 ? (
              /* Empty state */
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-12 text-center max-w-lg mx-auto">
                <MapPin className="w-10 h-10 text-stone-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold font-editorial text-stone-900 dark:text-stone-100 mb-1">
                  Nenhuma notícia encontrada para este filtro
                </h3>
                <p className="text-xs text-stone-500 mb-6">
                  {selectedCity
                    ? `Ainda não há publicações para ${selectedCity} (${selectedState}). Você pode publicar uma nova matéria no Painel ADM.`
                    : 'Tente ajustar os termos da busca ou explorar outros estados e municípios.'}
                </p>
              </div>
            ) : (
              <>
                {/* 1. Carrossel de Manchetes Principais de Capa (NO TOPO) */}
                <section aria-label="Manchetes Principais em Carrossel">
                  <LatestCarousel articles={carouselArticles} />
                </section>

                {/* 2. Grelha de Destaques em Pauta (Logo após o carrossel) */}
                {destaquesPautaArticles.length > 0 && (
                  <section aria-label="Destaques em Pauta">
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200 dark:border-stone-800">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-emerald-700 dark:text-emerald-500" />
                        <h2 className="text-lg sm:text-xl font-bold font-editorial text-stone-900 dark:text-stone-100">
                          Destaques em Pauta ({destaquesPautaArticles.length})
                        </h2>
                      </div>
                      <span className="text-xs text-stone-500">Reportagens Especiais de Todo o País</span>
                    </div>
                    <SecondaryGrid articles={destaquesPautaArticles} />
                  </section>
                )}

                {/* 3. Seção "Brasil & Interior" (Blocos organizados por regiões e municípios) */}
                {!hasSpecificFilter && (
                  <section aria-label="Brasil e Interior">
                    <RegionalSection />
                  </section>
                )}

                {/* 4. Feed de Últimas Notícias */}
                {remainingStories.length > 0 && (
                  <section aria-label="Feed Cronológico" className="pt-4">
                    <LatestNewsFeed articles={remainingStories} />
                  </section>
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Reader Modal */}
      <ArticleReaderModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <NewsProvider>
      <MainContent />
    </NewsProvider>
  );
}
