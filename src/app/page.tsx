'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { CATEGORIES_DATA, REGIONS_LIST } from '@/data/categories';
import { INITIAL_PROFESSIONALS } from '@/data/professionals';
import { Professional, PillarId } from '@/data/types';

// Layout
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';

// Home sections
import { HeroSection } from '@/components/home/HeroSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { ProsSection } from '@/components/home/ProsSection';
import { TrustSection } from '@/components/home/TrustSection';
import { CtaBanner } from '@/components/home/CtaBanner';

// Modals & UI
import { ProProfileModal } from '@/components/modals/ProProfileModal';
import { RegisterModal } from '@/components/modals/RegisterModal';
import { ProfileWizard } from '@/components/modals/ProfileWizard';
import { Toast } from '@/components/ui/Toast';

export default function HomePage() {
  // ---------------------------------------------------------------
  // State
  // ---------------------------------------------------------------
  const [selectedPillar, setSelectedPillar] = useState<PillarId | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('Todas as Regiões');
  const [viewMode, setViewMode] = useState<'all' | 'favorites'>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [professionals, setProfessionals] = useState<Professional[]>(INITIAL_PROFESSIONALS);

  // Modals
  const [selectedProForModal, setSelectedProForModal] = useState<Professional | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [wizardPro, setWizardPro] = useState<Professional | null>(null);
  const [bannerVisible, setBannerVisible] = useState<boolean>(true);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'normal' | 'success'>('normal');

  // Register form
  const [regForm, setRegForm] = useState({
    name: '',
    phone: '',
    region: 'Zona Sul',
    subcategory: 'encanamento',
    bio: '',
  });

  // ---------------------------------------------------------------
  // Backend API & LocalStorage Sync
  // ---------------------------------------------------------------
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem('servico_indicado_favs');
      if (savedFavs) setFavorites(new Set(JSON.parse(savedFavs)));
    } catch (e) {
      console.warn('Erro ao carregar favoritos:', e);
    }

    async function loadProsFromApi() {
      try {
        const res = await fetch('/api/profissionais');
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data)) setProfessionals(json.data);
        }
      } catch (err) {
        console.warn('Aviso: usando dados locais de fallback:', err);
      }
    }

    loadProsFromApi();
  }, []);

  // ---------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------
  const triggerToast = (msg: string, type: 'normal' | 'success' = 'normal') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newFavs = new Set(favorites);
    const pro = professionals.find((p) => p.id === id);
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

  const clearAllFilters = () => {
    setSelectedPillar(null);
    setSelectedSubcategory(null);
    setSearchQuery('');
    setSelectedRegion('Todas as Regiões');
    setViewMode('all');
  };

  const scrollToPros = () => {
    const prosSection = document.getElementById('pros-section');
    if (prosSection) {
      const headerOffset = 90;
      const elementPosition = prosSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  // ---------------------------------------------------------------
  // Filtering Logic
  // ---------------------------------------------------------------
  const filteredProfessionals = useMemo(() => {
    return professionals.filter((pro) => {
      if (viewMode === 'favorites' && !favorites.has(pro.id)) return false;
      if (selectedPillar && pro.category !== selectedPillar) return false;
      if (selectedSubcategory && pro.subcategory !== selectedSubcategory) return false;
      if (selectedRegion !== 'Todas as Regiões' && !pro.regions.includes(selectedRegion)) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          pro.name.toLowerCase().includes(q) ||
          pro.headline.toLowerCase().includes(q) ||
          pro.bio.toLowerCase().includes(q) ||
          pro.tags.some((t) => t.toLowerCase().includes(q)) ||
          pro.subcategory.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [professionals, viewMode, favorites, selectedPillar, selectedSubcategory, selectedRegion, searchQuery]);

  // ---------------------------------------------------------------
  // Register Form Submit
  // ---------------------------------------------------------------
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name.trim() || !regForm.phone.trim()) return;

    let pillar: PillarId = 'reparos';
    if (['pedreiro', 'pintura', 'gesso', 'piscina', 'telhado', 'serralheria'].includes(regForm.subcategory)) {
      pillar = 'reforma';
    } else if (['montagem', 'suporte_tv', 'marcenaria', 'cortinas'].includes(regForm.subcategory)) {
      pillar = 'montagem';
    }

    const subcategoryData = CATEGORIES_DATA[pillar]?.subcategories.find((s) => s.id === regForm.subcategory);

    const payload = {
      name: regForm.name.trim(),
      headline: subcategoryData ? `${subcategoryData.name} Profissional` : 'Prestador Especialista',
      category: pillar,
      subcategory: regForm.subcategory,
      regions: [regForm.region],
      phone: regForm.phone.replace(/\D/g, '') || '11999998888',
      priceEstimate: 'Orçamento sem compromisso',
      experienceYears: 5,
      tags: [subcategoryData?.name || 'Especialista', 'Novo Indicado', 'Atendimento Rápido'],
      bio: regForm.bio.trim() || 'Profissional dedicado com foco em qualidade e pontualidade na execução do serviço.',
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
        setProfessionals((prev) => [created, ...prev]);
        setWizardPro(created);
        try {
          localStorage.setItem('servico_indicado_my_pro', JSON.stringify(created));
        } catch (e) {
          console.warn('Erro ao salvar no localStorage:', e);
        }
        triggerToast(`🎉 Cadastro inicial realizado! Vamos personalizar seu perfil.`, 'success');
      } else {
        triggerToast('Erro ao cadastrar profissional.', 'normal');
      }
    } catch (err) {
      console.error('Erro na requisição ao backend:', err);
      triggerToast('Erro de conexão com o servidor.', 'normal');
    }

    setRegForm({ name: '', phone: '', region: 'Zona Sul', subcategory: 'encanamento', bio: '' });
    setIsRegisterModalOpen(false);
    clearAllFilters();
  };

  const handleWizardComplete = (updated: Professional) => {
    setProfessionals((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setWizardPro(null);
    try {
      localStorage.setItem('servico_indicado_my_pro', JSON.stringify(updated));
    } catch (e) {
      console.warn('Erro ao atualizar no localStorage:', e);
    }
    triggerToast(`🚀 Perfil completo de ${updated.name} publicado com sucesso!`, 'success');
  };

  // ---------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------
  return (
    <div className="flex flex-col min-h-screen">

      {/* Announcement Bar */}
      {bannerVisible && <AnnouncementBar onClose={() => setBannerVisible(false)} />}

      {/* Header */}
      <AppHeader
        favoritesCount={favorites.size}
        viewMode={viewMode}
        onLogoClick={clearAllFilters}
        onCategoriesClick={() =>
          document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' })
        }
        onFavoritesClick={() => {
          setViewMode(viewMode === 'favorites' ? 'all' : 'favorites');
          scrollToPros();
        }}
        onRegisterClick={() => setIsRegisterModalOpen(true)}
      />

      <main className="flex-1">

        {/* Hero */}
        <HeroSection
          searchQuery={searchQuery}
          selectedRegion={selectedRegion}
          onSearchChange={setSearchQuery}
          onRegionChange={setSelectedRegion}
          onSearch={scrollToPros}
        />

        {/* Categories Drill-Down */}
        <CategoriesSection
          selectedPillar={selectedPillar}
          selectedSubcategory={selectedSubcategory}
          professionals={professionals}
          onPillarSelect={setSelectedPillar}
          onSubcategorySelect={setSelectedSubcategory}
        />

        {/* Professionals Grid */}
        <ProsSection
          filteredProfessionals={filteredProfessionals}
          favorites={favorites}
          viewMode={viewMode}
          selectedPillar={selectedPillar}
          selectedSubcategory={selectedSubcategory}
          selectedRegion={selectedRegion}
          searchQuery={searchQuery}
          onToggleFavorite={toggleFavorite}
          onViewProfile={setSelectedProForModal}
          onViewModeChange={setViewMode}
          onClearPillar={() => { setSelectedPillar(null); setSelectedSubcategory(null); }}
          onClearSubcategory={() => setSelectedSubcategory(null)}
          onClearRegion={() => setSelectedRegion('Todas as Regiões')}
          onClearSearch={() => setSearchQuery('')}
          onClearAll={clearAllFilters}
        />

        {/* Trust & Differentiators */}
        <TrustSection />

        {/* Provider CTA */}
        <CtaBanner onRegisterClick={() => setIsRegisterModalOpen(true)} />

      </main>

      {/* Footer */}
      <AppFooter
        onPillarSubcategorySelect={(pillar, subcategory) => {
          setSelectedPillar(pillar);
          setSelectedSubcategory(subcategory);
          scrollToPros();
        }}
        onRegisterClick={() => setIsRegisterModalOpen(true)}
      />

      {/* Professional Profile Modal */}
      {selectedProForModal && (
        <ProProfileModal
          professional={selectedProForModal}
          onClose={() => setSelectedProForModal(null)}
          onCopyPhone={(phone) => {
            navigator.clipboard.writeText(phone);
            triggerToast('Telefone copiado para a área de transferência!', 'success');
          }}
        />
      )}

      {/* Register Modal */}
      {isRegisterModalOpen && (
        <RegisterModal
          formState={regForm}
          onFormChange={(field, value) =>
            setRegForm((prev) => ({ ...prev, [field]: value }))
          }
          onSubmit={handleRegisterSubmit}
          onClose={() => setIsRegisterModalOpen(false)}
        />
      )}

      {/* Profile Wizard Modal (completes profile after fast signup) */}
      {wizardPro && (
        <ProfileWizard
          professional={wizardPro}
          onComplete={handleWizardComplete}
          onClose={() => setWizardPro(null)}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && <Toast message={toastMessage} type={toastType} />}
    </div>
  );
}
