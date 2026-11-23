'use client';

import Image from 'next/image';
import { Heart, Star, MapPin, CheckCircle2, MessageCircle } from 'lucide-react';
import { Professional } from '@/data/types';

interface ProfessionalCardProps {
  professional: Professional;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onViewProfile: (pro: Professional) => void;
}

export function ProfessionalCard({
  professional: pro,
  isFavorite,
  onToggleFavorite,
  onViewProfile,
}: ProfessionalCardProps) {
  const waMessage = encodeURIComponent(
    `Olá ${pro.name}! Vi seu perfil no Serviço Indicado e gostaria de solicitar um orçamento para ${pro.headline}. Você tem disponibilidade esta semana?`
  );
  const waLink = `https://wa.me/55${pro.phone}?text=${waMessage}`;

  return (
    <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between group">
      {/* Card Header */}
      <div className="p-5 pb-3">
        <div className="flex gap-4 items-start">

          {/* Avatar with Verified Badge */}
          <div className="relative shrink-0">
            <Image
              src={pro.avatar}
              alt={pro.name}
              width={68}
              height={68}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
              unoptimized
            />
            {pro.verified && (
              <span
                title="Profissional 100% Verificado"
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center border-2 border-white shadow-xs"
              >
                <CheckCircle2 size={12} className="stroke-[3]" />
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h3 className="font-extrabold text-base text-slate-900 truncate">
                {pro.name}
              </h3>
              <button
                onClick={(e) => onToggleFavorite(pro.id, e)}
                className={`p-1.5 rounded-full transition ${
                  isFavorite
                    ? 'text-rose-500 bg-rose-50'
                    : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100'
                }`}
                aria-label="Favoritar"
              >
                <Heart size={18} className={isFavorite ? 'fill-rose-500' : ''} />
              </button>
            </div>

            <p className="text-xs font-semibold text-teal-700 truncate mb-1.5">
              {pro.headline}
            </p>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                <Star size={12} className="fill-amber-400 text-amber-500" />
                {pro.rating.toFixed(1)}
              </span>
              <span>({pro.reviewsCount} avaliações)</span>
              <span className="truncate flex items-center gap-1">
                <MapPin size={12} className="shrink-0 text-slate-400" />
                {pro.regions[0]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-5 py-2 flex-1">
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
          {pro.bio}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {pro.emailVerified && (
            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <CheckCircle2 size={10} className="text-emerald-600 stroke-[3]" />
              E-mail Verificado
            </span>
          )}
          {pro.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Estimativa média</span>
          <span className="font-extrabold text-slate-900">{pro.priceEstimate}</span>
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-5 pt-3 border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={() => onViewProfile(pro)}
          className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs text-center transition"
        >
          Ver Perfil
        </button>

        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-500/20 transition"
        >
          <MessageCircle size={15} />
          <span>WhatsApp</span>
        </a>
      </div>
    </article>
  );
}
