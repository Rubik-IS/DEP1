import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ChevronDown,
  X,
  Check,
  ArrowUpRight,
} from 'lucide-react';
import { SERVICES_LIST } from '../../data/rubikData';
import { MagneticButton } from '../ui/MagneticButton';
import { scrollToSection } from '../../lib/animation';
import {
  trackCtaClick,
  trackCubeStateChange,
  trackServiceEvent,
} from '../../lib/analytics';
import type { NexusMode } from '../canvas/RubikNexusCore';

export interface HeroProps {
  nexusMode: NexusMode;
  onChangeNexusMode: (mode: NexusMode) => void;
  activeServiceId: string | null;
  hoveredService: { serviceId: string; serviceTitle: string } | null;
  onSelectService: (serviceId: string | null) => void;
  onDiscussService: (serviceTitle: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  nexusMode,
  onChangeNexusMode,
  activeServiceId,
  hoveredService: _hoveredService,
  onSelectService,
  onDiscussService,
}) => {
  const navigate = useNavigate();
  const [isCubeTransitioning, setIsCubeTransitioning] = useState(false);
  const transitionLockRef = useRef(false);

  const handleToggleCubeFromIndicator = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    if (e.detail > 0) {
      e.currentTarget.blur();
    }
    if (transitionLockRef.current) return;
    transitionLockRef.current = true;
    setIsCubeTransitioning(true);

    const nextMode: NexusMode =
      nexusMode === 'exploded' ? 'assembled' : 'exploded';
    onChangeNexusMode(nextMode);
    trackCubeStateChange({
      cube_state: nextMode,
      interaction_type: 'hero_rubik_logo_click',
    });

    window.setTimeout(() => {
      transitionLockRef.current = false;
      setIsCubeTransitioning(false);
    }, 750);
  };

  const activeService = activeServiceId
    ? SERVICES_LIST.find((s) => s.id === activeServiceId) ?? null
    : null;

  const handleExploreServices = (e: React.MouseEvent) => {
    e.preventDefault();
    trackCtaClick('Explore Our Services', 'hero');
    const servicesEl = document.getElementById('services');
    if (servicesEl) {
      scrollToSection('services');
    } else {
      navigate('/capabilities');
    }
  };

  const handleDiscussProject = (e: React.MouseEvent) => {
    e.preventDefault();
    trackCtaClick('Discuss a Project', 'hero');
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      scrollToSection('contact');
    } else {
      navigate('/contact');
    }
  };

  const handleViewInServices = () => {
    if (activeService) {
      onSelectService(activeService.id);
      trackServiceEvent('service_navigation_click', {
        service_id: activeService.id,
        service_name: activeService.title,
        source: 'hero_focus_panel',
      });
    }
    const servicesEl = document.getElementById('services');
    if (servicesEl) {
      scrollToSection('services');
    } else {
      navigate('/capabilities');
    }
  };

  return (
    <section
      id="hero"
      data-analytics-section="hero"
      aria-label="Rubik Integrated Systems — Technology, Connected."
      className="hero-viewport w-full min-h-[100svh] lg:h-[100svh] lg:max-h-[100svh] relative overflow-clip flex flex-col justify-between pt-[5.75rem] sm:pt-[6.25rem] lg:pt-[5.5rem] xl:pt-[6rem] pb-4 lg:pb-5 xl:pb-6 pointer-events-none"
    >
      {/* Subtle Ambient Architectural Light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/4 w-[38rem] h-[38rem] rounded-full bg-[#38BDF8]/8 blur-[145px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 right-12 w-[30rem] h-[30rem] rounded-full bg-[#6366F1]/8 blur-[145px]"
      />

      {/* Main Hero Grid */}
      <div className="nexus-container relative z-10 w-full px-[clamp(1rem,3.5vw,4.5rem)] flex-1 flex flex-col justify-center min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-center">
          {/* Left Column: Immediate LCP Render at opacity: 1, y: 0 (Zero CLS) */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-3.5 sm:space-y-4 pointer-events-auto">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
              <span className="font-mono text-[11px] sm:text-xs font-medium uppercase tracking-[0.22em] text-slate-300">
                RUBIK INTEGRATED SYSTEMS <span className="text-[#38BDF8] mx-1">|</span> EST. 2021
              </span>
            </div>

            {/* Primary Headline */}
            <div className="space-y-3.5">
              <h1 className="font-display text-[clamp(2.15rem,min(4.7vw,6.4vh),4.85rem)] font-bold tracking-tight text-white leading-[0.98]">
                MAKE EVERY SYSTEM{' '}
                <span className="bg-gradient-to-r from-[#38BDF8] via-[#7DD3FC] to-[#6366F1] bg-clip-text text-transparent">
                  WORK AS ONE.
                </span>
              </h1>

              <p className="text-sm sm:text-base xl:text-lg text-slate-300 max-w-xl leading-relaxed font-normal">
                We connect infrastructure, software and business systems to create integrated
                technology solutions that move your business forward.
              </p>
            </div>

            {/* Editorial CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-0.5">
              <MagneticButton
                variant="primary"
                size="md"
                href="#services"
                onClick={handleExploreServices}
                className="group font-mono text-xs uppercase tracking-[0.14em]"
              >
                <span>EXPLORE OUR SERVICES</span>
                <ArrowRight className="w-4 h-4 ml-1.5 inline-block transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticButton>

              <MagneticButton
                variant="secondary"
                size="md"
                href="#contact"
                onClick={handleDiscussProject}
                className="font-mono text-xs uppercase tracking-[0.14em]"
              >
                <span>DISCUSS A PROJECT</span>
              </MagneticButton>
            </div>

            {/* Metadata Line */}
            <div className="pt-1 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-slate-400">
              CAIRO, EGYPT · INFRASTRUCTURE · SOFTWARE · ENTERPRISE SYSTEMS
            </div>
          </div>

          {/* Right Column: Service Focus Panel when a 3D Cubie or Touch Chip is Selected */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-end justify-center pointer-events-none">
            {activeService && (
              <div
                role="region"
                aria-label={`Selected Service: ${activeService.title}`}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                className="pointer-events-auto relative z-20 w-full max-w-md lg:mr-24 rounded-2xl bg-[#080D1A]/90 backdrop-blur-2xl border border-[#38BDF8]/40 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(56,189,248,0.14)] space-y-4"
              >
                <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#38BDF8]">
                      {activeService.cubieRangeLabel}
                    </div>
                    <h2 className="font-display text-lg sm:text-xl font-bold text-white mt-0.5">
                      {activeService.title}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectService(null);
                      onChangeNexusMode('assembled');
                    }}
                    aria-label="Close service preview"
                    className="p-1.5 rounded-lg bg-[#151B29] border border-white/10 text-slate-300 hover:text-white hover:border-[#38BDF8]/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activeService.description}
                </p>

                <ul className="space-y-1.5">
                  {activeService.deliverables.slice(0, 3).map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs text-slate-200"
                    >
                      <Check className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5">
                  <MagneticButton
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      trackServiceEvent('service_cta_click', {
                        service_id: activeService.id,
                        service_name: activeService.title,
                        source: 'hero_focus_panel',
                      });
                      onDiscussService(activeService.title);
                    }}
                    className="!px-3.5 !py-2 text-xs font-mono uppercase tracking-wider"
                  >
                    <span>Discuss This Service</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1 inline-block" />
                  </MagneticButton>

                  <button
                    type="button"
                    data-interactive="true"
                    data-cursor="interactive"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewInServices();
                    }}
                    className="font-mono text-[11px] uppercase tracking-wider text-slate-300 hover:text-[#38BDF8] transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
                  >
                    View in Services ↓
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Borderless Animated Middle-Right Rubik Icon + Text Cube Toggle */}
      <button
        type="button"
        data-cursor="nexus-3d"
        data-interactive="true"
        disabled={isCubeTransitioning}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={handleToggleCubeFromIndicator}
        aria-label={
          nexusMode === 'exploded'
            ? 'Assemble 3D Rubik Cube. Click a block to inspect services.'
            : 'Explode 3D Rubik Cube. Click a block to inspect services.'
        }
        aria-pressed={nexusMode === 'exploded'}
        className="group pointer-events-auto absolute bottom-24 right-4 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:right-6 z-20 flex flex-col items-center gap-2 appearance-none bg-transparent border-0 shadow-none p-1 select-none [-webkit-tap-highlight-color:transparent] !outline-none focus:!outline-none focus-visible:!outline-none focus-visible:ring-0 active:bg-transparent active:!outline-none transition-transform duration-300 disabled:opacity-75"
      >
        <span
          className={`relative flex items-center justify-center w-8 h-8 transition-all duration-500 ease-out drop-shadow-[0_0_12px_rgba(56,189,248,0.45)] group-hover:drop-shadow-[0_0_18px_rgba(56,189,248,0.8)] group-focus-visible:drop-shadow-[0_0_22px_rgba(56,189,248,0.95)] ${
            nexusMode === 'exploded'
              ? 'scale-115 rotate-45'
              : 'motion-safe:animate-[bounce_3.4s_ease-in-out_infinite] group-hover:scale-110 group-hover:rotate-12'
          }`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-7 h-7 text-[#38BDF8]"
            fill="none"
          >
            <rect
              x="2"
              y="2"
              width="5.5"
              height="5.5"
              rx="1.2"
              fill="currentColor"
              className="transition-transform duration-500 origin-center group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 motion-safe:animate-pulse"
              fillOpacity="0.95"
            />
            <rect x="9.25" y="2" width="5.5" height="5.5" rx="1.2" fill="currentColor" fillOpacity="0.45" />
            <rect
              x="16.5"
              y="2"
              width="5.5"
              height="5.5"
              rx="1.2"
              fill="#6366F1"
              className="transition-transform duration-500 origin-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              fillOpacity="0.9"
            />
            <rect x="2" y="9.25" width="5.5" height="5.5" rx="1.2" fill="currentColor" fillOpacity="0.45" />
            <rect x="9.25" y="9.25" width="5.5" height="5.5" rx="1.2" fill="#7DD3FC" fillOpacity="0.95" />
            <rect x="16.5" y="9.25" width="5.5" height="5.5" rx="1.2" fill="currentColor" fillOpacity="0.45" />
            <rect
              x="2"
              y="16.5"
              width="5.5"
              height="5.5"
              rx="1.2"
              fill="#6366F1"
              className="transition-transform duration-500 origin-center group-hover:-translate-x-0.5 group-hover:translate-y-0.5"
              fillOpacity="0.9"
            />
            <rect x="9.25" y="16.5" width="5.5" height="5.5" rx="1.2" fill="currentColor" fillOpacity="0.45" />
            <rect
              x="16.5"
              y="16.5"
              width="5.5"
              height="5.5"
              rx="1.2"
              fill="currentColor"
              className="transition-transform duration-500 origin-center group-hover:translate-x-0.5 group-hover:translate-y-0.5 motion-safe:animate-pulse"
              fillOpacity="0.95"
            />
          </svg>
        </span>
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] group-hover:tracking-[0.24em] bg-gradient-to-r from-slate-200 via-[#38BDF8] to-indigo-300 bg-clip-text text-transparent group-hover:from-white group-hover:via-[#7DD3FC] group-hover:to-[#38BDF8] group-focus-visible:underline group-focus-visible:decoration-[#38BDF8] group-focus-visible:underline-offset-4 motion-safe:animate-pulse transition-all duration-300 whitespace-nowrap drop-shadow-[0_2px_8px_rgba(8,13,26,0.9)]">
          Click a block
        </span>
      </button>

      {/* Bottom Spatial Navigation & Drag Instruction */}
      <div className="nexus-container relative z-10 w-full px-[clamp(1rem,3.5vw,4.5rem)] pt-3 border-t border-white/10 pointer-events-auto">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">
            DRAG TO EXPLORE <span className="text-[#38BDF8] mx-1.5">·</span> CLICK BLOCKS TO INSPECT SERVICES
          </span>

          <a
            href="#services"
            onClick={handleExploreServices}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-300 hover:text-[#38BDF8] transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] rounded-lg px-2 py-1"
          >
            <span>02 — OUR SERVICES</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#38BDF8] animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
