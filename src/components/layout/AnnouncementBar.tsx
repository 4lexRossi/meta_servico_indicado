'use client';

import { X } from 'lucide-react';

interface AnnouncementBarProps {
  onClose: () => void;
}

export function AnnouncementBar({ onClose }: AnnouncementBarProps) {
  return (
    <aside className="bg-gradient-to-r from-teal-800 via-teal-600 to-blue-600 text-white text-xs md:text-sm py-2 px-4 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-center">
        <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[11px]">
          100% Gratuito
        </span>
        <p className="font-medium">
          Todos os profissionais passam por verificação de antecedentes e avaliações autênticas. Contato direto sem intermediários!
        </p>
        <button
          onClick={onClose}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition"
          aria-label="Fechar aviso"
        >
          <X size={16} />
        </button>
      </div>
    </aside>
  );
}
