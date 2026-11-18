import { useEffect } from 'react';

export type ConsentStatus = 'granted' | 'denied' | null;

export type ServiceAction =
  | 'service_view'
  | 'service_select'
  | 'service_cta_click'
  | 'service_details_open'
  | 'service_navigation_click';

export type SolutionAction =
  | 'solution_navigation_click'
  | 'solution_view'
  | 'solution_cta_click';

export type ContactAction =
  | 'contact_form_start'
  | 'contact_form_submit'
  | 'generate_lead';

export interface AnalyticsQueueEntry {
  event: string;
  params: Record<string, string | number | boolean>;
  timestamp: string;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __rubikAnalyticsQueue?: AnalyticsQueueEntry[];
  }
}

export const CONSENT_STORAGE_KEY = 'rubik_analytics_consent';
const DEDUP_WINDOW_MS = 350;
const SECTION_DWELL_MS = 1000;

const BLOCKED_PII_KEYS = new Set([
  'name',
  'full_name',
  'fullname',
  'first_name',
  'last_name',
  'email',
  'e_mail',
  'user_email',
  'contact_email',
  'phone',
  'telephone',
  'mobile',
  'user_phone',
  'description',
  'project_description',
  'message',
  'password',
  'secret',
  'token',
  'address',
  'ip',
  'ip_address',
]);

const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_PATTERN = /(?:\+?\d[\d\s().-]{7,}\d)/;

const analyticsMemoryQueue: AnalyticsQueueEntry[] = [];
const recentEventTimestamps = new Map<string, number>();

let consentDefaultInitialized = false;
let gaScriptInjected = false;
let gtmScriptInjected = false;

function getMeasurementIds(): { gaId: string; gtmId: string } {
  const env =
    typeof import.meta !== 'undefined' && import.meta.env
      ? (import.meta.env as Record<string, string | undefined>)
      : {};

  return {
    gaId: (env.VITE_GA_MEASUREMENT_ID ?? '').trim(),
    gtmId: (env.VITE_GTM_ID ?? '').trim(),
  };
}

function ensureGtagStub(): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };
  }
}

function ensureConsentDefaults(): void {
  if (typeof window === 'undefined' || consentDefaultInitialized) return;
  ensureGtagStub();
  window.gtag?.('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  });
  consentDefaultInitialized = true;
}

function injectMeasurementScripts(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (getConsentStatus() !== 'granted') return;

  const { gaId, gtmId } = getMeasurementIds();

  if (gaId && !gaScriptInjected) {
    const existingGa = document.querySelector(
      `script[data-rubik-ga-id="${gaId}"]`
    );
    if (!existingGa) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
        gaId
      )}`;
      script.dataset.rubikGaId = gaId;
      document.head.appendChild(script);
    }
    window.gtag?.('js', new Date());
    window.gtag?.('config', gaId, {
      send_page_view: false,
      anonymize_ip: true,
    });
    gaScriptInjected = true;
  }

  if (gtmId && !gtmScriptInjected) {
    const existingGtm = document.querySelector(
      `script[data-rubik-gtm-id="${gtmId}"]`
    );
    if (!existingGtm) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
      });
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(
        gtmId
      )}`;
      script.dataset.rubikGtmId = gtmId;
      document.head.appendChild(script);
    }
    gtmScriptInjected = true;
  }
}

/**
 * Strips any PII keys (`name`, `email`, `phone`, `telephone`, `description`, `message`, `password`, etc.)
 * and redacts accidental email/phone values before events leave the application.
 */
export function sanitizeAnalyticsParams(
  params?: Record<string, unknown>
): Record<string, string | number | boolean> {
  if (!params || typeof params !== 'object') {
    return {};
  }

  const sanitized: Record<string, string | number | boolean> = {};

  for (const [rawKey, value] of Object.entries(params)) {
    const normalizedKey = rawKey.trim().toLowerCase();
    if (!normalizedKey || BLOCKED_PII_KEYS.has(normalizedKey)) {
      continue;
    }

    if (value === null || value === undefined) {
      continue;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) continue;
      if (EMAIL_PATTERN.test(trimmed) || PHONE_PATTERN.test(trimmed)) {
        continue;
      }
      sanitized[rawKey] = trimmed.slice(0, 140);
    } else if (typeof value === 'number' && Number.isFinite(value)) {
      sanitized[rawKey] = value;
    } else if (typeof value === 'boolean') {
      sanitized[rawKey] = value;
    }
  }

  return sanitized;
}

/**
 * Reads persisted analytics consent status (`'granted'`, `'denied'`, or `null` if undecided).
 */
export function getConsentStatus(): ConsentStatus {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored === 'granted' || stored === 'denied') {
      return stored;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Persists user consent decision, updates Google Consent Mode v2, and loads tags only when granted.
 */
export function setConsentStatus(granted: boolean): ConsentStatus {
  const status: 'granted' | 'denied' = granted ? 'granted' : 'denied';

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, status);
    } catch {
      // Ignore storage failures in restricted browsing contexts
    }

    ensureConsentDefaults();

    window.gtag?.('consent', 'update', {
      analytics_storage: status,
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });

    if (granted) {
      injectMeasurementScripts();
    }

    window.dispatchEvent(
      new CustomEvent('rubik:analytics-consent', { detail: { status } })
    );
  }

  return status;
}

/**
 * Initializes Consent Mode v2 defaults on app startup and activates measurement only if previously granted.
 */
export function initAnalytics(): void {
  if (typeof window === 'undefined') return;
  ensureConsentDefaults();
  if (getConsentStatus() === 'granted') {
    window.gtag?.('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    injectMeasurementScripts();
  }
}

/**
 * Tracks a GA4 event if and only if user analytics consent is `'granted'` and the event
 * is not a rapid duplicate within `DEDUP_WINDOW_MS`. Returns `true` if queued/sent.
 */
export function trackEvent(
  name: string,
  params?: Record<string, unknown>
): boolean {
  if (typeof window === 'undefined') return false;

  const eventName = name.trim();
  if (!eventName) return false;

  if (getConsentStatus() !== 'granted') {
    return false;
  }

  const cleanParams = sanitizeAnalyticsParams(params);
  const dedupKey = `${eventName}:${JSON.stringify(cleanParams)}`;
  const now = Date.now();
  const prevTimestamp = recentEventTimestamps.get(dedupKey);

  if (prevTimestamp !== undefined && now - prevTimestamp < DEDUP_WINDOW_MS) {
    return false;
  }
  recentEventTimestamps.set(dedupKey, now);

  const entry: AnalyticsQueueEntry = {
    event: eventName,
    params: cleanParams,
    timestamp: new Date(now).toISOString(),
  };

  analyticsMemoryQueue.push(entry);
  window.__rubikAnalyticsQueue = window.__rubikAnalyticsQueue || [];
  window.__rubikAnalyticsQueue.push(entry);

  ensureConsentDefaults();
  window.gtag?.('event', eventName, cleanParams);

  return true;
}

export function trackPageView(path: string, title?: string): boolean {
  const pageTitle =
    title ?? (typeof document !== 'undefined' ? document.title : 'Rubik Nexus');
  return trackEvent('page_view', {
    page_path: path,
    page_title: pageTitle,
  });
}

const CUBE_HOVER_SAMPLE_MS = 1500;
let lastCubeHoverAt = 0;
let lastCubeHoverBlockId = '';

export function trackCubeBlockHover(params: {
  cube_block_id: string;
  service_id: string;
  service_name: string;
  cube_state?: string;
}): boolean {
  const now = Date.now();
  if (
    params.cube_block_id === lastCubeHoverBlockId &&
    now - lastCubeHoverAt < CUBE_HOVER_SAMPLE_MS
  ) {
    return false;
  }
  if (now - lastCubeHoverAt < 650) {
    return false;
  }
  lastCubeHoverAt = now;
  lastCubeHoverBlockId = params.cube_block_id;

  return trackEvent('cube_block_hover', {
    cube_block_id: params.cube_block_id,
    service_id: params.service_id,
    service_name: params.service_name,
    cube_state: params.cube_state ?? 'assembled',
    interaction_type: 'hover',
    page_location:
      typeof window !== 'undefined' ? window.location?.pathname ?? '/' : '/',
  });
}

export function trackCubeServiceClick(params: {
  service_id: string;
  service_name: string;
  cube_block_id: string;
  cube_state?: string;
}): boolean {
  return trackEvent('cube_service_click', {
    service_id: params.service_id,
    service_name: params.service_name,
    cube_block_id: params.cube_block_id,
    cube_state: params.cube_state ?? 'assembled',
    interaction_type: 'click',
    page_location:
      typeof window !== 'undefined' ? window.location?.pathname ?? '/' : '/',
  });
}

export function trackCubeStateChange(params: {
  cube_state: string;
  interaction_type?: string;
}): boolean {
  return trackEvent('cube_state_change', {
    cube_state: params.cube_state,
    interaction_type: params.interaction_type ?? 'toggle',
    page_location:
      typeof window !== 'undefined' ? window.location?.pathname ?? '/' : '/',
  });
}

export function trackServiceEvent(
  action: ServiceAction,
  params?: Record<string, unknown>
): boolean {
  return trackEvent(action, params);
}

export function trackSolutionEvent(
  action: SolutionAction,
  params?: Record<string, unknown>
): boolean {
  return trackEvent(action, params);
}

export function trackCtaClick(ctaName: string, location: string): boolean {
  return trackEvent('cta_click', {
    cta_name: ctaName,
    cta_location: location,
  });
}

export function trackContactEvent(
  action: ContactAction,
  params?: Record<string, unknown>
): boolean {
  return trackEvent(action, params);
}

export function trackNavClick(label: string, destination: string): boolean {
  return trackEvent('nav_click', {
    nav_label: label,
    nav_destination: destination,
  });
}

/**
 * Returns a copy of the in-memory analytics event log (for DebugView & automated testing).
 */
export function getAnalyticsQueue(): AnalyticsQueueEntry[] {
  return [...analyticsMemoryQueue];
}

/**
 * Clears the in-memory/global analytics event log and deduplication state (used in tests).
 */
export function clearAnalyticsQueue(): void {
  analyticsMemoryQueue.length = 0;
  recentEventTimestamps.clear();
  consentDefaultInitialized = false;
  gaScriptInjected = false;
  gtmScriptInjected = false;
  if (typeof window !== 'undefined') {
    window.__rubikAnalyticsQueue = [];
  }
}

/**
 * Shared IntersectionObserver hook (`threshold: 0.5`) that fires `section_view`
 * once per `[data-analytics-section]` element after `1000ms` of continuous visibility.
 * Resets tracked sections automatically when `pathname` changes.
 */
export function useSectionVisibilityTracker(pathname: string): void {
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof document === 'undefined' ||
      typeof IntersectionObserver === 'undefined'
    ) {
      return;
    }

    const firedSections = new Set<string>();
    const observedNodes = new WeakSet<HTMLElement>();
    const activeTimers = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          const sectionId = el.dataset.analyticsSection;
          if (!sectionId || firedSections.has(sectionId)) continue;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            if (!activeTimers.has(sectionId)) {
              const timerId = window.setTimeout(() => {
                activeTimers.delete(sectionId);
                if (!firedSections.has(sectionId)) {
                  firedSections.add(sectionId);
                  trackEvent('section_view', {
                    section_id: sectionId,
                    page_path: pathname,
                  });
                }
              }, SECTION_DWELL_MS);
              activeTimers.set(sectionId, timerId);
            }
          } else {
            const pending = activeTimers.get(sectionId);
            if (pending !== undefined) {
              window.clearTimeout(pending);
              activeTimers.delete(sectionId);
            }
          }
        }
      },
      { threshold: 0.5 }
    );

    const observeAll = () => {
      const nodes = document.querySelectorAll<HTMLElement>(
        '[data-analytics-section]'
      );
      nodes.forEach((node) => {
        if (!observedNodes.has(node)) {
          observedNodes.add(node);
          observer.observe(node);
        }
      });
    };

    const rafId = requestAnimationFrame(observeAll);
    const mutationObserver =
      typeof MutationObserver !== 'undefined'
        ? new MutationObserver(observeAll)
        : null;

    if (mutationObserver && document.body) {
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      cancelAnimationFrame(rafId);
      mutationObserver?.disconnect();
      observer.disconnect();
      activeTimers.forEach((timerId) => window.clearTimeout(timerId));
      activeTimers.clear();
    };
  }, [pathname]);
}
