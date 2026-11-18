import React, { useEffect, useRef, useState } from 'react';
import {
  canUseNexusCursor,
  NexusCursorController,
} from './CursorController';
import './cursor.css';

export const NexusCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const coreRef = useRef<HTMLDivElement | null>(null);
  const innerRingRef = useRef<HTMLDivElement | null>(null);
  const outerRingRef = useRef<HTMLDivElement | null>(null);
  const rippleRef = useRef<HTMLDivElement | null>(null);
  const trail0Ref = useRef<HTMLDivElement | null>(null);
  const trail1Ref = useRef<HTMLDivElement | null>(null);
  const trail2Ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const evaluateCapability = () => {
      setEnabled(canUseNexusCursor());
    };

    evaluateCapability();

    const pointerQuery = window.matchMedia('(pointer: fine) and (hover: hover)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    pointerQuery.addEventListener?.('change', evaluateCapability);
    motionQuery.addEventListener?.('change', evaluateCapability);

    return () => {
      pointerQuery.removeEventListener?.('change', evaluateCapability);
      motionQuery.removeEventListener?.('change', evaluateCapability);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const controller = new NexusCursorController({
      root: rootRef.current,
      core: coreRef.current,
      innerRing: innerRingRef.current,
      outerRing: outerRingRef.current,
      ripple: rippleRef.current,
      trails: [trail0Ref.current, trail1Ref.current, trail2Ref.current],
    });

    controller.mount();

    return () => {
      controller.destroy();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-state="default"
      data-pressed="false"
      data-dragging-3d="false"
      data-cubie-hover="false"
      data-visible="false"
      className="nexus-cursor-root group pointer-events-none fixed inset-0 z-[9999] hidden overflow-hidden lg:block data-[visible=false]:opacity-0 data-[visible=true]:opacity-100 data-[state=text]:opacity-0 data-[state=disabled]:opacity-25 transition-opacity duration-200"
    >
      {/* ==================================================================
          C. MOTION TRAIL — 3 Fading Crystalline Micro-Shards
         ================================================================== */}
      <div
        ref={trail2Ref}
        className="fixed left-0 top-0 h-1.5 w-1.5 border border-[#6366F1]/60 bg-[#6366F1]/35 opacity-0 shadow-[0_0_8px_rgba(99,102,241,0.45)] will-change-transform"
      />
      <div
        ref={trail1Ref}
        className="fixed left-0 top-0 h-2 w-2 border border-[#38BDF8]/65 bg-[#6366F1]/45 opacity-0 shadow-[0_0_10px_rgba(56,189,248,0.45)] will-change-transform"
      />
      <div
        ref={trail0Ref}
        className="fixed left-0 top-0 h-2 w-2 border border-[#E2E8F0]/75 bg-[#38BDF8]/55 opacity-0 shadow-[0_0_12px_rgba(56,189,248,0.6)] will-change-transform"
      />

      {/* ==================================================================
          D. CLICK ENERGY RIPPLE — Expanding Cyan/Violet Pulse Ring
         ================================================================== */}
      <div
        ref={rippleRef}
        className="pointer-events-none fixed left-0 top-0 h-12 w-12 opacity-0 will-change-transform"
      >
        <svg
          viewBox="0 0 64 64"
          className="h-full w-full overflow-visible"
          fill="none"
        >
          <circle
            cx="32"
            cy="32"
            r="24"
            stroke="#38BDF8"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
          <circle
            cx="32"
            cy="32"
            r="16"
            stroke="#6366F1"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* ==================================================================
          B1. INNER CONCENTRIC RING — Precision Geometric Halo
         ================================================================== */}
      <div
        ref={innerRingRef}
        className="fixed left-0 top-0 will-change-transform"
      >
        <div
          className="flex items-center justify-center rounded-full border transition-all duration-200 ease-out
            h-6 w-6 border-[#38BDF8]/45 bg-transparent shadow-[0_0_12px_rgba(56,189,248,0.18)]
            group-data-[state=interactive]:h-9 group-data-[state=interactive]:w-9 group-data-[state=interactive]:border-[#38BDF8]/80 group-data-[state=interactive]:bg-[#38BDF8]/[0.06] group-data-[state=interactive]:shadow-[0_0_20px_rgba(56,189,248,0.32)]
            group-data-[state=cta]:h-11 group-data-[state=cta]:w-11 group-data-[state=cta]:border-[#E2E8F0]/85 group-data-[state=cta]:bg-[#6366F1]/15 group-data-[state=cta]:shadow-[0_0_28px_rgba(56,189,248,0.5)]
            group-data-[state=nexus-3d]:h-10 group-data-[state=nexus-3d]:w-10 group-data-[state=nexus-3d]:border-[#38BDF8]/75 group-data-[state=nexus-3d]:bg-[#38BDF8]/[0.05]
            group-data-[cubie-hover=true]:h-11 group-data-[cubie-hover=true]:w-11 group-data-[cubie-hover=true]:border-[#38BDF8] group-data-[cubie-hover=true]:shadow-[0_0_26px_rgba(56,189,248,0.55)]
            group-data-[pressed=true]:scale-75 group-data-[dragging-3d=true]:scale-85"
        >
          {/* Counter-rotating inner micro-segmented ring */}
          <svg
            viewBox="0 0 40 40"
            className="nexus-orbit-spin-reverse h-full w-full p-0.5 opacity-60 group-data-[state=interactive]:opacity-90 group-data-[state=cta]:opacity-100 group-data-[state=nexus-3d]:opacity-95"
          >
            <circle
              cx="20"
              cy="20"
              r="17"
              fill="none"
              stroke="#6366F1"
              strokeWidth="1"
              strokeDasharray="8 10"
            />
          </svg>
        </div>
      </div>

      {/* ==================================================================
          B2. OUTER ORBITAL RING SYSTEM — Segmented SVG Ring + Corner Reticle
         ================================================================== */}
      <div
        ref={outerRingRef}
        className="fixed left-0 top-0 will-change-transform"
      >
        <div
          className="relative flex items-center justify-center transition-all duration-300 ease-out
            h-10 w-10
            group-data-[state=interactive]:h-14 group-data-[state=interactive]:w-14
            group-data-[state=cta]:h-16 group-data-[state=cta]:w-16
            group-data-[state=nexus-3d]:h-16 group-data-[state=nexus-3d]:w-16
            group-data-[pressed=true]:scale-80 group-data-[dragging-3d=true]:scale-90"
        >
          {/* Rotating segmented geometric orbital ring with gradient */}
          <svg
            viewBox="0 0 64 64"
            className="nexus-orbit-spin-slow h-full w-full overflow-visible"
            fill="none"
          >
            <defs>
              <linearGradient
                id="nexusCursorOrbitGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#E2E8F0" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Segmented orbital arc */}
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="url(#nexusCursorOrbitGrad)"
              strokeWidth="1.25"
              strokeDasharray="22 14 8 14"
              strokeLinecap="round"
              className="opacity-55 transition-opacity duration-300 group-data-[state=interactive]:opacity-90 group-data-[state=cta]:opacity-100 group-data-[state=nexus-3d]:opacity-95"
            />

            {/* Cardinal geometric tick markings */}
            <line
              x1="32"
              y1="1"
              x2="32"
              y2="5"
              stroke="#38BDF8"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <line
              x1="32"
              y1="59"
              x2="32"
              y2="63"
              stroke="#38BDF8"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <line
              x1="1"
              y1="32"
              x2="5"
              y2="32"
              stroke="#6366F1"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <line
              x1="59"
              y1="32"
              x2="63"
              y2="32"
              stroke="#6366F1"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>

          {/* 4 Corner Architectural Targeting Brackets (Active in CTA & 3D Nexus states) */}
          <div
            className="pointer-events-none absolute inset-0 scale-110 opacity-0 transition-all duration-300
              group-data-[state=cta]:scale-100 group-data-[state=cta]:opacity-100
              group-data-[state=nexus-3d]:scale-100 group-data-[state=nexus-3d]:opacity-95
              group-data-[cubie-hover=true]:scale-95 group-data-[cubie-hover=true]:opacity-100"
          >
            {/* Top-left bracket */}
            <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l-2 border-t-2 border-[#38BDF8]" />
            {/* Top-right bracket */}
            <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r-2 border-t-2 border-[#6366F1]" />
            {/* Bottom-left bracket */}
            <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b-2 border-l-2 border-[#6366F1]" />
            {/* Bottom-right bracket */}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b-2 border-r-2 border-[#38BDF8]" />
          </div>
        </div>
      </div>

      {/* ==================================================================
          A. CENTRAL CRYSTALLINE CORE — 45° Rotated Diamond + Reticle Crosshair
         ================================================================== */}
      <div
        ref={coreRef}
        className="fixed left-0 top-0 will-change-transform"
      >
        <div className="relative flex items-center justify-center">
          {/* Luminous rotated 45deg crystalline diamond */}
          <div
            className="rotate-45 border transition-all duration-200 ease-out
              h-2.5 w-2.5 border-[#E2E8F0]/90 bg-[#38BDF8] shadow-[0_0_14px_#38BDF8,0_0_4px_#FFFFFF]
              group-data-[state=interactive]:h-3 group-data-[state=interactive]:w-3 group-data-[state=interactive]:bg-[#E2E8F0] group-data-[state=interactive]:border-[#38BDF8] group-data-[state=interactive]:shadow-[0_0_18px_#38BDF8]
              group-data-[state=cta]:h-3.5 group-data-[state=cta]:w-3.5 group-data-[state=cta]:rotate-[135deg] group-data-[state=cta]:bg-[#E2E8F0] group-data-[state=cta]:border-[#38BDF8] group-data-[state=cta]:shadow-[0_0_24px_#38BDF8,0_0_10px_#6366F1]
              group-data-[state=nexus-3d]:h-3 group-data-[state=nexus-3d]:w-3 group-data-[state=nexus-3d]:bg-[#38BDF8] group-data-[state=nexus-3d]:border-[#E2E8F0]
              group-data-[cubie-hover=true]:scale-125 group-data-[cubie-hover=true]:bg-[#E2E8F0]
              group-data-[pressed=true]:scale-65"
          >
            {/* Inner specular highlight facet */}
            <div className="h-full w-full scale-50 bg-[#E2E8F0]" />
          </div>

          {/* Precision '+' Targeting Crosshair (Emerges in CTA & 3D Cubie Hover states) */}
          <div
            className="pointer-events-none absolute flex items-center justify-center opacity-0 scale-50 transition-all duration-200
              group-data-[state=cta]:opacity-100 group-data-[state=cta]:scale-100
              group-data-[cubie-hover=true]:opacity-100 group-data-[cubie-hover=true]:scale-100"
          >
            <span className="absolute h-4 w-[1px] bg-[#E2E8F0]/90" />
            <span className="absolute h-[1px] w-4 bg-[#E2E8F0]/90" />
          </div>
        </div>
      </div>
    </div>
  );
};
