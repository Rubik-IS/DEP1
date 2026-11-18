import React, { useEffect, useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import {
  ConsentStatus,
  getConsentStatus,
  initAnalytics,
  setConsentStatus,
} from '../../lib/analytics';

export const CookieConsentBanner: React.FC = () => {
  const [consent, setConsent] = useState<ConsentStatus>(() =>
    typeof window !== 'undefined' ? getConsentStatus() : 'denied'
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initAnalytics();
    setConsent(getConsentStatus());
    setMounted(true);

    const handleConsentChange = () => {
      setConsent(getConsentStatus());
    };

    window.addEventListener('rubik:analytics-consent', handleConsentChange);
    return () => {
      window.removeEventListener('rubik:analytics-consent', handleConsentChange);
    };
  }, []);

  if (!mounted || consent !== null) {
    return null;
  }

  const handleChoice = (granted: boolean) => {
    const next = setConsentStatus(granted);
    setConsent(next);
  };

  return (
    <aside
      role="region"
      aria-label="Privacy and analytics preferences"
      className="fixed bottom-4 left-4 right-4 z-50 max-w-md sm:bottom-6 sm:left-6 sm:right-auto"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#080D1A]/92 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:p-5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#38BDF8]/50 via-[#6366F1]/40 to-transparent"
        />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#38BDF8]/30 bg-[#38BDF8]/10 text-[#38BDF8]">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F8FAFC]">
              Analytics &amp; Privacy
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleChoice(false)}
            aria-label="Dismiss and use essential only"
            data-cursor="interactive"
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-2.5 text-xs leading-relaxed text-slate-300">
          We use privacy-first analytics (Google Consent Mode v2) without
          collecting personal contact details. Choose whether to enable usage
          metrics to help improve Rubik Integrated Systems.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleChoice(true)}
            data-cursor="interactive"
            className="rounded-xl border border-[#38BDF8]/45 bg-gradient-to-r from-[#38BDF8] to-[#6366F1] px-3.5 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(56,189,248,0.28)] transition-all hover:shadow-[0_0_28px_rgba(56,189,248,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080D1A]"
          >
            Accept Analytics
          </button>

          <button
            type="button"
            onClick={() => handleChoice(false)}
            data-cursor="interactive"
            className="rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-white/30 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080D1A]"
          >
            Essential Only
          </button>
        </div>
      </div>
    </aside>
  );
};
