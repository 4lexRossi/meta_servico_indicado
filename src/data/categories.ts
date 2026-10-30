import { PillarCategory } from './types';

export const CATEGORIES_DATA: Record<string, PillarCategory> = {
  reparos: {
    id: "reparos",
    name: "Reparos Rápidos",
    tagline: "Serviços pontuais e manutenções urgentes: encanadores, eletricistas, chaveiros e marido de aluguel.",
    badge: "Emergências & Dia a Dia",
    colorTheme: "blue",
    subcategories: [
      { id: "encanamento", name: "Encanamento", emoji: "🔧", desc: "Vazamentos, torneiras, caça-vazamentos e desentupimento", pillarId: "reparos" },
      { id: "eletrica", name: "Elétrica", emoji: "⚡", desc: "Chuveiros, tomadas, disjuntores, fiação e iluminação", pillarId: "reparos" },
      { id: "chaveiro", name: "Chaveiro 24h", emoji: "🔑", desc: "Abertura de portas, fechaduras digitais e cópias", pillarId: "reparos" },
      { id: "marido_aluguel", name: "Marido de Aluguel", emoji: "🔨", desc: "Pequenos consertos gerais, furos e penduricalhos", pillarId: "reparos" },
      { id: "ar_condicionado", name: "Ar-condicionado", emoji: "❄️", desc: "Instalação, limpeza química e recarga de gás", pillarId: "reparos" }
    ]
  },
  reforma: {
    id: "reforma",
    name: "Reforma & Construção",
    tagline: "Profissionais capacitados para transformar e valorizar o seu imóvel: pedreiros, pintores e gesseiros.",
    badge: "Obras & Acabamentos",
    colorTheme: "amber",
    subcategories: [
      { id: "pedreiro", name: "Pedreiro & Alvenaria", emoji: "🧱", desc: "Construção de paredes, contrapiso, reboco e pisos", pillarId: "reforma" },
      { id: "pintura", name: "Pintura & Texturas", emoji: "🎨", desc: "Pintura interna/externa, massa corrida e efeitos", pillarId: "reforma" },
      { id: "gesso", name: "Gesso & Drywall", emoji: "📐", desc: "Forros decorados, sancas iluminadas e divisórias", pillarId: "reforma" },
      { id: "piscina", name: "Piscinas & Manutenção", emoji: "🏊", desc: "Tratamento de água, bombas, filtros e azulejos", pillarId: "reforma" },
      { id: "telhado", name: "Telhados & Calhas", emoji: "🏠", desc: "Goteiras, limpeza de calhas e troca de telhas", pillarId: "reforma" },
      { id: "serralheria", name: "Serralheria", emoji: "⚙️", desc: "Portões automáticos, grades, corrimãos e soldas", pillarId: "reforma" }
    ]
  },
  montagem: {
    id: "montagem",
    name: "Montagem & Móveis",
    tagline: "Montagem de móveis comprados na internet ou lojas, suportes de TV, cortinas e prateleiras.",
    badge: "Móveis & Utilidades",
    colorTheme: "emerald",
    subcategories: [
      { id: "montagem", name: "Montador de Móveis", emoji: "🪑", desc: "Montagem de guarda-roupas, camas, mesas e armários", pillarId: "montagem" },
      { id: "suporte_tv", name: "Painel & Suporte de TV", emoji: "📺", desc: "Fixação segura com nível a laser e organização de cabos", pillarId: "montagem" },
      { id: "marcenaria", name: "Marcenaria", emoji: "🪵", desc: "Ajuste de portas, troca de corrediças e móveis sob medida", pillarId: "montagem" },
      { id: "cortinas", name: "Cortinas & Persianas", emoji: "🖼️", desc: "Instalação de varões, persianas rolo, trilhos e quadros", pillarId: "montagem" }
    ]
  }
};

export const REGIONS_LIST = [
  "Todas as Regiões",
  "Zona Sul",
  "Zona Oeste",
  "Zona Norte",
  "Zona Leste",
  "Centro",
  "ABC Paulista",
  "Alphaville & Região"
];
