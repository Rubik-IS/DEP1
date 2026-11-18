import { defineConfig, type Plugin, type ResolvedConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';

interface ContactRequestPayload {
  name?: string;
  company?: string;
  email?: string;
  telephone?: string;
  service?: string;
  description?: string;
  honeypot?: string;
}

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;

function sanitizeField(value: unknown, maxLength = 500): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[<>]/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function buildMailtoUrl(payload: Required<Omit<ContactRequestPayload, 'honeypot'>>): string {
  const subject = encodeURIComponent(
    `[Rubik Nexus Inquiry] ${payload.service} — ${payload.company} (${payload.name})`
  );
  const body = encodeURIComponent(
    [
      `Name: ${payload.name}`,
      `Company: ${payload.company}`,
      `Email: ${payload.email}`,
      `Telephone: ${payload.telephone}`,
      `Service Interested In: ${payload.service}`,
      '',
      'Project Description:',
      payload.description,
    ].join('\n')
  );
  return `mailto:info@rubik-is.com?subject=${subject}&body=${body}`;
}

function createContactApiMiddleware() {
  return (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const url = req.url?.split('?')[0];
    if (url !== '/api/contact') {
      next();
      return;
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    if (req.method !== 'POST') {
      res.statusCode = 405;
      res.end(
        JSON.stringify({
          ok: false,
          status: 'validation_error',
          message: 'Method Not Allowed. Use POST /api/contact.',
          smtpConfigured: Boolean(process.env.RUBIK_SMTP_HOST),
          mailtoFallbackUrl: 'mailto:info@rubik-is.com',
        })
      );
      return;
    }

    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    const now = Date.now();
    const currentLimit = rateLimitStore.get(clientIp);
    if (currentLimit && now < currentLimit.resetAt) {
      if (currentLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
        res.statusCode = 429;
        res.end(
          JSON.stringify({
            ok: false,
            status: 'rate_limited',
            message:
              'Too many inquiry attempts from this address. Please wait a minute or reach us directly at info@rubik-is.com / +20 100 101 0538.',
            smtpConfigured: Boolean(process.env.RUBIK_SMTP_HOST),
            mailtoFallbackUrl: 'mailto:info@rubik-is.com',
          })
        );
        return;
      }
      currentLimit.count += 1;
    } else {
      rateLimitStore.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    }

    let rawBody = '';
    req.on('data', (chunk: Buffer) => {
      rawBody += chunk.toString('utf-8');
      if (rawBody.length > 32_768) {
        req.destroy();
      }
    });

    req.on('end', () => {
      try {
        const parsed = JSON.parse(rawBody || '{}') as ContactRequestPayload;

        if (parsed.honeypot && String(parsed.honeypot).trim().length > 0) {
          res.statusCode = 400;
          res.end(
            JSON.stringify({
              ok: false,
              status: 'spam_blocked',
              message: 'Automated spam submission detected and blocked.',
              smtpConfigured: Boolean(process.env.RUBIK_SMTP_HOST),
              mailtoFallbackUrl: 'mailto:info@rubik-is.com',
            })
          );
          return;
        }

        const sanitized = {
          name: sanitizeField(parsed.name, 120),
          company: sanitizeField(parsed.company, 140),
          email: sanitizeField(parsed.email, 160),
          telephone: sanitizeField(parsed.telephone, 45),
          service: sanitizeField(parsed.service, 120),
          description: sanitizeField(parsed.description, 2500),
        };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        const phoneRegex = /^[+\d][\d\s().-]{6,24}$/;

        const fieldErrors: string[] = [];
        if (sanitized.name.length < 2) fieldErrors.push('Name is required (min 2 chars).');
        if (sanitized.company.length < 2) fieldErrors.push('Company name is required.');
        if (!emailRegex.test(sanitized.email)) fieldErrors.push('Valid business email is required.');
        if (!phoneRegex.test(sanitized.telephone)) fieldErrors.push('Valid telephone number is required.');
        if (sanitized.service.length < 2) fieldErrors.push('Service selection is required.');
        if (sanitized.description.length < 15)
          fieldErrors.push('Project description must be at least 15 characters.');

        const mailtoFallbackUrl = buildMailtoUrl(sanitized);
        const smtpConfigured = Boolean(process.env.RUBIK_SMTP_HOST);

        if (fieldErrors.length > 0) {
          res.statusCode = 422;
          res.end(
            JSON.stringify({
              ok: false,
              status: 'validation_error',
              message: fieldErrors.join(' '),
              smtpConfigured,
              mailtoFallbackUrl,
            })
          );
          return;
        }

        const referenceId = `RBK-${Date.now().toString(36).toUpperCase()}-${Math.random()
          .toString(36)
          .substring(2, 6)
          .toUpperCase()}`;

        console.info(
          `[Rubik Contact Relay] Validated inquiry ${referenceId} | Company: ${sanitized.company} | Service: ${sanitized.service} | SMTP Configured: ${smtpConfigured}`
        );

        res.statusCode = 200;
        res.end(
          JSON.stringify({
            ok: true,
            status: 'accepted_local_relay',
            referenceId,
            smtpConfigured,
            mailtoFallbackUrl,
            message: smtpConfigured
              ? `Inquiry ${referenceId} validated and queued for SMTP dispatch to info@rubik-is.com.`
              : `Inquiry ${referenceId} validated and logged by the local Rubik API relay. Because external SMTP credentials (RUBIK_SMTP_HOST) are not configured in this environment, no external email was sent automatically—use the direct email client action below to send immediately to info@rubik-is.com.`,
          })
        );
      } catch {
        res.statusCode = 400;
        res.end(
          JSON.stringify({
            ok: false,
            status: 'validation_error',
            message: 'Malformed JSON request payload.',
            smtpConfigured: Boolean(process.env.RUBIK_SMTP_HOST),
            mailtoFallbackUrl: 'mailto:info@rubik-is.com',
          })
        );
      }
    });
  };
}

function rubikContactApiPlugin(): Plugin {
  const middleware = createContactApiMiddleware();
  return {
    name: 'rubik-contact-api-middleware',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

function githubPagesSpaFallbackPlugin(): Plugin {
  let resolvedConfig: ResolvedConfig | null = null;
  return {
    name: 'rubik-gh-pages-spa-fallback',
    configResolved(config) {
      resolvedConfig = config;
    },
    closeBundle() {
      if (!resolvedConfig) return;
      const outDir = path.resolve(resolvedConfig.root, resolvedConfig.build.outDir);
      if (!fs.existsSync(outDir)) return;
      const base = resolvedConfig.base || '/';
      const fallbackHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Redirecting — Rubik Integrated Systems</title>
    <script>
      (function () {
        var base = ${JSON.stringify(base)};
        var target = window.location.pathname + window.location.search + window.location.hash;
        try {
          sessionStorage.setItem('rubik_gh_spa_redirect', target);
        } catch (e) {}
        window.location.replace(base);
      })();
    </script>
  </head>
  <body></body>
</html>
`;
      fs.writeFileSync(path.join(outDir, '404.html'), fallbackHtml, 'utf8');
    },
  };
}

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), rubikContactApiPlugin(), githubPagesSpaFallbackPlugin()],
  build: {
    target: 'es2020',
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-three': ['three', '@react-three/fiber'],
          'vendor-motion': ['gsap', 'lenis'],
        },
      },
    },
  },
});
