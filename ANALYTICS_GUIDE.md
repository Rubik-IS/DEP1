# Rubik Nexus — GA4 Analytics & Google Consent Mode v2 Guide

## 1. Architecture Overview

Analytics in **Project: Rubik Nexus** (`Rubik Integrated Systems`) is centralized in two modules:

- **`src/lib/analytics.ts`**: Consent-gated telemetry engine, PII sanitizer, deduplication guard, GA4/GTM dynamic script loader, and shared `IntersectionObserver` section dwell tracker (`useSectionVisibilityTracker`).
- **`src/components/ui/CookieConsentBanner.tsx`**: Accessible bottom-left consent interface (`role="region"`, `aria-label="Privacy and analytics preferences"`) offering **Accept Analytics** or **Essential Only**.

---

## 2. Environment Configuration

Measurement IDs are read strictly from Vite environment variables—never hardcoded:

```env
# Optional: Google Analytics 4 Measurement ID
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Optional: Google Tag Manager Container ID
VITE_GTM_ID=GTM-XXXXXXX
```

If neither variable is set, `analytics.ts` still operates cleanly in local queue/DebugView mode (`window.__rubikAnalyticsQueue`) once consent is granted, without injecting external scripts.

---

## 3. Google Consent Mode v2 & Privacy Guardrails

1. **Default-Denied Initialization**: On startup (`initAnalytics()`), `gtag('consent', 'default', ...)` sets:
   - `analytics_storage: 'denied'`
   - `ad_storage: 'denied'`
   - `ad_user_data: 'denied'`
   - `ad_personalization: 'denied'`
2. **Persisted Choice**: Selecting **Accept Analytics** or **Essential Only** writes `'granted'` or `'denied'` to `localStorage` under `rubik_analytics_consent` and calls `gtag('consent', 'update', ...)`.
3. **Strict Script Gating**: External `googletagmanager.com/gtag/js` and `gtm.js` scripts are **never** injected into `<head>` unless:
   - `VITE_GA_MEASUREMENT_ID` or `VITE_GTM_ID` is configured, **and**
   - `getConsentStatus() === 'granted'`.
4. **Zero-PII Enforcement**: Before any event is queued or dispatched to `gtag`, `sanitizeAnalyticsParams()` strips blocked PII keys (`name`, `full_name`, `first_name`, `last_name`, `email`, `e_mail`, `user_email`, `contact_email`, `phone`, `telephone`, `mobile`, `user_phone`, `description`, `project_description`, `message`, `password`, `secret`, `token`, `address`, `ip`, `ip_address`) and drops any string value matching an email address or telephone number pattern.

---

## 4. Event Catalog & Parameters

| Event Name | Helper Function | Parameters | Trigger Condition |
| :--- | :--- | :--- | :--- |
| `page_view` | `trackPageView(path, title)` | `page_path`, `page_title` | Route transitions in `App.tsx` |
| `section_view` | `useSectionVisibilityTracker(pathname)` | `section_id`, `page_path` | `[data-analytics-section]` stays `>= 50%` in viewport for `1000ms` (once per route visit) |
| `cube_service_click` | `trackCubeServiceClick(params)` | `service_id`, `service_name`, `cube_block_id` | Clicking a 3D cubie or fallback block (never on hover) |
| `service_view` | `trackServiceEvent('service_view', params)` | `service_id`, `service_title`, `source` | Selecting a service tab or opening a service in Hero/Services |
| `service_details_open` | `trackServiceEvent('service_details_open', params)` | `service_id`, `service_title` | Expanding the `Learn More` technical drawer |
| `service_cta_click` | `trackServiceEvent('service_cta_click', params)` | `service_id`, `service_title`, `cta_location` | Clicking `Discuss This Service` |
| `service_navigation_click` | `trackServiceEvent('service_navigation_click', params)` | `service_id`, `destination` | Navigating from Hero/Service Focus to `#services` |
| `solution_navigation_click` | `trackSolutionEvent('solution_navigation_click', params)` | `solution_slug`, `solution_title` | Selecting ZKTeco or Weighing Management in Navbar |
| `solution_view` | `trackSolutionEvent('solution_view', params)` | `solution_slug`, `solution_title` | Viewing a solution showcase or detail page |
| `solution_cta_click` | `trackSolutionEvent('solution_cta_click', params)` | `solution_slug`, `solution_title`, `cta_location` | Clicking `Request Solution Demo` or solution CTA |
| `cta_click` | `trackCtaClick(ctaName, location)` | `cta_name`, `cta_location` | Primary/secondary CTA clicks (`hero`, `contact`, etc.) |
| `nav_click` | `trackNavClick(label, destination)` | `nav_label`, `nav_destination` | Top-level Navbar & Footer navigation clicks |
| `outbound_click` | `trackEvent('outbound_click', params)` | `link_url`, `link_label` | External website / mailto / tel links |
| `contact_form_start` | `trackContactEvent('contact_form_start', params)` | `selected_service` | First field focus in `ContactTerminal` (once per session) |
| `contact_form_submit` | `trackContactEvent('contact_form_submit', params)` | `selected_service`, `submission_status` | Form submission attempt (no form PII) |
| `generate_lead` | `trackContactEvent('generate_lead', params)` | `selected_service`, `reference_id` | Fired **only** when `/api/contact` returns `ok: true` |

---

## 5. Deduplication & Performance Rules

- **Rapid Event Deduplication**: Identical `(eventName + sanitizedParams)` emissions within `350ms` are ignored to prevent React 18 StrictMode double-effects or accidental double-clicks.
- **Single Shared Observer**: `useSectionVisibilityTracker` uses one shared `IntersectionObserver` (`threshold: 0.5`) across all `[data-analytics-section]` landmarks plus a lightweight `MutationObserver` so lazy-loaded route sections are tracked without per-section scroll listeners.

---

## 6. Recommended GA4 Setup & Explorations

1. **Mark Key Events (Conversions)** in GA4 Admin:
   - `generate_lead` (primary conversion)
   - `solution_cta_click` and `service_cta_click` (micro-conversions)
2. **Register Custom Dimensions** (Event-scoped):
   - `service_id`, `service_title`, `cube_block_id`, `solution_slug`, `section_id`, `cta_name`, `cta_location`, `selected_service`.
3. **Recommended Explorations**:
   - **3D Cube-to-Lead Funnel**: `cube_service_click` -> `service_view` -> `service_cta_click` -> `contact_form_start` -> `generate_lead`.
   - **Solution Interest Breakdown**: Compare `solution_view` vs `solution_cta_click` segmented by `solution_slug` (`zkteco-attendance` vs `weighing-management`).
   - **Section Engagement Heatmap**: Compare `section_view` counts by `section_id` on `/`.
4. **Local Debug Inspection**:
   - After accepting analytics in the banner, open DevTools Console and inspect `window.__rubikAnalyticsQueue` or call `getAnalyticsQueue()` to verify every emitted payload is clean and PII-free.
