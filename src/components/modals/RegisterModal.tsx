'use client';

import React, { useState } from 'react';
import { X, UserPlus, AlertCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { REGIONS_LIST } from '@/data/categories';
import { CaptchaChallenge } from '@/components/ui/CaptchaChallenge';
import { formatPhone, validatePhone } from '@/lib/phone';

interface RegisterFormState {
  name: string;
  phone: string;
  email?: string;
  password?: string;
  region: string;
  subcategory: string;
  bio: string;
}

interface RegisterModalProps {
  formState: RegisterFormState;
  onFormChange: (field: keyof RegisterFormState, value: string) => void;
  onSubmit: (e: React.FormEvent, captcha: { captchaToken: string; captchaAnswer: string }) => void;
  onClose: () => void;
  errorMessage?: string | null;
  isSubmitting?: boolean;
}

export function RegisterModal({
  formState,
  onFormChange,
  onSubmit,
  onClose,
  errorMessage,
  isSubmitting,
}: RegisterModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [captchaData, setCaptchaData] = useState<{ captchaToken: string; captchaAnswer: string }>({
    captchaToken: '',
    captchaAnswer: '',
  });
  const [localCaptchaError, setLocalCaptchaError] = useState<string | null>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    onFormChange('phone', formatted);
    if (phoneError) setPhoneError(null);
  };

  const handlePhoneBlur = () => {
    if (!formState.phone) return;
    const check = validatePhone(formState.phone);
    if (!check.isValid) {
      setPhoneError(check.error || 'Número de WhatsApp inválido.');
    } else {
      setPhoneError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const phoneCheck = validatePhone(formState.phone);
    if (!phoneCheck.isValid) {
      setPhoneError(phoneCheck.error || 'Informe um número de WhatsApp válido no formato (00) 00000-0000.');
      return;
    }
    setPhoneError(null);

    if (!captchaData.captchaAnswer.trim()) {
      setLocalCaptchaError('Por favor, responda à verificação de segurança antes de continuar.');
      return;
    }
    setLocalCaptchaError(null);
    onSubmit(e, captchaData);
  };
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

        {(errorMessage || localCaptchaError) && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage || localCaptchaError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
                WhatsApp com DDD <span className="text-teal-600">*</span>
              </label>
              <input
                type="tel"
                required
                value={formState.phone}
                onChange={handlePhoneChange}
                onBlur={handlePhoneBlur}
                placeholder="(00) 00000-0000"
                maxLength={15}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition focus:ring-2 ${
                  phoneError
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/30 text-rose-900'
                    : 'border-slate-300 focus:border-teal-500 focus:ring-teal-500/20'
                }`}
              />
              {phoneError ? (
                <p className="text-[11px] text-rose-600 font-medium mt-1">{phoneError}</p>
              ) : (
                <p className="text-[11px] text-slate-400 mt-1">Apenas números. Formato: (00) 00000-0000</p>
              )}
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

          {/* Email + Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                E-mail (opcional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={15} />
                </div>
                <input
                  type="email"
                  value={formState.email || ''}
                  onChange={(e) => onFormChange('email', e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Senha de Acesso ao Painel
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={15} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={formState.password || ''}
                  onChange={(e) => onFormChange('password', e.target.value)}
                  placeholder="Mínimo 6 dígitos"
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                  title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
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

          {/* Captcha Anti-bot Protection */}
          <CaptchaChallenge
            onVerified={(data) => {
              setCaptchaData(data);
              setLocalCaptchaError(null);
            }}
            onReset={() => {
              setCaptchaData({ captchaToken: '', captchaAnswer: '' });
            }}
            error={localCaptchaError}
          />

          {/* Terms */}
          <div className="flex items-start gap-2 pt-1">
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
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-extrabold text-sm shadow-lg shadow-teal-700/20 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Cadastrar Perfil no Serviço Indicado</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
