'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { Professional } from '@/data/types';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pro, setPro] = useState<Professional | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError('Nenhum código ou token de verificação foi fornecido.');
      return;
    }

    async function verify() {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token!)}`);
        const json = await res.json();

        if (res.ok && json.success) {
          setSuccess(true);
          setPro(json.data);

          // Update active session if this professional is currently logged in
          try {
            const stored = localStorage.getItem('servico_indicado_pro_session');
            if (stored) {
              const current = JSON.parse(stored);
              if (current.id === json.data.id) {
                localStorage.setItem('servico_indicado_pro_session', JSON.stringify(json.data));
              }
            }
          } catch (e) {
            console.warn('Erro ao sincronizar sessão:', e);
          }
        } else {
          setError(json.error || 'Não foi possível validar este e-mail.');
        }
      } catch {
        setError('Erro de conexão ao tentar validar seu e-mail.');
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-teal-50/20 to-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl overflow-hidden">
            <Image src="/icon.png" alt="Serviço Indicado" width={36} height={36} unoptimized />
          </div>
          <span className="font-extrabold text-slate-900 text-lg">
            Serviço<span className="text-teal-600">Indicado</span>
          </span>
        </Link>
        <Link
          href="/painel"
          className="text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl border border-teal-200 transition"
        >
          Painel do Prestador
        </Link>
      </header>

      {/* Main Container */}
      <main className="max-w-md w-full mx-auto px-4 py-12 flex-1 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl w-full text-center animate-in zoom-in-95 duration-200">
          {loading && (
            <div className="py-8 space-y-4">
              <div className="w-12 h-12 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <h2 className="text-lg font-extrabold text-slate-800">
                Validando seu e-mail...
              </h2>
              <p className="text-xs text-slate-500">
                Aguarde um instante enquanto confirmamos seu endereço com o serviço AWS.
              </p>
            </div>
          )}

          {!loading && success && (
            <div className="py-4 space-y-5">
              <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={44} className="stroke-[2.5]" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold border border-emerald-200 mb-2">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  E-mail Verificado com Sucesso!
                </span>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Tudo pronto{pro?.name ? `, ${pro.name}` : ''}!
                </h1>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Seu endereço de e-mail foi autenticado. O selo de verificação oficial já está visível no seu anúncio e no seu painel.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Mail size={14} className="text-teal-600" />
                  <span>{pro?.email || 'E-mail autenticado'}</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Seus clientes agora contam com mais uma garantia de confiança e identidade no Serviço Indicado.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/painel"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-lg shadow-teal-700/20 transition"
                >
                  <span>Ir para o Meu Painel</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}

          {!loading && !success && (
            <div className="py-4 space-y-5">
              <div className="w-20 h-20 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
                <AlertCircle size={44} />
              </div>

              <div>
                <h1 className="text-xl font-black text-slate-900">
                  Falha na Verificação
                </h1>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {error || 'O link de verificação pode ter expirado ou é inválido.'}
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/painel"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm transition"
                >
                  <span>Acessar Meu Painel</span>
                </Link>
                <Link
                  href="/"
                  className="text-xs font-bold text-slate-500 hover:text-slate-700 py-1"
                >
                  Voltar para a Página Inicial
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
        &copy; {new Date().getFullYear()} Serviço Indicado &bull; Profissionais de Confiança
      </footer>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
