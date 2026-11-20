'use client';

import { Sparkles } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'normal' | 'success';
}

export function Toast({ message, type }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right duration-200">
      <div
        className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-bold border ${
          type === 'success'
            ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
            : 'bg-slate-900 text-slate-100 border-slate-700'
        }`}
      >
        <Sparkles size={18} className="text-teal-400 shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  );
}
