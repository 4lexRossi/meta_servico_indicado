'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, CheckCircle2, Lock } from 'lucide-react';

interface CaptchaChallengeProps {
  onVerified: (data: { captchaToken: string; captchaAnswer: string }) => void;
  onReset?: () => void;
  error?: string | null;
}

export function CaptchaChallenge({ onVerified, onReset, error }: CaptchaChallengeProps) {
  const [question, setQuestion] = useState<string>('Carregando verificação...');
  const [token, setToken] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchChallenge = async () => {
    setLoading(true);
    setAnswer('');
    if (onReset) onReset();

    try {
      const res = await fetch('/api/captcha');
      if (res.ok) {
        const json = await res.json();
        if (json.challenge) {
          setQuestion(json.challenge.question);
          setToken(json.challenge.token);
        }
      } else {
        setQuestion('Erro ao carregar desafio');
      }
    } catch {
      setQuestion('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenge();
  }, []);

  const handleAnswerChange = (val: string) => {
    setAnswer(val);
    if (val.trim()) {
      onVerified({ captchaToken: token, captchaAnswer: val.trim() });
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2.5 transition">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
            <ShieldCheck size={14} className="stroke-[2.5]" />
          </div>
          <span className="text-xs font-bold text-slate-800">
            Verificação Antispam & Robôs
          </span>
        </div>

        <button
          type="button"
          onClick={fetchChallenge}
          disabled={loading}
          className="text-slate-400 hover:text-teal-700 p-1 rounded-lg transition disabled:opacity-40"
          title="Novo desafio"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-extrabold text-slate-700 select-none shadow-2xs">
          {loading ? '...' : question}
        </div>

        <input
          type="text"
          required
          value={answer}
          onChange={(e) => handleAnswerChange(e.target.value)}
          placeholder="Sua resposta"
          className="w-28 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 bg-white"
        />

        {answer.trim() && (
          <CheckCircle2 size={16} className="text-teal-600 shrink-0 stroke-[2.5] animate-in zoom-in-75" />
        )}
      </div>

      {error && (
        <p className="text-[11px] font-semibold text-rose-600 animate-in fade-in">
          {error}
        </p>
      )}

      <p className="text-[10px] text-slate-400 flex items-center gap-1">
        <Lock size={10} /> Protegido por limite de requisições e verificação humana.
      </p>
    </div>
  );
}
