import React, { useState, useRef } from 'react';
import { useNews } from '../context/NewsContext';
import { StateCityMenu } from './StateCityMenu';
import { 
  Search, 
  Moon, 
  Sun, 
  SlidersHorizontal, 
  MapPin, 
  ChevronDown, 
  X,
  Menu,
  ShieldCheck,
  Lock
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    selectedState,
    selectedCity,
    clearRegionalFilter,
    searchQuery,
    setSearchQuery,
    darkMode,
    toggleDarkMode,
    isAdminAuthenticated,
    adminUser,
  } = useNews();

  const [isStateMenuOpen, setIsStateMenuOpen] = useState(false);
  const [isSearchOpenMobile, setIsSearchOpenMobile] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const stateButtonRef = useRef<HTMLButtonElement>(null);

  const hasRegionalFilter = Boolean(selectedState || selectedCity);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      {/* Editorial Top Utility Strip */}
      <div className="bg-stone-900 text-stone-300 dark:bg-stone-950 dark:text-stone-400 text-[11px] py-1 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-emerald-400">JORNALISMO REGIONAL INDEPENDENTE</span>
            <span className="hidden sm:inline text-stone-500">·</span>
            <span className="hidden sm:inline">26 Estados + Distrito Federal</span>
            <span className="hidden md:inline text-stone-500">·</span>
            <span className="hidden md:inline">Edição Digital em Tempo Real</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveView('admin');
                window.location.hash = 'admin';
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-[11px] cursor-pointer transition-colors shadow-xs"
              title="Acessar Redação e Painel Administrativo"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>{isAdminAuthenticated ? `ADM: ${adminUser?.name || 'Logado'}` : 'Painel ADM / Redação'}</span>
            </button>

            {hasRegionalFilter && (
              <span className="hidden lg:inline text-emerald-400 font-medium">
                Região ativa: {selectedCity ? `${selectedCity} (${selectedState})` : `Estado ${selectedState}`}
              </span>
            )}
            <span className="text-stone-400 hidden sm:inline">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Main Top Bar (Strict 3-Zone Contract) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 relative">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            setActiveView('home');
            clearRegionalFilter();
          }}
          className="text-left group cursor-pointer"
        >
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-1.5 font-editorial">
            <span>Brasil</span>
            <span className="text-emerald-700 dark:text-emerald-500">&amp;</span>
            <span>Interior</span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Single-Line, 4-5 links) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-700 dark:text-stone-300">
          <button
            onClick={() => setActiveView('home')}
            className={`whitespace-nowrap transition-colors hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer ${
              activeView === 'home' && !hasRegionalFilter
                ? 'text-emerald-800 dark:text-emerald-400 font-semibold'
                : ''
            }`}
          >
            Início
          </button>

          <button
            onClick={() => setActiveView('ultimas')}
            className={`whitespace-nowrap transition-colors hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer ${
              activeView === 'ultimas'
                ? 'text-emerald-800 dark:text-emerald-400 font-semibold'
                : ''
            }`}
          >
            Últimas Notícias
          </button>

          <button
            onClick={() => setActiveView('brasil_interior')}
            className={`whitespace-nowrap transition-colors hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer ${
              activeView === 'brasil_interior'
                ? 'text-emerald-800 dark:text-emerald-400 font-semibold'
                : ''
            }`}
          >
            Brasil &amp; Interior
          </button>

          <button
            onClick={() => {
              setActiveView('admin');
              window.location.hash = 'admin';
            }}
            className={`whitespace-nowrap transition-colors hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer font-bold flex items-center gap-1 ${
              activeView === 'admin'
                ? 'text-emerald-800 dark:text-emerald-400'
                : 'text-amber-700 dark:text-amber-400'
            }`}
          >
            <span>Painel ADM</span>
          </button>

          {/* Estados e Municípios Dropdown Trigger */}
          <div className="relative">
            <button
              ref={stateButtonRef}
              onClick={() => setIsStateMenuOpen(!isStateMenuOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all cursor-pointer ${
                hasRegionalFilter
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-300 dark:border-emerald-800'
                  : isStateMenuOpen
                  ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                  : 'hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-700 dark:text-emerald-500" />
              <span>
                {selectedCity
                  ? `${selectedCity} (${selectedState})`
                  : selectedState
                  ? `Estado: ${selectedState}`
                  : 'Estados e Municípios'}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isStateMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* The Cascading Menu */}
            <StateCityMenu
              isOpen={isStateMenuOpen}
              onClose={() => setIsStateMenuOpen(false)}
              anchorRef={stateButtonRef}
            />
          </div>
        </nav>

        {/* Zone 3: Actions (Search, Dark Mode, Painel ADM) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Bar Desktop */}
          <div className="hidden lg:flex items-center relative w-48 xl:w-64">
            <Search className="w-4 h-4 absolute left-3 text-stone-400" />
            <input
              type="text"
              placeholder="Buscar notícia..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-7 py-1.5 text-xs bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Trigger for Mobile */}
          <button
            onClick={() => setIsSearchOpenMobile(!isSearchOpenMobile)}
            className="lg:hidden p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg cursor-pointer"
            aria-label="Abrir busca"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
            title={darkMode ? 'Modo Claro' : 'Modo Escuro'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="md:hidden p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg cursor-pointer"
            aria-label="Abrir navegação mobile"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Input Overlay */}
      {isSearchOpenMobile && (
        <div className="lg:hidden p-3 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 animate-in fade-in">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Buscar notícias por título, assunto ou cidade..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {isMobileNavOpen && (
        <div className="md:hidden bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setActiveView('home');
                clearRegionalFilter();
                setIsMobileNavOpen(false);
              }}
              className={`p-2.5 rounded-lg text-xs font-medium text-left border ${
                activeView === 'home' && !hasRegionalFilter
                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                  : 'border-stone-200 dark:border-stone-800'
              }`}
            >
              Início
            </button>
            <button
              onClick={() => {
                setActiveView('ultimas');
                setIsMobileNavOpen(false);
              }}
              className={`p-2.5 rounded-lg text-xs font-medium text-left border ${
                activeView === 'ultimas'
                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                  : 'border-stone-200 dark:border-stone-800'
              }`}
            >
              Últimas Notícias
            </button>
            <button
              onClick={() => {
                setActiveView('brasil_interior');
                setIsMobileNavOpen(false);
              }}
              className={`p-2.5 rounded-lg text-xs font-medium text-left border ${
                activeView === 'brasil_interior'
                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                  : 'border-stone-200 dark:border-stone-800'
              }`}
            >
              Brasil &amp; Interior
            </button>
            <button
              onClick={() => {
                setIsStateMenuOpen(true);
                setIsMobileNavOpen(false);
              }}
              className={`p-2.5 rounded-lg text-xs font-medium text-left border flex items-center justify-between ${
                hasRegionalFilter
                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                  : 'border-stone-200 dark:border-stone-800'
              }`}
            >
              <span>Estados &amp; Cidades</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {hasRegionalFilter && (
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <span className="text-xs text-stone-600 dark:text-stone-400">
                Filtro: {selectedCity ? `${selectedCity} - ${selectedState}` : `Estado ${selectedState}`}
              </span>
              <button
                onClick={() => {
                  clearRegionalFilter();
                  setIsMobileNavOpen(false);
                }}
                className="text-xs text-red-600 font-semibold"
              >
                Limpar Filtro
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
