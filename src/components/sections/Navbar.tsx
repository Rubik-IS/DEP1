import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowUpRight, ChevronDown } from 'lucide-react';
import { COMPANY_INFO } from '../../data/rubikData';
import { SOLUTIONS_LIST } from '../../data/solutions';
import { MagneticButton } from '../ui/MagneticButton';
import { scrollToSection } from '../../lib/animation';
import { trackNavClick, trackSolutionEvent, trackCtaClick } from '../../lib/analytics';
import type { NexusMode } from '../canvas/RubikNexusCore';

export interface NavbarProps {
  activeSection?: string;
  nexusMode?: NexusMode;
  onToggleNexusMode?: () => void;
}

interface NavItem {
  label: string;
  to: string;
  index: string;
  isServicesAnchor?: boolean;
}

const NAV_ITEMS_PRIMARY: NavItem[] = [
  { label: 'Services', to: '/#services', index: '01', isServicesAnchor: true },
];

const NAV_ITEMS_AFTER_SOLUTIONS: NavItem[] = [
  { label: 'Industries', to: '/industries', index: '03' },
  { label: 'Events', to: '/events', index: '04' },
  { label: 'About', to: '/about', index: '05' },
  { label: 'Contact', to: '/contact', index: '06' },
];

export const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsDropdownOpen, setSolutionsDropdownOpen] = useState(false);
  const [mobileSolutionsExpanded, setMobileSolutionsExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const openedByHoverRef = useRef<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    setMobileSolutionsExpanded(false);
  }, []);

  useEffect(() => {
    closeMobileMenu();
    setSolutionsDropdownOpen(false);
  }, [location.pathname, closeMobileMenu]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (solutionsDropdownOpen) setSolutionsDropdownOpen(false);
        if (mobileMenuOpen) closeMobileMenu();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSolutionsDropdownOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen, solutionsDropdownOpen, closeMobileMenu]);

  const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    closeMobileMenu();
    setSolutionsDropdownOpen(false);
    trackNavClick('Rubik Integrated Systems', '/');
    if (location.pathname === '/') {
      e.preventDefault();
      scrollToSection('top');
    }
  };

  const handleServicesClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    closeMobileMenu();
    setSolutionsDropdownOpen(false);
    trackNavClick('Services', '/#services');
    if (location.pathname === '/') {
      scrollToSection('services');
    } else {
      navigate('/#services');
      requestAnimationFrame(() => scrollToSection('services'));
    }
  };

  const handleDiscussProject = () => {
    closeMobileMenu();
    setSolutionsDropdownOpen(false);
    trackCtaClick('Discuss a Project', 'navbar');
    if (location.pathname === '/') {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        scrollToSection('contact');
        return;
      }
    }
    navigate('/contact');
  };

  const openDropdownWithCancel = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (!solutionsDropdownOpen) {
      openedByHoverRef.current = true;
      setSolutionsDropdownOpen(true);
    }
  };

  const scheduleDropdownClose = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => {
      openedByHoverRef.current = false;
      setSolutionsDropdownOpen(false);
    }, 140);
  };

  const handleSolutionsButtonClick = () => {
    if (openedByHoverRef.current) {
      openedByHoverRef.current = false;
      setSolutionsDropdownOpen(true);
      return;
    }
    setSolutionsDropdownOpen((prev) => !prev);
  };

  const isSolutionsActive =
    location.pathname.startsWith('/solutions') ||
    (location.pathname === '/' && activeSection === 'solutions');

  const isNavItemActive = (item: NavItem): boolean => {
    if (item.isServicesAnchor) {
      return (
        location.pathname === '/capabilities' ||
        (location.pathname === '/' && activeSection === 'services')
      );
    }
    if (item.to === '/events' && location.pathname.startsWith('/events')) {
      return true;
    }
    if (location.pathname === item.to) {
      return true;
    }
    if (location.pathname === '/' && activeSection) {
      if (item.to === '/industries' && activeSection === 'industries') return true;
      if (item.to === '/events' && activeSection === 'events') return true;
      if (item.to === '/about' && activeSection === 'about') return true;
      if (item.to === '/contact' && activeSection === 'contact') return true;
    }
    return false;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full py-2.5 sm:py-3 pointer-events-none transition-all duration-300">
      <div className="nexus-container w-full px-[clamp(1rem,3.5vw,4.5rem)]">
        <nav
          aria-label="Primary Navigation"
          className={`pointer-events-auto relative w-full flex items-center justify-between gap-2 lg:gap-3 px-3.5 sm:px-5 xl:px-7 py-2 sm:py-2.5 rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
            isScrolled
              ? 'bg-[#080D1A]/90 border-slate-400/20 shadow-[0_14px_40px_-10px_rgba(0,0,0,0.85)]'
              : 'bg-[#080D1A]/75 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.55)]'
          }`}
        >
          {/* Ambient Architectural Top Hairline */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#38BDF8]/35 to-transparent"
          />

          {/* Refined Brand Lockup */}
          <Link
            to="/"
            onClick={handleBrandClick}
            className="group flex items-center gap-3 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] rounded-xl p-0.5"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#151B29] to-[#080D1A] border border-slate-400/25 group-hover:border-[#38BDF8]/60 shadow-[0_0_18px_rgba(56,189,248,0.12)] transition-all duration-300">
              <svg
                viewBox="0 0 36 36"
                className="w-5 h-5 overflow-visible transition-transform duration-500 ease-out group-hover:rotate-6 motion-reduce:transition-none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="rubikCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#0284C7" />
                  </linearGradient>
                  <linearGradient id="rubikVioletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
                <rect x="3" y="3" width="8" height="8" rx="2" fill="url(#rubikCyanGrad)" opacity="0.85" />
                <rect x="13.5" y="3" width="8" height="8" rx="2" fill="url(#rubikCyanGrad)" opacity="0.9" />
                <rect x="24" y="3" width="8" height="8" rx="2" fill="url(#rubikCyanGrad)" />
                <rect x="3" y="13.5" width="8" height="8" rx="2" fill="url(#rubikCyanGrad)" opacity="0.9" />
                <rect x="13.5" y="13.5" width="8" height="8" rx="2" fill="url(#rubikVioletGrad)" />
                <rect x="24" y="13.5" width="8" height="8" rx="2" fill="url(#rubikCyanGrad)" opacity="0.95" />
                <rect x="3" y="24" width="8" height="8" rx="2" fill="url(#rubikCyanGrad)" opacity="0.8" />
                <rect x="13.5" y="24" width="8" height="8" rx="2" fill="url(#rubikCyanGrad)" opacity="0.9" />
                <rect
                  x="25.8"
                  y="25.8"
                  width="8"
                  height="8"
                  rx="2"
                  fill="url(#rubikVioletGrad)"
                  className="animate-pulse motion-reduce:animate-none transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                />
              </svg>
            </div>

            <div className="flex flex-col leading-none">
              <span className="font-display text-sm sm:text-base font-bold tracking-[0.14em] text-white group-hover:text-[#38BDF8] transition-colors">
                RUBIK
              </span>
              <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-slate-400 mt-0.5">
                INTEGRATED SYSTEMS<span className="sr-only"> Home</span>
              </span>
            </div>
          </Link>

          {/* Desktop (lg: 1024px+) Navigation Links */}
          <div className="hidden lg:flex items-center gap-0.5 xl:gap-2 min-w-0">
            {/* 01 Services */}
            {NAV_ITEMS_PRIMARY.map((item) => {
              const active = isNavItemActive(item);
              return (
                <a
                  key={item.label}
                  href={item.to}
                  onClick={handleServicesClick}
                  aria-current={active ? 'page' : undefined}
                  className={`relative px-2 xl:px-3 py-1.5 rounded-xl text-[13px] xl:text-sm font-medium whitespace-nowrap transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] ${
                    active
                      ? 'text-white bg-white/[0.06]'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <span className="hidden xl:inline font-mono text-[10px] text-slate-400 mr-1.5">
                    {item.index}
                  </span>
                  {item.label}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-1 left-2 right-2 lg:left-3 lg:right-3 h-px bg-gradient-to-r from-[#38BDF8] to-[#6366F1]"
                    />
                  )}
                </a>
              );
            })}

            {/* 02 Solutions Dropdown Menu */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={openDropdownWithCancel}
              onMouseLeave={scheduleDropdownClose}
            >
              <button
                type="button"
                aria-expanded={solutionsDropdownOpen}
                aria-haspopup="menu"
                aria-controls="solutions-desktop-menu"
                onClick={handleSolutionsButtonClick}
                className={`relative inline-flex items-center gap-1 px-2 xl:px-3 py-1.5 rounded-xl text-[13px] xl:text-sm font-medium whitespace-nowrap transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] ${
                  isSolutionsActive || solutionsDropdownOpen
                    ? 'text-white bg-white/[0.06]'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <span className="hidden xl:inline font-mono text-[10px] text-slate-400 mr-1">
                  02
                </span>
                <span>Solutions</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#38BDF8] transition-transform duration-200 ${
                    solutionsDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
                {isSolutionsActive && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1 left-2 right-2 lg:left-3 lg:right-3 h-px bg-gradient-to-r from-[#38BDF8] to-[#6366F1]"
                  />
                )}
              </button>

              {solutionsDropdownOpen && (
                <div
                  id="solutions-desktop-menu"
                  role="menu"
                  aria-label="Rubik Operational Solutions"
                  className="absolute left-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-[#080D1A]/95 backdrop-blur-2xl border border-slate-400/20 shadow-[0_24px_60px_rgba(0,0,0,0.85),0_0_24px_rgba(56,189,248,0.1)] p-2.5 z-50"
                >
                  <div className="px-3 py-2 border-b border-white/10 mb-1.5 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#38BDF8]">
                      // SPECIALIZED PLATFORMS
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      02 SYSTEMS
                    </span>
                  </div>

                  <div className="space-y-1">
                    {SOLUTIONS_LIST.map((solution) => {
                      const isCurrent = location.pathname === solution.route;
                      return (
                        <Link
                          key={solution.id}
                          to={solution.route}
                          role="menuitem"
                          onClick={() => {
                            setSolutionsDropdownOpen(false);
                            trackSolutionEvent('solution_navigation_click', {
                              solution_id: solution.id,
                              solution_name: solution.title,
                              destination: solution.route,
                              nav_surface: 'desktop_dropdown',
                            });
                          }}
                          className={`group flex items-start justify-between gap-3 p-3 rounded-xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] ${
                            isCurrent
                              ? 'bg-[#38BDF8]/12 border-[#38BDF8]/40 text-white'
                              : 'bg-transparent border-transparent hover:bg-[#151B29]/80 hover:border-white/10 text-slate-200'
                          }`}
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] text-[#38BDF8]">
                                {solution.index}
                              </span>
                              <span className="font-display text-sm font-semibold text-white group-hover:text-[#38BDF8] transition-colors">
                                {solution.title}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {solution.summary}
                            </p>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#38BDF8] shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 03–06 Remaining Routes */}
            {NAV_ITEMS_AFTER_SOLUTIONS.map((item) => {
              const active = isNavItemActive(item);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => trackNavClick(item.label, item.to)}
                  aria-current={active ? 'page' : undefined}
                  className={`relative px-2 xl:px-3 py-1.5 rounded-xl text-[13px] xl:text-sm font-medium whitespace-nowrap transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] ${
                    active
                      ? 'text-white bg-white/[0.06]'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <span className="hidden xl:inline font-mono text-[10px] text-slate-400 mr-1.5">
                    {item.index}
                  </span>
                  {item.label}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-1 left-2 right-2 lg:left-3 lg:right-3 h-px bg-gradient-to-r from-[#38BDF8] to-[#6366F1]"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Control: Discuss a Project CTA (visible from lg: 1024px+) */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <MagneticButton
              variant="primary"
              size="sm"
              onClick={handleDiscussProject}
              className="!px-3 xl:!px-4 !py-1.5 text-xs xl:text-sm whitespace-nowrap"
            >
              <span>Discuss a Project</span>
              <ArrowUpRight className="w-3.5 h-3.5 lg:w-4 lg:h-4 ml-1 inline-block" />
            </MagneticButton>
          </div>

          {/* Mobile & Tablet Drawer Trigger (< 1024px) */}
          <div className="flex items-center gap-2 lg:hidden shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="rubik-mobile-drawer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="p-2 rounded-xl bg-[#151B29]/90 border border-white/15 text-slate-200 hover:text-white hover:border-[#38BDF8]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Responsive Accessible Mobile & Tablet Menu Drawer (< 1024px) */}
        {mobileMenuOpen && (
          <div
            id="rubik-mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Drawer"
            className="pointer-events-auto mt-2 w-full max-w-full overflow-x-clip rounded-2xl bg-[#080D1A]/95 backdrop-blur-2xl border border-slate-400/20 shadow-[0_24px_60px_rgba(0,0,0,0.85)] p-5 lg:hidden"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#38BDF8]">
                // NAVIGATION
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                {COMPANY_INFO.concept}
              </span>
            </div>

            <div className="flex flex-col space-y-1.5">
              {NAV_ITEMS_PRIMARY.map((item) => {
                const active = isNavItemActive(item);
                return (
                  <a
                    key={item.label}
                    href={item.to}
                    onClick={handleServicesClick}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[#38BDF8]/12 text-white border border-[#38BDF8]/35'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-xs text-[#38BDF8]">{item.index}</span>
                      <span>{item.label}</span>
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </a>
                );
              })}

              {/* Expandable Mobile Solutions Submenu */}
              <div className="rounded-xl border border-white/10 bg-[#151B29]/45 overflow-hidden">
                <button
                  type="button"
                  aria-expanded={mobileSolutionsExpanded}
                  onClick={() => setMobileSolutionsExpanded((prev) => !prev)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors ${
                    isSolutionsActive ? 'text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-xs text-[#38BDF8]">02</span>
                    <span>Solutions</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#38BDF8] transition-transform duration-200 ${
                      mobileSolutionsExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {mobileSolutionsExpanded && (
                  <div className="px-3 pb-3 space-y-1.5 border-t border-white/10 pt-2">
                    {SOLUTIONS_LIST.map((solution) => {
                      const isCurrent = location.pathname === solution.route;
                      return (
                        <Link
                          key={solution.id}
                          to={solution.route}
                          onClick={() => {
                            closeMobileMenu();
                            trackSolutionEvent('solution_navigation_click', {
                              solution_id: solution.id,
                              solution_name: solution.title,
                              destination: solution.route,
                              nav_surface: 'mobile_drawer',
                            });
                          }}
                          className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                            isCurrent
                              ? 'bg-[#38BDF8]/15 text-white border border-[#38BDF8]/35'
                              : 'text-slate-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span className="truncate">{solution.title}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {NAV_ITEMS_AFTER_SOLUTIONS.map((item) => {
                const active = isNavItemActive(item);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => {
                      closeMobileMenu();
                      trackNavClick(item.label, item.to);
                    }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[#38BDF8]/12 text-white border border-[#38BDF8]/35'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-xs text-[#38BDF8]">{item.index}</span>
                      <span>{item.label}</span>
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </Link>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-white/10">
              <MagneticButton
                variant="primary"
                size="md"
                onClick={handleDiscussProject}
                className="w-full justify-center"
              >
                <span>Discuss a Project</span>
                <ArrowUpRight className="w-4 h-4 ml-1.5 inline-block" />
              </MagneticButton>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
