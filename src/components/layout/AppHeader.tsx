'use client';

import { ShieldCheck, Layers, Heart, UserPlus } from 'lucide-react';

interface AppHeaderProps {
  favoritesCount: number;
  viewMode: 'all' | 'favorites';
  onLogoClick: () => void;
  onCategoriesClick: () => void;
  onFavoritesClick: () => void;
  onRegisterClick: () => void;
}

export function AppHeader({
  favoritesCount,
  viewMode,
  onLogoClick,
  onCategoriesClick,
  onFavoritesClick,
  onRegisterClick,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={onLogoClick}
          className="flex items-center gap-3 text-left group transition"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-teal-800 text-white flex items-center justify-center shadow-md shadow-teal-700/20 group-hover:scale-105 transition">
            <ShieldCheck size={22} className="stroke-[2.3]" />
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Serviço<span className="text-teal-600">Indicado</span>
            </div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
              Profissionais de Confiança
            </div>
          </div>
        </button>

        {/* Quick Nav */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onCategoriesClick}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-slate-700 hover:text-teal-700 hover:bg-slate-100 font-semibold text-sm transition"
          >
            <Layers size={17} className="text-slate-500" />
            <span>Categorias</span>
          </button>

          <button
            onClick={onFavoritesClick}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full font-semibold text-sm transition ${
              viewMode === 'favorites'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'text-slate-700 hover:text-teal-700 hover:bg-slate-100'
            }`}
          >
            <Heart
              size={17}
              className={favoritesCount > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-500'}
            />
            <span className="hidden xs:inline">Salvos</span>
            <span className="bg-rose-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              {favoritesCount}
            </span>
          </button>

          <button
            onClick={onRegisterClick}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-1.5 border-teal-600 text-teal-700 hover:bg-teal-600 hover:text-white font-bold text-xs sm:text-sm bg-teal-50/60 shadow-xs transition"
          >
            <UserPlus size={16} />
            <span>Sou Profissional</span>
          </button>
        </div>
      </div>
    </header>
  );
}
