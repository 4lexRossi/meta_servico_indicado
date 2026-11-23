'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import {
  X, ChevronRight, ChevronLeft, Check,
  Camera, Briefcase, MapPin, Tag, DollarSign, Image as ImageIcon, Rocket
} from 'lucide-react';
import { REGIONS_LIST } from '@/data/categories';
import { Professional } from '@/data/types';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
interface WizardData {
  headline: string;
  experienceYears: number;
  priceEstimate: string;
  extraRegions: string[];
  tags: string[];
  avatarUrl: string;
  portfolioItems: { title: string; url: string }[];
}

interface ProfileWizardProps {
  professional: Professional;
  onComplete: (updated: Professional) => void;
  onClose: () => void;
}

// ─────────────────────────────────────────────────────────────
// Steps meta
// ─────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Apresentação',  icon: Briefcase },
  { id: 2, label: 'Cobertura',     icon: MapPin     },
  { id: 3, label: 'Habilidades',   icon: Tag        },
  { id: 4, label: 'Foto & Portfólio', icon: Camera  },
];

const TAG_SUGGESTIONS = [
  'Atendimento Rápido', 'Pontual', 'Orçamento Grátis', 'Profissional Verificado',
  'Aceita Pix', 'Aceita Cartão', 'Nota Fiscal', 'Urgência 24h',
  'Experiência Comprovada', 'Trabalha Fins de Semana', 'Garantia de Serviço',
];

// ─────────────────────────────────────────────────────────────
// Step 1 — Apresentação
// ─────────────────────────────────────────────────────────────
function StepApresentacao({
  data, onChange,
}: { data: WizardData; onChange: (patch: Partial<WizardData>) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-bold text-slate-700 block mb-1.5">
          Título Profissional <span className="text-teal-600">*</span>
        </label>
        <input
          type="text"
          value={data.headline}
          onChange={(e) => onChange({ headline: e.target.value })}
          placeholder="Ex: Eletricista Residencial e Predial"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Aparece logo abaixo do seu nome no perfil público.
        </p>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-700 block mb-1.5">
          Anos de Experiência
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={40}
            value={data.experienceYears}
            onChange={(e) => onChange({ experienceYears: Number(e.target.value) })}
            className="flex-1 accent-teal-600"
          />
          <span className="w-16 text-center font-extrabold text-teal-700 text-sm bg-teal-50 rounded-lg px-2 py-1.5 border border-teal-200">
            {data.experienceYears} {data.experienceYears === 1 ? 'ano' : 'anos'}
          </span>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-700 block mb-1.5">
          Faixa de Preço / Estimativa
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            'A partir de R$ 80/h',
            'A partir de R$ 150/h',
            'Orçamento sem compromisso',
            'Consultar por serviço',
          ].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange({ priceEstimate: opt })}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition text-left ${
                data.priceEstimate === opt
                  ? 'border-teal-500 bg-teal-50 text-teal-700'
                  : 'border-slate-200 text-slate-600 hover:border-teal-300'
              }`}
            >
              <DollarSign size={14} className="shrink-0" />
              {opt}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={
            [
              'A partir de R$ 80/h',
              'A partir de R$ 150/h',
              'Orçamento sem compromisso',
              'Consultar por serviço',
            ].includes(data.priceEstimate)
              ? ''
              : data.priceEstimate
          }
          onChange={(e) => onChange({ priceEstimate: e.target.value })}
          placeholder="Ou escreva sua própria faixa de preço..."
          className="mt-2 w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-slate-600 placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Step 2 — Cobertura de Regiões
// ─────────────────────────────────────────────────────────────
function StepCobertura({
  professional, data, onChange,
}: { professional: Professional; data: WizardData; onChange: (patch: Partial<WizardData>) => void }) {
  const allRegions = REGIONS_LIST.filter((r) => r !== 'Todas as Regiões');
  const primary = professional.regions[0];

  const toggleRegion = (r: string) => {
    if (r === primary) return; // primary is always on
    const next = data.extraRegions.includes(r)
      ? data.extraRegions.filter((x) => x !== r)
      : [...data.extraRegions, r];
    onChange({ extraRegions: next });
  };

  const selectedSet = new Set([primary, ...data.extraRegions]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Sua região principal é <strong className="text-slate-800">{primary}</strong>. Marque as regiões adicionais onde você também atende.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {allRegions.map((r) => {
          const isSelected = selectedSet.has(r);
          const isPrimary  = r === primary;
          return (
            <button
              key={r}
              type="button"
              onClick={() => toggleRegion(r)}
              disabled={isPrimary}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition ${
                isPrimary
                  ? 'border-teal-500 bg-teal-600 text-white cursor-default'
                  : isSelected
                  ? 'border-teal-400 bg-teal-50 text-teal-700'
                  : 'border-slate-200 text-slate-600 hover:border-teal-300'
              }`}
            >
              <MapPin size={13} className="shrink-0" />
              <span className="text-left leading-tight">{r}</span>
              {isPrimary && (
                <span className="ml-auto text-[10px] font-bold bg-white/20 rounded px-1">Principal</span>
              )}
              {isSelected && !isPrimary && <Check size={13} className="ml-auto shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Step 3 — Tags / Diferenciais
// ─────────────────────────────────────────────────────────────
function StepHabilidades({
  data, onChange,
}: { data: WizardData; onChange: (patch: Partial<WizardData>) => void }) {
  const [custom, setCustom] = useState('');

  const toggleTag = (tag: string) => {
    const next = data.tags.includes(tag)
      ? data.tags.filter((t) => t !== tag)
      : data.tags.length < 6 ? [...data.tags, tag] : data.tags;
    onChange({ tags: next });
  };

  const addCustom = () => {
    const val = custom.trim();
    if (!val || data.tags.includes(val) || data.tags.length >= 6) return;
    onChange({ tags: [...data.tags, val] });
    setCustom('');
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Escolha até <strong>6 diferenciais</strong> que aparecem como badges no seu perfil.
        {data.tags.length > 0 && (
          <span className="ml-1 text-teal-600 font-semibold">{data.tags.length}/6 selecionados</span>
        )}
      </p>

      {/* Selected tags */}
      {data.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-teal-50 border border-teal-100">
          {data.tags.map((t) => (
            <span
              key={t}
              className="flex items-center gap-1.5 bg-teal-600 text-white text-xs font-bold px-2.5 py-1 rounded-full"
            >
              {t}
              <button
                type="button"
                onClick={() => onChange({ tags: data.tags.filter((x) => x !== t) })}
                className="hover:text-teal-200 transition"
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2">
        {TAG_SUGGESTIONS.filter((s) => !data.tags.includes(s)).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => toggleTag(s)}
            disabled={data.tags.length >= 6}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            + {s}
          </button>
        ))}
      </div>

      {/* Custom tag */}
      <div className="flex gap-2">
        <input
          type="text"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustom(); } }}
          placeholder="Adicionar diferencial personalizado..."
          maxLength={30}
          className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
        />
        <button
          type="button"
          onClick={addCustom}
          disabled={data.tags.length >= 6 || !custom.trim()}
          className="px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Step 4 — Avatar & Portfolio
// ─────────────────────────────────────────────────────────────
const AVATAR_MAX_SIZE = 2 * 1024 * 1024; // 2 MB
const PORTFOLIO_MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_PORTFOLIO_ITEMS = 10;

function StepFotos({
  professional, data, onChange,
}: { professional: Professional; data: WizardData; onChange: (patch: Partial<WizardData>) => void }) {
  const [uploading, setUploading] = useState(false);
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const avatarRef = useRef<HTMLInputElement>(null);
  const portfolioRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File, type: 'avatar' | 'portfolio' = 'portfolio'): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Falha no upload');
    }
    return json.url as string;
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > AVATAR_MAX_SIZE) {
      alert('A foto de perfil excede o limite máximo permitido de 2 MB.');
      e.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const url = await uploadFile(file, 'avatar');
      onChange({ avatarUrl: url });
    } catch (err: any) {
      alert(err.message || 'Erro ao enviar foto. Tente novamente.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handlePortfolioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (data.portfolioItems.length >= MAX_PORTFOLIO_ITEMS) {
      alert(`Você já atingiu o limite máximo de ${MAX_PORTFOLIO_ITEMS} fotos no portfólio.`);
      e.target.value = '';
      return;
    }

    if (file.size > PORTFOLIO_MAX_SIZE) {
      alert('A imagem do portfólio excede o limite máximo permitido de 5 MB.');
      e.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const url = await uploadFile(file, 'portfolio');
      const title = portfolioTitle.trim() || file.name.replace(/\.[^.]+$/, '');
      onChange({
        portfolioItems: [...data.portfolioItems, { title, url }],
      });
      setPortfolioTitle('');
    } catch (err: any) {
      alert(err.message || 'Erro ao enviar foto. Tente novamente.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removePortfolioItem = (idx: number) => {
    onChange({ portfolioItems: data.portfolioItems.filter((_, i) => i !== idx) });
  };

  const avatarSrc = data.avatarUrl || professional.avatar;

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div>
        <p className="text-xs font-bold text-slate-700 mb-3">Foto de Perfil</p>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image
              src={avatarSrc}
              alt="Avatar"
              width={80}
              height={80}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200"
              unoptimized
            />
            {uploading && (
              <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <button
              type="button"
              onClick={() => avatarRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-teal-500 text-teal-700 bg-teal-50 hover:bg-teal-100 font-bold text-sm transition disabled:opacity-50"
            >
              <Camera size={15} />
              {data.avatarUrl ? 'Trocar foto' : 'Enviar foto'}
            </button>
            <p className="text-[11px] text-slate-400 mt-1.5">JPG, PNG ou WEBP, máx. 2 MB</p>
          </div>
        </div>
        <input
          ref={avatarRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden"
        />
      </div>

      {/* Portfolio */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-slate-700">Portfólio de Trabalhos</p>
          <span className="text-[11px] text-slate-400">{data.portfolioItems.length}/{MAX_PORTFOLIO_ITEMS} fotos</span>
        </div>

        {data.portfolioItems.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {data.portfolioItems.map((item, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square">
                <Image
                  src={item.url}
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removePortfolioItem(idx)}
                    className="w-7 h-7 rounded-full bg-white/90 text-red-500 flex items-center justify-center hover:bg-white transition"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="absolute bottom-0 inset-x-0 text-[10px] text-white font-semibold text-center bg-black/50 px-1 py-0.5 truncate">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        )}

        {data.portfolioItems.length < MAX_PORTFOLIO_ITEMS && (
          <div className="space-y-2">
            <input
              type="text"
              value={portfolioTitle}
              onChange={(e) => setPortfolioTitle(e.target.value)}
              placeholder="Legenda da foto (ex: Instalação elétrica, 2024)"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
            <button
              type="button"
              onClick={() => portfolioRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 font-semibold text-sm transition w-full justify-center disabled:opacity-50"
            >
              <ImageIcon size={15} />
              {uploading ? 'Enviando...' : 'Adicionar foto ao portfólio'}
            </button>
            <p className="text-[11px] text-slate-400 text-center">Formatos aceitos: JPG, PNG, WEBP (máx. 5 MB cada, até {MAX_PORTFOLIO_ITEMS} fotos)</p>
          </div>
        )}
        <input
          ref={portfolioRef}
          type="file"
          accept="image/*"
          onChange={handlePortfolioChange}
          className="hidden"
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Wizard
// ─────────────────────────────────────────────────────────────
export function ProfileWizard({ professional, onComplete, onClose }: ProfileWizardProps) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<WizardData>({
    headline: professional.headline || '',
    experienceYears: professional.experienceYears || 5,
    priceEstimate: professional.priceEstimate || 'Orçamento sem compromisso',
    extraRegions: [],
    tags: professional.tags || [],
    avatarUrl: '',
    portfolioItems: [],
  });

  const onChange = (patch: Partial<WizardData>) =>
    setData((prev) => ({ ...prev, ...patch }));

  const canProceed = () => {
    if (step === 1) return data.headline.trim().length > 0;
    return true;
  };

  const handleFinish = async () => {
    setSaving(true);
    const allRegions = [professional.regions[0], ...data.extraRegions];
    const payload = {
      headline: data.headline.trim(),
      experienceYears: data.experienceYears,
      priceEstimate: data.priceEstimate,
      regions: allRegions,
      tags: data.tags,
      ...(data.avatarUrl ? { avatar: data.avatarUrl } : {}),
      portfolio: data.portfolioItems,
    };

    try {
      const res = await fetch(`/api/profissionais/${professional.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const updated: Professional = res.ok
        ? (await res.json()).data
        : { ...professional, ...payload };

      onComplete(updated);
    } catch {
      onComplete({ ...professional, ...payload });
    } finally {
      setSaving(false);
    }
  };

  const stepComponents = [
    <StepApresentacao key={1} data={data} onChange={onChange} />,
    <StepCobertura key={2} professional={professional} data={data} onChange={onChange} />,
    <StepHabilidades key={3} data={data} onChange={onChange} />,
    <StepFotos key={4} professional={professional} data={data} onChange={onChange} />,
  ];

  const isLast = step === STEPS.length;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Complete seu Perfil</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Olá, <strong>{professional.name.split(' ')[0]}</strong>! Quanto mais completo, mais contatos você recebe.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition shrink-0"
            >
              <X size={16} />
            </button>
          </div>

          {/* Step progress bar */}
          <div className="flex items-center gap-1.5">
            {STEPS.map((s, idx) => {
              const Icon = s.icon;
              const done = step > s.id;
              const active = step === s.id;
              return (
                <div key={s.id} className="flex items-center gap-1.5 flex-1">
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                        done
                          ? 'bg-teal-600 text-white'
                          : active
                          ? 'bg-teal-100 text-teal-700 ring-2 ring-teal-400'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {done ? <Check size={13} className="stroke-[3]" /> : <Icon size={13} />}
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-wide ${active ? 'text-teal-700' : done ? 'text-teal-500' : 'text-slate-400'}`}>
                      {s.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={`h-0.5 flex-1 rounded-full mb-4 ${step > s.id ? 'bg-teal-500' : 'bg-slate-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {stepComponents[step - 1]}
        </div>

        {/* Footer nav */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
          <button
            type="button"
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-sm transition"
          >
            <ChevronLeft size={16} />
            {step > 1 ? 'Anterior' : 'Agora não'}
          </button>

          {isLast ? (
            <button
              type="button"
              onClick={handleFinish}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-extrabold text-sm shadow-lg shadow-teal-700/20 transition disabled:opacity-60"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Rocket size={15} />
              )}
              {saving ? 'Salvando...' : 'Publicar Perfil Completo!'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Próximo
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
