'use client';

import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { PillarId } from '@/data/types';

interface AppFooterProps {
  onPillarSubcategorySelect: (pillar: PillarId, subcategory: string) => void;
  onRegisterClick: () => void;
}

export function AppFooter({ onPillarSubcategorySelect, onRegisterClick }: AppFooterProps) {
  return (
    <footer className="bg-white border-t border-slate-200 py-12 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <span className="font-extrabold text-lg text-slate-900">
              Serviço<span className="text-teal-600">Indicado</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            Conectando famílias e residências aos profissionais mais qualificados e confiáveis da sua região.
          </p>
          <div className="flex gap-2">
            <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">🔒 Seguro</span>
            <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">⭐ Avaliado</span>
          </div>
        </div>

        {/* Reparos Rápidos */}
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm mb-3">Reparos Rápidos</h4>
          <ul className="text-xs space-y-2 text-slate-500">
            <li>
              <button onClick={() => onPillarSubcategorySelect('reparos', 'encanamento')} className="hover:text-teal-600">
                Encanadores
              </button>
            </li>
            <li>
              <button onClick={() => onPillarSubcategorySelect('reparos', 'eletrica')} className="hover:text-teal-600">
                Eletricistas Residenciais
              </button>
            </li>
            <li>
              <button onClick={() => onPillarSubcategorySelect('reparos', 'chaveiro')} className="hover:text-teal-600">
                Chaveiro 24h
              </button>
            </li>
            <li>
              <button onClick={() => onPillarSubcategorySelect('reparos', 'marido_aluguel')} className="hover:text-teal-600">
                Marido de Aluguel
              </button>
            </li>
          </ul>
        </div>

        {/* Reformas & Móveis */}
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm mb-3">Reformas & Móveis</h4>
          <ul className="text-xs space-y-2 text-slate-500">
            <li>
              <button onClick={() => onPillarSubcategorySelect('reforma', 'pedreiro')} className="hover:text-teal-600">
                Pedreiros & Alvenaria
              </button>
            </li>
            <li>
              <button onClick={() => onPillarSubcategorySelect('reforma', 'pintura')} className="hover:text-teal-600">
                Pintores Residenciais
              </button>
            </li>
            <li>
              <button onClick={() => onPillarSubcategorySelect('montagem', 'montagem')} className="hover:text-teal-600">
                Montadores de Móveis
              </button>
            </li>
            <li>
              <button onClick={() => onPillarSubcategorySelect('montagem', 'marcenaria')} className="hover:text-teal-600">
                Marcenaria Fina
              </button>
            </li>
          </ul>
        </div>

        {/* Institucional */}
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm mb-3">Serviço Indicado</h4>
          <ul className="text-xs space-y-2 text-slate-500">
            <li>
              <Link href="/painel" className="font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1">
                <span>Área do Profissional (Login)</span>
              </Link>
            </li>
            <li>
              <button onClick={onRegisterClick} className="hover:text-teal-600">
                Quero me Cadastrar
              </button>
            </li>
            <li><a href="#" className="hover:text-teal-600">Como Funciona</a></li>
            <li><a href="#" className="hover:text-teal-600">Dicas de Segurança</a></li>
            <li><a href="#" className="hover:text-teal-600">Fale Conosco</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>&copy; 2026 Serviço Indicado. Todos os direitos reservados.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:underline">Termos de Uso</a>
          <a href="#" className="hover:underline">Privacidade</a>
        </div>
      </div>
    </footer>
  );
}
