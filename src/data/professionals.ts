import { Professional } from './types';

export const INITIAL_PROFESSIONALS: Professional[] = [
  {
    id: "pro-1",
    name: "Carlos Eduardo Silveira",
    headline: "Encanador Especialista em Caça-Vazamentos",
    category: "reparos",
    subcategory: "encanamento",
    rating: 4.9,
    reviewsCount: 148,
    regions: ["Zona Sul", "Centro", "Zona Oeste"],
    avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80",
    phone: "11984210932",
    priceEstimate: "A partir de R$ 90,00",
    experienceYears: 14,
    tags: ["Caça Vazamentos", "Desentupidora", "Troca de Coluna", "Emergência 24h"],
    bio: "Encanador profissional há mais de 14 anos atendendo São Paulo e região. Especialista em detecção de vazamentos com geofone eletrônico sem quebrar a parede sem necessidade. Atendimento pontual com laudo e garantia por escrito.",
    verified: true,
    badges: ["Identidade Verificada", "Garantia 90 Dias", "Top Indicado"],
    portfolio: [
      { title: "Troca de encanamento de cobre", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80" },
      { title: "Instalação de torneira monocomando", url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80" },
      { title: "Conserto de caixa d'água", url: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80" }
    ],
    reviews: [
      { name: "Mariana Alencar (Moema)", stars: 5, text: "O Carlos achou um vazamento que outros dois encanadores não acharam e que estava estragando o piso. Trabalho limpo e muito educado!" },
      { name: "Roberto Mendes (Pinheiros)", stars: 5, text: "Pontualidade britânica. Fez a troca da caixa acoplada e regulou a pressão do chuveiro. Recomendo de olhos fechados." }
    ]
  },
  {
    id: "pro-2",
    name: "Marcos Vinicius Rezende",
    headline: "Eletricista Predial & Residencial Certificado",
    category: "reparos",
    subcategory: "eletrica",
    rating: 5.0,
    reviewsCount: 212,
    regions: ["Zona Oeste", "ABC Paulista", "Zona Sul"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    phone: "11973129845",
    priceEstimate: "A partir de R$ 120,00",
    experienceYears: 10,
    tags: ["Certificado NR-10", "Quadro de Luz", "Fiação Completa", "Chuveiros 220V"],
    bio: "Eletricista credenciado pelo SENAI e com certificação NR-10 ativa. Realizo desde a simples troca de chuveiro ou tomada até dimensionamento de circuitos, troca de disjuntores e instalação de painéis residenciais.",
    verified: true,
    badges: ["NR-10 Válida", "Garantia Total", "Nota Máxima"],
    portfolio: [
      { title: "Quadro de disjuntores novo", url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80" },
      { title: "Iluminação de trilho em LED", url: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80" },
      { title: "Troca de fiação antiga", url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80" }
    ],
    reviews: [
      { name: "Fábio Dantas (Perdizes)", stars: 5, text: "Fez a substituição do quadro de energia do meu apartamento antigo. Segurança total e deixou tudo identificado com etiquetas." },
      { name: "Camila Ribeiro (Vila Madalena)", stars: 5, text: "Excelente profissional! Instalou os pendentes e tirou todas as dúvidas sobre economia de energia." }
    ]
  },
  {
    id: "pro-3",
    name: "Luciana Ferreira",
    headline: "Pintora Profissional & Efeitos Decorativos",
    category: "reforma",
    subcategory: "pintura",
    rating: 4.9,
    reviewsCount: 118,
    regions: ["Zona Sul", "Zona Oeste", "Centro"],
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    phone: "11985443219",
    priceEstimate: "Orçamento sem compromisso",
    experienceYears: 8,
    tags: ["Cimento Queimado", "Massa Corrida", "Pintura Airless", "Isolamento Perfeito"],
    bio: "Fundadora da iniciativa Mulheres na Obra. Trabalho com pintura residencial fina, aplicação de cimento queimado, textura geométrica e recuperação de paredes com umidade. Cuidado extremo com a proteção dos seus móveis e pisos.",
    verified: true,
    badges: ["Destaque Regional", "Trabalho Limpo", "Mulheres na Obra"],
    portfolio: [
      { title: "Parede em cimento queimado fosco", url: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80" },
      { title: "Pintura interna de apartamento", url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80" },
      { title: "Massa corrida e acabamento acetinado", url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80" }
    ],
    reviews: [
      { name: "Carla Silveira (Itaim Bibi)", stars: 5, text: "A Lu é impecável! Forrou cada rodapé e tomada com fita. O apartamento terminou limpo e com cheiro de casa nova." },
      { name: "Guilherme S. (Jardins)", stars: 5, text: "Fizemos a pintura do escritório todo com ela. Prazo cumprido antes do combinado e parede perfeita." }
    ]
  },
  {
    id: "pro-4",
    name: "Rodrigo Santos (Móveis Já)",
    headline: "Montador de Móveis & Fixações em Geral",
    category: "montagem",
    subcategory: "montagem",
    rating: 4.8,
    reviewsCount: 310,
    regions: ["Zona Sul", "Zona Leste", "Zona Norte", "Centro"],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    phone: "11991204899",
    priceEstimate: "A partir de R$ 80,00",
    experienceYears: 11,
    tags: ["Móveis Tok&Stok / MadeiraMadeira", "Guarda-Roupa Casal", "Desmontagem", "Ferramental Próprio"],
    bio: "Montador de móveis experiente para produtos comprados em lojas físicas e na internet. Possuo parafusadeiras de alto torque, nível a laser e peças extras de reposição caso venha faltando na caixa.",
    verified: true,
    badges: ["Atendimento Ágil", "Ferramental Completo", "Mais de 1000 montagens"],
    portfolio: [
      { title: "Guarda-roupa 6 portas montado", url: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80" },
      { title: "Cozinha modular instalada", url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80" },
      { title: "Mesa de jantar e cadeiras", url: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=600&q=80" }
    ],
    reviews: [
      { name: "Patrícia Gomes (Tatuapé)", stars: 5, text: "Montou um guarda-roupa enorme de 6 portas em menos de 3 horas com portas alinhadinhas. Muito rápido e educado." },
      { name: "Lucas Lima (Santana)", stars: 5, text: "Preço super justo e veio no dia seguinte ao que chamei no WhatsApp. Salvou meu fim de semana." }
    ]
  },
  {
    id: "pro-5",
    name: "José Silva (Mestre Zé)",
    headline: "Pedreiro Especialista em Reformas & Alvenaria",
    category: "reforma",
    subcategory: "pedreiro",
    rating: 4.9,
    reviewsCount: 195,
    regions: ["Zona Leste", "Zona Norte", "ABC Paulista"],
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    phone: "11978201192",
    priceEstimate: "Visita técnica gratuita",
    experienceYears: 22,
    tags: ["Contrapiso", "Porcelanato", "Demolição", "Mestre de Obras"],
    bio: "Mais de duas décadas de experiência em construção civil e reformas residenciais. Gerencio equipe de pedreiros e serventes para reformas completas de cozinhas, banheiros e ampliações. Comprometimento com prazos e sem desperdício de material.",
    verified: true,
    badges: ["22 Anos de Carreira", "Contrato & Recibo", "Mestre de Obra"],
    portfolio: [
      { title: "Assentamento de porcelanato 90x90", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80" },
      { title: "Reforma completa de banheiro", url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=600&q=80" },
      { title: "Construção de parede com nicho", url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80" }
    ],
    reviews: [
      { name: "Valdir Ramos (São Caetano)", stars: 5, text: "O Seu Zé reformou meu banheiro do zero. O corte do porcelanato ficou perfeito, sem dentes. Indicação de ouro!" },
      { name: "Renata M. (Mooca)", stars: 5, text: "Profissional sério e confiável. Cumpriu o cronograma certinho e sempre limpava o entulho no final do dia." }
    ]
  },
  {
    id: "pro-6",
    name: "Alexandre Pontes (Chaveiro 24h)",
    headline: "Chaveiro Rápido & Instalação de Fechadura Digital",
    category: "reparos",
    subcategory: "chaveiro",
    rating: 4.9,
    reviewsCount: 172,
    regions: ["Zona Sul", "Centro", "Zona Oeste"],
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    phone: "11993441209",
    priceEstimate: "A partir de R$ 90,00",
    experienceYears: 12,
    tags: ["Abertura sem Danos", "Fechadura Intelbras / Yale", "Chave Codificada", "24 Horas"],
    bio: "Atendimento emergencial em até 30 minutos em caso de chave trancada ou perda. Especialista em furação e instalação de fechaduras biométricas e inteligentes para portas de madeira e pivotantes.",
    verified: true,
    badges: ["Atendimento 24h", "Chegada Rápida", "Especialista Digital"],
    portfolio: [
      { title: "Instalação de fechadura eletrônica", url: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80" },
      { title: "Abertura de porta tetra de segurança", url: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80" }
    ],
    reviews: [
      { name: "Daniela Costa (Vila Mariana)", stars: 5, text: "Fiquei trancada para fora às 23h de domingo. Ele chegou em 20 minutos e abriu sem estragar a fechadura. Nota 10!" }
    ]
  },
  {
    id: "pro-7",
    name: "Claudio Marido de Aluguel",
    headline: "Pequenos Reparos, Instalação de Quadros e Metais",
    category: "reparos",
    subcategory: "marido_aluguel",
    rating: 4.8,
    reviewsCount: 160,
    regions: ["Zona Sul", "Zona Oeste", "Centro"],
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    phone: "11981290312",
    priceEstimate: "A partir de R$ 75,00",
    experienceYears: 9,
    tags: ["Instalação de Cortinas", "Furos em Porcelanato", "Ajuste de Dobradiça", "Troca de Sifão"],
    bio: "O profissional certo para aquela lista de pendências que acumulam em casa. Troco lâmpadas, instalo acessórios de banheiro, conserto gavetas emperradas e instalo quadros e espelhos pesados com buchas especiais.",
    verified: true,
    badges: ["Multitarefas", "Cuidado aos Detalhes", "Orçamento Ágil"],
    portfolio: [
      { title: "Instalação de espelho com LED", url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80" },
      { title: "Acessórios de banheiro furados em porcelanato", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80" }
    ],
    reviews: [
      { name: "Juliana Neves (Brooklin)", stars: 5, text: "O Claudio fez 7 pequenos consertos em uma única tarde. Muito caprichoso e resolveu tudo com agilidade." }
    ]
  },
  {
    id: "pro-8",
    name: "Marcelo Drywall & Gesso",
    headline: "Gesseiro Especialista em Forros & Paredes Acústicas",
    category: "reforma",
    subcategory: "gesso",
    rating: 4.9,
    reviewsCount: 114,
    regions: ["Zona Leste", "ABC Paulista", "Centro"],
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
    phone: "11984445522",
    priceEstimate: "Orçamento por m²",
    experienceYears: 13,
    tags: ["Sancas com Cortineiro", "Isolamento Acústico", "Placa Cimentícia", "Drywall Resistente à Água"],
    bio: "Projetos em gesso acartonado (drywall) com precisão milimétrica. Executo forros rebaixados com rasgos de luz, cortineiros embutidos e paredes acústicas com lã de vidro para home office e dormitórios.",
    verified: true,
    badges: ["Acabamento Premium", "Sem Trincas", "Garantia Estrutural"],
    portfolio: [
      { title: "Forro rebaixado com rasgo de luz", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80" },
      { title: "Divisória acústica em drywall", url: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=600&q=80" }
    ],
    reviews: [
      { name: "Leonardo Bragança (Santo André)", stars: 5, text: "O teto da minha sala virou outro! As sancas e o cortineiro ficaram retinhos e prontos para pintar." }
    ]
  },
  {
    id: "pro-9",
    name: "Beatriz Aquasul Piscinas",
    headline: "Tratamento de Água & Manutenção de Bombas e Filtros",
    category: "reforma",
    subcategory: "piscina",
    rating: 5.0,
    reviewsCount: 89,
    regions: ["Alphaville & Região", "Zona Oeste", "Zona Sul"],
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    phone: "11977778899",
    priceEstimate: "Planos mensais a partir de R$ 250",
    experienceYears: 7,
    tags: ["Tratamento Químico", "Troca de Areia do Filtro", "Piscinas de Alvenaria e Vinil", "Aspiração"],
    bio: "Cuidado completo para a piscina da sua residência ou condomínio. Medição digital de cloro e pH, decantação, aspiração e manutenção mecânica de motobombas e aquecedores solares.",
    verified: true,
    badges: ["Água Cristalina", "Pontualidade Semanal", "Produtos Inclusos"],
    portfolio: [
      { title: "Piscina com água cristalina recuperada", url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80" }
    ],
    reviews: [
      { name: "Claudia Esteves (Alphaville)", stars: 5, text: "A piscina estava verde após semanas de chuva e a Bia recuperou a água em dois dias sem precisar esvaziar. Excelente!" }
    ]
  },
  {
    id: "pro-10",
    name: "Fernando Marcenaria Fina",
    headline: "Marceneiro para Reparos & Móveis Sob Medida",
    category: "montagem",
    subcategory: "marcenaria",
    rating: 4.8,
    reviewsCount: 78,
    regions: ["Zona Norte", "Centro", "Zona Oeste"],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    phone: "11983332211",
    priceEstimate: "Orçamento sob medida",
    experienceYears: 16,
    tags: ["MDF Ultra", "Dobradiças com Amortecedor", "Laqueamento", "Restauração"],
    bio: "Marceneiro artesanal com marcenaria completa. Faço desde pequenas adaptações em armários embutidos existentes até confecção de gabinetes de banheiro e painéis ripados sob medida com fita de borda colada à quente.",
    verified: true,
    badges: ["MDF de Primeira Linha", "Ferragens com Garantia", "Marcenaria Própria"],
    portfolio: [
      { title: "Painel ripado em freijó com nicho", url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80" }
    ],
    reviews: [
      { name: "Tiago Sampaio (Santana)", stars: 5, text: "Reformou o armário da minha cozinha trocando todas as corrediças telescópicas. Ficou deslizando suave como novo." }
    ]
  }
];
