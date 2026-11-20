'use client';

import { ChevronRight } from 'lucide-react';

interface CtaBannerProps {
  onRegisterClick: () => void;
}

export function CtaBanner({ onRegisterClick }: CtaBannerProps) {
  return (
    <section className="py-14 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl">
          <span className="text-teal-400 text-xs font-bold uppercase tracking-wider bg-teal-950/80 border border-teal-800/80 px-3 py-1 rounded-full mb-3 inline-block">
            Para Prestadores de Serviços
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            É um bom profissional e quer ser recomendado na sua região?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Cadastre-se no <strong>Serviço Indicado</strong>. Receba chamados direto no seu WhatsApp de clientes qualificados que buscam pontualidade e serviço bem feito.
          </p>
          <div className="flex flex-wrap gap-6 text-xs sm:text-sm text-slate-400">
            <div><strong className="text-teal-300 text-base">Zero</strong> mensalidade inicial</div>
            <div><strong className="text-teal-300 text-base">100%</strong> do valor é seu</div>
            <div><strong className="text-teal-300 text-base">Até 10x</strong> mais visibilidade local</div>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-center sm:items-start gap-2 w-full md:w-auto">
          <button
            onClick={onRegisterClick}
            className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-teal-500/20 transition"
          >
            <span>Cadastrar Meu Negócio Grátis</span>
            <ChevronRight size={18} />
          </button>
          <span className="text-xs text-slate-400">Leva menos de 2 minutos • Sem necessidade de cartão</span>
        </div>
      </div>
    </section>
  );
}
