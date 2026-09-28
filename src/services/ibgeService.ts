import { BRAZIL_STATES } from '../data/brazilLocations';

// Cache in memory
const memoryCache: Record<string, string[]> = {};

export interface IBGEMunicipio {
  id: number;
  nome: string;
}

/**
 * Retorna os municípios de um determinado estado (UF).
 * 1. Primeiro verifica se tem no cache em memória ou no localStorage
 * 2. Tenta buscar da API pública oficial do IBGE para obter 100% dos municípios daquele estado
 * 3. Se houver falha de rede ou enquanto carrega, utiliza a ampla base local pré-carregada
 */
export async function getMunicipiosPorEstado(
  ufSigla: string,
  onLoaded?: (municipios: string[], source: 'ibge' | 'cache' | 'local') => void
): Promise<string[]> {
  const siglaUpper = ufSigla.toUpperCase();

  // 1. Memory cache check
  if (memoryCache[siglaUpper] && memoryCache[siglaUpper].length > 0) {
    if (onLoaded) onLoaded(memoryCache[siglaUpper], 'cache');
    return memoryCache[siglaUpper];
  }

  // 2. LocalStorage check
  try {
    const localSaved = localStorage.getItem(`ibge_municipios_${siglaUpper}`);
    if (localSaved) {
      const parsed = JSON.parse(localSaved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryCache[siglaUpper] = parsed;
        if (onLoaded) onLoaded(parsed, 'cache');
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Erro ao ler cache do storage:', e);
  }

  // Fallback imediato: base local
  const localState = BRAZIL_STATES.find(s => s.sigla === siglaUpper);
  const fallbackList = localState ? localState.municipios : [];
  if (onLoaded) onLoaded(fallbackList, 'local');

  // 3. Tentar carregar do IBGE em segundo plano/assíncrono
  try {
    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${siglaUpper}/municipios?orderBy=nome`
    );
    if (response.ok) {
      const data: IBGEMunicipio[] = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const names = data.map(m => m.nome);
        memoryCache[siglaUpper] = names;
        try {
          localStorage.setItem(`ibge_municipios_${siglaUpper}`, JSON.stringify(names));
        } catch {
          // Ignore quota errors
        }
        if (onLoaded) onLoaded(names, 'ibge');
        return names;
      }
    }
  } catch (error) {
    console.info(`Não foi possível conectar ao IBGE no momento para ${siglaUpper}, mantendo base expandida offline.`, error);
  }

  return fallbackList;
}

/**
 * Retorna os municípios sincronamente a partir da base expandida ou cache
 */
export function getMunicipiosSync(ufSigla: string): string[] {
  const siglaUpper = ufSigla.toUpperCase();
  if (memoryCache[siglaUpper]) {
    return memoryCache[siglaUpper];
  }
  try {
    const localSaved = localStorage.getItem(`ibge_municipios_${siglaUpper}`);
    if (localSaved) {
      const parsed = JSON.parse(localSaved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryCache[siglaUpper] = parsed;
        return parsed;
      }
    }
  } catch {
    // Ignore
  }

  const localState = BRAZIL_STATES.find(s => s.sigla === siglaUpper);
  return localState ? localState.municipios : [];
}
