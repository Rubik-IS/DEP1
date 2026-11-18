import React, {
  Suspense,
  lazy,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigationType,
  useNavigate,
} from 'react-router-dom';
import type {
  NexusMode,
  CubieHoverInfo,
} from './components/canvas/RubikSceneCanvas';
import { CustomCursor } from './components/ui/CustomCursor';
import { BackToTopButton } from './components/ui/BackToTopButton';
import { CookieConsentBanner } from './components/ui/CookieConsentBanner';
import { NexusPreloader } from './components/ui/NexusPreloader';
import { Navbar } from './components/sections/Navbar';
import { Footer } from './components/sections/Footer';
import { HomePage } from './pages/HomePage';
import { SERVICES_LIST } from './data/rubikData';
import {
  LoadingProgressTracker,
  type LoadingMilestoneId,
  type LoadingProgressSnapshot,
} from './lib/loadingProgress';
import {
  initSmoothScroll,
  refreshScrollEngine,
  scrollToExactY,
  scrollToSection,
} from './lib/animation';
import {
  trackPageView,
  useSectionVisibilityTracker,
} from './lib/analytics';

const RubikSceneCanvas = lazy(
  () => import('./components/canvas/RubikSceneCanvas')
);
const CapabilitiesPage = lazy(() => import('./pages/CapabilitiesPage'));
const IndustriesPage = lazy(() => import('./pages/IndustriesPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const SolutionZKTecoPage = lazy(() => import('./pages/SolutionZKTecoPage'));
const SolutionWeighingPage = lazy(() => import('./pages/SolutionWeighingPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const RouteLoadingFallback: React.FC = () => (
  <div
    role="status"
    aria-live="polite"
    className="min-h-screen flex items-center justify-center px-6 pt-28"
  >
    <div className="font-mono text-xs uppercase tracking-[0.22em] text-[#94A3B8]">
      Loading Rubik Nexus View...
    </div>
  </div>
);

const mapSectionToNexusMode = (sectionId: string): NexusMode => {
  switch (sectionId) {
    case 'hero':
      return 'assembled';
    case 'services':
      return 'exploded';
    case 'solutions':
      return 'pillar-03';
    case 'approach':
      return 'process';
    case 'industries':
      return 'compact';
    case 'events':
      return 'events';
    case 'about':
      return 'assembled';
    case 'contact':
      return 'assembled';
    default:
      return 'assembled';
  }
};

const mapRouteToNexusMode = (pathname: string): NexusMode => {
  if (pathname.startsWith('/capabilities')) return 'exploded';
  if (pathname.startsWith('/solutions/zkteco-attendance')) return 'pillar-03';
  if (pathname.startsWith('/solutions/weighing-management')) return 'matrix';
  if (pathname.startsWith('/industries')) return 'compact';
  if (pathname.startsWith('/events')) return 'events';
  if (pathname.startsWith('/about')) return 'process';
  if (pathname.startsWith('/contact')) return 'assembled';
  return 'assembled';
};

const SCROLL_STORAGE_PREFIX = 'rubik_scroll_pos_';

const getLocationStorageKey = (
  key: string,
  pathname: string,
  search: string
): string => {
  return key && key !== 'default' ? key : `${pathname}${search}`;
};

const AppShell: React.FC = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const navigate = useNavigate();

  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [nexusMode, setNexusMode] = useState<NexusMode>('assembled');
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [hoveredService, setHoveredService] = useState<CubieHoverInfo | null>(
    null
  );
  const [preselectedService, setPreselectedService] = useState<
    string | undefined
  >(undefined);
  const [mount3DCanvas, setMount3DCanvas] = useState<boolean>(false);
  const trackerRef = useRef<LoadingProgressTracker>(new LoadingProgressTracker());
  const [loadingSnapshot, setLoadingSnapshot] =
    useState<LoadingProgressSnapshot>(() =>
      trackerRef.current.getSnapshot(false)
    );
  const [preloaderVisible, setPreloaderVisible] = useState<boolean>(false);
  const [preloaderFading, setPreloaderFading] = useState<boolean>(false);
  const [preloaderCycle, setPreloaderCycle] = useState<number>(0);
  const preloaderDismissedRef = useRef<boolean>(false);

  const completeLoadingMilestone = useCallback((id: LoadingMilestoneId) => {
    const next = trackerRef.current.completeMilestone(id);
    setLoadingSnapshot(next);
  }, []);

  const lastAutoSectionRef = useRef<string>('hero');
  const pathnameRef = useRef<string>(location.pathname);
  pathnameRef.current = location.pathname;

  const scrollPositionsRef = useRef<Map<string, number>>(new Map());
  const isRestoringScrollRef = useRef<boolean>(false);
  const currentLocationKeyRef = useRef<string>(
    getLocationStorageKey(location.key, location.pathname, location.search)
  );
  currentLocationKeyRef.current = getLocationStorageKey(
    location.key,
    location.pathname,
    location.search
  );

  // Track section visibility across routes
  useSectionVisibilityTracker(location.pathname);

  // Intelligent Loading Screen Orchestration:
  // - Suppresses overlay completely when core milestones finish within 450ms.
  // - Shows real milestone progress if loading takes > 450ms.
  // - Enforces 9000ms recovery timeout with Retry & Continue controls.
  useEffect(() => {
    if (preloaderDismissedRef.current) return;

    let cancelled = false;
    const tracker = trackerRef.current;

    const mark = (id: LoadingMilestoneId) => {
      if (cancelled) return;
      const snap = tracker.completeMilestone(id);
      setLoadingSnapshot(snap);
    };

    // 1. Application shell booted
    mark('app_boot');

    // 2. Hero initial layout painted
    const heroRaf = requestAnimationFrame(() => {
      mark('hero_ready');
    });

    // 3. DOM & critical stylesheet/resource readiness
    const handleWindowLoad = () => mark('dom_ready');
    if (document.readyState === 'complete') {
      mark('dom_ready');
    } else {
      window.addEventListener('load', handleWindowLoad, { once: true });
    }

    // 4. Web fonts readiness (capped at 1200ms so blocked font CDNs never stall)
    const fontTimeout = globalThis.setTimeout(() => mark('fonts_ready'), 1200);
    if (document.fonts && typeof document.fonts.ready?.then === 'function') {
      document.fonts.ready
        .then(() => {
          globalThis.clearTimeout(fontTimeout);
          mark('fonts_ready');
        })
        .catch(() => {
          globalThis.clearTimeout(fontTimeout);
          mark('fonts_ready');
        });
    } else {
      globalThis.clearTimeout(fontTimeout);
      mark('fonts_ready');
    }

    // 5. Intelligent 450ms display threshold: only show if core load is still pending
    const showTimer = globalThis.setTimeout(() => {
      if (cancelled || preloaderDismissedRef.current) return;
      const current = tracker.getSnapshot(false);
      const coreReady =
        current.completedMilestones.includes('app_boot') &&
        current.completedMilestones.includes('dom_ready') &&
        current.completedMilestones.includes('hero_ready') &&
        current.completedMilestones.includes('fonts_ready');

      if (!coreReady) {
        setPreloaderFading(false);
        setPreloaderVisible(true);
        setMount3DCanvas(true);
      } else {
        preloaderDismissedRef.current = true;
      }
    }, 450);

    // 6. Hard 9000ms safety timeout so visitors are never stuck
    const recoveryTimer = globalThis.setTimeout(() => {
      if (cancelled || preloaderDismissedRef.current) return;
      const snap = tracker.getSnapshot(true);
      if (snap.status === 'loading') {
        setLoadingSnapshot(tracker.markTimeout());
      }
    }, 9000);

    return () => {
      cancelled = true;
      cancelAnimationFrame(heroRaf);
      window.removeEventListener('load', handleWindowLoad);
      globalThis.clearTimeout(fontTimeout);
      globalThis.clearTimeout(showTimer);
      globalThis.clearTimeout(recoveryTimer);
    };
  }, [preloaderCycle]);

  // Smooth 100% completion fade-out when overlay is visible
  useEffect(() => {
    if (!preloaderVisible || loadingSnapshot.status !== 'ready') return;

    const holdTimer = globalThis.setTimeout(() => {
      setPreloaderFading(true);
    }, 220);

    const unmountTimer = globalThis.setTimeout(() => {
      preloaderDismissedRef.current = true;
      setPreloaderVisible(false);
      setPreloaderFading(false);
    }, 540);

    return () => {
      globalThis.clearTimeout(holdTimer);
      globalThis.clearTimeout(unmountTimer);
    };
  }, [preloaderVisible, loadingSnapshot.status]);

  const handleRetryPreloader = useCallback(() => {
    preloaderDismissedRef.current = false;
    setPreloaderFading(false);
    setPreloaderVisible(true);
    setLoadingSnapshot(trackerRef.current.reset());
    setMount3DCanvas(true);
    setPreloaderCycle((c) => c + 1);
  }, []);

  const handleContinueFromPreloader = useCallback(() => {
    preloaderDismissedRef.current = true;
    setPreloaderFading(true);
    globalThis.setTimeout(() => {
      setPreloaderVisible(false);
      setPreloaderFading(false);
    }, 300);
  }, []);

  // Defer mounting the 3D WebGL canvas until first user interaction or browser idle
  // to protect FCP, LCP, and Total Blocking Time (TBT) on initial load.
  useEffect(() => {
    let mounted = false;
    let timerId: ReturnType<typeof setTimeout> | undefined;
    let idleId: number | undefined;

    const triggerMount = () => {
      if (mounted) return;
      mounted = true;
      cleanupListeners();
      setMount3DCanvas(true);
    };

    const events: Array<keyof WindowEventMap> = [
      'pointerdown',
      'mousemove',
      'touchstart',
      'scroll',
      'keydown',
    ];

    const cleanupListeners = () => {
      events.forEach((evt) => window.removeEventListener(evt, triggerMount));
      if (timerId !== undefined) globalThis.clearTimeout(timerId);
      if (idleId !== undefined && 'cancelIdleCallback' in window) {
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
      }
    };

    events.forEach((evt) =>
      window.addEventListener(evt, triggerMount, { once: true, passive: true })
    );

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(triggerMount, { timeout: 3500 });
    } else {
      timerId = globalThis.setTimeout(triggerMount, 3200);
    }

    return cleanupListeners;
  }, []);

  // Initialize Lenis + GSAP ScrollTrigger scroll tracking
  useEffect(() => {
    const cleanup = initSmoothScroll((progress, currentSection) => {
      setScrollProgress(progress);
      setActiveSection(currentSection);

      if (
        pathnameRef.current === '/' &&
        currentSection &&
        currentSection !== lastAutoSectionRef.current
      ) {
        lastAutoSectionRef.current = currentSection;
        setNexusMode(mapSectionToNexusMode(currentSection));
      }
    });

    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, []);

  // Disable native scrollRestoration so React Router POP restoration is deterministic
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Save current scrollY continuously for active history entry
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const persistCurrentScroll = () => {
      if (isRestoringScrollRef.current) return;
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      const storageKey = currentLocationKeyRef.current;
      scrollPositionsRef.current.set(storageKey, y);
      try {
        sessionStorage.setItem(
          `${SCROLL_STORAGE_PREFIX}${storageKey}`,
          String(y)
        );
      } catch {
        // Ignore storage quota errors in restricted browsing contexts
      }
    };

    window.addEventListener('scroll', persistCurrentScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', persistCurrentScroll);
    };
  }, []);

  // Synchronize route changes with scroll restoration (POP), page view tracking, and 3D state
  useEffect(() => {
    const storageKey = getLocationStorageKey(
      location.key,
      location.pathname,
      location.search
    );

    if (location.pathname === '/') {
      lastAutoSectionRef.current = 'hero';
      setActiveSection('hero');
    }

    setNexusMode(mapRouteToNexusMode(location.pathname));

    // Track SPA page_view after PageMeta updates document.title
    const trackRaf = requestAnimationFrame(() => {
      trackPageView(
        `${location.pathname}${location.search}`,
        document.title
      );
    });

    if (navigationType === 'POP') {
      let savedY = scrollPositionsRef.current.get(storageKey);
      if (typeof savedY !== 'number') {
        try {
          const raw = sessionStorage.getItem(
            `${SCROLL_STORAGE_PREFIX}${storageKey}`
          );
          if (raw !== null) {
            const parsed = Number(raw);
            if (Number.isFinite(parsed)) {
              savedY = parsed;
            }
          }
        } catch {
          // Ignore storage read errors
        }
      }

      const targetY = typeof savedY === 'number' ? savedY : 0;
      isRestoringScrollRef.current = true;

      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          scrollToExactY(targetY, { immediate: true });
          refreshScrollEngine();
          isRestoringScrollRef.current = false;
        });
      });

      return () => {
        cancelAnimationFrame(trackRaf);
        cancelAnimationFrame(raf1);
        if (raf2) cancelAnimationFrame(raf2);
        isRestoringScrollRef.current = false;
      };
    }

    if (location.hash) {
      scrollToSection(location.hash);
    } else {
      scrollToExactY(0, { immediate: true });
    }

    const rafId = requestAnimationFrame(() => {
      refreshScrollEngine();
    });

    return () => {
      cancelAnimationFrame(trackRaf);
      cancelAnimationFrame(rafId);
    };
  }, [
    location.key,
    location.pathname,
    location.search,
    location.hash,
    navigationType,
  ]);

  const handleToggleNexusMode = useCallback(() => {
    setNexusMode((prev) => (prev === 'exploded' ? 'assembled' : 'exploded'));
  }, []);

  const handleChangeNexusMode = useCallback((mode: NexusMode) => {
    setNexusMode(mode);
  }, []);

  const handleSelectService = useCallback((serviceId: string | null) => {
    setActiveServiceId(serviceId);
    if (serviceId) {
      const matched = SERVICES_LIST.find((s) => s.id === serviceId);
      if (matched?.nexusFocusMode) {
        setNexusMode(matched.nexusFocusMode);
      }
    }
  }, []);

  const handleCubieSelect = useCallback(
    (_index: number, _label: string, serviceId?: string) => {
      if (!serviceId) return;
      setActiveServiceId((prev) => {
        const nextId = prev === serviceId ? null : serviceId;
        if (nextId) {
          const matched = SERVICES_LIST.find((s) => s.id === nextId);
          if (matched?.nexusFocusMode) {
            setNexusMode(matched.nexusFocusMode);
          }
        } else {
          setNexusMode('assembled');
        }
        return nextId;
      });
    },
    []
  );

  const handleCubieHover = useCallback((info: CubieHoverInfo | null) => {
    setHoveredService(info);
  }, []);

  const handleSelectServiceForContact = useCallback(
    (serviceTitle: string) => {
      setPreselectedService(serviceTitle);
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        scrollToSection('contact');
      } else {
        navigate(`/contact?service=${encodeURIComponent(serviceTitle)}`, {
          state: { preselectedService: serviceTitle },
        });
      }
    },
    [navigate]
  );

  return (
    <div className="relative w-full min-h-screen bg-[#080D1A] text-[#F8FAFC] selection:bg-[#38BDF8]/30 selection:text-[#F8FAFC] overflow-x-clip">
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2.5 focus:rounded-xl focus:bg-[#38BDF8] focus:text-[#080D1A] focus:font-mono focus:text-xs focus:font-bold focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Intelligent Animated Loading Overlay (only shown if initial load > 450ms) */}
      <NexusPreloader
        visible={preloaderVisible}
        isFadingOut={preloaderFading}
        progress={loadingSnapshot.progress}
        status={loadingSnapshot.status}
        message={loadingSnapshot.message}
        errorMessage={loadingSnapshot.errorMessage}
        onRetry={handleRetryPreloader}
        onContinue={handleContinueFromPreloader}
      />

      {/* Desktop Cyber Custom Cursor */}
      <CustomCursor />

      {/* Deferred Fixed Full-Viewport 3D Rubik Nexus Canvas Layer */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-auto"
      >
        {mount3DCanvas && (
          <Suspense fallback={null}>
            <RubikSceneCanvas
              mode={nexusMode}
              scrollProgress={scrollProgress}
              activeSection={
                location.pathname === '/' ? activeSection : location.pathname
              }
              selectedServiceId={activeServiceId}
              onCubieSelect={handleCubieSelect}
              onCubieHover={handleCubieHover}
              onSceneReady={() => completeLoadingMilestone('webgl_3d_ready')}
            />
          </Suspense>
        )}
      </div>

      {/* Foreground Content Layer (keeps open #hero space pass-through for 3D drag/hover) */}
      <div className="relative z-10 flex flex-col min-h-screen pointer-events-none [&>header]:pointer-events-auto [&>footer]:pointer-events-auto [&>main]:pointer-events-none [&>main>section:not(#hero)]:pointer-events-auto [&>main>div]:pointer-events-auto">
        <Navbar
          activeSection={activeSection}
          nexusMode={nexusMode}
          onToggleNexusMode={handleToggleNexusMode}
        />

        <main id="main-content" className="flex-grow">
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage
                    nexusMode={nexusMode}
                    onChangeNexusMode={handleChangeNexusMode}
                    activeServiceId={activeServiceId}
                    hoveredService={hoveredService}
                    onSelectService={handleSelectService}
                    preselectedService={preselectedService}
                    onSelectServiceForContact={handleSelectServiceForContact}
                  />
                }
              />
              <Route
                path="/capabilities"
                element={
                  <CapabilitiesPage
                    onSelectServiceForContact={handleSelectServiceForContact}
                  />
                }
              />
              <Route
                path="/solutions/zkteco-attendance"
                element={<SolutionZKTecoPage />}
              />
              <Route
                path="/solutions/weighing-management"
                element={<SolutionWeighingPage />}
              />
              <Route path="/industries" element={<IndustriesPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:slug" element={<EventDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route
                path="/contact"
                element={<ContactPage preselectedService={preselectedService} />}
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>

      {/* Persistent Privacy / Analytics Consent Banner & Back-to-Top */}
      <CookieConsentBanner />
      <BackToTopButton />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppShell />
    </BrowserRouter>
  );
};

export default App;
