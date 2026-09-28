import { Article } from '../types';

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'Agronegócio': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
  'Meio Ambiente': 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
  'Cidades': 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=1200&q=80',
  'Cultura': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
  'Tecnologia': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  'Economia': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
  'Nacional': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
  'Geral': 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
};

export const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80';

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-001',
    title: 'Polo do Centro-Oeste lidera revolução verde com energia solar e inteligência no campo',
    subtitle: 'Complexos agroindustriais no interior de Mato Grosso batem recorde em descarbonização e conectividade, impulsionando a safra nacional com sustentabilidade comprovada.',
    content: `O interior de Mato Grosso consolidou nesta semana mais um marco para o agronegócio e a transição energética do país. Em municípios estratégicos como Sorriso, Lucas do Rio Verde e Sinop, cooperativas e médios produtores ampliaram em mais de 45% a adesão a parques fotovoltaicos instalados sobre armazéns e estruturas de beneficiamento de grãos.

A integração entre geração distribuída de energia limpa, sensores de umidade de solo em tempo real e logística multimodal hidroviária e ferroviária vem gerando ganhos diretos de produtividade com drástica redução nas emissões de carbono.

![Complexo agroindustrial com armazéns inteligentes e painéis solares em Sorriso (MT)](https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80)

Segundo balanço divulgado por consórcios agrícolas regionais, a economia gerada pela eletrificação e monitoramento remoto superou R$ 180 milhões no último trimestre. "Não se trata apenas de produzir mais toneladas por hectare, mas de garantir rastreabilidade internacional rigorosa, preservação das matas ciliares e geração de empregos qualificados para os jovens das cidades do interior", pontua a pesquisadora ambiental Mariana Albuquerque.

A iniciativa também contempla projetos pioneiros de recuperação de nascentes e capacitação de comunidades rurais em tecnologia de satélites aplicada ao manejo de pastagens sustentáveis.`,
    coverImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    category: 'Agronegócio',
    scope: 'Municipal',
    stateSigla: 'MT',
    stateName: 'Mato Grosso',
    cityName: 'Sorriso',
    tags: ['Agronegócio', 'Sustentabilidade', 'Energia Solar', 'Centro-Oeste', 'Inovação'],
    publishedAt: '2026-09-27T16:30:00Z',
    readTimeMinutes: 5,
    author: {
      name: 'Carlos Eduardo Ramos',
      role: 'Correspondente de Economia e Agronegócios'
    },
    status: 'publicado',
    views: 14200,
    isLead: true
  },
  {
    id: 'art-002',
    title: 'Monitoramento comunitário no Pantanal e bacia amazônica amplia proteção de espécies aquáticas',
    subtitle: 'Parcerias entre ribeirinhos, biólogos e brigadas voluntárias reduzem queimadas e protegem refúgios ecológicos em Corumbá e municípios vizinhos.',
    content: `Em Corumbá e ao longo dos canais navegáveis que interligam o Pantanal sul-mato-grossense aos rios do Centro-Oeste, uma rede de monitoramento em tempo real operada conjuntamente por comunidades tradicionais ribeirinhas e pesquisadores vem transformando a gestão ambiental.

Equipados com embarcações leves movidas a motores solares silenciosos e aplicativos de mapeamento offline, os agentes comunitários registraram um aumento consistente no número de ninhadas de ariranhas e na recuperação de cardumes após as secas sazonais.

![Preservação de canais e refúgios ecológicos no Pantanal](https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80)

O projeto, que conta com apoio de universidades federais e fundos socioambientais, já serviu de modelo piloto para municípios da calha do Rio Madeira e do Tapajós, no Norte do país. O objetivo para o próximo semestre é instalar cinco novos postos flutuantes de atendimento e análise da qualidade da água.`,
    coverImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    category: 'Meio Ambiente',
    scope: 'Municipal',
    stateSigla: 'MS',
    stateName: 'Mato Grosso do Sul',
    cityName: 'Corumbá',
    tags: ['Meio Ambiente', 'Pantanal', 'Biodiversidade', 'Comunidades'],
    publishedAt: '2026-09-27T14:15:00Z',
    readTimeMinutes: 4,
    author: {
      name: 'Beatriz Fonseca',
      role: 'Editora de Ciência e Ecologia'
    },
    status: 'publicado',
    views: 9840
  },
  {
    id: 'art-003',
    title: 'Cidades do interior paulista e paranaense avançam em corredores de transporte 100% elétrico',
    subtitle: 'Campinas, Ribeirão Preto e Londrina implementam faixas exclusivas com ônibus elétricos, reduzindo ruído e emissões em eixos urbanos densos.',
    content: `Os municípios do interior do Sudeste e do Sul têm assumido a vanguarda das políticas públicas de mobilidade urbana de baixa emissão. Em Campinas, os novos corredores de transporte rápido (BRT) iniciaram a operação de frotas integralmente elétricas abastecidas por centrais de recarga rápida nas garagens municipais.

Medições preliminares da secretaria municipal de transportes apontam uma diminuição de 62% na poluição sonora nas vias centrais e uma economia expressiva no custo operacional por quilômetro rodado em comparação com veículos a diesel.

![Avanços em mobilidade e tecnologia nas cidades do interior](https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=1200&q=80)

A transição também estimulou a formação técnica em mecânica de veículos elétricos e automação no Senai local, abrindo novas vagas de emprego para técnicos da região metropolitana. Em Ribeirão Preto e Londrina, projetos semelhantes estão em fase de homologação para o primeiro semestre de 2027.`,
    coverImage: 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=1200&q=80',
    category: 'Cidades',
    scope: 'Municipal',
    stateSigla: 'SP',
    stateName: 'São Paulo',
    cityName: 'Campinas',
    tags: ['Mobilidade', 'Cidades Inteligentes', 'Transporte Elétrico', 'Campinas'],
    publishedAt: '2026-09-27T11:45:00Z',
    readTimeMinutes: 4,
    author: {
      name: 'Juliana Meirelles',
      role: 'Repórter de Infraestrutura e Cidades'
    },
    status: 'publicado',
    views: 11250
  },
  {
    id: 'art-004',
    title: 'Festivais do interior mineiro e baiano celebram patrimônio histórico com fomento ao artesanato',
    subtitle: 'Encontros culturais em Ouro Preto, Tiradentes e Cachoeira atraem milhares de turistas e fortalecem cooperativas de mestres artesãos.',
    content: `As ruas de paralelepípedo e as fachadas seculares de cidades históricas do interior de Minas Gerais e do Recôncavo Baiano voltaram a pulsar com feiras gastronômicas, rodas de capoeira, concertos barrocos e oficinas abertas de talha em madeira e tecelagem manual.

Em Ouro Preto e Tiradentes, o festival de tradições populares atraiu visitantes de todo o Brasil e alavancou em 38% a renda das famílias de artesãos vinculadas a associações locais. Os recursos gerados pelas feiras são reinvestidos na conservação das oficinas comunitárias e na transmissão dos saberes tradicionais aos aprendizes mais jovens.

![Casario histórico e patrimônio cultural preservado](https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80)

Na Bahia, municípios do interior vêm integrando roteiros da culinária ancestral com o turismo pedagógico escolar, demonstrando a força da economia criativa enraizada nos costumes regionais.`,
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    category: 'Cultura',
    scope: 'Municipal',
    stateSigla: 'MG',
    stateName: 'Minas Gerais',
    cityName: 'Ouro Preto',
    tags: ['Cultura', 'Patrimônio', 'Turismo', 'Artesanato', 'Minas Gerais'],
    publishedAt: '2026-09-27T09:20:00Z',
    readTimeMinutes: 3,
    author: {
      name: 'Henrique Guimarães',
      role: 'Crítico e Repórter Cultural'
    },
    status: 'publicado',
    views: 7600
  },
  {
    id: 'art-005',
    title: 'Governo Federal anuncia expansão de crédito regional para infraestrutura hídrica e saneamento',
    subtitle: 'Nova linha com taxas incentivadas destinará R$ 14 bilhões a consórcios intermunicipais no Nordeste e Norte para tratamento de efluentes e segurança alimentar.',
    content: `O Ministério das Cidades e bancos públicos federais oficializaram nesta semana um programa nacional voltado prioritariamente a municípios de pequeno e médio porte do semiárido nordestino e da Amazônia legal. O objetivo central é acelerar as metas do Marco Legal do Saneamento Básico, garantindo água tratada para populações rurais e periferias de cidades médias.

Os prefeitos reunidos em consórcio poderão apresentar projetos conjuntos para tratamento de esgoto, contenção de perdas nas redes de distribuição e instalação de cisternas produtivas em escolas públicas e postos de saúde.`,
    coverImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
    category: 'Nacional',
    scope: 'Nacional',
    tags: ['Brasil', 'Economia', 'Saneamento', 'Infraestrutura', 'Políticas Públicas'],
    publishedAt: '2026-09-27T08:00:00Z',
    readTimeMinutes: 5,
    author: {
      name: 'Renata Lins',
      role: 'Analista de Economia Pública'
    },
    status: 'publicado',
    views: 15400
  },
  {
    id: 'art-006',
    title: 'Polo tecnológico de Joinville e Florianópolis bate recorde de exportação de softwares industriais',
    subtitle: 'Empresas catarinenses ampliam presença no mercado latino-americano com soluções para automação de fábricas e logística portuária.',
    content: `O ecossistema de inovação do norte catarinense, sediado em Joinville, em parceria com os centros de pesquisa de Florianópolis e Blumenau, atingiu um volume recorde de US$ 320 milhões em serviços de software industrial exportados nos últimos nove meses.

A forte tradição metalmecânica da região serviu de berço natural para o surgimento de startups de manufatura avançada, inteligência preditiva para máquinas e sistemas de controle aduaneiro aplicados aos portos de Itajaí e São Francisco do Sul.`,
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    category: 'Tecnologia',
    scope: 'Municipal',
    stateSigla: 'SC',
    stateName: 'Santa Catarina',
    cityName: 'Joinville',
    tags: ['Tecnologia', 'Santa Catarina', 'Indústria 4.0', 'Inovação'],
    publishedAt: '2026-09-26T18:10:00Z',
    readTimeMinutes: 4,
    author: {
      name: 'Felipe Dornelles',
      role: 'Correspondente de Inovação'
    },
    status: 'publicado',
    views: 8900
  },
  {
    id: 'art-007',
    title: 'Feira de Santana consolida novo hub logístico de distribuição de hortifrúti do Nordeste',
    subtitle: 'Com entroncamento de quatro rodovias federais, cidade baiana agiliza escoamento da produção da Chapada e do Vale do São Francisco.',
    content: `Feira de Santana, conhecida como a "Princesa do Sertão", inaugurou um moderno terminal de distribuição refrigerada para alimentos frescos. A estrutura encurta o tempo de transporte entre as plantações de manga e uva de Juazeiro/Petrolina e os centros consumidores de Salvador, Aracaju e Maceió.

O novo complexo conta com câmaras frias inteligentes abastecidas por biometano e sistema de pesagem automatizado para cooperativas familiares.`,
    coverImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    category: 'Economia',
    scope: 'Municipal',
    stateSigla: 'BA',
    stateName: 'Bahia',
    cityName: 'Feira de Santana',
    tags: ['Nordeste', 'Logística', 'Bahia', 'Agronegócio'],
    publishedAt: '2026-09-26T15:00:00Z',
    readTimeMinutes: 3,
    author: {
      name: 'Marcos Vinicius Santos',
      role: 'Repórter Regional'
    },
    status: 'publicado',
    views: 6420
  },
  {
    id: 'art-008',
    title: 'Cruzeiro do Sul e Rio Branco avançam na integração de telemedicina especializada na floresta',
    subtitle: 'Conexão por satélite de baixa órbita permite que especialistas da capital atendam pacientes em aldeias e vilarejos remotos do Acre.',
    content: `A saúde pública no Acre alcançou um marco histórico com o programa de telemedicina especializada em comunidades isoladas do Vale do Juruá e Alto Acre. Médicos baseados em Rio Branco e centros universitários conveniados realizam consultas cardiológicas e dermatológicas ao vivo com o auxílio de enfermeiros de campo.

O tempo de espera para laudos diagnósticos caiu de 45 dias para menos de 6 horas, evitando deslocamentos fluviais que duravam dias.`,
    coverImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    category: 'Cidades',
    scope: 'Municipal',
    stateSigla: 'AC',
    stateName: 'Acre',
    cityName: 'Cruzeiro do Sul',
    tags: ['Acre', 'Saúde', 'Amazônia', 'Telemedicina'],
    publishedAt: '2026-09-26T12:00:00Z',
    readTimeMinutes: 4,
    author: {
      name: 'Aline Nogueira',
      role: 'Correspondente da Amazônia Ocidental'
    },
    status: 'publicado',
    views: 5310
  },
  {
    id: 'art-009',
    title: 'Petrolina e Juazeiro ampliam exportação de uva sem semente com irradiação solar e irrigação de precisão',
    subtitle: 'O Submédio do Vale do São Francisco consolida a safra de frutas tropicais de exportação com certificação global de rastreabilidade.',
    content: `A fruticultura irrigada no Vale do São Francisco registrou um novo crescimento de 22% nos embarques para os mercados europeu e norte-americano. Em Petrolina (PE) e Juazeiro (BA), o uso combinado de microaspersão automatizada e análise nutricional de folhas por inteligência artificial reduziu o uso de insumos hídricos em 30%.

As cooperativas de produtores familiares da região comemoram o aumento do valor agregado por hectare cultivado, impulsionando a abertura de novos postos de trabalho no interior pernambucano e baiano.`,
    coverImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    category: 'Agronegócio',
    scope: 'Municipal',
    stateSigla: 'PE',
    stateName: 'Pernambuco',
    cityName: 'Petrolina',
    tags: ['Agronegócio', 'Pernambuco', 'Exportação', 'São Francisco'],
    publishedAt: '2026-09-28T08:30:00Z',
    readTimeMinutes: 4,
    author: {
      name: 'Rodrigo Silveira',
      role: 'Analista de Mercados Agrícolas'
    },
    status: 'publicado',
    views: 12100
  },
  {
    id: 'art-010',
    title: 'Santarém e Alter do Chão ganham centro de bioeconomia para processamento sustentável de óleos essenciais',
    subtitle: 'Comunidades extrativistas do oeste paraense agregam valor à castanha, copaíba e andiroba com apoio de laboratórios regionais de inovação.',
    content: `A inauguração do novo Parque Tecnológico da Bioeconomia em Santarém marca um momento decisivo para o extrativismo comunitário no Baixo Amazonas. A estrutura permite que cooperativas locais processem óleos cosméticos e medicinais com padrão internacional direto na origem.

O projeto garante remuneração justa para mais de 1.200 famílias de extrativistas e fortalece a conservação das reservas extrativistas da região de Alter do Chão e Tapajós.`,
    coverImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    category: 'Meio Ambiente',
    scope: 'Municipal',
    stateSigla: 'PA',
    stateName: 'Pará',
    cityName: 'Santarém',
    tags: ['Bioeconomia', 'Pará', 'Amazônia', 'Sustentabilidade'],
    publishedAt: '2026-09-28T07:15:00Z',
    readTimeMinutes: 5,
    author: {
      name: 'Marina Tapajós',
      role: 'Repórter de Meio Ambiente e Sociedade'
    },
    status: 'publicado',
    views: 9400
  },
  {
    id: 'art-011',
    title: 'Maringá e Cascavel lideram ranking de cidades mais arborizadas e seguras do Sul do país',
    subtitle: 'Planejamento urbano integrado e ampliação de parques lineares elevam a qualidade de vida nos municípios do interior paranaense.',
    content: `Índices recentes de desenvolvimento humano municipal destacam Maringá e Cascavel como referência em parques urbanos, ciclovias integradas e gestão digital de iluminação pública. 

A cobertura vegetal de mais de 30% da área urbana reduz ilhas de calor e favorece a drenagem de águas pluviais, servindo de inspiração para outros centros urbanos de médio porte no interior do Brasil.`,
    coverImage: 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=1200&q=80',
    category: 'Cidades',
    scope: 'Municipal',
    stateSigla: 'PR',
    stateName: 'Paraná',
    cityName: 'Maringá',
    tags: ['Paraná', 'Urbanismo', 'Qualidade de Vida', 'Cidades Verdes'],
    publishedAt: '2026-09-28T06:45:00Z',
    readTimeMinutes: 3,
    author: {
      name: 'Lucas Pires',
      role: 'Correspondente do Sul'
    },
    status: 'publicado',
    views: 8150
  },
  {
    id: 'art-012',
    title: 'Rota das Rendas em Caicó e Serra do Mel movimenta a economia criativa no interior do RN',
    subtitle: 'Mestras bordadeiras do Seridó conquistam feiras internacionais com bordado de Caicó de indicação geográfica protegida.',
    content: `O bordado tradicional do Seridó, no interior do Rio Grande do Norte, vivencia uma fase de forte valorização no design contemporâneo e na moda sustentável. A associação de bordadeiras de Caicó assinou novos contratos de fornecimento para ateliês nacionais e europeus.

A conquista do selo de Indicação Geográfica preserva técnicas seculares e assegura formação técnica remunerada para jovens aprendizes das zonas rurais do Seridó potiguar.`,
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    category: 'Cultura',
    scope: 'Municipal',
    stateSigla: 'RN',
    stateName: 'Rio Grande do Norte',
    cityName: 'Caicó',
    tags: ['Cultura', 'Artesanato', 'Rio Grande do Norte', 'Seridó'],
    publishedAt: '2026-09-28T05:20:00Z',
    readTimeMinutes: 4,
    author: {
      name: 'Clarice Medeiros',
      role: 'Correspondente de Cultura Regional'
    },
    status: 'publicado',
    views: 7200
  },
  {
    id: 'art-013',
    title: 'Goiânia e Rio Verde recebem maior feira de startups do agronegócio e biotecnologia da América Latina',
    subtitle: 'Encontro reúne investidores, cientistas e jovens empreendedores para debater fertilizantes orgânicos e automação de máquinas.',
    content: `O estado de Goiás sedia nesta semana a edição 2026 da AgriTech Summit, reunindo mais de 250 agtechs e cooperativas agrícolas de todo o Centro-Oeste. 

Entre os principais destaques estão os drones autônomos de pulverização seletiva e os bioinsumos produzidos a partir de microrganismos nativos do Cerrado, com potencial para substituir insumos químicos importados.`,
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    category: 'Tecnologia',
    scope: 'Municipal',
    stateSigla: 'GO',
    stateName: 'Goiás',
    cityName: 'Rio Verde',
    tags: ['Tecnologia', 'Goiás', 'Agtech', 'Inovação'],
    publishedAt: '2026-09-28T04:00:00Z',
    readTimeMinutes: 4,
    author: {
      name: 'Gabriel Siqueira',
      role: 'Repórter de Inovação e Negócios'
    },
    status: 'publicado',
    views: 10500
  },
  {
    id: 'art-014',
    title: 'Caxias do Sul e Bento Gonçalves impulsionam o enoturismo com foco em sustentabilidade e gastronomia',
    subtitle: 'Região da Serra Gaúcha registra alta recorde na visitação de vinícolas familiares e rotas do patrimônio colonial italiano.',
    content: `A Serra Gaúcha encerra o terceiro trimestre com recorde histórico na presença de visitantes nacionais e sul-americanos. Vinícolas de pequeno e médio porte em Caxias do Sul, Bento Gonçalves e Garibaldi investiram em certificações orgânicas, degustações guiadas por enólogos e preservação de vales nativos.

A movimentação aqueceu o setor de hotelaria, gastronomia e transporte comunitário, gerando renda para produtores rurais de várias gerações.`,
    coverImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
    category: 'Economia',
    scope: 'Municipal',
    stateSigla: 'RS',
    stateName: 'Rio Grande do Sul',
    cityName: 'Caxias do Sul',
    tags: ['Enoturismo', 'Rio Grande do Sul', 'Gastronomia', 'Turismo'],
    publishedAt: '2026-09-28T03:30:00Z',
    readTimeMinutes: 4,
    author: {
      name: 'Eduardo Rossi',
      role: 'Especialista em Turismo Regional'
    },
    status: 'publicado',
    views: 9100
  }
];
