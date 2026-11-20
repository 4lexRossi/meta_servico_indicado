'use client';

import { Search, MapPin, ChevronRight, X } from 'lucide-react';
import { REGIONS_LIST } from '@/data/categories';

interface HeroSectionProps {
  searchQuery: string;
  selectedRegion: string;
  onSearchChange: (value: string) => void;
  onRegionChange: (value: string) => void;
  onSearch: () => void;
}

const QUICK_SUGGESTIONS = [
  { label: '🔧 Troca de Torneira', term: 'encanamento' },
  { label: '⚡ Chuveiro 220V', term: 'chuveiro' },
  { label: '🪑 Montador de Guarda-Roupa', term: 'montador' },
  { label: '🎨 Pintura de Parede', term: 'pintura' },
  { label: '🔑 Fechadura Digital', term: 'fechadura' },
];

export function HeroSection({
  searchQuery,
  selectedRegion,
  onSearchChange,
  onRegionChange,
  onSearch,
}: HeroSectionProps) {
  return (
    <section className="relative pt-10 pb-12 bg-radial from-teal-100/50 via-slate-50 to-slate-50 border-b border-slate-200/60 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 text-center">

        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 bg-white border border-teal-200 shadow-xs px-3.5 py-1 rounded-full text-xs font-bold text-teal-800 mb-5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Mais de 450+ prestadores indicados e avaliados no Brasil</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
          O jeito seguro de contratar para a sua casa.
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          De pequenos reparos e reformas completas à montagem de móveis: conecte-se com profissionais recomendados diretamente no WhatsApp, sem taxas ou comissões abusivas.
        </p>

        {/* Search Box Card */}
        <div className="bg-white p-2 sm:p-2.5 rounded-2xl sm:rounded-full shadow-xl shadow-slate-200/60 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-2 max-w-3xl mx-auto transition focus-within:ring-3 focus-within:ring-teal-500/20 focus-within:border-teal-500">

          {/* Keyword Input */}
          <div className="flex-1 flex items-center w-full px-3.5 py-2">
            <Search size={20} className="text-slate-400 mr-2.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onSearch();
                }
              }}
              placeholder="Ex: encanador, pintura, montador, Carlos..."
              className="w-full bg-transparent text-slate-800 text-sm sm:text-base outline-none placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="hidden sm:block w-px h-8 bg-slate-200" />

          {/* Region Select */}
          <div className="flex items-center w-full sm:w-auto px-3.5 py-2">
            <MapPin size={20} className="text-slate-400 mr-2 shrink-0" />
            <select
              value={selectedRegion}
              onChange={(e) => onRegionChange(e.target.value)}
              className="bg-transparent text-slate-700 text-sm font-semibold outline-none cursor-pointer w-full"
            >
              {REGIONS_LIST.map((reg) => (
                <option key={reg} value={reg}>{reg}</option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={onSearch}
            className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-700/20 transition shrink-0 cursor-pointer"
          >
            <span>Buscar</span>
            <ChevronRight size={17} />
          </button>
        </div>

        {/* Quick Suggestions Chips */}
        <div className="flex items-center justify-center flex-wrap gap-2 mt-5 text-xs text-slate-500 font-medium">
          <span className="font-semibold text-slate-600">Mais buscados:</span>
          {QUICK_SUGGESTIONS.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onSearchChange(item.term);
                onSearch();
              }}
              className="bg-white border border-slate-200 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700 px-3 py-1 rounded-full text-slate-700 font-medium transition"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
