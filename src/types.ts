export type ScopeType = 'Nacional' | 'Estadual' | 'Municipal';

export type NewsCategory = 
  | 'Geral'
  | 'Nacional'
  | 'Economia'
  | 'Agronegócio'
  | 'Política'
  | 'Cidades'
  | 'Meio Ambiente'
  | 'Cultura'
  | 'Tecnologia';

export interface Author {
  name: string;
  role: string;
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  coverImage: string;
  category: NewsCategory;
  scope: ScopeType;
  stateSigla?: string; // e.g. 'SP', 'MT'
  stateName?: string;  // e.g. 'São Paulo'
  cityName?: string;   // e.g. 'Ribeirão Preto'
  tags: string[];
  publishedAt: string;
  readTimeMinutes: number;
  author: Author;
  status: 'publicado' | 'rascunho';
  views: number;
  isLead?: boolean;
}

export type BrazilianRegion = 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul';

export interface BrazilianState {
  sigla: string;
  nome: string;
  regiao: BrazilianRegion;
  capital: string;
  municipios: string[];
}
