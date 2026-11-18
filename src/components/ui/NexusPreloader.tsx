import React from 'react';
import { RefreshCw, ArrowRight } from 'lucide-react';
import type { LoadingStatus } from '../../lib/loadingProgress';

export interface NexusPreloaderProps {
  visible: boolean;
  isFadingOut: boolean;
  progress: number;
  status: LoadingStatus;
  message: string;
  errorMessage?: string | null;
  onRetry: () => void;
  onContinue: () => void;
}

export const NexusPreloader: React.FC<NexusPreloaderProps> = ({
  visible,
  isFadingOut,
  progress,
  status,
  message,
  errorMessage,
  onRetry,
  onContinue,
}) => {
  if (!visible) return null;

  const isRecoveryState = status === 'timeout' || status === 'error';
  const clampedProgress = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Loading Rubik Integrated Systems: ${clampedProgress}% — ${message}`}
      className={`fixed inset-0 z-[120] flex flex-col items-center justify-center bg-[#080D1A] px-6 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Subtle Ambient Cyber Aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(56, 189, 248, 0.28) 0%, rgba(99, 102, 241, 0.16) 50%, transparent 75%)',
          }}
        />
      </div>

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center text-center">
        {/* Animated Rubik 3x3 Brand Mark */}
        <div
          className={`relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-400/25 bg-gradient-to-br from-[#151B29] to-[#080D1A] shadow-[0_0_32px_rgba(56,189,248,0.18)] transition-transform duration-500 motion-reduce:transition-none ${
            clampedProgress >= 100 ? 'scale-105 border-[#38BDF8]/60' : ''
          }`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 36 36"
            className="h-9 w-9 overflow-visible"
            fill="none"
          >
            <defs>
              <linearGradient
                id="preloaderCyanGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>
              <linearGradient
                id="preloaderVioletGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
            </defs>
            <rect
              x="3"
              y="3"
              width="8"
              height="8"
              rx="2"
              fill="url(#preloaderCyanGrad)"
              className="motion-safe:animate-pulse"
              opacity="0.88"
            />
            <rect
              x="13.5"
              y="3"
              width="8"
              height="8"
              rx="2"
              fill="url(#preloaderCyanGrad)"
              opacity="0.92"
            />
            <rect
              x="24"
              y="3"
              width="8"
              height="8"
              rx="2"
              fill="url(#preloaderCyanGrad)"
            />
            <rect
              x="3"
              y="13.5"
              width="8"
              height="8"
              rx="2"
              fill="url(#preloaderCyanGrad)"
              opacity="0.92"
            />
            <rect
              x="13.5"
              y="13.5"
              width="8"
              height="8"
              rx="2"
              fill="url(#preloaderVioletGrad)"
            />
            <rect
              x="24"
              y="13.5"
              width="8"
              height="8"
              rx="2"
              fill="url(#preloaderCyanGrad)"
              opacity="0.95"
            />
            <rect
              x="3"
              y="24"
              width="8"
              height="8"
              rx="2"
              fill="url(#preloaderCyanGrad)"
              opacity="0.82"
            />
            <rect
              x="13.5"
              y="24"
              width="8"
              height="8"
              rx="2"
              fill="url(#preloaderCyanGrad)"
              opacity="0.92"
            />
            <rect
              x={clampedProgress >= 100 ? '24' : '25.8'}
              y={clampedProgress >= 100 ? '24' : '25.8'}
              width="8"
              height="8"
              rx="2"
              fill="url(#preloaderVioletGrad)"
              className="transition-all duration-500 ease-out motion-safe:animate-pulse"
            />
          </svg>
        </div>

        {/* Brand Lockup */}
        <div className="mb-6 space-y-1">
          <div className="font-display text-lg font-bold tracking-[0.18em] text-[#F8FAFC]">
            RUBIK
          </div>
          <div className="type-caption uppercase tracking-[0.24em] text-[#94A3B8]">
            INTEGRATED SYSTEMS
          </div>
        </div>

        {/* Prominent Real-Time Percentage */}
        <div className="mb-3 flex items-baseline justify-center gap-1 font-display text-4xl font-bold tracking-tight text-[#F8FAFC] tabular-nums sm:text-5xl">
          <span>{clampedProgress}</span>
          <span className="text-xl font-semibold text-[#38BDF8] sm:text-2xl">
            %
          </span>
        </div>

        {/* Smooth Progress Bar */}
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={clampedProgress}
          aria-label="Application loading progress"
          className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-[#151B29] ring-1 ring-white/10"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#38BDF8] to-[#6366F1] transition-[width] duration-300 ease-out motion-reduce:transition-none"
            style={{ width: `${clampedProgress}%` }}
          />
        </div>

        {/* Dynamic Status Message */}
        <p className="type-caption uppercase tracking-[0.18em] text-[#CBD5E1]">
          {message}
        </p>

        {/* Timeout / Error Recovery Controls */}
        {isRecoveryState && (
          <div className="mt-6 w-full space-y-3 rounded-2xl border border-white/10 bg-[#151B29]/75 p-4 text-left">
            <p className="text-xs leading-relaxed text-[#CBD5E1]">
              {errorMessage ??
                'Initialization is taking longer than expected. You can retry or continue directly to the website.'}
            </p>
            <div className="flex flex-wrap items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-[#080D1A] px-3 py-1.5 text-xs font-medium text-[#F8FAFC] transition-colors hover:border-[#38BDF8]/50 hover:text-[#38BDF8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Retry</span>
              </button>
              <button
                type="button"
                onClick={onContinue}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#38BDF8] px-3.5 py-1.5 text-xs font-semibold text-[#080D1A] transition-colors hover:bg-[#7DD3FC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NexusPreloader;
