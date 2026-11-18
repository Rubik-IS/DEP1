import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const SECTION_IDS = [
  'hero',
  'services',
  'solutions',
  'approach',
  'industries',
  'events',
  'about',
  'contact',
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

let activeLenis: Lenis | null = null;

/**
 * Checks whether the user has requested reduced motion at the OS/browser level.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Computes overall normalized scroll progress (0..1) and the currently active section ID.
 */
function computeScrollState(): { progress: number; activeSection: string } {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return { progress: 0, activeSection: 'hero' };
  }

  const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
  const maxScroll = Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight
  );
  const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));

  const viewportPivot = window.innerHeight * 0.42;
  let activeSection: string = 'hero';

  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (rect.top <= viewportPivot) {
      activeSection = id;
    }
  }

  return { progress, activeSection };
}

/**
 * Initializes Lenis smooth scrolling synchronized with GSAP ticker and ScrollTrigger.
 * Automatically respects `prefers-reduced-motion: reduce`.
 * Returns a cleanup function for React `useEffect`.
 */
export function initSmoothScroll(
  onScrollProgress?: (progress: number, activeSection: string) => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const reducedMotion = prefersReducedMotion();
  const isCoarsePointer =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches;

  const emitProgress = () => {
    if (!onScrollProgress) return;
    const { progress, activeSection } = computeScrollState();
    onScrollProgress(progress, activeSection);
  };

  // Emit initial scroll state immediately
  emitProgress();

  // If reduced motion is enabled or on coarse-pointer touch devices, skip Lenis inertia and rely on native scrolling
  if (reducedMotion || isCoarsePointer) {
    const handleNativeScroll = () => {
      ScrollTrigger.update();
      emitProgress();
    };
    window.addEventListener('scroll', handleNativeScroll, { passive: true });
    window.addEventListener('resize', emitProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleNativeScroll);
      window.removeEventListener('resize', emitProgress);
    };
  }

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  });

  activeLenis = lenis;

  lenis.on('scroll', () => {
    ScrollTrigger.update();
    emitProgress();
  });

  const handleNativeFallback = () => {
    emitProgress();
  };
  window.addEventListener('scroll', handleNativeFallback, { passive: true });
  window.addEventListener('resize', emitProgress, { passive: true });

  const tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  return () => {
    window.removeEventListener('scroll', handleNativeFallback);
    window.removeEventListener('resize', emitProgress);
    gsap.ticker.remove(tickerCallback);
    lenis.destroy();
    if (activeLenis === lenis) {
      activeLenis = null;
    }
  };
}

/**
 * Refreshes Lenis bounds and GSAP ScrollTrigger positions after route or layout changes.
 */
export function refreshScrollEngine(): void {
  if (typeof window === 'undefined') return;
  activeLenis?.resize();
  ScrollTrigger.refresh();
}

/**
 * Scrolls to an exact vertical pixel offset (`y`), synchronized with Lenis when active.
 * Useful for restoring exact scroll positions on browser Back/Forward (`POP`) navigation.
 */
export function scrollToExactY(
  y: number,
  options?: { immediate?: boolean }
): void {
  if (typeof window === 'undefined') return;

  const targetY = Math.max(0, Number.isFinite(y) ? y : 0);
  const immediate = Boolean(options?.immediate) || prefersReducedMotion();

  if (activeLenis) {
    activeLenis.resize();
    if (immediate) {
      activeLenis.scrollTo(targetY, { immediate: true, force: true });
      window.scrollTo({ top: targetY, behavior: 'auto' });
      ScrollTrigger.update();
    } else {
      activeLenis.scrollTo(targetY, {
        duration: 0.9,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
    return;
  }

  window.scrollTo({
    top: targetY,
    behavior: immediate ? 'auto' : 'smooth',
  });
  ScrollTrigger.update();
}

/**
 * Smoothly scrolls to a target section by ID (supports `#id`, `/#id`, `id`, or `top`).
 * Includes a short frame-retry window so cross-route navigation to hash targets resolves reliably.
 */
export function scrollToSection(
  sectionId: string,
  options?: { immediate?: boolean }
): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const normalizedId = sectionId.replace(/^\/?#/, '');
  const immediate = Boolean(options?.immediate) || prefersReducedMotion();

  if (!normalizedId || normalizedId === 'top') {
    if (activeLenis && !immediate) {
      activeLenis.scrollTo(0, { duration: 1.05 });
    } else if (activeLenis && immediate) {
      activeLenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({
        top: 0,
        behavior: immediate ? 'auto' : 'smooth',
      });
    }
    return;
  }

  const navOffset = -84;

  const performScroll = (targetEl: HTMLElement) => {
    if (activeLenis) {
      activeLenis.resize();
      if (!immediate) {
        activeLenis.scrollTo(targetEl, {
          offset: navOffset,
          duration: 1.15,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        activeLenis.scrollTo(targetEl, {
          offset: navOffset,
          immediate: true,
        });
      }
    } else {
      const top =
        targetEl.getBoundingClientRect().top + window.scrollY + navOffset;
      window.scrollTo({
        top: Math.max(0, top),
        behavior: immediate ? 'auto' : 'smooth',
      });
    }
  };

  const immediateTarget = document.getElementById(normalizedId);
  if (immediateTarget) {
    performScroll(immediateTarget);
    return;
  }

  // Cross-route transition fallback: wait briefly for the new route's DOM to mount
  let attempts = 0;
  const maxAttempts = 20;
  const retryFind = () => {
    const el = document.getElementById(normalizedId);
    if (el) {
      performScroll(el);
      return;
    }
    attempts += 1;
    if (attempts < maxAttempts) {
      requestAnimationFrame(retryFind);
    }
  };
  requestAnimationFrame(retryFind);
}

/**
 * React hook that reveals elements matching `[data-reveal]` inside a section container
 * using GSAP and ScrollTrigger, with an instant visibility fallback for reduced motion.
 */
export function useSectionReveal(
  ref: React.RefObject<HTMLElement | null>,
  options?: { stagger?: number; y?: number; delay?: number }
): void {
  const stagger = options?.stagger ?? 0.1;
  const yOffset = options?.y ?? 28;
  const delay = options?.delay ?? 0;

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const elements = Array.from(
      container.querySelectorAll<HTMLElement>('[data-reveal]')
    );
    if (elements.length === 0) return;

    if (prefersReducedMotion()) {
      gsap.set(elements, { opacity: 1, y: 0, clearProps: 'transform' });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        elements,
        {
          opacity: 0,
          y: yOffset,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger,
          delay,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: container,
            start: 'top 86%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    }, container);

    const refreshRaf = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(refreshRaf);
      ctx.revert();
    };
  }, [ref, stagger, yOffset, delay]);
}
