import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Server,
  ShieldCheck,
  Code2,
  Database,
  Factory,
  Compass,
  Headphones,
  Bot,
  ArrowUpRight,
  ChevronRight,
  Check,
  BookOpen,
} from 'lucide-react';
import { SERVICES_LIST, type ServiceItem } from '../../data/rubikData';
import { SectionHeading } from '../ui/SectionHeading';
import { MagneticButton } from '../ui/MagneticButton';
import {
  prefersReducedMotion,
  scrollToExactY,
  scrollToSection,
  useSectionReveal,
} from '../../lib/animation';
import { trackServiceEvent } from '../../lib/analytics';

export interface ServicesProps {
  activeServiceId?: string | null;
  onSelectService?: (serviceId: string | null) => void;
  onSelectServiceForContact?: (serviceTitle: string) => void;
}

const SERVICE_ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Server,
  ShieldCheck,
  Code2,
  Database,
  Factory,
  Compass,
  Headphones,
  Bot,
};

export const Services: React.FC<ServicesProps> = ({
  activeServiceId,
  onSelectService,
  onSelectServiceForContact,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [internalSelectedId, setInternalSelectedId] = useState<string>(
    SERVICES_LIST[0].id
  );
  const [mobileExpandedId, setMobileExpandedId] = useState<string | null>(
    activeServiceId ?? null
  );
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [detailExpanded, setDetailExpanded] = useState<boolean>(false);
  const navigate = useNavigate();

  useSectionReveal(sectionRef, { stagger: 0.08, y: 24 });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mql = window.matchMedia('(min-width: 1024px)');
    const syncBreakpoint = () => setIsDesktop(mql.matches);
    syncBreakpoint();
    mql.addEventListener('change', syncBreakpoint);
    return () => mql.removeEventListener('change', syncBreakpoint);
  }, []);

  useEffect(() => {
    if (activeServiceId) {
      setInternalSelectedId(activeServiceId);
      setMobileExpandedId(activeServiceId);
    }
  }, [activeServiceId]);

  const resolvedServiceId = activeServiceId || internalSelectedId;
  const activeService: ServiceItem =
    SERVICES_LIST.find((s) => s.id === resolvedServiceId) ?? SERVICES_LIST[0];

  const handleSelectService = (service: ServiceItem) => {
    const isStackedViewport =
      typeof window !== 'undefined' ? window.innerWidth < 1024 : !isDesktop;

    if (isStackedViewport) {
      const isCollapsing = mobileExpandedId === service.id;
      if (isCollapsing) {
        setMobileExpandedId(null);
        if (activeServiceId === service.id) {
          onSelectService?.(null);
        }
        setDetailExpanded(false);
        return;
      }

      setMobileExpandedId(service.id);
      setInternalSelectedId(service.id);
      onSelectService?.(service.id);
      setDetailExpanded(false);
      trackServiceEvent('service_select', {
        service_id: service.id,
        service_name: service.title,
        service_category: service.category,
        interaction_source: 'services_list_mobile',
      });
      trackServiceEvent('service_view', {
        service_id: service.id,
        service_name: service.title,
        service_category: service.category,
      });

      requestAnimationFrame(() => {
        const tabEl = tabRefs.current[service.id];
        if (!tabEl) return;
        const rect = tabEl.getBoundingClientRect();
        const navbarOffset = 96;
        if (rect.top < navbarOffset || rect.top > window.innerHeight * 0.65) {
          const targetY = Math.max(0, window.scrollY + rect.top - navbarOffset);
          scrollToExactY(targetY, { immediate: prefersReducedMotion() });
        }
      });
      return;
    }

    // Desktop two-column behavior: keep panel active without collapsing
    setInternalSelectedId(service.id);
    setMobileExpandedId(service.id);
    onSelectService?.(service.id);
    setDetailExpanded(false);
    trackServiceEvent('service_select', {
      service_id: service.id,
      service_name: service.title,
      service_category: service.category,
      interaction_source: 'services_list',
    });
    trackServiceEvent('service_view', {
      service_id: service.id,
      service_name: service.title,
      service_category: service.category,
    });
  };

  const handleDiscussService = (service: ServiceItem) => {
    trackServiceEvent('service_cta_click', {
      service_id: service.id,
      service_name: service.title,
      source: 'services_section',
    });
    onSelectServiceForContact?.(service.title);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      scrollToSection('contact');
    } else {
      navigate('/contact', { state: { preselectedService: service.title } });
    }
  };

  const renderServiceCardContent = (service: ServiceItem) => {
    const CardIcon = SERVICE_ICON_MAP[service.iconName] ?? Server;
    const serviceHasSubgroups = Boolean(
      service.subgroups && service.subgroups.length > 0
    );
    const serviceHasFrameworks = Boolean(
      service.frameworks && service.frameworks.length > 0
    );

    return (
      <>
        <div className="space-y-5">
          {/* 1. Service Title & Category */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#080D1A] border border-white/15 flex items-center justify-center text-[#38BDF8] shrink-0">
                <CardIcon className="w-5 h-5" />
              </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#38BDF8]">
                SERVICE {service.index} // {service.category.toUpperCase()}
              </div>
              <h4 className="font-display text-xl sm:text-2xl lg:text-[1.65rem] font-bold text-white mt-0.5 leading-snug">
                {service.title}
              </h4>
            </div>
          </div>
        </div>

        {/* 2. Concise Introduction */}
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed lg:min-h-[3.25rem]">
          {service.description}
        </p>

        {/* 3. Standardized 6 Key Capabilities */}
        <div className="space-y-2.5">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
            KEY CAPABILITIES &amp; OFFERINGS
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {service.capabilities.slice(0, 6).map((cap) => (
              <li
                key={cap}
                className="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-200 py-2.5 px-3 rounded-xl bg-[#080D1A]/55 border border-white/10 min-h-[3.25rem]"
              >
                <Check className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                <span className="leading-snug">{cap}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 4. Business Value Delivered */}
        <div className="rounded-2xl bg-[#080D1A]/65 border border-[#38BDF8]/20 p-4 space-y-1.5">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#38BDF8]">
            BUSINESS VALUE DELIVERED
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {service.businessValue}
          </p>
        </div>

        {/* Expandable Contextual "Learn More" Drawer (Frameworks, Tracks & Platforms) */}
        {detailExpanded && (
          <div className="rounded-2xl bg-[#080D1A]/85 border border-[#38BDF8]/25 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#38BDF8]">
                TECHNICAL PLATFORMS &amp; DELIVERY MODEL
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                {service.cubieRangeLabel}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {service.technologies.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-xs px-2.5 py-1 rounded-lg bg-[#151B29] text-slate-200 border border-white/10"
                >
                  {tech}
                </span>
              ))}
            </div>
            {serviceHasSubgroups && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {service.subgroups!.map((group) => (
                  <div
                    key={group.label}
                    className="rounded-xl bg-[#151B29]/60 border border-white/10 p-3 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
                        {group.label}
                      </span>
                      <h5 className="font-display text-xs font-semibold text-white">
                        {group.title}
                      </h5>
                    </div>
                    <ul className="space-y-1">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-1.5 text-[11px] text-slate-300"
                        >
                          <Check className="w-3 h-3 text-[#38BDF8] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
            {serviceHasFrameworks && (
              <div className="space-y-2 pt-1">
                <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#38BDF8]">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Referenced Frameworks &amp; Standards</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {service.frameworks!.map((fw) => (
                    <div
                      key={fw.name}
                      className="p-2 rounded-lg bg-[#151B29]/60 border border-white/5"
                    >
                      <div className="font-mono text-[11px] font-semibold text-white">
                        {fw.name}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {fw.focus}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p className="text-xs text-slate-400 leading-relaxed">
              Delivered end-to-end by Rubik Integrated Systems with unified discovery,
              architecture alignment, integration testing, and ongoing 24/7 technical support.
            </p>
          </div>
        )}
      </div>

      {/* 5. Clear Call to Action Footer */}
      <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
        <MagneticButton
          variant="primary"
          size="sm"
          onClick={() => handleDiscussService(service)}
          className="font-mono text-xs uppercase tracking-[0.14em]"
        >
          <span>{service.ctaLabel}</span>
          <ArrowUpRight className="w-4 h-4 ml-1.5 inline-block" />
        </MagneticButton>

        <button
          type="button"
          onClick={() => {
            const nextExpanded = !detailExpanded;
            setDetailExpanded(nextExpanded);
            if (nextExpanded) {
              trackServiceEvent('service_details_open', {
                service_id: service.id,
                service_name: service.title,
              });
            }
          }}
          aria-expanded={detailExpanded}
          className="font-mono text-xs uppercase tracking-[0.16em] text-slate-300 hover:text-[#38BDF8] transition-colors"
        >
          {detailExpanded ? 'Hide Technical Stack ↑' : 'Learn More →'}
        </button>
      </div>
    </>
    );
  };

  return (
    <section
      id="services"
      data-analytics-section="services"
      ref={sectionRef}
      aria-label="Our Services — Integrated Technology Groups"
      className="nexus-section relative w-full border-t border-white/10 bg-[#080D1A]/65 overflow-x-clip"
    >
      <div className="nexus-container w-full px-[clamp(1rem,3.5vw,4.5rem)] space-y-12 xl:space-y-14">
        <SectionHeading
          indexTag="// 02"
          eyebrow="OUR SERVICES"
          title="FROM TECHNOLOGY REQUIREMENTS"
          highlight="TO WORKING SOLUTIONS."
          description="Select any practice area below—or click a module directly on the 3D Rubik Nexus—to inspect its capabilities, technical coverage, and deployment scope."
          align="left"
        />

        {/* Balanced Fixed-Alignment Two-Panel Service Explorer */}
        <div
          data-reveal
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-stretch"
        >
          {/* Left Column: 8-Group Interactive Editorial List (Stable Height & Position) */}
          <div
            role="tablist"
            aria-label="Rubik Integrated Systems Service Groups"
            className="lg:col-span-5 flex flex-col divide-y divide-white/10 border-y border-white/10 h-full"
          >
            {SERVICES_LIST.map((service) => {
              const IconComponent =
                SERVICE_ICON_MAP[service.iconName] ?? Server;
              const isDesktopSelected = service.id === activeService.id;
              const isMobileExpanded = mobileExpandedId === service.id;
              const isHighlighted = isDesktop
                ? isDesktopSelected
                : isMobileExpanded;

              return (
                <div key={service.id} className="flex-1 flex flex-col">
                  <button
                    ref={(el) => {
                      tabRefs.current[service.id] = el;
                    }}
                    type="button"
                    role={isDesktop ? 'tab' : undefined}
                    id={`service-tab-${service.id}`}
                    aria-selected={isDesktop ? isDesktopSelected : undefined}
                    aria-expanded={!isDesktop ? isMobileExpanded : undefined}
                    aria-controls={
                      isDesktop
                        ? `service-panel-${service.id}`
                        : `service-panel-mobile-${service.id}`
                    }
                    onClick={() => handleSelectService(service)}
                    className={`group flex-1 flex items-center w-full text-left py-3.5 px-4 sm:px-5 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] relative ${
                      isHighlighted
                        ? 'bg-[#151B29]/75'
                        : 'bg-transparent hover:bg-white/[0.025]'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-300 ${
                        isHighlighted ? 'bg-[#38BDF8]' : 'bg-transparent group-hover:bg-white/20'
                      }`}
                    />

                    <div className="flex items-center justify-between gap-4 w-full">
                      <div className="flex items-center gap-4 min-w-0">
                        <span
                          className={`font-mono text-xs font-semibold shrink-0 transition-colors ${
                            isHighlighted ? 'text-[#38BDF8]' : 'text-slate-400'
                          }`}
                        >
                          {service.index}
                        </span>

                        <div
                          className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                            isHighlighted
                              ? 'bg-[#080D1A] border-[#38BDF8]/40 text-[#38BDF8]'
                              : 'bg-[#0E172F]/60 border-white/10 text-slate-400 group-hover:text-slate-200'
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">
                          <h3
                            className={`font-display text-lg sm:text-xl font-bold truncate transition-colors ${
                              isHighlighted
                                ? 'text-white'
                                : 'text-slate-300 group-hover:text-white'
                            }`}
                          >
                            {service.title}
                          </h3>
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {service.category}
                          </p>
                        </div>
                      </div>

                      <ChevronRight
                        className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                          isHighlighted
                            ? 'text-[#38BDF8] rotate-90 lg:rotate-0 lg:translate-x-0.5'
                            : 'text-slate-500 group-hover:text-slate-300'
                        }`}
                      />
                    </div>
                  </button>

                  {/* Responsive Inline Accordion Card (< 1024px only): smooth expand/collapse toggle */}
                  <div
                    id={`service-panel-mobile-${service.id}`}
                    role="region"
                    aria-labelledby={`service-tab-${service.id}`}
                    aria-hidden={!isMobileExpanded}
                    className={`lg:hidden grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                      isMobileExpanded
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="overflow-hidden min-h-0">
                      {isMobileExpanded && (
                        <div className="py-3 px-1 sm:px-2">
                          <div className="smoked-glass rounded-2xl p-5 sm:p-7 flex flex-col justify-between gap-5 border border-[#38BDF8]/25">
                            {renderServiceCardContent(service)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Desktop Two-Column Detail Panel (lg: 1024px+) */}
          <div
            id={`service-panel-${activeService.id}`}
            role="tabpanel"
            aria-labelledby={`service-tab-${activeService.id}`}
            className="hidden lg:flex lg:col-span-7 smoked-glass rounded-3xl p-6 sm:p-8 lg:p-9 flex-col justify-between gap-5 h-full lg:min-h-[736px] xl:min-h-[660px] 2xl:min-h-[650px]"
          >
            {renderServiceCardContent(activeService)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
