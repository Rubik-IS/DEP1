import React, {
  Component,
  ErrorInfo,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { Canvas } from '@react-three/fiber';
import { useWebGLCapability } from '../../hooks/useWebGLCapability';
import { SERVICES_LIST } from '../../data/rubikData';
import {
  trackCubeBlockHover,
  trackCubeServiceClick,
} from '../../lib/analytics';
import {
  RubikNexusCore,
  NexusMode,
  NexusDiscipline,
  CubieHoverInfo,
} from './RubikNexusCore';
import { ParticleField } from './ParticleField';

export type {
  NexusMode,
  NexusDiscipline,
  CubieHoverInfo,
} from './RubikNexusCore';

export interface RubikSceneCanvasProps {
  mode: NexusMode;
  scrollProgress: number;
  activeSection: string;
  selectedServiceId?: string | null;
  onCubieSelect?: (index: number, label: string, serviceId?: string) => void;
  onCubieHover?: (info: CubieHoverInfo | null) => void;
  onSceneReady?: () => void;
}

interface CanvasErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface CanvasErrorBoundaryState {
  hasError: boolean;
}

class CanvasErrorBoundary extends Component<
  CanvasErrorBoundaryProps,
  CanvasErrorBoundaryState
> {
  constructor(props: CanvasErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): CanvasErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.warn(
      '[RubikSceneCanvas] WebGL rendering fallback activated:',
      error.message,
      info.componentStack
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface FallbackModuleItem {
  index: number;
  row: number;
  col: number;
  serviceId: string;
  serviceTitle: string;
  label: string;
  isSignature?: boolean;
}

const IsometricRubikFallback: React.FC<{
  mode: NexusMode;
  activeSection: string;
  selectedServiceId?: string | null;
  onCubieSelect?: (index: number, label: string, serviceId?: string) => void;
  onCubieHover?: (info: CubieHoverInfo | null) => void;
  onSceneReady?: () => void;
}> = ({
  mode,
  activeSection,
  selectedServiceId = null,
  onCubieSelect,
  onCubieHover,
  onSceneReady,
}) => {
  const [activeIdx, setActiveIdx] = useState<number>(8);

  useEffect(() => {
    onSceneReady?.();
  }, [onSceneReady]);

  const fallbackModules = useMemo<FallbackModuleItem[]>(() => {
    const count = Math.max(1, SERVICES_LIST.length);
    return Array.from({ length: 9 }, (_, i) => {
      const service = SERVICES_LIST[i % count];
      return {
        index: i,
        row: Math.floor(i / 3),
        col: i % 3,
        serviceId: service?.id ?? `service-${(i % count) + 1}`,
        serviceTitle: service?.title ?? `Rubik Service ${(i % count) + 1}`,
        label:
          i === 8
            ? `${service?.title ?? 'AI Agents & Automation'} // Rubik.I.S Offset Node [1,-1,1]`
            : `${service?.index ?? `0${i + 1}`} // ${service?.title ?? 'Rubik Service'}`,
        isSignature: i === 8,
      };
    });
  }, []);

  const isExploded =
    mode === 'exploded' ||
    mode === 'matrix' ||
    mode === 'process' ||
    mode === 'events' ||
    mode.startsWith('pillar');

  const hasServiceFocus = Boolean(selectedServiceId);

  return (
    <div
      data-cursor="nexus-3d"
      className="relative w-full h-full flex items-center justify-center overflow-hidden select-none"
      aria-label="Interactive Rubik Nexus 3D Architectural Matrix"
    >
      {/* Ambient Cyber Glow Backdrop */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 65% 45%, rgba(56, 189, 248, 0.14) 0%, rgba(99, 102, 241, 0.09) 35%, rgba(8, 13, 26, 0) 70%)',
        }}
      />

      {/* Isometric 3x3 Interactive Rubik Architectural Matrix */}
      <div
        className={`relative transition-all duration-700 ease-out ${
          activeSection === 'hero'
            ? 'lg:translate-x-[5.5vw] xl:translate-x-[6.5vw] scale-100 xl:scale-110'
            : 'lg:translate-x-[4vw] scale-90 opacity-80'
        }`}
      >
        <div
          className="relative w-[min(84vw,20rem)] h-[min(84vw,20rem)] sm:w-80 sm:h-80 xl:w-96 xl:h-96 flex items-center justify-center"
          style={{
            transform:
              'perspective(1100px) rotateX(24deg) rotateY(-28deg) rotateZ(4deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Outer Orbital SVG Ring */}
          <svg
            viewBox="0 0 320 320"
            className="pointer-events-none absolute inset-0 w-full h-full opacity-40 animate-spin"
            style={{ animationDuration: '36s' }}
          >
            <circle
              cx="160"
              cy="160"
              r="146"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1"
              strokeDasharray="8 6"
            />
            <circle
              cx="160"
              cy="160"
              r="122"
              fill="none"
              stroke="#6366F1"
              strokeWidth="1"
              strokeDasharray="4 10"
            />
          </svg>

          <div
            className="grid grid-cols-3 gap-3 p-5 rounded-2xl border border-sky-400/20 bg-slate-950/70 backdrop-blur-md shadow-[0_0_60px_rgba(56,189,248,0.18)] transition-all duration-500"
            style={{
              gap: isExploded ? '1.35rem' : '0.7rem',
            }}
          >
            {fallbackModules.map((mod) => {
              const isServiceMatch =
                hasServiceFocus && mod.serviceId === selectedServiceId;
              const isSelected = hasServiceFocus
                ? isServiceMatch
                : activeIdx === mod.index;
              const isDimmed = hasServiceFocus && !isServiceMatch;
              const isSig = Boolean(mod.isSignature);
              const offsetX = isSig ? 12 : isExploded ? (mod.col - 1) * 8 : 0;
              const offsetY = isSig ? 12 : isExploded ? (mod.row - 1) * 8 : 0;

              return (
                <button
                  key={mod.index}
                  type="button"
                  data-cursor="nexus-3d"
                  onClick={() => {
                    setActiveIdx(mod.index);
                    onCubieSelect?.(mod.index, mod.label, mod.serviceId);
                  }}
                  onMouseEnter={(e) => {
                    setActiveIdx(mod.index);
                    if (typeof document !== 'undefined') {
                      document.documentElement.dataset.nexusCubieHover = 'true';
                    }
                    const rect = e.currentTarget.getBoundingClientRect();
                    onCubieHover?.({
                      index: mod.index,
                      serviceId: mod.serviceId,
                      serviceTitle: mod.serviceTitle,
                      screenX: rect.right,
                      screenY: rect.top + rect.height / 2,
                    });
                  }}
                  onMouseLeave={() => {
                    if (typeof document !== 'undefined') {
                      delete document.documentElement.dataset.nexusCubieHover;
                    }
                    onCubieHover?.(null);
                  }}
                  aria-label={mod.label}
                  style={{
                    transform: `translate3d(${offsetX}px, ${offsetY}px, ${
                      isSelected || isSig ? '18px' : '0px'
                    })`,
                  }}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center relative group focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                    isDimmed
                      ? 'opacity-45 bg-slate-950/60 border-slate-800/70'
                      : isSig
                      ? 'bg-gradient-to-br from-sky-500/30 via-indigo-600/25 to-slate-900 border-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.5)]'
                      : isSelected
                      ? 'bg-slate-900/95 border-sky-400/80 shadow-[0_0_20px_rgba(56,189,248,0.35)]'
                      : 'bg-slate-900/80 border-slate-700/70 hover:border-sky-400/60'
                  }`}
                >
                  <span className="font-mono text-[10px] tracking-widest text-sky-400/90">
                    0{mod.index + 1}
                  </span>
                  <span
                    className={`mt-1 w-2 h-2 rounded-full ${
                      isSig
                        ? 'bg-sky-400 animate-ping'
                        : isSelected
                        ? 'bg-sky-400'
                        : 'bg-indigo-400/60'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const RubikSceneCanvas: React.FC<RubikSceneCanvasProps> = ({
  mode,
  scrollProgress,
  activeSection,
  selectedServiceId = null,
  onCubieSelect,
  onCubieHover,
  onSceneReady,
}) => {
  const capability = useWebGLCapability();
  const [localHovered, setLocalHovered] = useState<CubieHoverInfo | null>(null);

  const handleCubieHover = useCallback(
    (info: CubieHoverInfo | null) => {
      setLocalHovered(info);
      if (info) {
        trackCubeBlockHover({
          cube_block_id: String(info.index + 1),
          service_id: info.serviceId,
          service_name: info.serviceTitle,
          cube_state: mode,
        });
      }
      onCubieHover?.(info);
    },
    [mode, onCubieHover]
  );

  const handleCubieSelect = useCallback(
    (index: number, label: string, serviceId?: string) => {
      const matchedService = serviceId
        ? SERVICES_LIST.find((s) => s.id === serviceId)
        : undefined;
      trackCubeServiceClick({
        service_id: serviceId ?? `node-${index + 1}`,
        service_name: matchedService?.title ?? label,
        cube_block_id: String(index + 1),
        cube_state: mode,
      });
      onCubieSelect?.(index, label, serviceId);
    },
    [mode, onCubieSelect]
  );

  // Clear floating tooltip if the user scrolls away from the hero stage
  useEffect(() => {
    if (activeSection !== 'hero') {
      setLocalHovered(null);
    }
  }, [activeSection]);

  const fallbackView = (
    <IsometricRubikFallback
      mode={mode}
      activeSection={activeSection}
      selectedServiceId={selectedServiceId}
      onCubieSelect={handleCubieSelect}
      onCubieHover={handleCubieHover}
      onSceneReady={onSceneReady}
    />
  );

  const tooltipNode =
    localHovered &&
    typeof document !== 'undefined' &&
    createPortal(
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed z-30 transition-opacity duration-150"
        style={{
          left: `clamp(16px, ${Math.round(
            localHovered.screenX + 18
          )}px, calc(100vw - 250px))`,
          top: `clamp(88px, ${Math.round(
            localHovered.screenY - 24
          )}px, calc(100vh - 90px))`,
        }}
      >
        <div className="max-w-[234px] rounded-xl border border-[#38BDF8]/40 bg-[#080D1A]/90 px-3.5 py-2 shadow-[0_8px_30px_rgba(8,13,26,0.75)] backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]" />
            <p className="truncate text-xs font-medium text-[#F8FAFC]">
              {localHovered.serviceTitle}
            </p>
          </div>
          <p className="mt-0.5 pl-3.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#38BDF8]/85">
            Click to inspect
          </p>
        </div>
      </div>,
      document.body
    );

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 65% 38%, rgba(21, 27, 41, 0.94) 0%, rgba(14, 23, 47, 0.96) 45%, #080D1A 100%)',
      }}
    >
      {/* Subtle Ambient Cyber Aura */}
      <div
        className="pointer-events-none absolute -top-32 right-0 w-[36rem] h-[36rem] rounded-full opacity-25 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(56, 189, 248, 0.32) 0%, rgba(99, 102, 241, 0.18) 50%, transparent 75%)',
        }}
      />

      {!capability.supported ? (
        <div
          data-cursor="nexus-3d"
          className="w-full h-full pointer-events-auto"
        >
          {fallbackView}
        </div>
      ) : (
        <CanvasErrorBoundary
          fallback={
            <div
              data-cursor="nexus-3d"
              className="w-full h-full pointer-events-auto"
            >
              {fallbackView}
            </div>
          }
        >
          <div
            data-cursor="nexus-3d"
            className="w-full h-full pointer-events-auto"
          >
            <Canvas
              dpr={capability.dpr}
              camera={{ position: [0, 0.35, 6.8], fov: 42, near: 0.1, far: 60 }}
              gl={{
                antialias: !capability.isMobile,
                alpha: true,
                powerPreference: 'high-performance',
              }}
              onCreated={() => onSceneReady?.()}
              style={{ width: '100%', height: '100%', touchAction: 'pan-y' }}
            >
              <ParticleField
                count={capability.particleCount}
                prefersReducedMotion={capability.prefersReducedMotion}
                scrollProgress={scrollProgress}
                mode={mode}
              />
              <RubikNexusCore
                mode={mode}
                scrollProgress={scrollProgress}
                activeSection={activeSection}
                interactive={!capability.prefersReducedMotion}
                isMobile={capability.isMobile}
                prefersReducedMotion={capability.prefersReducedMotion}
                selectedServiceId={selectedServiceId}
                onCubieSelect={handleCubieSelect}
                onCubieHover={handleCubieHover}
              />
            </Canvas>
          </div>
        </CanvasErrorBoundary>
      )}

      {tooltipNode}
    </div>
  );
};

export default RubikSceneCanvas;
