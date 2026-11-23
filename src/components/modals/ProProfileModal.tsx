'use client';

import Image from 'next/image';
import { X, Star, CheckCircle2, Award, MessageCircle, Copy, ShieldCheck } from 'lucide-react';
import { Professional } from '@/data/types';

interface ProProfileModalProps {
  professional: Professional;
  onClose: () => void;
  onCopyPhone: (phone: string) => void;
}

export function ProProfileModal({ professional: pro, onClose, onCopyPhone }: ProProfileModalProps) {
  const waLink = `https://wa.me/55${pro.phone}?text=${encodeURIComponent(
    `Olá ${pro.name}! Vi seu perfil completo no Serviço Indicado e gostaria de solicitar um orçamento para ${pro.headline}.`
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur text-slate-700 hover:text-slate-900 flex items-center justify-center shadow-md transition"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        {/* Modal Body Scroll */}
        <div className="overflow-y-auto flex-1">

          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900" />

          {/* Profile Header */}
          <div className="px-6 pb-6 relative -mt-12 flex flex-col sm:flex-row items-start sm:items-end gap-4 border-b border-slate-100">
            <Image
              src={pro.avatar}
              alt={pro.name}
              width={96}
              height={96}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl bg-white"
              unoptimized
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-extrabold text-slate-900">{pro.name}</h3>
                <span className="bg-teal-100 text-teal-800 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={12} className="stroke-[2.5]" />
                  Verificado
                </span>
                {pro.emailVerified && (
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                    <ShieldCheck size={12} className="text-emerald-700 stroke-[2.5]" />
                    E-mail Verificado
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-teal-700 mb-2">{pro.headline}</p>
              <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                <span className="font-bold flex items-center gap-1">
                  <Star size={13} className="fill-amber-400 text-amber-500" />
                  {pro.rating.toFixed(1)} ({pro.reviewsCount} opiniões)
                </span>
                <span>📍 {pro.regions.join(', ')}</span>
                <span>⏱️ {pro.experienceYears} anos de experiência</span>
              </div>
            </div>
          </div>

          {/* Profile Sections */}
          <div className="p-6 space-y-6">

            {/* Guarantee Badges */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Garantias & Diferenciais
              </h4>
              <div className="flex flex-wrap gap-2">
                {pro.badges.map((b) => (
                  <span key={b} className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Award size={13} className="text-teal-600" />
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Sobre o Profissional
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">{pro.bio}</p>
            </div>

            {/* Tags */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Especialidades Atendidas
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {pro.tags.map((t) => (
                  <span key={t} className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Portfolio Gallery */}
            {pro.portfolio && pro.portfolio.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Fotos de Trabalhos Realizados
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {pro.portfolio.map((p, i) => (
                    <div key={i} className="relative rounded-xl overflow-hidden h-28 bg-slate-100 group">
                      <Image
                        src={p.url}
                        alt={p.title}
                        fill
                        className="object-cover group-hover:scale-105 transition"
                        unoptimized
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white text-[11px] font-medium">
                        {p.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Reviews */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Avaliações de Clientes Reais
              </h4>
              <div className="space-y-3">
                {pro.reviews.map((rev, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-slate-800">{rev.name}</span>
                      <span className="text-amber-500 text-xs">{'★'.repeat(rev.stars)}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      &ldquo;{rev.text}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Fixed Footer CTA */}
        <div className="p-4 px-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-slate-500 block">Estimativa média</span>
            <span className="font-extrabold text-sm sm:text-base text-slate-900">{pro.priceEstimate}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onCopyPhone(pro.phone)}
              className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Copy size={14} />
              <span>Copiar Contato</span>
            </button>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-emerald-500/20 transition"
            >
              <MessageCircle size={16} />
              <span>Chamar no WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
