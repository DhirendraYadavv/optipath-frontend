'use client';
import React from 'react';
import { Lock } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

interface AuthFeatureGateProps {
  title: string;
  description: string;
  children: React.ReactNode;
  /** Legacy props, kept so existing pages still compile. The gate now always follows the Google sign-in. */
  user?: unknown;
  onUnlock?: () => void;
}

export default function AuthFeatureGate({ title, description, children }: AuthFeatureGateProps) {
  const { user, ready, openSignIn } = useAuth();

  if (user) return <>{children}</>;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-200/80 bg-white shadow-xs my-4">
      <div aria-hidden="true" className="pointer-events-none select-none filter blur-[6px] opacity-35 max-h-[360px] overflow-hidden p-6">
        {children}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-white/40 flex flex-col items-center justify-center p-6 text-center z-20">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#831843] mb-3 shadow-xs">
          <Lock className="w-6 h-6 text-[#831843]" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#831843] mb-1.5">Sign in required</span>
        <h4 className="font-serif text-xl font-bold text-[#0E1726] mb-1.5">{title}</h4>
        <p className="text-xs text-[#526173] max-w-md mb-4 leading-relaxed">{description}</p>
        <button
          type="button"
          disabled={!ready}
          onClick={() => openSignIn(description)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#831843] hover:bg-[#6b1337] disabled:opacity-60 text-white text-xs font-bold transition shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Lock className="w-3.5 h-3.5" /> Sign in to unlock
        </button>
      </div>
    </div>
  );
}
