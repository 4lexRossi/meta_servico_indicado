'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { 
  ShieldCheck, 
  Search, 
  MapPin, 
  Star, 
  Heart, 
  X, 
  ChevronRight, 
  Wrench, 
  Hammer, 
  Layers, 
  UserPlus, 
  PhoneCall, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Award, 
  ThumbsUp,
  MessageCircle,
  Copy,
  ChevronLeft
} from 'lucide-react';
import { CATEGORIES_DATA, REGIONS_LIST } from '@/data/categories';
import { INITIAL_PROFESSIONALS } from '@/data/professionals';
import { Professional, PillarId } from '@/data/types';

export default function HomePage() {
  // -------------------------------------------------------------
  // State
  // -------------------------------------------------------------
  const [selectedPillar, setSelectedPillar] = useState<PillarId | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('Todas as Regiões');
  const [viewMode, setViewMode] = useState<'all' | 'favorites'>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [professionals, setProfessionals] = useState<Professional[]>(INITIAL_PROFESSIONALS);
  
  // Modals state
  const [selectedProForModal, setSelectedProForModal] = useState<Professional | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [bannerVisible, setBannerVisible] = useState<boolean>(true);
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'normal' | 'success'>('normal');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRegion, setRegRegion] = useState('Zona Sul');
  const [regSubcategory, setRegSubcategory] = useState('encanamento');
  const [regBio, setRegBio] = useState('');

  // -------------------------------------------------------------
  // Backend API Data Fetching & LocalStorage Sync
  // -------------------------------------------------------------
  useEffect(() => {
    // 1. Sync saved favorites
    try {
      const savedFavs = localStorage.getItem('servico_indicado_favs');
      if (savedFavs) {
        setFavorites(new Set(JSON.parse(savedFavs)));
      }
    } catch (e) {
      console.warn('Erro ao carregar favoritos:', e);
    }

    // 2. Fetch from Next.js Backend API
    async function loadProsFromApi() {
      try {
        const res = await fetch('/api/profissionais');
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data)) {
            setProfessionals(json.data);
          }
        }
      } catch (err) {
        console.warn('Aviso: usando dados locais de fallback:', err);
      }
    }

    loadProsFromApi();
  }, []);

  const triggerToast = (msg: string, type: 'normal' | 'success' = 'normal') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newFavs = new Set(favorites);
    const pro = professionals.find(p => p.id === id);

    if (newFavs.has(id)) {
      newFavs.delete(id);
      triggerToast(`${pro?.name || 'Profissional'} removido dos salvos.`);
    } else {
      newFavs.add(id);
      triggerToast(`⭐ ${pro?.name || 'Profissional'} salvo nos seus favoritos!`, 'success');
    }
    setFavorites(newFavs);
    localStorage.setItem('servico_indicado_favs', JSON.stringify(Array.from(newFavs)));
  };

  // -------------------------------------------------------------
  // Filtering Logic
  // -------------------------------------------------------------
  const filteredProfessionals = useMemo(() => {
    return professionals.filter(pro => {
      // Favorites filter
      if (viewMode === 'favorites' && !favorites.has(pro.id)) {
        return false;
      }
      // Pillar filter
      if (selectedPillar && pro.category !== selectedPillar) {
        return false;
      }
      // Subcategory filter
      if (selectedSubcategory && pro.subcategory !== selectedSubcategory) {
        return false;
      }
      // Region filter
      if (selectedRegion !== 'Todas as Regiões' && !pro.regions.includes(selectedRegion)) {
        return false;
      }
      // Search text query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchName = pro.name.toLowerCase().includes(q);
        const matchHeadline = pro.headline.toLowerCase().includes(q);
        const matchBio = pro.bio.toLowerCase().includes(q);
        const matchTags = pro.tags.some(t => t.toLowerCase().includes(q));
        const matchSub = pro.subcategory.toLowerCase().includes(q);
        if (!matchName && !matchHeadline && !matchBio && !matchTags && !matchSub) {
          return false;
        }
      }
      return true;
    });
  }, [professionals, viewMode, favorites, selectedPillar, selectedSubcategory, selectedRegion, searchQuery]);

  // Handle Pro Registration via Backend API
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) return;

    let pillar: PillarId = 'reparos';
    if (['pedreiro', 'pintura', 'gesso', 'piscina', 'telhado', 'serralheria'].includes(regSubcategory)) {
      pillar = 'reforma';
    } else if (['montagem', 'suporte_tv', 'marcenaria', 'cortinas'].includes(regSubcategory)) {
      pillar = 'montagem';
    }

    const subcategoryData = CATEGORIES_DATA[pillar]?.subcategories.find(s => s.id === regSubcategory);

    const payload = {
      name: regName.trim(),
      headline: subcategoryData ? `${subcategoryData.name} Profissional` : 'Prestador Especialista',
      category: pillar,
      subcategory: regSubcategory,
      regions: [regRegion],
      phone: regPhone.replace(/\D/g, '') || '11999998888',
      priceEstimate: 'Orçamento sem compromisso',
      experienceYears: 5,
      tags: [subcategoryData?.name || 'Especialista', 'Novo Indicado', 'Atendimento Rápido'],
      bio: regBio.trim() || 'Profissional dedicado com foco em qualidade e pontualidade na execução do serviço.',
    };

    try {
      const res = await fetch('/api/profissionais', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        const created = json.data;
        setProfessionals(prev => [created, ...prev]);
        triggerToast(`🎉 Parabéns, ${created.name}! Cadastro realizado com sucesso no back-end!`, 'success');
      } else {
        triggerToast('Erro ao cadastrar profissional.', 'normal');
      }
    } catch (err) {
      console.error('Erro na requisição ao backend:', err);
      triggerToast('Erro de conexão com o servidor.', 'normal');
    }

    // Reset and close
    setRegName('');
    setRegPhone('');
    setRegBio('');
    setIsRegisterModalOpen(false);
    setSelectedPillar(null);
    setSelectedSubcategory(null);
    setSearchQuery('');
    setSelectedRegion('Todas as Regiões');
    setViewMode('all');
  };

  const clearAllFilters = () => {
    setSelectedPillar(null);
    setSelectedSubcategory(null);
    setSearchQuery('');
    setSelectedRegion('Todas as Regiões');
    setViewMode('all');
  };

  // -------------------------------------------------------------
  // Render JSX
  // -------------------------------------------------------------
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Top Announcement Bar */}
      {bannerVisible && (
        <aside className="bg-gradient-to-r from-teal-800 via-teal-600 to-blue-600 text-white text-xs md:text-sm py-2 px-4 relative z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-center">
            <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[11px]">
              100% Gratuito
            </span>
            <p className="font-medium">
              Todos os profissionais passam por verificação de antecedentes e avaliações autênticas. Contato direto sem intermediários!
            </p>
            <button 
              onClick={() => setBannerVisible(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition"
              aria-label="Fechar aviso"
            >
              <X size={16} />
            </button>
          </div>
        </aside>
      )}

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          
          {/* Logo */}
          <button 
            onClick={clearAllFilters}
            className="flex items-center gap-3 text-left group transition"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-teal-800 text-white flex items-center justify-center shadow-md shadow-teal-700/20 group-hover:scale-105 transition">
              <ShieldCheck size={22} className="stroke-[2.3]" />
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Serviço<span className="text-teal-600">Indicado</span>
              </div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                Profissionais de Confiança
              </div>
            </div>
          </button>

          {/* Quick Nav */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-slate-700 hover:text-teal-700 hover:bg-slate-100 font-semibold text-sm transition"
            >
              <Layers size={17} className="text-slate-500" />
              <span>Categorias</span>
            </button>

            <button
              onClick={() => {
                setViewMode(viewMode === 'favorites' ? 'all' : 'favorites');
                document.getElementById('pros-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full font-semibold text-sm transition ${
                viewMode === 'favorites' 
                  ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                  : 'text-slate-700 hover:text-teal-700 hover:bg-slate-100'
              }`}
            >
              <Heart size={17} className={favorites.size > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-500'} />
              <span className="hidden xs:inline">Salvos</span>
              <span className="bg-rose-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                {favorites.size}
              </span>
            </button>

            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-1.5 border-teal-600 text-teal-700 hover:bg-teal-600 hover:text-white font-bold text-xs sm:text-sm bg-teal-50/60 shadow-xs transition"
            >
              <UserPlus size={16} />
              <span>Sou Profissional</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        
        {/* Hero Section */}
        <section className="relative pt-10 pb-12 bg-radial from-teal-100/50 via-slate-50 to-slate-50 border-b border-slate-200/60 overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 text-center">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-teal-200 shadow-xs px-3.5 py-1 rounded-full text-xs font-bold text-teal-800 mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Mais de 450+ prestadores indicados e avaliados no Brasil</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
              O jeito seguro de contratar para a sua casa.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              De pequenos reparos e reformas completas à montagem de móveis: conecte-se com profissionais recomendados diretamente no WhatsApp, sem taxas ou comissões abusivas.
            </p>

            {/* Search Box Card */}
            <div className="bg-white p-2 sm:p-2.5 rounded-2xl sm:rounded-full shadow-xl shadow-slate-200/60 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-2 max-w-3xl mx-auto transition focus-within:ring-3 focus-within:ring-teal-500/20 focus-within:border-teal-500">
              
              {/* Keyword Input */}
              <div className="flex-1 flex items-center w-full px-3.5 py-2">
                <Search size={20} className="text-slate-400 mr-2.5 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ex: encanador, pintura, montador, Carlos..."
                  className="w-full bg-transparent text-slate-800 text-sm sm:text-base outline-none placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="hidden sm:block w-px h-8 bg-slate-200"></div>

              {/* Region Select */}
              <div className="flex items-center w-full sm:w-auto px-3.5 py-2">
                <MapPin size={20} className="text-slate-400 mr-2 shrink-0" />
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-transparent text-slate-700 text-sm font-semibold outline-none cursor-pointer w-full"
                >
                  {REGIONS_LIST.map((reg) => (
                    <option key={reg} value={reg}>{reg}</option>
                  ))}
                </select>
              </div>

              {/* Submit Search Button */}
              <button
                onClick={() => {
                  document.getElementById('pros-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-700/20 transition shrink-0"
              >
                <span>Buscar</span>
                <ChevronRight size={17} />
              </button>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex items-center justify-center flex-wrap gap-2 mt-5 text-xs text-slate-500 font-medium">
              <span className="font-semibold text-slate-600">Mais buscados:</span>
              {[
                { label: '🔧 Troca de Torneira', term: 'encanamento' },
                { label: '⚡ Chuveiro 220V', term: 'chuveiro' },
                { label: '🪑 Montador de Guarda-Roupa', term: 'montador' },
                { label: '🎨 Pintura de Parede', term: 'pintura' },
                { label: '🔑 Fechadura Digital', term: 'fechadura' }
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => {
                    setSearchQuery(item.term);
                    document.getElementById('pros-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-white border border-slate-200 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700 px-3 py-1 rounded-full text-slate-700 font-medium transition"
                >
                  {item.label}
                </button>
              ))}
            </div>

          </div>
        </section>

        {/* Hierarchical Categories Section (Drill-Down) */}
        <section id="categories-section" className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            
            {/* Header & Breadcrumb */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-2">
                  <button 
                    onClick={() => {
                      setSelectedPillar(null);
                      setSelectedSubcategory(null);
                    }}
                    className={`hover:text-teal-600 ${!selectedPillar ? 'text-teal-700 font-bold' : 'underline'}`}
                  >
                    Todas as Categorias
                  </button>
                  {selectedPillar && (
                    <>
                      <span>/</span>
                      <button 
                        onClick={() => setSelectedSubcategory(null)}
                        className={`hover:text-teal-600 ${!selectedSubcategory ? 'text-teal-700 font-bold' : 'underline'}`}
                      >
                        {CATEGORIES_DATA[selectedPillar].name}
                      </button>
                    </>
                  )}
                  {selectedSubcategory && (
                    <>
                      <span>/</span>
                      <span className="text-teal-700 font-bold">
                        {CATEGORIES_DATA[selectedPillar!]?.subcategories.find(s => s.id === selectedSubcategory)?.name}
                      </span>
                    </>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Qual serviço você precisa hoje?
                </h2>
                <p className="text-sm sm:text-base text-slate-600 mt-1">
                  Selecione um dos 3 pilares principais para abrir as especialidades atendidas.
                </p>
              </div>

              {(selectedPillar || selectedSubcategory) && (
                <button
                  onClick={() => {
                    setSelectedPillar(null);
                    setSelectedSubcategory(null);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3.5 py-1.5 rounded-full transition self-start md:self-auto"
                >
                  <ChevronLeft size={16} />
                  <span>Voltar para Todos os Pilares</span>
                </button>
              )}
            </div>

            {/* Level 1: The 3 Main Category Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Reparos Rápidos */}
              <div 
                onClick={() => {
                  setSelectedPillar(selectedPillar === 'reparos' ? null : 'reparos');
                  setSelectedSubcategory(null);
                }}
                className={`group cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  selectedPillar === 'reparos'
                    ? 'border-blue-600 bg-blue-50/40 shadow-xl shadow-blue-500/10'
                    : 'border-slate-200 bg-white hover:border-blue-400 hover:shadow-lg'
                }`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition"></div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-105 transition">
                      <Wrench size={26} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-full">
                      Emergências
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition">
                    Reparos Rápidos
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Serviços pontuais e manutenções urgentes: encanadores, eletricistas, chaveiros e marido de aluguel.
                  </p>
                  <div className="text-xs font-semibold text-blue-700 bg-blue-50 py-1 px-2.5 rounded-lg inline-block mb-4">
                    Encanamento • Elétrica • Chaveiro • Ar-condicionado
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-sm font-bold text-blue-600">
                  <span>Ver 5 especialidades</span>
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>

              {/* Card 2: Reforma & Construção */}
              <div 
                onClick={() => {
                  setSelectedPillar(selectedPillar === 'reforma' ? null : 'reforma');
                  setSelectedSubcategory(null);
                }}
                className={`group cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  selectedPillar === 'reforma'
                    ? 'border-amber-500 bg-amber-50/40 shadow-xl shadow-amber-500/10'
                    : 'border-slate-200 bg-white hover:border-amber-400 hover:shadow-lg'
                }`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:scale-150 transition"></div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:scale-105 transition">
                      <Hammer size={26} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-2.5 py-1 rounded-full">
                      Obras & Acabamentos
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-700 transition">
                    Reforma & Construção
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Profissionais qualificados para transformar o seu imóvel: pedreiros, pintores, gesseiros e mestres de obra.
                  </p>
                  <div className="text-xs font-semibold text-amber-800 bg-amber-50 py-1 px-2.5 rounded-lg inline-block mb-4">
                    Pedreiro • Pintura • Drywall • Piscinas & Telhados
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-sm font-bold text-amber-700">
                  <span>Ver 6 especialidades</span>
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>

              {/* Card 3: Montagem & Móveis */}
              <div 
                onClick={() => {
                  setSelectedPillar(selectedPillar === 'montagem' ? null : 'montagem');
                  setSelectedSubcategory(null);
                }}
                className={`group cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  selectedPillar === 'montagem'
                    ? 'border-emerald-600 bg-emerald-50/40 shadow-xl shadow-emerald-500/10'
                    : 'border-slate-200 bg-white hover:border-emerald-400 hover:shadow-lg'
                }`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition"></div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:scale-105 transition">
                      <Layers size={26} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                      Móveis & Utilidades
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition">
                    Montagem & Móveis
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Montagem precisa de móveis comprados na internet, suportes para Smart TVs, cortinas e marcenaria.
                  </p>
                  <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 py-1 px-2.5 rounded-lg inline-block mb-4">
                    Montador • Suporte de TV • Marcenaria • Cortinas
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-sm font-bold text-emerald-700">
                  <span>Ver 4 especialidades</span>
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>

            </div>

            {/* Level 2: Subcategories Grid (Drill-Down Panel) */}
            {selectedPillar && (
              <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-slate-50 border-2 border-teal-300 shadow-md animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                      Especialidades em {CATEGORIES_DATA[selectedPillar].name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Clique em um card abaixo para filtrar prestadores com foco nesta especialidade:
                    </p>
                  </div>
                  {selectedSubcategory && (
                    <button
                      onClick={() => setSelectedSubcategory(null)}
                      className="text-xs font-bold text-teal-700 hover:underline self-start sm:self-auto"
                    >
                      Limpar filtro de especialidade
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {CATEGORIES_DATA[selectedPillar].subcategories.map((sub) => {
                    const isSelected = selectedSubcategory === sub.id;
                    const proCount = professionals.filter(p => p.subcategory === sub.id).length;

                    return (
                      <div
                        key={sub.id}
                        onClick={() => {
                          setSelectedSubcategory(isSelected ? null : sub.id);
                        }}
                        className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                          isSelected
                            ? 'bg-teal-50 border-teal-600 shadow-md ring-2 ring-teal-600'
                            : 'bg-white border-slate-200 hover:border-teal-400 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{sub.emoji}</span>
                          <span className="text-[11px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                            {proCount} indicado{proCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">{sub.name}</h4>
                        <p className="text-xs text-slate-500 leading-snug">{sub.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </section>

        {/* Professionals Section */}
        <section id="pros-section" className="py-10 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            
            {/* Filter Chips & Counter Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
              
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {filteredProfessionals.length}
                  </span>
                  <span className="text-slate-600 font-medium">
                    profissional{filteredProfessionals.length !== 1 ? 'is' : ''} disponíve{filteredProfessionals.length !== 1 ? 'is' : 'l'}
                  </span>
                </div>

                {/* Active Filter Chips */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedPillar && (
                    <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-900 text-xs font-bold px-2.5 py-1 rounded-full">
                      Pilar: {CATEGORIES_DATA[selectedPillar].name}
                      <button onClick={() => { setSelectedPillar(null); setSelectedSubcategory(null); }}>
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {selectedSubcategory && (
                    <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-900 text-xs font-bold px-2.5 py-1 rounded-full">
                      Especialidade: {CATEGORIES_DATA[selectedPillar!]?.subcategories.find(s => s.id === selectedSubcategory)?.name}
                      <button onClick={() => setSelectedSubcategory(null)}>
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {selectedRegion !== 'Todas as Regiões' && (
                    <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-900 text-xs font-bold px-2.5 py-1 rounded-full">
                      Região: {selectedRegion}
                      <button onClick={() => setSelectedRegion('Todas as Regiões')}>
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-900 text-xs font-bold px-2.5 py-1 rounded-full">
                      Busca: &ldquo;{searchQuery}&rdquo;
                      <button onClick={() => setSearchQuery('')}>
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {viewMode === 'favorites' && (
                    <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-900 text-xs font-bold px-2.5 py-1 rounded-full">
                      Mostrando apenas Salvos
                      <button onClick={() => setViewMode('all')}>
                        <X size={14} />
                      </button>
                    </span>
                  )}
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-slate-200/80 p-1 rounded-full self-start sm:self-auto">
                <button
                  onClick={() => setViewMode('all')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                    viewMode === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setViewMode('favorites')}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition ${
                    viewMode === 'favorites'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Heart size={13} className={favorites.size > 0 ? 'text-rose-500 fill-rose-500' : ''} />
                  <span>Meus Salvos ({favorites.size})</span>
                </button>
              </div>

            </div>

            {/* Grid of Professionals */}
            {filteredProfessionals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProfessionals.map((pro) => {
                  const isFav = favorites.has(pro.id);
                  const waMessage = encodeURIComponent(
                    `Olá ${pro.name}! Vi seu perfil no Serviço Indicado e gostaria de solicitar um orçamento para ${pro.headline}. Você tem disponibilidade esta semana?`
                  );
                  const waLink = `https://wa.me/55${pro.phone}?text=${waMessage}`;

                  return (
                    <article
                      key={pro.id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between group"
                    >
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
                                onClick={(e) => toggleFavorite(pro.id, e)}
                                className={`p-1.5 rounded-full transition ${
                                  isFav 
                                    ? 'text-rose-500 bg-rose-50' 
                                    : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100'
                                }`}
                                aria-label="Favoritar"
                              >
                                <Heart size={18} className={isFav ? 'fill-rose-500' : ''} />
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
                          onClick={() => setSelectedProForModal(pro)}
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
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl border-2 border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <Search size={28} />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                  Nenhum profissional encontrado
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                  Tente remover alguns filtros ou buscar por outro termo ou região.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition"
                >
                  Limpar Todos os Filtros
                </button>
              </div>
            )}

          </div>
        </section>

        {/* Trust & Differentiators Section (Solving Brazilian Bottlenecks) */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            
            <div className="inline-block bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mb-3">
              Por que escolher o Serviço Indicado?
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto mb-4">
              Construído para resolver o que as plataformas tradicionais não resolvem
            </h2>

            <p className="text-slate-600 max-w-2xl mx-auto mb-12 text-sm sm:text-base leading-relaxed">
              Diferente de modelos onde o profissional paga créditos para abrir contato ou há comissões que encarecem a obra, conectamos você diretamente com total transparência.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-300 hover:shadow-lg transition">
                <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                  <ShieldCheck size={24} />
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-2">Verificação Rigorosa</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Conferência de documentos, antecedentes e histórico real antes do profissional ser recomendado na plataforma.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-300 hover:shadow-lg transition">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                  <MessageCircle size={24} />
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-2">WhatsApp Direto</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Sem intermediários ou mensagens perdidas. Combine datas, envie fotos e tire dúvidas direto no WhatsApp.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-300 hover:shadow-lg transition">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                  <Star size={24} />
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-2">Avaliações Autênticas</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Opiniões verificadas de moradores do seu próprio bairro que já contrataram o serviço e aprovaram o resultado.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-300 hover:shadow-lg transition">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                  <ThumbsUp size={24} />
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-2">Preço Justo & Sem Taxas</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  O prestador não precisa inflacionar o orçamento para cobrir taxas de aplicativo. Ganha o profissional, economiza o cliente.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* Provider CTA Banner */}
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
                onClick={() => setIsRegisterModalOpen(true)}
                className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-teal-500/20 transition"
              >
                <span>Cadastrar Meu Negócio Grátis</span>
                <ChevronRight size={18} />
              </button>
              <span className="text-xs text-slate-400">Leva menos de 2 minutos • Sem necessidade de cartão</span>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
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

          <div>
            <h4 className="font-extrabold text-slate-900 text-sm mb-3">Reparos Rápidos</h4>
            <ul className="text-xs space-y-2 text-slate-500">
              <li><button onClick={() => { setSelectedPillar('reparos'); setSelectedSubcategory('encanamento'); }} className="hover:text-teal-600">Encanadores</button></li>
              <li><button onClick={() => { setSelectedPillar('reparos'); setSelectedSubcategory('eletrica'); }} className="hover:text-teal-600">Eletricistas Residenciais</button></li>
              <li><button onClick={() => { setSelectedPillar('reparos'); setSelectedSubcategory('chaveiro'); }} className="hover:text-teal-600">Chaveiro 24h</button></li>
              <li><button onClick={() => { setSelectedPillar('reparos'); setSelectedSubcategory('marido_aluguel'); }} className="hover:text-teal-600">Marido de Aluguel</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-slate-900 text-sm mb-3">Reformas & Móveis</h4>
            <ul className="text-xs space-y-2 text-slate-500">
              <li><button onClick={() => { setSelectedPillar('reforma'); setSelectedSubcategory('pedreiro'); }} className="hover:text-teal-600">Pedreiros & Alvenaria</button></li>
              <li><button onClick={() => { setSelectedPillar('reforma'); setSelectedSubcategory('pintura'); }} className="hover:text-teal-600">Pintores Residenciais</button></li>
              <li><button onClick={() => { setSelectedPillar('montagem'); setSelectedSubcategory('montagem'); }} className="hover:text-teal-600">Montadores de Móveis</button></li>
              <li><button onClick={() => { setSelectedPillar('montagem'); setSelectedSubcategory('marcenaria'); }} className="hover:text-teal-600">Marcenaria Fina</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-slate-900 text-sm mb-3">Serviço Indicado</h4>
            <ul className="text-xs space-y-2 text-slate-500">
              <li><button onClick={() => setIsRegisterModalOpen(true)} className="hover:text-teal-600">Quero me Cadastrar</button></li>
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

      {/* ========================================================= */}
      {/* Interactive Detail Modal: Professional Profile */}
      {/* ========================================================= */}
      {selectedProForModal && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedProForModal(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProForModal(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur text-slate-700 hover:text-slate-900 flex items-center justify-center shadow-md transition"
              aria-label="Fechar"
            >
              <X size={18} />
            </button>

            {/* Modal Body Scroll */}
            <div className="overflow-y-auto flex-1">
              
              {/* Banner */}
              <div className="h-32 bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900"></div>

              {/* Profile Header */}
              <div className="px-6 pb-6 relative -mt-12 flex flex-col sm:flex-row items-start sm:items-end gap-4 border-b border-slate-100">
                <Image
                  src={selectedProForModal.avatar}
                  alt={selectedProForModal.name}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl bg-white"
                  unoptimized
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-extrabold text-slate-900">
                      {selectedProForModal.name}
                    </h3>
                    <span className="bg-teal-100 text-teal-800 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={12} className="stroke-[2.5]" />
                      Verificado
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-teal-700 mb-2">
                    {selectedProForModal.headline}
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                    <span className="font-bold flex items-center gap-1">
                      <Star size={13} className="fill-amber-400 text-amber-500" />
                      {selectedProForModal.rating.toFixed(1)} ({selectedProForModal.reviewsCount} opiniões)
                    </span>
                    <span>📍 {selectedProForModal.regions.join(', ')}</span>
                    <span>⏱️ {selectedProForModal.experienceYears} anos de experiência</span>
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
                    {selectedProForModal.badges.map(b => (
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
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {selectedProForModal.bio}
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Especialidades Atendidas
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProForModal.tags.map(t => (
                      <span key={t} className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Portfolio Gallery */}
                {selectedProForModal.portfolio && selectedProForModal.portfolio.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Fotos de Trabalhos Realizados
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedProForModal.portfolio.map((p, i) => (
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
                    {selectedProForModal.reviews.map((rev, idx) => (
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
                <span className="font-extrabold text-sm sm:text-base text-slate-900">
                  {selectedProForModal.priceEstimate}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedProForModal.phone);
                    triggerToast('Telefone copiado para a área de transferência!', 'success');
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Copy size={14} />
                  <span>Copiar Contato</span>
                </button>

                <a
                  href={`https://wa.me/55${selectedProForModal.phone}?text=${encodeURIComponent(
                    `Olá ${selectedProForModal.name}! Vi seu perfil completo no Serviço Indicado e gostaria de solicitar um orçamento para ${selectedProForModal.headline}.`
                  )}`}
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
      )}

      {/* ========================================================= */}
      {/* Modal: Cadastro de Novo Profissional */}
      {/* ========================================================= */}
      {isRegisterModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsRegisterModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsRegisterModalOpen(false)}
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

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nome Completo ou Razão Social
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Ex: Carlos Eduardo Silveira"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    WhatsApp com DDD
                  </label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Região Principal
                  </label>
                  <select
                    value={regRegion}
                    onChange={(e) => setRegRegion(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-teal-500 bg-white"
                  >
                    {REGIONS_LIST.filter(r => r !== 'Todas as Regiões').map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Especialidade Principal
                </label>
                <select
                  value={regSubcategory}
                  onChange={(e) => setRegSubcategory(e.target.value)}
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

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Resumo de Experiência & Atuação
                </label>
                <textarea
                  rows={3}
                  value={regBio}
                  onChange={(e) => setRegBio(e.target.value)}
                  placeholder="Ex: Trabalho com reformas e encanamento há 10 anos, atendo toda a Zona Sul com pontualidade..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                ></textarea>
              </div>

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
      )}

      {/* ========================================================= */}
      {/* Toast Notification */}
      {/* ========================================================= */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right duration-200">
          <div className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-bold border ${
            toastType === 'success'
              ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
              : 'bg-slate-900 text-slate-100 border-slate-700'
          }`}>
            <Sparkles size={18} className="text-teal-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

    </div>
  );
}
