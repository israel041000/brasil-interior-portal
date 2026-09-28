export type ScopeType = 'Nacional' | 'Estadual' | 'Municipal';

export type NewsCategory = string;

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

export interface AdSenseSettings {
  enabled: boolean;
  clientScriptId: string; // e.g. ca-pub-XXXXXXXXXXXXXXXX
  autoAdsEnabled: boolean;
  showPlaceholders: boolean; // Show placeholder boxes in production if true
  headerBannerCode: string; // Custom <ins> or HTML code for top header ad
  inFeedBannerCode: string; // Custom <ins> or HTML code for between sections
  bottomArticleBannerCode: string; // Custom <ins> or HTML code for end of article
}
