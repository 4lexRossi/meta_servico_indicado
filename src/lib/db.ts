import { Professional } from '@/data/types';
import { INITIAL_PROFESSIONALS } from '@/data/professionals';

// In-memory store (easily replaced by Prisma, Supabase, or Drizzle)
let professionalsDb: Professional[] = [...INITIAL_PROFESSIONALS];

export async function getProfessionals(filters?: {
  pillar?: string;
  subcategory?: string;
  region?: string;
  search?: string;
}): Promise<Professional[]> {
  let result = [...professionalsDb];

  if (!filters) return result;

  if (filters.pillar) {
    result = result.filter(p => p.category === filters.pillar);
  }

  if (filters.subcategory) {
    result = result.filter(p => p.subcategory === filters.subcategory);
  }

  if (filters.region && filters.region !== 'Todas as Regiões') {
    result = result.filter(p => p.regions.includes(filters.region!));
  }

  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    result = result.filter(p => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchHeadline = p.headline.toLowerCase().includes(q);
      const matchBio = p.bio.toLowerCase().includes(q);
      const matchTags = p.tags.some(t => t.toLowerCase().includes(q));
      const matchSub = p.subcategory.toLowerCase().includes(q);
      return matchName || matchHeadline || matchBio || matchTags || matchSub;
    });
  }

  return result;
}

export async function getProfessionalById(id: string): Promise<Professional | null> {
  const pro = professionalsDb.find(p => p.id === id);
  return pro || null;
}

export async function createProfessional(data: Partial<Professional>): Promise<Professional> {
  const newPro: Professional = {
    id: `pro-${Date.now()}`,
    name: data.name || 'Novo Prestador',
    headline: data.headline || 'Profissional Qualificado',
    category: data.category || 'reparos',
    subcategory: data.subcategory || 'encanamento',
    rating: 5.0,
    reviewsCount: 1,
    regions: data.regions && data.regions.length > 0 ? data.regions : ['Zona Sul'],
    avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    phone: data.phone?.replace(/\D/g, '') || '11999998888',
    priceEstimate: data.priceEstimate || 'Orçamento sem compromisso',
    experienceYears: data.experienceYears || 5,
    tags: data.tags && data.tags.length > 0 ? data.tags : ['Profissional Verificado'],
    bio: data.bio || 'Prestador de serviços cadastrado na rede do Serviço Indicado.',
    verified: true,
    badges: ['Cadastro Verificado', 'Novo Indicado'],
    portfolio: data.portfolio || [],
    reviews: [
      { name: 'Equipe Serviço Indicado', stars: 5, text: 'Profissional recém-cadastrado na rede de indicações verificadas.' }
    ]
  };

  professionalsDb.unshift(newPro);
  return newPro;
}
