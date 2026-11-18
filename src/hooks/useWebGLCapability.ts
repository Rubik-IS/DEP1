import { useState, useEffect } from 'react';

export interface WebGLCapability {
  supported: boolean;
  isMobile: boolean;
  prefersReducedMotion: boolean;
  dpr: [number, number];
  particleCount: number;
}

let cachedWebGLSupport: boolean | null = null;

function detectWebGLSupport(): boolean {
  if (cachedWebGLSupport !== null) {
    return cachedWebGLSupport;
  }
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return true;
  }
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2', { powerPreference: 'high-performance' }) ||
      canvas.getContext('webgl', { powerPreference: 'high-performance' }) ||
      canvas.getContext('experimental-webgl');

    if (!gl) {
      cachedWebGLSupport = false;
      return false;
    }

    cachedWebGLSupport = true;
    return true;
  } catch {
    cachedWebGLSupport = false;
    return false;
  }
}

function computeCapability(): WebGLCapability {
  if (typeof window === 'undefined') {
    return {
      supported: true,
      isMobile: false,
      prefersReducedMotion: false,
      dpr: [1, 2],
      particleCount: 600,
    };
  }

  const supported = detectWebGLSupport();
  const isMobile = window.innerWidth < 768;
  const prefersReducedMotion =
    typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const dpr: [number, number] = isMobile ? [1, 1.25] : [1, 2];
  const particleCount = prefersReducedMotion ? 80 : isMobile ? 180 : 600;

  return {
    supported,
    isMobile,
    prefersReducedMotion,
    dpr,
    particleCount,
  };
}

export function useWebGLCapability(): WebGLCapability {
  const [capability, setCapability] = useState<WebGLCapability>(() =>
    computeCapability()
  );

  useEffect(() => {
    const updateCapability = () => {
      setCapability(computeCapability());
    };

    updateCapability();

    window.addEventListener('resize', updateCapability, { passive: true });

    let mediaQuery: MediaQueryList | null = null;
    if (typeof window.matchMedia === 'function') {
      mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', updateCapability);
      }
    }

    return () => {
      window.removeEventListener('resize', updateCapability);
      if (mediaQuery && typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', updateCapability);
      }
    };
  }, []);

  return capability;
}
