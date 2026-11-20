'use client';

import { ChevronRight, Wrench, Hammer, Layers } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PillarId } from '@/data/types';

interface PillarConfig {
  id: PillarId;
  title: string;
  description: string;
  badge: string;
  tags: string;
  specialtyCount: number;
  Icon: LucideIcon;
  colorSelected: string;
  colorHover: string;
  colorBg: string;
  colorGlow: string;
  colorIcon: string;
  colorText: string;
  colorBadge: string;
  colorRing: string;
  colorChevronHover: string;
}

const PILLAR_CONFIGS: PillarConfig[] = [
  {
    id: 'reparos',
    title: 'Reparos Rápidos',
    description: 'Serviços pontuais e manutenções urgentes: encanadores, eletricistas, chaveiros e marido de aluguel.',
    badge: 'Emergências',
    tags: 'Encanamento • Elétrica • Chaveiro • Ar-condicionado',
    specialtyCount: 5,
    Icon: Wrench,
    colorSelected: 'border-blue-600 bg-blue-50/40 shadow-xl shadow-blue-500/10',
    colorHover: 'border-slate-200 bg-white hover:border-blue-400 hover:shadow-lg',
    colorGlow: 'bg-blue-500/10',
    colorIcon: 'from-blue-500 to-blue-700 shadow-blue-500/30',
    colorText: 'text-blue-700 group-hover:text-blue-700',
    colorBadge: 'text-blue-700 bg-blue-100/70',
    colorBg: 'bg-blue-50',
    colorRing: 'text-blue-600',
    colorChevronHover: 'bg-blue-100 group-hover:bg-blue-600',
  },
  {
    id: 'reforma',
    title: 'Reforma & Construção',
    description: 'Profissionais qualificados para transformar o seu imóvel: pedreiros, pintores, gesseiros e mestres de obra.',
    badge: 'Obras & Acabamentos',
    tags: 'Pedreiro • Pintura • Drywall • Piscinas & Telhados',
    specialtyCount: 6,
    Icon: Hammer,
    colorSelected: 'border-amber-500 bg-amber-50/40 shadow-xl shadow-amber-500/10',
    colorHover: 'border-slate-200 bg-white hover:border-amber-400 hover:shadow-lg',
    colorGlow: 'bg-amber-500/10',
    colorIcon: 'from-amber-500 to-amber-700 shadow-amber-500/30',
    colorText: 'text-amber-800 group-hover:text-amber-700',
    colorBadge: 'text-amber-800 bg-amber-100/70',
    colorBg: 'bg-amber-50',
    colorRing: 'text-amber-700',
    colorChevronHover: 'bg-amber-100 group-hover:bg-amber-600',
  },
  {
    id: 'montagem',
    title: 'Montagem & Móveis',
    description: 'Montagem precisa de móveis comprados na internet, suportes para Smart TVs, cortinas e marcenaria.',
    badge: 'Móveis & Utilidades',
    tags: 'Montador • Suporte de TV • Marcenaria • Cortinas',
    specialtyCount: 4,
    Icon: Layers,
    colorSelected: 'border-emerald-600 bg-emerald-50/40 shadow-xl shadow-emerald-500/10',
    colorHover: 'border-slate-200 bg-white hover:border-emerald-400 hover:shadow-lg',
    colorGlow: 'bg-emerald-500/10',
    colorIcon: 'from-emerald-500 to-emerald-700 shadow-emerald-500/30',
    colorText: 'text-emerald-800 group-hover:text-emerald-700',
    colorBadge: 'text-emerald-800 bg-emerald-100/70',
    colorBg: 'bg-emerald-50',
    colorRing: 'text-emerald-700',
    colorChevronHover: 'bg-emerald-100 group-hover:bg-emerald-600',
  },
];

interface PillarCardProps {
  pillarId: PillarId;
  isSelected: boolean;
  onClick: (id: PillarId) => void;
}

export function PillarCard({ pillarId, isSelected, onClick }: PillarCardProps) {
  const config = PILLAR_CONFIGS.find((c) => c.id === pillarId)!;
  const { Icon } = config;

  return (
    <div
      onClick={() => onClick(pillarId)}
      className={`group cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
        isSelected ? config.colorSelected : config.colorHover
      }`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${config.colorGlow} rounded-full blur-2xl group-hover:scale-150 transition`} />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${config.colorIcon} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition`}>
            <Icon size={26} />
          </div>
          <span className={`text-[11px] font-bold uppercase tracking-wider ${config.colorBadge} px-2.5 py-1 rounded-full`}>
            {config.badge}
          </span>
        </div>
        <h3 className={`text-xl font-bold text-slate-900 mb-2 transition ${config.colorText}`}>
          {config.title}
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">{config.description}</p>
        <div className={`text-xs font-semibold ${config.colorRing} ${config.colorBg} py-1 px-2.5 rounded-lg inline-block mb-4`}>
          {config.tags}
        </div>
      </div>

      <div className={`flex items-center justify-between pt-4 border-t border-slate-100 text-sm font-bold ${config.colorRing}`}>
        <span>Ver {config.specialtyCount} especialidades</span>
        <div className={`w-8 h-8 rounded-full ${config.colorChevronHover} group-hover:text-white flex items-center justify-center transition`}>
          <ChevronRight size={18} />
        </div>
      </div>
    </div>
  );
}
