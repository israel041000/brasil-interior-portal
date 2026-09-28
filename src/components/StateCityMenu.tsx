import React, { useState, useMemo, useRef, useEffect } from 'react';
import { BRAZIL_STATES, REGIONS } from '../data/brazilLocations';
import { BrazilianState, BrazilianRegion } from '../types';
import { useNews } from '../context/NewsContext';
import { getMunicipiosPorEstado, getMunicipiosSync } from '../services/ibgeService';
import { 
  MapPin, 
  ChevronRight, 
  Search, 
  X, 
  Check, 
  Globe, 
  RefreshCw, 
  Database,
  Building2,
  Plus
} from 'lucide-react';

interface StateCityMenuProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLButtonElement | null>;
}

export const StateCityMenu: React.FC<StateCityMenuProps> = ({ isOpen, onClose }) => {
  const { selectedState, selectedCity, selectLocationFilter, clearRegionalFilter } = useNews();

  const [activeTabRegion, setActiveTabRegion] = useState<BrazilianRegion | 'Todos'>('Todos');
  const [hoveredStateSigla, setHoveredStateSigla] = useState<string>(selectedState || 'SP');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dynamic municipalities map per state (caches local + IBGE)
  const [municipalitiesMap, setMunicipalitiesMap] = useState<Record<string, string[]>>(() => {
    const initialMap: Record<string, string[]> = {};
    BRAZIL_STATES.forEach(st => {
      initialMap[st.sigla] = getMunicipiosSync(st.sigla);
    });
    return initialMap;
  });

  const [loadingIbge, setLoadingIbge] = useState<Record<string, boolean>>({});
  const [ibgeSourceMap, setIbgeSourceMap] = useState<Record<string, 'ibge' | 'local' | 'cache'>>({});
  const menuContainerRef = useRef<HTMLDivElement>(null);

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Keep hoveredState updated if state changes
  useEffect(() => {
    if (selectedState) {
      setHoveredStateSigla(selectedState);
    }
  }, [selectedState]);

  // Fetch full IBGE municipalities list whenever hovered state changes
  useEffect(() => {
    if (!hoveredStateSigla) return;
    
    // If not loaded from IBGE yet, request it
    if (ibgeSourceMap[hoveredStateSigla] !== 'ibge') {
      setLoadingIbge(prev => ({ ...prev, [hoveredStateSigla]: true }));
      getMunicipiosPorEstado(hoveredStateSigla, (list, source) => {
        setMunicipalitiesMap(prev => ({ ...prev, [hoveredStateSigla]: list }));
        setIbgeSourceMap(prev => ({ ...prev, [hoveredStateSigla]: source }));
        setLoadingIbge(prev => ({ ...prev, [hoveredStateSigla]: false }));
      }).finally(() => {
        setLoadingIbge(prev => ({ ...prev, [hoveredStateSigla]: false }));
      });
    }
  }, [hoveredStateSigla]); // Only re-run when the state we are looking at changes

  // Filter states based on search term and region
  const filteredStates = useMemo(() => {
    return BRAZIL_STATES.filter(st => {
      const matchesRegion = activeTabRegion === 'Todos' || st.regiao === activeTabRegion;
      const term = searchTerm.trim().toLowerCase();
      if (!term) return matchesRegion;
      const stateCities = municipalitiesMap[st.sigla] || st.municipios;
      const matchesSearch =
        st.nome.toLowerCase().includes(term) ||
        st.sigla.toLowerCase().includes(term) ||
        stateCities.some(m => m.toLowerCase().includes(term));
      return matchesRegion && matchesSearch;
    });
  }, [activeTabRegion, searchTerm, municipalitiesMap]);

  // Currently focused state object
  const currentFocusedState = useMemo(() => {
    return (
      BRAZIL_STATES.find(st => st.sigla === hoveredStateSigla) ||
      filteredStates[0] ||
      BRAZIL_STATES[0]
    );
  }, [hoveredStateSigla, filteredStates]);

  // All municipalities of the currently focused state
  const rawCityList = useMemo(() => {
    return (
      municipalitiesMap[currentFocusedState.sigla] ||
      currentFocusedState.municipios
    );
  }, [municipalitiesMap, currentFocusedState]);

  // Municipalities of the currently focused state, filtered by search
  const currentMunicipalities = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return rawCityList;
    return rawCityList.filter(m => m.toLowerCase().includes(term));
  }, [rawCityList, searchTerm]);

  // Check if search matches exactly or if it can be added as custom filter
  const isSearchCustom = useMemo(() => {
    const term = searchTerm.trim();
    if (!term) return false;
    const exists = rawCityList.some(c => c.toLowerCase() === term.toLowerCase());
    return !exists;
  }, [searchTerm, rawCityList]);

  if (!isOpen) return null;

  const currentSource = ibgeSourceMap[currentFocusedState.sigla] || 'local';
  const isLoadingCurrent = loadingIbge[currentFocusedState.sigla];

  return (
    <div
      ref={menuContainerRef}
      className="absolute top-full left-0 right-0 md:left-auto md:right-auto md:w-[760px] lg:w-[880px] mt-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-2xl z-50 overflow-hidden transition-all duration-200 animate-in fade-in slide-in-from-top-2"
    >
      {/* Top Bar inside Dropdown */}
      <div className="p-3 md:p-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950/70 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-700 dark:text-emerald-500 shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 leading-tight flex items-center gap-2">
              <span>Navegação Regional por Estados e Municípios</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
                Base IBGE Integrada
              </span>
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Explore o jornalismo dos municípios e interior de todos os 26 estados + Distrito Federal
            </p>
          </div>
        </div>

        {/* Search input with live count */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar qualquer município do Brasil..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 dark:focus:ring-emerald-500/30"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg md:hidden self-end"
          aria-label="Fechar menu de estados"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Region Segmented Tabs */}
      <div className="px-4 py-2 bg-white dark:bg-stone-900 border-b border-stone-100 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTabRegion('Todos')}
          className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
            activeTabRegion === 'Todos'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          Todos os Estados (27)
        </button>
        {REGIONS.map(reg => (
          <button
            key={reg}
            onClick={() => setActiveTabRegion(reg)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              activeTabRegion === reg
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            {reg}
          </button>
        ))}
      </div>

      {/* Two-Column Cascading Body: Left States, Right Municipalities */}
      <div className="grid grid-cols-1 md:grid-cols-12 h-[410px] max-h-[65vh] divide-y md:divide-y-0 md:divide-x divide-stone-100 dark:divide-stone-800">
        {/* Left Column: Estados List (Menu Rolante) */}
        <div className="md:col-span-5 h-[180px] md:h-full overflow-y-auto custom-scrollbar p-2 space-y-0.5">
          <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 flex items-center justify-between">
            <span>Estados ({filteredStates.length})</span>
            <span className="text-[10px] text-stone-400 font-normal">Passe o mouse ou toque</span>
          </div>

          {filteredStates.length === 0 ? (
            <div className="p-4 text-xs text-stone-500 text-center">Nenhum estado localizado.</div>
          ) : (
            filteredStates.map(st => {
              const isSelected = selectedState === st.sigla;
              const isHovered = hoveredStateSigla === st.sigla;
              const count = (municipalitiesMap[st.sigla] || st.municipios).length;

              return (
                <button
                  key={st.sigla}
                  onMouseEnter={() => setHoveredStateSigla(st.sigla)}
                  onClick={() => setHoveredStateSigla(st.sigla)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors group cursor-pointer ${
                    isHovered
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-5 rounded text-[11px] font-bold font-mono tracking-tight shrink-0 ${
                        isHovered || isSelected
                          ? 'bg-emerald-700 text-white'
                          : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {st.sigla}
                    </span>
                    <span className="truncate font-medium">{st.nome}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 text-[11px] text-stone-500 dark:text-stone-400">
                    <span className="text-[10px] font-mono tabular-nums bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded">
                      {count} mun.
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Right Column: Cascading Submenu of Municipalities */}
        <div className="md:col-span-7 h-[230px] md:h-full overflow-y-auto custom-scrollbar p-3 flex flex-col justify-between bg-stone-50/30 dark:bg-stone-900/30">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200/80 dark:border-stone-800 gap-2 flex-wrap">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold">
                    Municípios &amp; Interior de {currentFocusedState.sigla}
                  </span>
                  {isLoadingCurrent ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-stone-400">
                      <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />
                      Sincronizando IBGE...
                    </span>
                  ) : currentSource === 'ibge' ? (
                    <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 rounded">
                      ✓ IBGE Completo
                    </span>
                  ) : null}
                </div>
                <h5 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <span>{currentFocusedState.nome} ({rawCityList.length} cidades)</span>
                  <span className="text-xs font-normal text-stone-500">· Capital: {currentFocusedState.capital}</span>
                </h5>
              </div>

              {/* Button to filter ENTIRE state */}
              <button
                onClick={() => {
                  selectLocationFilter(currentFocusedState.sigla);
                  onClose();
                }}
                className="px-2.5 py-1 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 hover:bg-emerald-200 dark:hover:bg-emerald-900/80 rounded-md transition-colors whitespace-nowrap cursor-pointer"
              >
                Ver todo o Estado ({currentFocusedState.sigla})
              </button>
            </div>

            {/* Custom city search filter fallback */}
            {isSearchCustom && searchTerm.trim().length > 1 && (
              <div className="mb-2 p-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center justify-between">
                <div className="text-xs text-emerald-900 dark:text-emerald-200">
                  <span className="font-semibold">Filtrar pelo município:</span> "{searchTerm.trim()}" em {currentFocusedState.sigla}
                </div>
                <button
                  onClick={() => {
                    selectLocationFilter(currentFocusedState.sigla, searchTerm.trim());
                    onClose();
                  }}
                  className="px-2 py-1 text-xs font-semibold bg-emerald-700 text-white rounded hover:bg-emerald-800 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Filtrar</span>
                </button>
              </div>
            )}

            {/* List of cities in this state */}
            {currentMunicipalities.length === 0 ? (
              <div className="py-6 text-center text-xs text-stone-500 space-y-2">
                <p>Nenhum município listado corresponde a "{searchTerm}".</p>
                {searchTerm && (
                  <button
                    onClick={() => {
                      selectLocationFilter(currentFocusedState.sigla, searchTerm.trim());
                      onClose();
                    }}
                    className="px-3 py-1.5 text-xs bg-emerald-700 text-white rounded-lg font-medium hover:bg-emerald-800 cursor-pointer"
                  >
                    Filtrar mesmo assim por "{searchTerm.trim()}"
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 max-h-[290px] overflow-y-auto custom-scrollbar pr-1">
                {currentMunicipalities.map(city => {
                  const isCurrentCityActive =
                    selectedState === currentFocusedState.sigla && selectedCity === city;

                  return (
                    <button
                      key={city}
                      onClick={() => {
                        selectLocationFilter(currentFocusedState.sigla, city);
                        onClose();
                      }}
                      className={`text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-all cursor-pointer ${
                        isCurrentCityActive
                          ? 'bg-emerald-700 text-white font-medium shadow-xs'
                          : 'bg-white dark:bg-stone-900/90 text-stone-700 dark:text-stone-200 border border-stone-200/60 dark:border-stone-800 hover:border-emerald-600 hover:text-emerald-800 dark:hover:text-emerald-300'
                      }`}
                    >
                      <span className="truncate">{city}</span>
                      {isCurrentCityActive ? (
                        <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />
                      ) : city === currentFocusedState.capital ? (
                        <span className="text-[10px] text-stone-600 dark:text-stone-300 shrink-0 font-medium ml-1">Capital</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Clear Filter Option */}
          {(selectedState || selectedCity) && (
            <div className="pt-2.5 mt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
              <span className="text-stone-500">
                Filtro ativo: {selectedCity ? `${selectedCity} - ${selectedState}` : `Estado: ${selectedState}`}
              </span>
              <button
                onClick={() => {
                  clearRegionalFilter();
                  onClose();
                }}
                className="text-red-600 hover:text-red-700 dark:text-red-400 font-medium cursor-pointer"
              >
                Limpar Filtro Regional
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer bar of modal */}
      <div className="px-4 py-2.5 bg-stone-100/70 dark:bg-stone-950 border-t border-stone-200/80 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-500" />
          <span>
            {rawCityList.length} municípios disponíveis para {currentFocusedState.nome} ({currentFocusedState.sigla})
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white font-medium cursor-pointer"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};
