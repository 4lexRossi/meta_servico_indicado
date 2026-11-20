'use client';

import { ShieldCheck, MessageCircle, Star, ThumbsUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface TrustItem {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

const TRUST_ITEMS: TrustItem[] = [
  {
    icon: ShieldCheck,
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-700',
    title: 'Verificação Rigorosa',
    description: 'Conferência de documentos, antecedentes e histórico real antes do profissional ser recomendado na plataforma.',
  },
  {
    icon: MessageCircle,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    title: 'WhatsApp Direto',
    description: 'Sem intermediários ou mensagens perdidas. Combine datas, envie fotos e tire dúvidas direto no WhatsApp.',
  },
  {
    icon: Star,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    title: 'Avaliações Autênticas',
    description: 'Opiniões verificadas de moradores do seu próprio bairro que já contrataram o serviço e aprovaram o resultado.',
  },
  {
    icon: ThumbsUp,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-700',
    title: 'Preço Justo & Sem Taxas',
    description: 'O prestador não precisa inflacionar o orçamento para cobrir taxas de aplicativo. Ganha o profissional, economiza o cliente.',
  },
];

export function TrustSection() {
  return (
    <section className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-block bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mb-3">
          Por que escolher o Serviço Indicado?
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto mb-4">
          Construído para resolver o que as plataformas tradicionais não resolvem
        </h2>

        <p className="text-slate-600 max-w-2xl mx-auto mb-12 text-sm sm:text-base leading-relaxed">
          Diferente de modelos onde o profissional paga créditos para abrir contato ou há comissões que encarecem a obra,
          conectamos você diretamente com total transparência.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {TRUST_ITEMS.map(({ icon: Icon, iconBg, iconColor, title, description }) => (
            <div
              key={title}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-300 hover:shadow-lg transition"
            >
              <div className={`w-12 h-12 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center mb-4`}>
                <Icon size={24} />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">{title}</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
