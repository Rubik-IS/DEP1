import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  CONSENT_STORAGE_KEY,
  clearAnalyticsQueue,
  getAnalyticsQueue,
  getConsentStatus,
  sanitizeAnalyticsParams,
  setConsentStatus,
  trackContactEvent,
  trackCubeBlockHover,
  trackCubeServiceClick,
  trackCubeStateChange,
  trackEvent,
} from '../../src/lib/analytics';

function installMockWindow() {
  const store = new Map<string, string>();
  const dispatchedEvents: unknown[] = [];
  const dataLayer: unknown[] = [];
  const gtagCalls: unknown[][] = [];

  const mockWindow = {
    location: { pathname: '/' },
    localStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
    },
    dataLayer,
    gtag: (...args: unknown[]) => {
      gtagCalls.push(args);
    },
    dispatchEvent: (evt: unknown) => {
      dispatchedEvents.push(evt);
      return true;
    },
    __rubikAnalyticsQueue: [] as unknown[],
  };

  vi.stubGlobal('window', mockWindow);
  vi.stubGlobal(
    'CustomEvent',
    class MockCustomEvent {
      type: string;
      detail: unknown;
      constructor(type: string, init?: { detail?: unknown }) {
        this.type = type;
        this.detail = init?.detail;
      }
    }
  );

  return { store, gtagCalls, dispatchedEvents };
}

describe('Analytics, Consent Mode v2, PII Stripping & Deduplication', () => {
  beforeEach(() => {
    clearAnalyticsQueue();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('blocks events when consent is undecided or denied, and allows after granted', () => {
    const { store, gtagCalls } = installMockWindow();
    expect(getConsentStatus()).toBeNull();

    expect(
      trackCubeServiceClick({
        service_id: 'it-consulting',
        service_name: 'IT Consulting & Technology Advisory',
        cube_block_id: '21',
        cube_state: 'assembled',
      })
    ).toBe(false);
    expect(getAnalyticsQueue()).toHaveLength(0);

    setConsentStatus(false);
    expect(store.get(CONSENT_STORAGE_KEY)).toBe('denied');
    expect(trackEvent('cta_click', { cta_name: 'Explore' })).toBe(false);

    setConsentStatus(true);
    expect(store.get(CONSENT_STORAGE_KEY)).toBe('granted');
    expect(
      trackCubeServiceClick({
        service_id: 'it-consulting',
        service_name: 'IT Consulting & Technology Advisory',
        cube_block_id: '21',
        cube_state: 'exploded',
      })
    ).toBe(true);
    expect(
      trackCubeStateChange({
        cube_state: 'exploded',
        interaction_type: 'hero_rubik_logo_click',
      })
    ).toBe(true);
    expect(getAnalyticsQueue()).toHaveLength(2);
    expect(gtagCalls.some((c) => c[0] === 'consent' && c[1] === 'update')).toBe(
      true
    );
  });

  it('strictly strips PII keys and email/phone patterns from event payloads', () => {
    installMockWindow();
    setConsentStatus(true);

    const sanitized = sanitizeAnalyticsParams({
      name: 'Ahmed Ali',
      email: 'ahmed@rubik-is.com',
      phone: '+20 100 101 0538',
      message: 'Please call me at +20 100 101 0538',
      note: 'Reach me at secret@test.com',
      service_interest: 'Odoo ERP',
      success: true,
    });
    expect(sanitized).toEqual({
      service_interest: 'Odoo ERP',
      success: true,
    });

    trackContactEvent('generate_lead', {
      service_interest: 'IT Support & Managed IT Services',
      email: 'leaked@example.com',
      name: 'Should Be Stripped',
    });

    const queue = getAnalyticsQueue();
    expect(queue).toHaveLength(1);
    expect(queue[0].params).toEqual({
      service_interest: 'IT Support & Managed IT Services',
    });
  });

  it('deduplicates rapid-fire events and samples cube_block_hover', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-18T06:00:00Z'));
    installMockWindow();
    setConsentStatus(true);

    expect(trackEvent('service_view', { service_id: 'it-support' })).toBe(true);
    expect(trackEvent('service_view', { service_id: 'it-support' })).toBe(false);

    vi.advanceTimersByTime(400);
    expect(trackEvent('service_view', { service_id: 'it-support' })).toBe(true);

    // Cube hover sampling
    expect(
      trackCubeBlockHover({
        cube_block_id: '1',
        service_id: 'infrastructure-networking',
        service_name: 'Infrastructure & Networking',
      })
    ).toBe(true);
    expect(
      trackCubeBlockHover({
        cube_block_id: '1',
        service_id: 'infrastructure-networking',
        service_name: 'Infrastructure & Networking',
      })
    ).toBe(false);

    vi.useRealTimers();
  });
});
