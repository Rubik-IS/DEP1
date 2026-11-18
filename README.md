# Rubik Integrated Systems — Production Website (`DEP1`)

> **Technology, Connected.** — Independent, GitHub-ready production repository for the **Rubik Integrated Systems (Rubik.I.S)** corporate website.

---

## 1. Project Overview

This directory (`DEP1`) is a standalone, production-hardened build of the Rubik Integrated Systems web application. It is completely independent from the development workspace and is configured for automated CI validation and static deployment via **GitHub Actions** and **GitHub Pages**.

### Technology Stack
- **Frontend Framework:** React `18.3.1` + TypeScript `5.6.3`
- **Build System:** Vite `6.0.3` (manual chunk splitting for React, Three.js/R3F, and GSAP/Lenis + lazy-loaded secondary routes)
- **Routing:** `react-router-dom` `6.30.6` (`BrowserRouter` with dynamic `import.meta.env.BASE_URL` + GitHub Pages `404.html` SPA fallback)
- **Styling & Typography:** Tailwind CSS `3.4.17` with 2 non-render-blocking Google variable fonts (`Space Grotesk` + `Plus Jakarta Sans`)
- **3D Interactive Experience:** Three.js `0.170.0` + `@react-three/fiber` `8.17.10` (`RubikNexusCore`, 7-state selection/inspection, shared geometry, WebGL `IsometricRubikFallback`)
- **Motion & Scroll:** GSAP `3.12.5` + Lenis `1.1.18` (with `prefers-reduced-motion` and coarse-pointer native-scroll support)
- **Analytics & Privacy:** Google Analytics 4 + Google Consent Mode v2 (opt-in via `CookieConsentBanner`, PII stripping, `350ms` event deduplication)
- **Testing & Quality Gates:** Vitest (`3.2.7`), Playwright (`@playwright/test`), `@axe-core/playwright` (WCAG 2.2 AA), Google Lighthouse, and `npm audit` security checks

### Repository Structure
```text
DEP1/
├── .github/
│   └── workflows/
│       ├── ci.yml          # PR & push build + quality validation
│       └── deploy.yml      # Automated GitHub Pages build & deployment
├── public/
│   ├── assets/             # Brand logo & verified IBM Storage event photos
│   ├── favicon.ico / .svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/         # canvas/, cursor/, sections/, seo/, ui/
│   ├── data/               # rubikData.ts, solutions.ts, events.ts
│   ├── hooks/              # useWebGLCapability.ts
│   ├── lib/                # analytics.ts, animation.ts, contactService.ts, loadingProgress.ts
│   └── pages/              # HomePage, CapabilitiesPage, Solutions, Industries, Events, About, Contact, NotFoundPage
├── tests/
│   ├── unit/               # Vitest unit tests
│   ├── integration/        # Vitest integration tests
│   ├── e2e/                # Playwright functional & responsive tests (320px–2560px)
│   ├── accessibility/      # WCAG 2.2 AA @axe-core/playwright tests
│   ├── seo/                # Metadata, canonicals, JSON-LD, 404 noindex tests
│   ├── analytics/          # GA4 Consent Mode v2 & PII-free telemetry tests
│   ├── visual/             # Visual regression snapshot tests
│   ├── performance/        # Google Lighthouse runner
│   └── security/           # Dependency & static source security audit
├── .env.example
├── .gitignore
├── DEPLOYMENT.md
├── package.json
├── playwright.config.ts
├── vite.config.ts
└── vitest.config.ts
```

---

## 2. Local Development

### Prerequisites
- **Node.js:** `20.x` (LTS recommended)
- **npm:** `10.x`

### Setup & Run
```bash
npm ci
cp .env.example .env   # Optional: configure VITE_GA_MEASUREMENT_ID or VITE_CONTACT_ENDPOINT
npm run dev            # Starts Vite dev server at http://localhost:5173
```

---

## 3. Production Build & Testing

```bash
npm run build             # Type-checks (tsc -b) and outputs static bundle to dist/ (including dist/404.html)
npm run preview           # Serves dist/ locally at http://127.0.0.1:4173

# Automated Quality Gates
npm run lint              # TypeScript typecheck
npm run test:unit         # Vitest unit suite
npm run test:integration  # Vitest integration suite
npm run test:e2e          # Playwright E2E & responsive suite
npm run test:accessibility # WCAG 2.2 AA audit
npm run test:seo          # Technical SEO & schema audit
npm run test:analytics    # GA4 Consent Mode v2 & PII check
npm run test:visual       # Visual regression check
npm run test:security     # Production dependency & source security scan
npm run test:performance  # Google Lighthouse Desktop & Mobile (against vite preview)
npm run test:all          # Complete CI gate (lint + unit + integration + build + playwright + security)
```

---

## 4. GitHub Hosting & Deployment Summary

This application compiles to static HTML/CSS/JS in `dist/` and is compatible with **GitHub Pages** (`actions/deploy-pages@v4`).

> [!NOTE]
> **Contact Form Relay on Static Hosting:** GitHub Pages does not execute Node.js server endpoints (`POST /api/contact`). On GitHub Pages, either set `VITE_CONTACT_ENDPOINT` in **GitHub Repository Variables** to an external form API (e.g., Formspree/serverless endpoint), or leave it unset — `submitContactInquiry()` automatically detects static hosting and provides a pre-filled `mailto:info@rubik-is.com` and `+20 100 101 0538` dispatch flow.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions to upload `DEP1` to GitHub, enable GitHub Actions for Pages, configure custom domains, and troubleshoot deployments.
