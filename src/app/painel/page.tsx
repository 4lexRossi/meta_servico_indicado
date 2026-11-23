'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  User, Phone, Briefcase, MapPin, DollarSign, Tag, Camera,
  Image as ImageIcon, CheckCircle2, Star, Save, LogOut, ExternalLink,
  Plus, X, AlertCircle, ArrowLeft, Layers, ShieldCheck, Check,
  Menu, ChevronDown, Mail, Lock, Eye, EyeOff
} from 'lucide-react';
import { Professional, PillarId, PortfolioItem } from '@/data/types';
import { CATEGORIES_DATA, REGIONS_LIST } from '@/data/categories';
import { INITIAL_PROFESSIONALS } from '@/data/professionals';
import { Toast } from '@/components/ui/Toast';
import { formatPhone } from '@/lib/phone';

const TAG_SUGGESTIONS = [
  'Atendimento Rápido',
  'Pontual',
  'Orçamento Grátis',
  'Profissional Verificado',
  'Aceita Pix',
  'Aceita Cartão',
  'Nota Fiscal',
  'Urgência 24h',
  'Experiência Comprovada',
  'Trabalha Fins de Semana',
  'Garantia de Serviço',
  'Materiais Inclusos',
  'Atendimento Domiciliar',
];

const TABS = [
  { id: 'geral', label: 'Visão Geral & Prévia', desc: 'Como os clientes vêem seu anúncio', icon: Star },
  { id: 'dados', label: 'Dados & Descrições', desc: 'Nome, WhatsApp, biografia e valores', icon: User },
  { id: 'servicos', label: 'Serviços & Regiões', desc: 'Especialidades e bairros atendidos', icon: Layers },
  { id: 'tags', label: 'Diferenciais & Habilidades', desc: 'Badges de garantia, pix, 24h', icon: Tag },
  { id: 'fotos', label: 'Fotos & Portfólio', desc: 'Avatar e galeria no AWS S3', icon: Camera },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function ProfessionalDashboardPage() {
  // -------------------------------------------------------------
  // State: Auth & Session
  // -------------------------------------------------------------
  const [pro, setPro] = useState<Professional | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab & Mobile Menu
  const [activeTab, setActiveTab] = useState<TabId>('geral');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Form Edit State
  const [formData, setFormData] = useState<Partial<Professional>>({});
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [customTag, setCustomTag] = useState('');
  const [portfolioTitle, setPortfolioTitle] = useState('');

  // Upload & Save Loading
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingPortfolio, setIsUploadingPortfolio] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'normal' | 'success'>('normal');

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);

  const triggerToast = (msg: string, type: 'normal' | 'success' = 'normal') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // -------------------------------------------------------------
  // Check LocalStorage Session on Load
  // -------------------------------------------------------------
  useEffect(() => {
    try {
      const stored = localStorage.getItem('servico_indicado_pro_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        setPro(parsed);
        setFormData(parsed);
      }
    } catch (e) {
      console.warn('Erro ao carregar sessão do profissional:', e);
    } finally {
      setLoadingSession(false);
    }
  }, []);

  // -------------------------------------------------------------
  // Login Handler
  // -------------------------------------------------------------
  const handleLogin = async (e?: React.FormEvent, directId?: string) => {
    if (e) e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const body = directId
        ? { id: directId }
        : { identifier: loginIdentifier, password: loginPassword };
      const res = await fetch('/api/profissionais/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (res.ok && json.data) {
        setPro(json.data);
        setFormData(json.data);
        localStorage.setItem('servico_indicado_pro_session', JSON.stringify(json.data));
        triggerToast(`🎉 Bem-vindo ao seu painel, ${json.data.name}!`, 'success');
      } else {
        setLoginError(json.error || 'Nenhum profissional encontrado com esses dados.');
      }
    } catch {
      setLoginError('Erro de conexão ao tentar fazer login.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setPro(null);
    setFormData({});
    localStorage.removeItem('servico_indicado_pro_session');
    triggerToast('Você saiu da sua conta.');
  };

  // -------------------------------------------------------------
  // Form Field Updates
  // -------------------------------------------------------------
  const updateField = (field: keyof Professional, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleRegion = (regionName: string) => {
    const current = (formData.regions || []) as string[];
    const next = current.includes(regionName)
      ? current.filter((r) => r !== regionName)
      : [...current, regionName];
    // Keep at least one region
    if (next.length > 0) {
      updateField('regions', next);
    }
  };

  const toggleTag = (tagName: string) => {
    const current = (formData.tags || []) as string[];
    const next = current.includes(tagName)
      ? current.filter((t) => t !== tagName)
      : current.length < 8
      ? [...current, tagName]
      : current;
    updateField('tags', next);
  };

  const handleAddCustomTag = () => {
    const val = customTag.trim();
    if (!val) return;
    const current = (formData.tags || []) as string[];
    if (!current.includes(val) && current.length < 8) {
      updateField('tags', [...current, val]);
      setCustomTag('');
    }
  };

  // -------------------------------------------------------------
  // S3 File Upload Handlers (Standard Web Limits: 2MB Avatar, 5MB Portfolio, Max 10 Photos)
  // -------------------------------------------------------------
  const AVATAR_MAX_SIZE = 2 * 1024 * 1024; // 2 MB
  const PORTFOLIO_MAX_SIZE = 5 * 1024 * 1024; // 5 MB
  const MAX_PORTFOLIO_PHOTOS = 10;

  const uploadToS3 = async (file: File, type: 'avatar' | 'portfolio' = 'portfolio'): Promise<string> => {
    const uploadForm = new FormData();
    uploadForm.append('file', file);
    uploadForm.append('type', type);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: uploadForm,
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Falha no upload para o S3');
    }
    return json.url;
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > AVATAR_MAX_SIZE) {
      triggerToast('A foto de perfil excede o limite máximo permitido de 2 MB.', 'normal');
      e.target.value = '';
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const url = await uploadToS3(file, 'avatar');
      updateField('avatar', url);
      triggerToast('Foto de perfil atualizada no S3!', 'success');
    } catch (err: any) {
      triggerToast(err.message || 'Erro ao enviar imagem. Verifique o arquivo e tente novamente.', 'normal');
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = '';
    }
  };

  const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const currentList = (formData.portfolio || []) as PortfolioItem[];
    if (currentList.length >= MAX_PORTFOLIO_PHOTOS) {
      triggerToast(`Limite máximo de ${MAX_PORTFOLIO_PHOTOS} fotos atingido no portfólio.`, 'normal');
      e.target.value = '';
      return;
    }

    if (file.size > PORTFOLIO_MAX_SIZE) {
      triggerToast('A foto do portfólio excede o limite máximo permitido de 5 MB.', 'normal');
      e.target.value = '';
      return;
    }

    setIsUploadingPortfolio(true);
    try {
      const url = await uploadToS3(file, 'portfolio');
      const title = portfolioTitle.trim() || file.name.replace(/\.[^/.]+$/, '');
      updateField('portfolio', [...currentList, { title, url }]);
      setPortfolioTitle('');
      triggerToast('Foto adicionada ao portfólio no S3!', 'success');
    } catch (err: any) {
      triggerToast(err.message || 'Erro ao enviar imagem do portfólio.', 'normal');
    } finally {
      setIsUploadingPortfolio(false);
      e.target.value = '';
    }
  };

  const removePortfolioItem = (index: number) => {
    const currentList = (formData.portfolio || []) as PortfolioItem[];
    updateField('portfolio', currentList.filter((_, i) => i !== index));
    triggerToast('Foto removida do portfólio.');
  };

  // -------------------------------------------------------------
  // Save Changes to Database
  // -------------------------------------------------------------
  const handleSaveAll = async () => {
    if (!pro?.id) return;
    setIsSaving(true);

    try {
      const payload = {
        ...formData,
        ...(newPassword.trim() ? { newPassword: newPassword.trim() } : {}),
      };

      const res = await fetch(`/api/profissionais/${pro.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        const updated = json.data;
        setPro(updated);
        setFormData(updated);
        setNewPassword('');
        localStorage.setItem('servico_indicado_pro_session', JSON.stringify(updated));
        triggerToast('✅ Perfil e serviços atualizados com sucesso!', 'success');
      } else {
        triggerToast('Não foi possível salvar as alterações.', 'normal');
      }
    } catch {
      triggerToast('Erro ao comunicar com o servidor.', 'normal');
    } finally {
      setIsSaving(false);
    }
  };

  // -------------------------------------------------------------
  // RENDER: Loading Session
  // -------------------------------------------------------------
  if (loadingSession) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Login Screen
  // -------------------------------------------------------------
  if (!pro) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 flex flex-col justify-between">
        {/* Simple top nav */}
        <header className="bg-white border-b border-slate-200 py-4 px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-transparent">
              <Image src="/icon.png" alt="Serviço Indicado" width={40} height={40} className="w-full h-full" unoptimized />
            </div>
            <span className="font-extrabold text-slate-900 text-lg">
              Serviço<span className="text-teal-600">Indicado</span>
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-teal-700 transition"
          >
            <ArrowLeft size={16} />
            Voltar ao Início
          </Link>
        </header>

        {/* Login Box */}
        <div className="max-w-md w-full mx-auto px-4 py-12">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Briefcase size={26} />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">
                Área do Profissional
              </h1>
              <p className="text-xs text-slate-600 mt-1.5">
                Acesse seu painel para atualizar suas fotos, valores, regiões e informações do seu perfil público.
              </p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
              {/* Telefone ou E-mail */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  WhatsApp ou E-mail cadastrado
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="(11) 98765-4321 ou seu@email.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Digite seu telefone com DDD ou seu endereço de e-mail.
                </p>
              </div>

              {/* Senha */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Senha de Acesso
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Sua senha cadastrada"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                    title={showLoginPassword ? 'Ocultar senha' : 'Ver senha'}
                  >
                    {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn || !loginIdentifier.trim() || !loginPassword.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-extrabold text-sm shadow-md shadow-teal-700/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Entrar no Painel</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-1">
                Ou teste com um perfil demonstrativo:
              </p>
              <p className="text-[10px] text-slate-400 text-center mb-3">
                (Clique para testar com senha padrão: <strong>123456</strong>)
              </p>
              <div className="space-y-2">
                {INITIAL_PROFESSIONALS.slice(0, 3).map((demo) => (
                  <button
                    key={demo.id}
                    type="button"
                    onClick={() => {
                      setLoginIdentifier(demo.phone);
                      setLoginPassword('123456');
                      handleLogin(undefined, demo.id);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 flex items-center gap-3 transition text-left group"
                  >
                    <Image
                      src={demo.avatar}
                      alt={demo.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-lg object-cover"
                      unoptimized
                    />
                    <div className="flex-1 truncate">
                      <div className="text-xs font-bold text-slate-800 group-hover:text-teal-700 truncate">
                        {demo.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        Tel: {demo.phone} &bull; Senha: 123456
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                      Entrar
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-xs font-semibold text-slate-500 hover:text-teal-600"
              >
                Ainda não tem cadastro? Faça seu cadastro rápido na página inicial
              </Link>
            </div>
          </div>
        </div>

        <footer className="text-center py-4 text-xs text-slate-500">
          Serviço Indicado &copy; {new Date().getFullYear()} — Plataforma de Profissionais de Confiança
        </footer>

        {toastMessage && <Toast message={toastMessage} type={toastType} />}
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Logged-in Dashboard
  // -------------------------------------------------------------
  const allSubcategories = Object.values(CATEGORIES_DATA).flatMap((c) => c.subcategories);
  const currentSub = allSubcategories.find((s) => s.id === formData.subcategory);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Dashboard Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-transparent">
                <Image src="/icon.png" alt="Serviço Indicado" width={36} height={36} className="w-full h-full" unoptimized />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 text-lg leading-none block">
                  Serviço<span className="text-teal-600">Indicado</span>
                </span>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded leading-none uppercase">
                  Painel do Prestador
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:text-teal-700 hover:bg-slate-50 font-semibold text-xs transition"
            >
              <ExternalLink size={14} />
              <span>Ver Site Público</span>
            </Link>

            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-teal-700/20 transition disabled:opacity-50 shrink-0"
            >
              {isSaving ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              <span>Salvar<span className="hidden sm:inline"> Alterações</span></span>
            </button>

            <button
              onClick={handleLogout}
              className="w-9 h-9 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition shrink-0"
              title="Sair da Conta"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Profile Snapshot Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative group">
                <Image
                  src={formData.avatar || pro.avatar}
                  alt={formData.name || pro.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-teal-500/30 shadow-md bg-white"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute inset-0 bg-slate-900/40 rounded-2xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white"
                  title="Trocar foto de perfil"
                >
                  <Camera size={18} />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-extrabold text-slate-900">
                    {formData.name || pro.name}
                  </h1>
                  <span className="bg-teal-100 text-teal-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={12} className="stroke-[2.5]" />
                    Verificado
                  </span>
                </div>
                <p className="text-sm font-semibold text-teal-700 mt-0.5">
                  {formData.headline || pro.headline}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Star size={14} className="text-amber-500 fill-amber-500" />
                    <strong className="text-slate-800">{pro.rating?.toFixed(1) || '5.0'}</strong> ({pro.reviewsCount || 1} avaliações)
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone size={13} />
                    <span>WhatsApp: {formData.phone || pro.phone}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={13} />
                    <span>{(formData.regions || pro.regions || []).join(', ')}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Status Pill */}
            <div className="w-full sm:w-auto bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status no Site</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Perfil Ativo & Recebendo Contatos
              </span>
            </div>
          </div>

          {/* Mobile Hamburger Menu Selector */}
          <div className="sm:hidden border-t border-slate-100 mt-5 pt-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 font-bold text-sm shadow-xs transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                  <Menu size={18} />
                </div>
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-teal-600 block leading-none">
                    Menu de Opções
                  </span>
                  <span className="text-sm font-extrabold text-slate-900">
                    {TABS.find((t) => t.id === activeTab)?.label}
                  </span>
                </div>
              </div>
              <ChevronDown
                size={18}
                className={`text-teal-700 transition duration-200 ${isMobileMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Mobile Dropdown List */}
            {isMobileMenuOpen && (
              <div className="mt-2 p-2 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                {TABS.map((t) => {
                  const Icon = t.icon;
                  const isActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(t.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition text-left ${
                        isActive
                          ? 'bg-teal-600 text-white font-extrabold shadow-xs'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-teal-700'
                          }`}
                        >
                          <Icon size={16} />
                        </div>
                        <div>
                          <div className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-900'}`}>
                            {t.label}
                          </div>
                          <div className={`text-[10px] ${isActive ? 'text-teal-100' : 'text-slate-400'}`}>
                            {t.desc}
                          </div>
                        </div>
                      </div>
                      {isActive && <Check size={16} className="stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="hidden sm:flex items-center gap-2 border-t border-slate-100 mt-6 pt-4 overflow-x-auto pb-1 scrollbar-none">
            {TABS.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon size={15} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Visão Geral & Prévia */}
        {activeTab === 'geral' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Card de Apresentação */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                  <Star size={18} className="text-teal-600" />
                  Como os clientes vêem seu anúncio
                </h3>

                <div className="border border-slate-200 rounded-2xl p-5 bg-gradient-to-br from-white to-slate-50/50 shadow-sm">
                  <div className="flex items-start gap-4">
                    <Image
                      src={formData.avatar || pro.avatar}
                      alt={formData.name || pro.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                      unoptimized
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-slate-900 text-base">{formData.name || pro.name}</h4>
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                          ⭐ {pro.rating?.toFixed(1) || '5.0'}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-teal-700">{formData.headline || pro.headline}</p>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">{formData.bio || pro.bio}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-slate-100">
                    {(formData.tags || pro.tags || []).map((t, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                    <span className="text-xs font-extrabold text-slate-800">
                      {formData.priceEstimate || pro.priceEstimate}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-600 text-white px-3 py-1.5 rounded-xl shadow-xs">
                      Solicitar Orçamento no WhatsApp
                    </span>
                  </div>
                </div>
              </div>

              {/* Dicas para atrair mais clientes */}
              <div className="bg-teal-50/80 rounded-3xl p-6 border border-teal-100">
                <h4 className="font-bold text-teal-900 text-sm mb-2 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-teal-700" />
                  Dicas para aumentar seus orçamentos:
                </h4>
                <ul className="text-xs text-teal-800 space-y-1.5 list-disc list-inside">
                  <li>Mantenha fotos nítidas dos serviços já realizados na aba <strong>Fotos & Portfólio</strong>.</li>
                  <li>Especifique claramente suas <strong>Regiões de Atendimento</strong> para não perder clientes próximos.</li>
                  <li>Destaque diferenciais como <em>"Orçamento sem compromisso"</em> ou <em>"Aceita Pix"</em>.</li>
                </ul>
              </div>
            </div>

            {/* Quick Summary Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900">Resumo da Conta</h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Especialidade:</span>
                    <strong className="text-slate-800">{currentSub?.name || formData.subcategory}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Pilar:</span>
                    <strong className="text-slate-800 capitalize">{formData.category || pro.category}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Experiência:</span>
                    <strong className="text-slate-800">{formData.experienceYears || pro.experienceYears} anos</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Fotos no Portfólio:</span>
                    <strong className="text-slate-800">{(formData.portfolio || []).length} fotos</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('dados')}
                  className="w-full py-2.5 rounded-xl border border-teal-500 text-teal-700 bg-teal-50 hover:bg-teal-100 font-bold text-xs transition"
                >
                  Editar Dados Completos
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Dados Principais */}
        {activeTab === 'dados' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Dados Pessoais & Apresentação</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Atualize as informações visíveis aos clientes que buscam seu trabalho.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Nome */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Nome Completo ou Razão Social
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  WhatsApp para Contato Direto
                </label>
                <input
                  type="tel"
                  maxLength={15}
                  value={formatPhone(formData.phone || '')}
                  onChange={(e) => updateField('phone', formatPhone(e.target.value))}
                  placeholder="(00) 00000-0000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
                <p className="text-[11px] text-slate-400 mt-1">Apenas números. Formato: (00) 00000-0000</p>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  E-mail para Acesso ao Painel
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Usado para fazer login com telefone ou e-mail.</p>
              </div>

              {/* Nova Senha */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Alterar Senha de Acesso (opcional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Deixe em branco para manter a atual"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                    title={showNewPassword ? 'Ocultar senha' : 'Ver senha'}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Mínimo 6 dígitos caso queira alterar sua senha.</p>
              </div>

              {/* Headline */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Título / Headline Profissional
                </label>
                <input
                  type="text"
                  value={formData.headline || ''}
                  onChange={(e) => updateField('headline', e.target.value)}
                  placeholder="Ex: Eletricista Predial & Residencial com Certificação"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              {/* Experience Years */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Tempo de Experiência
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={1}
                    max={40}
                    value={formData.experienceYears || 5}
                    onChange={(e) => updateField('experienceYears', Number(e.target.value))}
                    className="flex-1 accent-teal-600"
                  />
                  <span className="w-20 text-center font-extrabold text-teal-700 text-sm bg-teal-50 rounded-xl px-2 py-2 border border-teal-200">
                    {formData.experienceYears || 5} anos
                  </span>
                </div>
              </div>

              {/* Valores / Estimativa de Preço */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Faixa de Preço / Forma de Cobrança
                </label>
                <input
                  type="text"
                  value={formData.priceEstimate || ''}
                  onChange={(e) => updateField('priceEstimate', e.target.value)}
                  placeholder="Ex: A partir de R$ 90/h ou Orçamento sem compromisso"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              {/* Bio */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Descrição Completa & Histórico de Atuação
                </label>
                <textarea
                  rows={4}
                  value={formData.bio || ''}
                  onChange={(e) => updateField('bio', e.target.value)}
                  placeholder="Descreva detalhadamente seus serviços, ferramentas utilizadas, diferenciais e experiência..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveAll}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-md shadow-teal-700/20 transition disabled:opacity-50"
              >
                {isSaving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
                <span>Salvar Dados</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Serviços & Regiões */}
        {activeTab === 'servicos' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Categorias de Serviços & Regiões</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Escolha o segmento em que você atua e as regiões onde pode atender clientes.
              </p>
            </div>

            {/* Pilar Principal */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Pilar Principal de Atuação
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'reparos', name: 'Reparos Rápidos', desc: 'Encanamento, elétrica, chaveiro, marido de aluguel' },
                  { id: 'reforma', name: 'Reforma & Obra', desc: 'Pedreiro, pintura, gesso, piscina, telhados' },
                  { id: 'montagem', name: 'Montagem & Móveis', desc: 'Montador, suporte de TV, marcenaria, cortinas' },
                ].map((pillar) => {
                  const isSelected = formData.category === pillar.id;
                  return (
                    <button
                      key={pillar.id}
                      type="button"
                      onClick={() => updateField('category', pillar.id as PillarId)}
                      className={`p-4 rounded-2xl border text-left transition ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/70 ring-2 ring-teal-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-extrabold text-sm text-slate-900 mb-1">{pillar.name}</div>
                      <div className="text-xs text-slate-500">{pillar.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Especialidade / Subcategoria */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Especialidade Principal
              </label>
              <select
                value={formData.subcategory || ''}
                onChange={(e) => updateField('subcategory', e.target.value)}
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

            {/* Regiões Atendidas */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Regiões Onde Você Atende (Selecione todas as que se aplicam)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {REGIONS_LIST.filter((r) => r !== 'Todas as Regiões').map((r) => {
                  const isChecked = (formData.regions || []).includes(r);
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => toggleRegion(r)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition text-left ${
                        isChecked
                          ? 'border-teal-500 bg-teal-50 text-teal-800'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition ${
                        isChecked ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check size={11} className="stroke-[3]" />}
                      </div>
                      <span className="truncate">{r}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveAll}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-md shadow-teal-700/20 transition disabled:opacity-50"
              >
                {isSaving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
                <span>Salvar Serviços</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Diferenciais & Tags */}
        {activeTab === 'tags' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Diferenciais & Habilidades (Tags)</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Essas tags aparecem em destaque no seu card de busca e aumentam a confiança dos clientes.
              </p>
            </div>

            {/* Active Tags */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Tags ativas no seu perfil ({(formData.tags || []).length}/8)
              </label>
              <div className="flex flex-wrap gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 min-h-[50px] items-center">
                {(formData.tags || []).length === 0 ? (
                  <span className="text-xs text-slate-400">Nenhum diferencial selecionado ainda.</span>
                ) : (
                  (formData.tags || []).map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 bg-teal-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xs"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => toggleTag(t)}
                        className="hover:text-teal-200 transition"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Sugestões rápidas de diferenciais:
              </label>
              <div className="flex flex-wrap gap-2">
                {TAG_SUGGESTIONS.filter((s) => !(formData.tags || []).includes(s)).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    disabled={(formData.tags || []).length >= 8}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700 transition disabled:opacity-40"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Tag Input */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Criar diferencial personalizado
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomTag();
                    }
                  }}
                  placeholder="Ex: Instalação de Tubulação de Cobre"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
                <button
                  type="button"
                  onClick={handleAddCustomTag}
                  disabled={(formData.tags || []).length >= 8 || !customTag.trim()}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition disabled:opacity-50"
                >
                  Adicionar
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveAll}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-md shadow-teal-700/20 transition disabled:opacity-50"
              >
                {isSaving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
                <span>Salvar Diferenciais</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 5: Fotos & Portfólio (AWS S3) */}
        {activeTab === 'fotos' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Fotos & Portfólio no S3 Standard</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Faça upload de fotos reais de seus trabalhos para transmitir credibilidade imediata.
              </p>
            </div>

            {/* Avatar Section */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-sm font-extrabold text-slate-800 mb-3">Foto de Perfil (Avatar)</h4>
              <div className="flex items-center gap-5 flex-wrap">
                <div className="relative">
                  <Image
                    src={formData.avatar || pro.avatar}
                    alt={formData.name || pro.name}
                    width={90}
                    height={90}
                    className="w-22 h-22 rounded-2xl object-cover border-2 border-white shadow-md bg-white"
                    unoptimized
                  />
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-slate-900/50 rounded-2xl flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-teal-500 hover:text-teal-700 text-slate-700 font-bold text-xs sm:text-sm shadow-xs transition disabled:opacity-50"
                  >
                    <Camera size={16} />
                    {isUploadingAvatar ? 'Enviando para o S3...' : 'Fazer Upload de Nova Foto'}
                  </button>
                  <p className="text-[11px] text-slate-400">
                    Formatos aceitos: JPG, PNG, WEBP (máx. 2 MB). Armazenamento em nuvem AWS S3.
                  </p>
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Portfolio Gallery Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800">
                    Galeria de Trabalhos Realizados
                  </h4>
                  <p className="text-xs text-slate-500">
                    {(formData.portfolio || []).length} de {MAX_PORTFOLIO_PHOTOS} fotos enviadas (máx. 5 MB por foto)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => portfolioInputRef.current?.click()}
                  disabled={isUploadingPortfolio || (formData.portfolio || []).length >= MAX_PORTFOLIO_PHOTOS}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-xs transition disabled:opacity-50"
                >
                  <Plus size={16} />
                  <span>Adicionar Foto</span>
                </button>
              </div>

              {/* Title input for next photo */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={portfolioTitle}
                  onChange={(e) => setPortfolioTitle(e.target.value)}
                  placeholder="Legenda da próxima foto (ex: Reforma completa de banheiro, 2024)"
                  disabled={isUploadingPortfolio || (formData.portfolio || []).length >= MAX_PORTFOLIO_PHOTOS}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm outline-none focus:border-teal-500 disabled:bg-slate-100 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => portfolioInputRef.current?.click()}
                  disabled={isUploadingPortfolio || (formData.portfolio || []).length >= MAX_PORTFOLIO_PHOTOS}
                  className="px-4 py-2.5 rounded-xl border border-teal-500 bg-teal-50 text-teal-700 font-bold text-xs transition hover:bg-teal-100 disabled:opacity-50"
                >
                  {isUploadingPortfolio ? 'Enviando...' : 'Escolher Imagem'}
                </button>
              </div>
              <input
                ref={portfolioInputRef}
                type="file"
                accept="image/*"
                onChange={handlePortfolioUpload}
                className="hidden"
              />

              {/* Photos Grid */}
              {(formData.portfolio || []).length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                  <ImageIcon size={36} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-semibold text-slate-500">
                    Você ainda não adicionou fotos ao seu portfólio.
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Trabalhos com fotos recebem até 3x mais contatos no WhatsApp.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {(formData.portfolio || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="group relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm aspect-square bg-slate-100"
                    >
                      <Image
                        src={item.url}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent opacity-90 group-hover:opacity-100 transition flex flex-col justify-between p-2.5">
                        <button
                          type="button"
                          onClick={() => removePortfolioItem(idx)}
                          className="self-end w-7 h-7 rounded-full bg-rose-600/90 hover:bg-rose-600 text-white flex items-center justify-center transition shadow-md"
                          title="Remover foto"
                        >
                          <X size={14} />
                        </button>
                        <p className="text-[11px] text-white font-bold truncate leading-tight">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveAll}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-md shadow-teal-700/20 transition disabled:opacity-50"
              >
                {isSaving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
                <span>Salvar Fotos</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Save Reminder if unsaved changes */}
      <div className="sticky bottom-4 mx-auto max-w-6xl w-full px-4 sm:px-6 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur text-white px-5 py-3 rounded-2xl shadow-xl flex items-center justify-between pointer-events-auto border border-slate-700">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span>Edições feitas em tempo real. Lembre-se de salvar antes de sair.</span>
          </div>
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs transition flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSaving ? <span className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /> : <Save size={13} />}
            <span>Salvar Tudo</span>
          </button>
        </div>
      </div>

      {toastMessage && <Toast message={toastMessage} type={toastType} />}
    </div>
  );
}
