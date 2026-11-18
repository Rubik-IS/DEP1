import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { CANONICAL_ROUTES } from '../fixtures/testData';

const ROOT = process.cwd();

describe('Integration: Sitemap, Robots, Index & Typography Configuration', () => {
  it('sitemap.xml contains all 8 canonical rubik-is.com routes without localhost URLs', () => {
    const sitemap = fs.readFileSync(
      path.join(ROOT, 'public/sitemap.xml'),
      'utf8'
    );
    expect(sitemap).not.toContain('localhost');
    expect(sitemap).not.toContain('127.0.0.1');
    for (const route of CANONICAL_ROUTES) {
      const expectedLoc =
        route === '/'
          ? 'https://www.rubik-is.com/'
          : `https://www.rubik-is.com${route}`;
      expect(sitemap).toContain(`<loc>${expectedLoc}</loc>`);
    }
  });

  it('robots.txt allows crawling and references the production sitemap', () => {
    const robots = fs.readFileSync(path.join(ROOT, 'public/robots.txt'), 'utf8');
    expect(robots).toMatch(/User-agent:\s*\*/i);
    expect(robots).toContain('Sitemap: https://www.rubik-is.com/sitemap.xml');
  });

  it('index.html uses non-render-blocking 2-font variable setup and Schema.org JSON-LD', () => {
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    expect(html).toContain('media="print"');
    expect(html).toContain('Plus+Jakarta+Sans');
    expect(html).toContain('Space+Grotesk');
    expect(html).not.toContain('JetBrains+Mono');
    expect(html).toContain('application/ld+json');
    expect(html).toContain('https://www.rubik-is.com/#organization');
  });
});
