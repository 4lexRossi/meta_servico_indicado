'use client';

import { X, UserPlus } from 'lucide-react';
import { REGIONS_LIST } from '@/data/categories';

interface RegisterFormState {
  name: string;
  phone: string;
  region: string;
  subcategory: string;
  bio: string;
}

interface RegisterModalProps {
  formState: RegisterFormState;
  onFormChange: (field: keyof RegisterFormState, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function RegisterModal({ formState, onFormChange, onSubmit, onClose }: RegisterModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-3">
            <UserPlus size={26} />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            Faça parte do Serviço Indicado
          </h3>
          <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
            Preencha os dados abaixo para ser avaliado e começar a receber contatos diretos no seu WhatsApp.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Nome Completo ou Razão Social
            </label>
            <input
              type="text"
              required
              value={formState.name}
              onChange={(e) => onFormChange('name', e.target.value)}
              placeholder="Ex: Carlos Eduardo Silveira"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Phone + Region */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                WhatsApp com DDD
              </label>
              <input
                type="tel"
                required
                value={formState.phone}
                onChange={(e) => onFormChange('phone', e.target.value)}
                placeholder="(11) 98765-4321"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Região Principal
              </label>
              <select
                value={formState.region}
                onChange={(e) => onFormChange('region', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-teal-500 bg-white"
              >
                {REGIONS_LIST.filter((r) => r !== 'Todas as Regiões').map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Especialidade */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Especialidade Principal
            </label>
            <select
              value={formState.subcategory}
              onChange={(e) => onFormChange('subcategory', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-teal-500 bg-white"
            >
              <optgroup label="Reparos Rápidos">
                <option value="encanamento">Encanamento & Caça Vazamentos</option>
                <option value="eletrica">Elétrica Residencial / Predial</option>
                <option value="chaveiro">Chaveiro 24h & Fechaduras</option>
                <option value="marido_aluguel">Marido de Aluguel / Pequenos Reparos</option>
                <option value="ar_condicionado">Ar-condicionado & Climatização</option>
              </optgroup>
              <optgroup label="Reforma & Obra">
                <option value="pedreiro">Pedreiro & Alvenaria</option>
                <option value="pintura">Pintura & Texturas</option>
                <option value="gesso">Gesso & Drywall</option>
                <option value="piscina">Piscinas & Manutenção</option>
                <option value="telhado">Telhados & Calhas</option>
                <option value="serralheria">Serralheria & Portões</option>
              </optgroup>
              <optgroup label="Montagem & Instalação">
                <option value="montagem">Montador de Móveis</option>
                <option value="suporte_tv">Instalação de TV & Suportes</option>
                <option value="marcenaria">Marcenaria Fina</option>
                <option value="cortinas">Cortinas & Persianas</option>
              </optgroup>
            </select>
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Resumo de Experiência & Atuação
            </label>
            <textarea
              rows={3}
              value={formState.bio}
              onChange={(e) => onFormChange('bio', e.target.value)}
              placeholder="Ex: Trabalho com reformas e encanamento há 10 anos, atendo toda a Zona Sul com pontualidade..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              required
              id="proTermsCheckbox"
              className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
            />
            <label htmlFor="proTermsCheckbox" className="text-xs text-slate-600 leading-snug">
              Concordo em prestar serviços de qualidade, responder orçamentos com rapidez e aceito os termos do Serviço Indicado.
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-extrabold text-sm shadow-lg shadow-teal-700/20 transition"
          >
            Cadastrar Perfil no Serviço Indicado
          </button>
        </form>
      </div>
    </div>
  );
}
