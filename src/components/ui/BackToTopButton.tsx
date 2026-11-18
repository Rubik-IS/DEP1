import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { prefersReducedMotion, scrollToSection } from '../../lib/animation';

export interface BackToTopButtonProps {
  threshold?: number;
  className?: string;
}

export const BackToTopButton: React.FC<BackToTopButtonProps> = ({
  threshold = 320,
  className = '',
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setVisible(y > threshold);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  const handleClick = () => {
    scrollToSection('top', { immediate: prefersReducedMotion() });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Back to top"
      title="Back to top"
      data-cursor="interactive"
      data-interactive="true"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      style={{
        bottom:
          'calc(clamp(1.25rem, 2.5vw, 1.75rem) + env(safe-area-inset-bottom, 0px))',
        right:
          'calc(clamp(1.25rem, 2.5vw, 1.75rem) + env(safe-area-inset-right, 0px))',
      }}
      className={`group fixed z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[#080D1A]/85 text-slate-200 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition-all duration-300 ease-out hover:border-[#38BDF8]/70 hover:text-[#38BDF8] hover:shadow-[0_0_24px_rgba(56,189,248,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080D1A] active:scale-95 motion-reduce:transition-none ${
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      } ${className}`}
    >
      {/* Subtle inner cyber glow ring on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full border border-[#38BDF8]/0 transition-colors duration-300 group-hover:border-[#38BDF8]/35"
      />
      <ArrowUp className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0" />
    </button>
  );
};
