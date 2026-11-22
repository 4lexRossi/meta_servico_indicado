'use client';

import { X } from 'lucide-react';

interface AnnouncementBarProps {
  onClose: () => void;
}

export function AnnouncementBar({ onClose }: AnnouncementBarProps) {
  return (
    <aside className="bg-gradient-to-r from-teal-800 via-teal-600 to-blue-600 text-white text-xs py-2 px-3 sm:px-4 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 text-center pr-7 sm:pr-8">
        <span className="hidden sm:inline-block bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] shrink-0">
          100% Gratuito
        </span>
        <p className="font-medium text-[11px] sm:text-xs leading-tight sm:leading-normal">
          Profissionais verificados com avaliações autênticas. Contato direto sem intermediários!
        </p>
      </div>
      <button
        onClick={onClose}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition"
        aria-label="Fechar aviso"
      >
        <X size={15} />
      </button>
    </aside>
  );
}
