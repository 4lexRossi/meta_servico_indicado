'use client';

import { ChevronLeft } from 'lucide-react';
import { CATEGORIES_DATA } from '@/data/categories';
import { PillarId, Professional } from '@/data/types';
import { PillarCard } from '@/components/cards/PillarCard';
import { SubcategoryCard } from '@/components/cards/SubcategoryCard';

interface CategoriesSectionProps {
  selectedPillar: PillarId | null;
  selectedSubcategory: string | null;
  professionals: Professional[];
  onPillarSelect: (id: PillarId | null) => void;
  onSubcategorySelect: (id: string | null) => void;
}

export function CategoriesSection({
  selectedPillar,
  selectedSubcategory,
  professionals,
  onPillarSelect,
  onSubcategorySelect,
}: CategoriesSectionProps) {
  const pillars: PillarId[] = ['reparos', 'reforma', 'montagem'];

  const handlePillarClick = (id: PillarId) => {
    onPillarSelect(selectedPillar === id ? null : id);
    onSubcategorySelect(null);
  };

  return (
    <section id="categories-section" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header & Breadcrumb */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-2">
              <button
                onClick={() => { onPillarSelect(null); onSubcategorySelect(null); }}
                className={`hover:text-teal-600 ${!selectedPillar ? 'text-teal-700 font-bold' : 'underline'}`}
              >
                Todas as Categorias
              </button>
              {selectedPillar && (
                <>
                  <span>/</span>
                  <button
                    onClick={() => onSubcategorySelect(null)}
                    className={`hover:text-teal-600 ${!selectedSubcategory ? 'text-teal-700 font-bold' : 'underline'}`}
                  >
                    {CATEGORIES_DATA[selectedPillar].name}
                  </button>
                </>
              )}
              {selectedSubcategory && (
                <>
                  <span>/</span>
                  <span className="text-teal-700 font-bold">
                    {CATEGORIES_DATA[selectedPillar!]?.subcategories.find((s) => s.id === selectedSubcategory)?.name}
                  </span>
                </>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Qual serviço você precisa hoje?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Selecione um dos 3 pilares principais para abrir as especialidades atendidas.
            </p>
          </div>

          {(selectedPillar || selectedSubcategory) && (
            <button
              onClick={() => { onPillarSelect(null); onSubcategorySelect(null); }}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3.5 py-1.5 rounded-full transition self-start md:self-auto"
            >
              <ChevronLeft size={16} />
              <span>Voltar para Todos os Pilares</span>
            </button>
          )}
        </div>

        {/* Level 1: Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillarId) => (
            <PillarCard
              key={pillarId}
              pillarId={pillarId}
              isSelected={selectedPillar === pillarId}
              onClick={handlePillarClick}
            />
          ))}
        </div>

        {/* Level 2: Subcategory Drill-Down */}
        {selectedPillar && (
          <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-slate-50 border-2 border-teal-300 shadow-md animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Especialidades em {CATEGORIES_DATA[selectedPillar].name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Clique em um card abaixo para filtrar prestadores com foco nesta especialidade:
                </p>
              </div>
              {selectedSubcategory && (
                <button
                  onClick={() => onSubcategorySelect(null)}
                  className="text-xs font-bold text-teal-700 hover:underline self-start sm:self-auto"
                >
                  Limpar filtro de especialidade
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {CATEGORIES_DATA[selectedPillar].subcategories.map((sub) => {
                const proCount = professionals.filter((p) => p.subcategory === sub.id).length;
                return (
                  <SubcategoryCard
                    key={sub.id}
                    subcategory={sub}
                    proCount={proCount}
                    isSelected={selectedSubcategory === sub.id}
                    onClick={(id) => onSubcategorySelect(selectedSubcategory === id ? null : id)}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
