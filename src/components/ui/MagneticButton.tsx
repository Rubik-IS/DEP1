import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion, scrollToSection } from '../../lib/animation';

export interface MagneticButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  children: React.ReactNode;
  className?: string;
}

const VARIANT_CLASSES: Record<
  NonNullable<MagneticButtonProps['variant']>,
  string
> = {
  primary:
    'bg-gradient-to-r from-[#38BDF8] via-[#2563EB] to-[#6366F1] text-white font-semibold shadow-[0_0_28px_rgba(56,189,248,0.35)] hover:shadow-[0_0_40px_rgba(56,189,248,0.58)] border border-[#38BDF8]/40',
  secondary:
    'bg-[#0E172F]/90 text-[#F8FAFC] font-medium border border-[#6366F1]/45 shadow-[0_0_24px_rgba(99,102,241,0.22)] hover:border-[#38BDF8]/70 hover:bg-[#152244] hover:shadow-[0_0_32px_rgba(56,189,248,0.32)]',
  outline:
    'bg-[#080D1A]/60 backdrop-blur-md text-[#F8FAFC] font-medium border border-white/20 hover:border-[#38BDF8]/70 hover:text-[#38BDF8] hover:bg-[#38BDF8]/10 hover:shadow-[0_0_24px_rgba(56,189,248,0.22)]',
  ghost:
    'bg-transparent text-[#94A3B8] font-medium border border-transparent hover:text-[#F8FAFC] hover:bg-white/5 hover:border-white/10',
};

const SIZE_CLASSES: Record<NonNullable<MagneticButtonProps['size']>, string> = {
  sm: 'px-4 py-2 text-xs tracking-wide rounded-lg gap-1.5',
  md: 'px-6 py-3 text-sm tracking-wide rounded-xl gap-2',
  lg: 'px-8 py-4 text-base tracking-wide rounded-xl gap-2.5',
};

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  variant = 'primary',
  size = 'md',
  href,
  children,
  className = '',
  disabled,
  onClick,
  type = 'button',
  ...rest
}) => {
  const elementRef = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLSpanElement | null>(null);
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);
  const innerXTo = useRef<gsap.QuickToFunc | null>(null);
  const innerYTo = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = elementRef.current;
    const inner = innerRef.current;
    if (!el || disabled) return;

    const isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;

    if (isTouch || prefersReducedMotion()) return;

    xTo.current = gsap.quickTo(el, 'x', {
      duration: 0.45,
      ease: 'power3.out',
    });
    yTo.current = gsap.quickTo(el, 'y', {
      duration: 0.45,
      ease: 'power3.out',
    });

    if (inner) {
      innerXTo.current = gsap.quickTo(inner, 'x', {
        duration: 0.45,
        ease: 'power3.out',
      });
      innerYTo.current = gsap.quickTo(inner, 'y', {
        duration: 0.45,
        ease: 'power3.out',
      });
    }

    return () => {
      gsap.killTweensOf(el);
      if (inner) gsap.killTweensOf(inner);
    };
  }, [disabled]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled || prefersReducedMotion()) return;
    const el = elementRef.current;
    if (!el || !xTo.current || !yTo.current) return;

    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);

    xTo.current(relX * 0.18);
    yTo.current(relY * 0.18);
    innerXTo.current?.(relX * 0.07);
    innerYTo.current?.(relY * 0.07);
  };

  const handleMouseLeave = () => {
    xTo.current?.(0);
    yTo.current?.(0);
    innerXTo.current?.(0);
    innerYTo.current?.(0);
  };

  const cursorStateAttr = disabled
    ? 'disabled'
    : variant === 'primary'
    ? 'cta'
    : 'interactive';

  const baseClasses = `group relative inline-flex items-center justify-center select-none overflow-hidden transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080D1A] disabled:opacity-50 disabled:pointer-events-none ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`;

  const content = (
    <>
      {/* Subtle cyber sheen sweep on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />
      <span
        ref={innerRef}
        className="relative z-10 inline-flex items-center justify-center gap-2"
      >
        {children}
      </span>
    </>
  );

  if (href) {
    const isExternal = /^https?:\/\//i.test(href);
    const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (onClick) {
        onClick(e as unknown as React.MouseEvent<HTMLButtonElement>);
      }
      if (!e.defaultPrevented && href.startsWith('#')) {
        e.preventDefault();
        scrollToSection(href);
      }
    };

    return (
      <a
        ref={(node) => {
          elementRef.current = node;
        }}
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        onClick={handleAnchorClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        data-interactive="true"
        data-cursor={cursorStateAttr}
        className={baseClasses}
        aria-label={rest['aria-label']}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={(node) => {
        elementRef.current = node;
      }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-interactive="true"
      data-cursor={cursorStateAttr}
      className={baseClasses}
      {...rest}
    >
      {content}
    </button>
  );
};
