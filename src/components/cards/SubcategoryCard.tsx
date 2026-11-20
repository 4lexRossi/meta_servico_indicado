'use client';

import { Subcategory } from '@/data/types';

interface SubcategoryCardProps {
  subcategory: Subcategory;
  proCount: number;
  isSelected: boolean;
  onClick: (id: string) => void;
}

export function SubcategoryCard({ subcategory: sub, proCount, isSelected, onClick }: SubcategoryCardProps) {
  return (
    <div
      onClick={() => onClick(sub.id)}
      className={`cursor-pointer rounded-2xl p-4 border transition-all ${
        isSelected
          ? 'bg-teal-50 border-teal-600 shadow-md ring-2 ring-teal-600'
          : 'bg-white border-slate-200 hover:border-teal-400 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{sub.emoji}</span>
        <span className="text-[11px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
          {proCount} indicado{proCount !== 1 ? 's' : ''}
        </span>
      </div>
      <h4 className="font-bold text-slate-900 text-sm mb-1">{sub.name}</h4>
      <p className="text-xs text-slate-500 leading-snug">{sub.desc}</p>
    </div>
  );
}
