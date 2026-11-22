'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Layers, Heart, UserPlus, Briefcase } from 'lucide-react';

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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-2">

        {/* Logo */}
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2 sm:gap-3 text-left group transition shrink-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-transparent shrink-0">
            <Image
              src="/icon.png"
              alt="Serviço Indicado"
              width={40}
              height={40}
              className="w-full h-full object-contain"
              unoptimized
            />
          </div>
          <div>
            <div className="text-base sm:text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Serviço<span className="text-teal-600">Indicado</span>
            </div>
            <div className="hidden sm:block text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
              Profissionais de Confiança
            </div>
          </div>
        </button>

        {/* Quick Nav */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          <button
            onClick={onCategoriesClick}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-slate-700 hover:text-teal-700 hover:bg-slate-100 font-semibold text-xs sm:text-sm transition"
          >
            <Layers size={17} className="text-slate-500" />
            <span>Categorias</span>
          </button>

          <button
            onClick={onFavoritesClick}
            className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm transition ${
              viewMode === 'favorites'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'text-slate-700 hover:text-teal-700 hover:bg-slate-100'
            }`}
            title="Ver profissionais salvos"
          >
            <Heart
              size={16}
              className={favoritesCount > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-500'}
            />
            <span className="hidden md:inline">Salvos</span>
            <span className="bg-rose-500 text-white text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              {favoritesCount}
            </span>
          </button>

          <Link
            href="/painel"
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full text-slate-700 hover:text-teal-700 hover:bg-slate-100 font-semibold text-xs sm:text-sm transition"
            title="Acessar Área do Profissional"
          >
            <Briefcase size={16} className="text-teal-600" />
            <span className="hidden sm:inline">Painel</span>
          </Link>

          <button
            onClick={onRegisterClick}
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-teal-600 text-teal-700 hover:bg-teal-600 hover:text-white font-bold text-xs sm:text-sm bg-teal-50/70 shadow-xs transition shrink-0"
          >
            <UserPlus size={15} />
            <span>Cadastrar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
