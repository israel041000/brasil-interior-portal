import { BrazilianState, BrazilianRegion } from '../types';

export const BRAZIL_STATES: BrazilianState[] = [
  // NORTE
  {
    sigla: 'AC',
    nome: 'Acre',
    regiao: 'Norte',
    capital: 'Rio Branco',
    municipios: [
      'Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira', 'Tarauacá', 'Feijó', 
      'Brasiléia', 'Epitaciolândia', 'Xapuri', 'Mâncio Lima', 'Marechal Thaumaturgo', 
      'Porto Acre', 'Plácido de Castro', 'Acrelândia', 'Rodrigues Alves', 'Bujari', 
      'Manoel Urbano', 'Capixaba', 'Porto Walter', 'Assis Brasil', 'Santa Rosa do Purus', 
      'Jordão'
    ]
  },
  {
    sigla: 'AP',
    nome: 'Amapá',
    regiao: 'Norte',
    capital: 'Macapá',
    municipios: [
      'Macapá', 'Santana', 'Laranjal do Jari', 'Oiapoque', 'Porto Grande', 
      'Mazagão', 'Tartarugalzinho', 'Vitória do Jari', 'Calçoene', 'Amapá', 
      'Ferreira Gomes', 'Cutias', 'Itaubal', 'Serra do Navio', 'Pracuúba'
    ]
  },
  {
    sigla: 'AM',
    nome: 'Amazonas',
    regiao: 'Norte',
    capital: 'Manaus',
    municipios: [
      'Manaus', 'Parintins', 'Itacoatiara', 'Manacapuru', 'Coari', 'Tefé', 
      'Tabatinga', 'Maués', 'Humaitá', 'Iranduba', 'São Gabriel da Cachoeira', 
      'Borba', 'Autazes', 'Presidente Figueiredo', 'Lábrea', 'Manicoré', 
      'Nova Olinda do Norte', 'Eirunepé', 'Careiro', 'Boca do Acre', 'São Paulo de Olivença',
      'Barcelos', 'Tupana', 'Novo Aripuanã', 'Fonte Boa', 'Uarini'
    ]
  },
  {
    sigla: 'PA',
    nome: 'Pará',
    regiao: 'Norte',
    capital: 'Belém',
    municipios: [
      'Belém', 'Ananindeua', 'Santarém', 'Marabá', 'Parauapebas', 'Castanhal', 
      'Abaetetuba', 'Cametá', 'Marituba', 'São Félix do Xingu', 'Bragança', 
      'Barcarena', 'Altamira', 'Tucuruí', 'Paragominas', 'Tailândia', 'Breves', 
      'Itaituba', 'Redenção', 'Moju', 'Oriximiná', 'Capanema', 'Santa Izabel do Pará',
      'Tomé-Açu', 'Canaã dos Carajás', 'Alenquer', 'Monte Alegre', 'Salinópolis',
      'Xinguara', 'Dom Eliseu', 'Vigia', 'Conceição do Araguaia'
    ]
  },
  {
    sigla: 'RO',
    nome: 'Rondônia',
    regiao: 'Norte',
    capital: 'Porto Velho',
    municipios: [
      'Porto Velho', 'Ji-Paraná', 'Ariquemes', 'Vilhena', 'Cacoal', 'Rolim de Moura', 
      'Jaru', 'Guajará-Mirim', 'Machadinho d\'Oeste', 'Buritis', 'Pimenta Bueno', 
      'Ouro Preto do Oeste', 'Espigão d\'Oeste', 'Nova Mamoré', 'Candeias do Jamari', 
      'Alta Floresta d\'Oeste', 'Presidente Médici', 'São Miguel do Guaporé', 
      'Colorado do Oeste', 'Alvorada d\'Oeste'
    ]
  },
  {
    sigla: 'RR',
    nome: 'Roraima',
    regiao: 'Norte',
    capital: 'Boa Vista',
    municipios: [
      'Boa Vista', 'Rorainópolis', 'Caracaraí', 'Pacaraima', 'Cantá', 'Mucajaí', 
      'Alto Alegre', 'Bonfim', 'Amajari', 'Normandia', 'São Luiz', 'São João da Baliza', 
      'Uiramutã', 'Caroebe', 'Iracema'
    ]
  },
  {
    sigla: 'TO',
    nome: 'Tocantins',
    regiao: 'Norte',
    capital: 'Palmas',
    municipios: [
      'Palmas', 'Araguaína', 'Gurupi', 'Porto Nacional', 'Paraíso do Tocantins', 
      'Colinas do Tocantins', 'Guaraí', 'Tocantinópolis', 'Dianópolis', 'Miracema do Tocantins', 
      'Formoso do Araguaia', 'Taguatinga', 'Lagoa da Confusão', 'Augustinópolis', 
      'Pedro Afonso', 'Alvorada', 'Araguatins', 'Natividade', 'Xambioá', 'Almas'
    ]
  },

  // NORDESTE
  {
    sigla: 'AL',
    nome: 'Alagoas',
    regiao: 'Nordeste',
    capital: 'Maceió',
    municipios: [
      'Maceió', 'Arapiraca', 'Rio Largo', 'Palmeira dos Índios', 'Penedo', 
      'União dos Palmares', 'Coruripe', 'Delmiro Gouveia', 'São Miguel dos Campos', 
      'Campo Alegre', 'Marechal Deodoro', 'Santana do Ipanema', 'Atalaia', 'Girau do Ponciano', 
      'Pilar', 'Viçosa', 'Maragogi', 'Piranhas', 'Batalha', 'Porto Calvo'
    ]
  },
  {
    sigla: 'BA',
    nome: 'Bahia',
    regiao: 'Nordeste',
    capital: 'Salvador',
    municipios: [
      'Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Juazeiro', 
      'Itabuna', 'Lauro de Freitas', 'Ilhéus', 'Teixeira de Freitas', 'Jequié', 
      'Alagoinhas', 'Barreiras', 'Porto Seguro', 'Simões Filho', 'Paulo Afonso', 
      'Eunápolis', 'Santo Antônio de Jesus', 'Valença', 'Candeias', 'Guanambi', 
      'Jacobina', 'Serrinha', 'Senhor do Bonfim', 'Luís Eduardo Magalhães', 'Dias d\'Ávila', 
      'Itapetinga', 'Irecê', 'Campo Formoso', 'Casa Nova', 'Brumado', 'Bom Jesus da Lapa', 
      'Conceição do Coité', 'Itaberaba', 'Cruz das Almas', 'Euclides da Cunha', 'Santo Amaro', 
      'Ribeira do Pombal', 'Cipó', 'Lençóis', 'Seabra', 'Mucugê', 'Morro de São Paulo', 
      'Itacaré', 'Prado', 'Mata de São João'
    ]
  },
  {
    sigla: 'CE',
    nome: 'Ceará',
    regiao: 'Nordeste',
    capital: 'Fortaleza',
    municipios: [
      'Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Sobral', 'Crato', 
      'Itapipoca', 'Maranguape', 'Iguatu', 'Quixadá', 'Canindé', 'Aquiraz', 
      'Pacatuba', 'Crateús', 'Russas', 'Tianguá', 'Aracati', 'Cascavel', 'Icó', 
      'Morada Nova', 'Camocim', 'Acaraú', 'Tauá', 'Limoeiro do Norte', 'Quixeramobim', 
      'Barbalha', 'Baturité', 'Guaramiranga', 'Jijoca de Jericoacoara', 'Beberibe'
    ]
  },
  {
    sigla: 'MA',
    nome: 'Maranhão',
    regiao: 'Nordeste',
    capital: 'São Luís',
    municipios: [
      'São Luís', 'Imperatriz', 'São José de Ribamar', 'Timon', 'Caxias', 'Codó', 
      'Paço do Lumiar', 'Açailândia', 'Bacabal', 'Balsas', 'Santa Inês', 'Barra do Corda', 
      'Pinheiro', 'Chapadinha', 'Santa Luzia', 'Buriticupu', 'Grajaú', 'Itapecuru Mirim', 
      'Coroatá', 'Tutóia', 'Barreirinhas', 'Presidente Dutra', 'Pedreiras', 'Viana', 
      'Carolina', 'Alcântara'
    ]
  },
  {
    sigla: 'PB',
    nome: 'Paraíba',
    regiao: 'Nordeste',
    capital: 'João Pessoa',
    municipios: [
      'João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos', 'Bayeux', 'Sousa', 
      'Cajazeiras', 'Cabedelo', 'Guarabira', 'Mamanguape', 'Queimadas', 'Esperança', 
      'Pombal', 'Monteiro', 'Catolé do Rocha', 'Alagoa Grande', 'Areia', 'Solânea', 
      'Conde', 'Itabaiana', 'Bananeiras', 'Picuí', 'Cuité'
    ]
  },
  {
    sigla: 'PE',
    nome: 'Pernambuco',
    regiao: 'Nordeste',
    capital: 'Recife',
    municipios: [
      'Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Petrolina', 'Paulista', 
      'Cabo de Santo Agostinho', 'Camaragibe', 'Garanhuns', 'Vitória de Santo Antão', 
      'Igarassu', 'São Lourenço da Mata', 'Santa Cruz do Capibaribe', 'Abreu e Lima', 
      'Ipojuca', 'Serra Talhada', 'Araripina', 'Gravatá', 'Carpina', 'Belo Jardim', 
      'Goiana', 'Arcoverde', 'Ouricuri', 'Pesqueira', 'Surubim', 'Palmares', 
      'Bezerros', 'Triunfo', 'Bonito', 'Fernando de Noronha'
    ]
  },
  {
    sigla: 'PI',
    nome: 'Piauí',
    regiao: 'Nordeste',
    capital: 'Teresina',
    municipios: [
      'Teresina', 'Parnaíba', 'Picos', 'Piripiri', 'Floriano', 'Barras', 'Campo Maior', 
      'União', 'Altos', 'Esperantina', 'José de Freitas', 'Pedro II', 'Oeiras', 
      'São Raimundo Nonato', 'Miguel Alves', 'Luís Correia', 'Bom Jesus', 'Uruçuí', 
      'Corrente', 'Valença do Piauí', 'Canto do Buriti'
    ]
  },
  {
    sigla: 'RN',
    nome: 'Rio Grande do Norte',
    regiao: 'Nordeste',
    capital: 'Natal',
    municipios: [
      'Natal', 'Mossoró', 'Parnamirim', 'São Gonçalo do Amarante', 'Ceará-Mirim', 
      'Macaíba', 'Caicó', 'Assú', 'São José de Mipibu', 'Currais Novos', 'Santa Cruz', 
      'Nova Cruz', 'Apodi', 'João Câmara', 'Touros', 'Pau dos Ferros', 'Macau', 
      'Tibau do Sul', 'Pipa', 'Areia Branca', 'Nísia Floresta'
    ]
  },
  {
    sigla: 'SE',
    nome: 'Sergipe',
    regiao: 'Nordeste',
    capital: 'Aracaju',
    municipios: [
      'Aracaju', 'Nossa Senhora do Socorro', 'Lagarto', 'Itabaiana', 'São Cristóvão', 
      'Estância', 'Tobias Barreto', 'Simão Dias', 'Itabaianinha', 'Nossa Senhora da Glória', 
      'Poço Redondo', 'Propriá', 'Barra dos Coqueiros', 'Boquim', 'Canindé de São Francisco', 
      'Laranjeiras', 'Neópolis', 'Umbaúba'
    ]
  },

  // CENTRO-OESTE
  {
    sigla: 'DF',
    nome: 'Distrito Federal',
    regiao: 'Centro-Oeste',
    capital: 'Brasília',
    municipios: [
      'Brasília', 'Ceilândia', 'Taguatinga', 'Samambaia', 'Plano Piloto', 'Águas Claras', 
      'Gama', 'Guará', 'Santa Maria', 'Sobradinho', 'Recanto das Emas', 'São Sebastião', 
      'Vicente Pires', 'Itapoã', 'Brazlândia', 'Sudoeste/Octogonal', 'Planaltina', 
      'Paranoá', 'Núcleo Bandeirante', 'Lago Sul', 'Lago Norte', 'Cruzeiro', 'Candangolândia'
    ]
  },
  {
    sigla: 'GO',
    nome: 'Goiás',
    regiao: 'Centro-Oeste',
    capital: 'Goiânia',
    municipios: [
      'Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Luziânia', 
      'Águas Lindas de Goiás', 'Valparaíso de Goiás', 'Trindade', 'Formosa', 
      'Novo Gama', 'Senador Canedo', 'Itumbiara', 'Catalão', 'Jataí', 'Planaltina', 
      'Caldas Novas', 'Santo Antônio do Descoberto', 'Cidade Ocidental', 'Goianésia', 
      'Cristalina', 'Mineiros', 'Inhumas', 'Jaraguá', 'Quirinópolis', 'Uruaçu', 
      'Porangatu', 'Goiatuba', 'Pires do Rio', 'Iporá', 'Niquelândia', 'Posse', 
      'Pirenópolis', 'Cidade de Goiás', 'Chapadão do Céu', 'São Miguel do Araguaia', 'Morrinhos'
    ]
  },
  {
    sigla: 'MT',
    nome: 'Mato Grosso',
    regiao: 'Centro-Oeste',
    capital: 'Cuiabá',
    municipios: [
      'Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Tangará da Serra', 
      'Sorriso', 'Lucas do Rio Verde', 'Primavera do Leste', 'Barra do Garças', 
      'Nova Mutum', 'Cáceres', 'Campo Novo do Parecis', 'Alta Floresta', 'Pontes e Lacerda', 
      'Juína', 'Campo Verde', 'Juara', 'Peixoto de Azevedo', 'Colíder', 'Guarantã do Norte', 
      'Mirassol d\'Oeste', 'Nova Xavantina', 'Diamantino', 'Sapezal', 'Querência', 
      'Canarana', 'Confresa', 'Água Boa', 'São Félix do Araguaia', 'Jaciara', 
      'Poxoréu', 'Chapada dos Guimarães', 'Nobres', 'Vila Rica', 'Barra do Bugres'
    ]
  },
  {
    sigla: 'MS',
    nome: 'Mato Grosso do Sul',
    regiao: 'Centro-Oeste',
    capital: 'Campo Grande',
    municipios: [
      'Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá', 'Ponta Porã', 'Sidrolândia', 
      'Naviraí', 'Nova Andradina', 'Aquidauana', 'Maracaju', 'Paranaíba', 'Amambai', 
      'Rio Brilhante', 'Coxim', 'Caarapó', 'Miranda', 'São Gabriel do Oeste', 'Aparecida do Taboado', 
      'Chapadão do Sul', 'Bonito', 'Fátima do Sul', 'Itaquiraí', 'Costa Rica', 
      'Jardim', 'Anastácio', 'Bela Vista', 'Ribas do Rio Pardo', 'Sonora', 'Bataguassu'
    ]
  },

  // SUDESTE
  {
    sigla: 'ES',
    nome: 'Espírito Santo',
    regiao: 'Sudeste',
    capital: 'Vitória',
    municipios: [
      'Vitória', 'Vila Velha', 'Serra', 'Cariacica', 'Cachoeiro de Itapemirim', 
      'Linhares', 'São Mateus', 'Colatina', 'Guarapari', 'Aracruz', 'Viana', 
      'Nova Venécia', 'Barra de São Francisco', 'Marataízes', 'Castelo', 'Santa Maria de Jetibá', 
      'Domingos Martins', 'Afonso Cláudio', 'Itapemirim', 'Anchieta', 'Conceição da Barra', 
      'Alegre', 'Guaçuí', 'Venda Nova do Imigrante', 'Iúna', 'Pinheiros', 'Jaguaré'
    ]
  },
  {
    sigla: 'MG',
    nome: 'Minas Gerais',
    regiao: 'Sudeste',
    capital: 'Belo Horizonte',
    municipios: [
      'Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim', 'Montes Claros', 
      'Ribeirão das Neves', 'Uberaba', 'Governador Valadares', 'Ipatinga', 'Sete Lagoas', 
      'Divinópolis', 'Santa Luzia', 'Ibirité', 'Poços de Caldas', 'Patos de Minas', 
      'Pouso Alegre', 'Teófilo Otoni', 'Barbacena', 'Sabará', 'Varginha', 'Vespasiano', 
      'Conselheiro Lafaiete', 'Itabira', 'Araguari', 'Passos', 'Ubá', 'Coronel Fabriciano', 
      'Muriaé', 'Ituiutaba', 'Lavras', 'Nova Serrana', 'Itajubá', 'Nova Lima', 
      'Paracatu', 'Pará de Minas', 'Itaúna', 'São João del-Rei', 'Patrocínio', 'Manhuaçu', 
      'Timóteo', 'Unaí', 'Curvelo', 'Alfenas', 'João Monlevade', 'Três Corações', 
      'Viçosa', 'Cataguases', 'Ouro Preto', 'Janaúba', 'Januária', 'São Sebastião do Paraíso', 
      'Formiga', 'Esmeraldas', 'Lagoa Santa', 'Diamantina', 'Tiradentes', 'Mariana', 
      'Guaxupé', 'Monte Carmelo', 'Araxá', 'Capelinha', 'Nanuque', 'Pirapora', 
      'Santos Dumont', 'Caratinga', 'São Lourenço', 'Caxambu', 'Almenara', 'Salinas'
    ]
  },
  {
    sigla: 'RJ',
    nome: 'Rio de Janeiro',
    regiao: 'Sudeste',
    capital: 'Rio de Janeiro',
    municipios: [
      'Rio de Janeiro', 'São Gonçalo', 'Duque de Caxias', 'Nova Iguaçu', 'Niterói', 
      'Belford Roxo', 'Campos dos Goytacazes', 'São João de Meriti', 'Petrópolis', 
      'Volta Redonda', 'Macaé', 'Magé', 'Itaboraí', 'Cabo Frio', 'Angra dos Reis', 
      'Nova Friburgo', 'Barra Mansa', 'Teresópolis', 'Mesquita', 'Nilópolis', 
      'Maricá', 'Queimados', 'Rio das Ostras', 'Resende', 'Araruama', 'Itaguaí', 
      'Japeri', 'São Pedro da Aldeia', 'Itaperuna', 'Barra do Piraí', 'Saquarema', 
      'Seropédica', 'Três Rios', 'Valença', 'Armação dos Búzios', 'Arraial do Cabo', 
      'Paraty', 'Guapimirim', 'Mangaratiba', 'Casimiro de Abreu', 'Santo Antônio de Pádua'
    ]
  },
  {
    sigla: 'SP',
    nome: 'São Paulo',
    regiao: 'Sudeste',
    capital: 'São Paulo',
    municipios: [
      'São Paulo', 'Guarulhos', 'Campinas', 'São Bernardo do Campo', 'Santo André', 
      'São José dos Campos', 'Osasco', 'Ribeirão Preto', 'Sorocaba', 'Mauá', 
      'São José do Rio Preto', 'Santos', 'Mogi das Cruzes', 'Diadema', 'Jundiaí', 
      'Piracicaba', 'Carapicuíba', 'Bauru', 'Itaquaquecetuba', 'São Vicente', 
      'Franca', 'Praia Grande', 'Guarujá', 'Taubaté', 'Limeira', 'Suzano', 
      'Taboão da Serra', 'Sumaré', 'Barueri', 'Embu das Artes', 'São Carlos', 
      'Indaiatuba', 'Cotia', 'Americana', 'Marília', 'Itapetininga', 'Araraquara', 
      'Jacareí', 'Hortolândia', 'Presidente Prudente', 'Rio Claro', 'Araçatuba', 
      'Santa Bárbara d\'Oeste', 'Ferraz de Vasconcelos', 'Francisco Morato', 'Itapecerica da Serra', 
      'Itu', 'Bragança Paulista', 'Pindamonhangaba', 'São Caetano do Sul', 'Itatiba', 
      'Jaú', 'Botucatu', 'Atibaia', 'Santana de Parnaíba', 'Araras', 'Valinhos', 
      'Sertãozinho', 'Catanduva', 'Barretos', 'Guaratinguetá', 'Jandira', 'Birigui', 
      'Votorantim', 'Várzea Paulista', 'Tatuí', 'Caraguatatuba', 'Itanhaém', 'Salto', 
      'Poá', 'Ourinhos', 'Paulínia', 'Assis', 'Lins', 'Votuporanga', 'Bebedouro', 
      'Avaré', 'Mogi Guaçu', 'Mogi Mirim', 'São João da Boa Vista', 'Ubatuba', 
      'São Sebastião', 'Ilhabela', 'Registro', 'Campos do Jordão', 'Bertioga', 
      'Fernandópolis', 'Jaboticabal', 'Pirassununga', 'Amparo', 'Jales', 'Lorena',
      'Matão', 'Taquaritinga', 'Lençóis Paulista', 'Vinhedo', 'Nova Odessa', 'Boituva'
    ]
  },

  // SUL
  {
    sigla: 'PR',
    nome: 'Paraná',
    regiao: 'Sul',
    capital: 'Curitiba',
    municipios: [
      'Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel', 'São José dos Pinhais', 
      'Foz do Iguaçu', 'Colombo', 'Guarapuava', 'Paranaguá', 'Araucária', 'Toledo', 
      'Apucarana', 'Pinhais', 'Campo Largo', 'Arapongas', 'Almirante Tamandaré', 
      'Umuarama', 'Piraquara', 'Cambé', 'Campo Mourão', 'Fazenda Rio Grande', 
      'Sarandi', 'Fazenda Rio Grande', 'Paranavaí', 'Francisco Beltrão', 'Pato Branco', 
      'Cianorte', 'Telêmaco Borba', 'Castro', 'Rolândia', 'Irati', 'União da Vitória', 
      'Ibiporã', 'Prudentópolis', 'Marechal Cândido Rondon', 'Cornélio Procópio', 
      'Palmas', 'Medianeira', 'Santo Antônio da Platina', 'Dois Vizinhos', 'Lapa', 
      'Matinhos', 'Guaratuba', 'Pontal do Paraná', 'Morretes', 'Antonina', 'Jandaia do Sul'
    ]
  },
  {
    sigla: 'RS',
    nome: 'Rio Grande do Sul',
    regiao: 'Sul',
    capital: 'Porto Alegre',
    municipios: [
      'Porto Alegre', 'Caxias do Sul', 'Canoas', 'Pelotas', 'Santa Maria', 'Gravataí', 
      'Viamão', 'Novo Hamburgo', 'São Leopoldo', 'Rio Grande', 'Alvorada', 'Passo Fundo', 
      'Sapucaia do Sul', 'Santa Cruz do Sul', 'Cachoeirinha', 'Uruguaiana', 'Bento Gonçalves', 
      'Bagé', 'Erechim', 'Guaíba', 'Lajeado', 'Ijuí', 'Esteio', 'Sapiranga', 
      'Santana do Livramento', 'Farroupilha', 'Alegrete', 'Camaquã', 'Santa Rosa', 
      'Venâncio Aires', 'Vacaria', 'Campo Bom', 'Montenegro', 'Cruz Alta', 'São Borja', 
      'São Gabriel', 'Carazinho', 'Taquara', 'Parobé', 'Santiago', 'Cangussu', 
      'Gramado', 'Canela', 'Nova Petrópolis', 'Torres', 'Capão da Canoa', 'Tramandaí', 
      'Santo Ângelo', 'Frederico Westphalen', 'Garibaldi', 'Carlos Barbosa', 'Flores da Cunha'
    ]
  },
  {
    sigla: 'SC',
    nome: 'Santa Catarina',
    regiao: 'Sul',
    capital: 'Florianópolis',
    municipios: [
      'Joinville', 'Florianópolis', 'Blumenau', 'São José', 'Itajaí', 'Chapecó', 
      'Palhoça', 'Criciúma', 'Jaraguá do Sul', 'Lages', 'Brusque', 'Balneário Camboriú', 
      'Tubarão', 'São Bento do Sul', 'Camboriú', 'Navegantes', 'Caçador', 'Concórdia', 
      'Rio do Sul', 'Gaspar', 'Biguaçu', 'Indaial', 'Itapema', 'Mafra', 'Canoinhas', 
      'Içara', 'Videira', 'São Francisco do Sul', 'Xanxerê', 'Guaramirim', 'Timbó', 
      'São Miguel do Oeste', 'Curitibanos', 'Tijucas', 'Porto Belo', 'Bombinhas', 
      'Imbituba', 'Laguna', 'Fraiburgo', 'Joaçaba', 'Campos Novos', 'Pomerode', 
      'Treze Tílias', 'Urubici', 'São Joaquim', 'Balneário Piçarras', 'Penha'
    ]
  }
];

export const REGIONS: BrazilianRegion[] = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'];
