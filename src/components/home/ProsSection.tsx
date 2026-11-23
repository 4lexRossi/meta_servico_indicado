'use client';

import { Heart, Search, X, RotateCcw } from 'lucide-react';
import { CATEGORIES_DATA } from '@/data/categories';
import { PillarId, Professional } from '@/data/types';
import { ProfessionalCard } from '@/components/cards/ProfessionalCard';

interface ProsSectionProps {
  filteredProfessionals: Professional[];
  favorites: Set<string>;
  viewMode: 'all' | 'favorites';
  selectedPillar: PillarId | null;
  selectedSubcategory: string | null;
  selectedRegion: string;
  searchQuery: string;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onViewProfile: (pro: Professional) => void;
  onViewModeChange: (mode: 'all' | 'favorites') => void;
  onClearPillar: () => void;
  onClearSubcategory: () => void;
  onClearRegion: () => void;
  onClearSearch: () => void;
  onClearAll: () => void;
}

export function ProsSection({
  filteredProfessionals,
  favorites,
  viewMode,
  selectedPillar,
  selectedSubcategory,
  selectedRegion,
  searchQuery,
  onToggleFavorite,
  onViewProfile,
  onViewModeChange,
  onClearPillar,
  onClearSubcategory,
  onClearRegion,
  onClearSearch,
  onClearAll,
}: ProsSectionProps) {
  const hasActiveFilters = Boolean(
    selectedPillar ||
    selectedSubcategory ||
    (selectedRegion && selectedRegion !== 'Todas as Regiões') ||
    (searchQuery && searchQuery.trim() !== '') ||
    viewMode === 'favorites'
  );

  return (
    <section id="pros-section" className="py-10 bg-slate-50 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100/80 px-2.5 py-0.5 rounded-full">
                Área de Indicados
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Profissionais Indicados
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-base sm:text-lg font-bold text-teal-700">
                {filteredProfessionals.length}
              </span>
              <span className="text-slate-600 text-sm font-medium">
                profissional{filteredProfessionals.length !== 1 ? 'is' : ''} disponíve{filteredProfessionals.length !== 1 ? 'is' : 'l'}
              </span>
            </div>

            {/* Active Filter Chips */}
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedPillar && (
                <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-900 text-xs font-bold px-2.5 py-1 rounded-full">
                  Pilar: {CATEGORIES_DATA[selectedPillar].name}
                  <button onClick={onClearPillar}><X size={14} /></button>
                </span>
              )}
              {selectedSubcategory && (
                <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-900 text-xs font-bold px-2.5 py-1 rounded-full">
                  Especialidade: {CATEGORIES_DATA[selectedPillar!]?.subcategories.find((s) => s.id === selectedSubcategory)?.name}
                  <button onClick={onClearSubcategory}><X size={14} /></button>
                </span>
              )}
              {selectedRegion !== 'Todas as Regiões' && (
                <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-900 text-xs font-bold px-2.5 py-1 rounded-full">
                  Região: {selectedRegion}
                  <button onClick={onClearRegion}><X size={14} /></button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-900 text-xs font-bold px-2.5 py-1 rounded-full">
                  Busca: &ldquo;{searchQuery}&rdquo;
                  <button onClick={onClearSearch}><X size={14} /></button>
                </span>
              )}
              {viewMode === 'favorites' && (
                <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-900 text-xs font-bold px-2.5 py-1 rounded-full">
                  Mostrando apenas Salvos
                  <button onClick={() => onViewModeChange('all')}><X size={14} /></button>
                </span>
              )}
            </div>
          </div>

          {/* View Mode Toggle & Clear All Filters */}
          <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
            <div className="flex items-center bg-slate-200/80 p-1 rounded-full self-start sm:self-auto">
              <button
                onClick={() => onViewModeChange('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                  viewMode === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => onViewModeChange('favorites')}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition ${
                  viewMode === 'favorites'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Heart size={13} className={favorites.size > 0 ? 'text-rose-500 fill-rose-500' : ''} />
                <span>Meus Salvos ({favorites.size})</span>
              </button>
            </div>

            {/* Clear All Filters Button */}
            <button
              type="button"
              onClick={onClearAll}
              disabled={!hasActiveFilters}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full transition ${
                hasActiveFilters
                  ? 'text-teal-700 hover:text-teal-900 hover:bg-teal-50 border border-teal-200 cursor-pointer shadow-2xs'
                  : 'text-slate-400 border border-slate-200 opacity-40 cursor-not-allowed pointer-events-none'
              }`}
              title={hasActiveFilters ? 'Limpar todos os filtros ativos' : 'Nenhum filtro ativo no momento'}
            >
              <RotateCcw size={12} />
              <span>Limpar todos os filtros</span>
            </button>
          </div>
        </div>

        {/* Professional Cards Grid */}
        {filteredProfessionals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfessionals.map((pro) => (
              <ProfessionalCard
                key={pro.id}
                professional={pro}
                isFavorite={favorites.has(pro.id)}
                onToggleFavorite={onToggleFavorite}
                onViewProfile={onViewProfile}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Search size={28} />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">
              {hasActiveFilters ? 'Nenhum profissional encontrado' : 'Nenhum profissional cadastrado ainda'}
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              {hasActiveFilters
                ? 'Tente remover alguns filtros ou buscar por outro termo ou região.'
                : 'Seja o primeiro profissional a fazer parte da nossa rede de indicações verificadas!'}
            </p>
            <button
              onClick={onClearAll}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition"
            >
              Limpar Todos os Filtros
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
