import React, { useEffect } from 'react';

const SITE_ORIGIN = 'https://www.rubik-is.com';
const DEFAULT_IMAGE = `${SITE_ORIGIN}/assets/logo.png`;
const PAGE_SCHEMA_SELECTOR = 'script[data-rubik-page-schema="true"]';

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface PageMetaProps {
  title: string;
  description: string;
  path?: string;
  ogType?: 'website' | 'article';
  image?: string;
  noIndex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}

function normalizeRoutePath(path?: string): string {
  if (!path || path === '/') return '/';
  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
  return withLeadingSlash.length > 1 && withLeadingSlash.endsWith('/')
    ? withLeadingSlash.slice(0, -1)
    : withLeadingSlash;
}

function upsertMetaTag(
  attrName: 'name' | 'property',
  attrValue: string,
  content: string
): void {
  let tag = document.head.querySelector<HTMLMetaElement>(
    `meta[${attrName}="${attrValue}"]`
  );
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attrName, attrValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertCanonicalLink(href: string): void {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export const PageMeta: React.FC<PageMetaProps> = ({
  title,
  description,
  path = '/',
  ogType = 'website',
  image = DEFAULT_IMAGE,
  noIndex = false,
  breadcrumbs,
  structuredData,
}) => {
  const normalizedPath = normalizeRoutePath(path);
  const canonicalUrl = `${SITE_ORIGIN}${normalizedPath}`;
  const serializedBreadcrumbs = JSON.stringify(breadcrumbs ?? null);
  const serializedStructuredData = JSON.stringify(structuredData ?? null);

  useEffect(() => {
    document.title = title;

    upsertMetaTag('name', 'description', description);
    upsertMetaTag(
      'name',
      'robots',
      noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'
    );
    upsertCanonicalLink(canonicalUrl);

    upsertMetaTag('property', 'og:type', ogType);
    upsertMetaTag('property', 'og:title', title);
    upsertMetaTag('property', 'og:description', description);
    upsertMetaTag('property', 'og:url', canonicalUrl);
    upsertMetaTag('property', 'og:image', image);

    upsertMetaTag('name', 'twitter:title', title);
    upsertMetaTag('name', 'twitter:description', description);
    upsertMetaTag('name', 'twitter:image', image);

    const parsedBreadcrumbs = JSON.parse(serializedBreadcrumbs) as BreadcrumbItem[] | null;
    const parsedStructuredData = JSON.parse(serializedStructuredData) as
      | Record<string, unknown>
      | Array<Record<string, unknown>>
      | null;

    const graphNodes: Array<Record<string, unknown>> = [];

    if (parsedBreadcrumbs && parsedBreadcrumbs.length > 0) {
      graphNodes.push({
        '@type': 'BreadcrumbList',
        itemListElement: parsedBreadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: `${SITE_ORIGIN}${normalizeRoutePath(crumb.path)}`,
        })),
      });
    }

    if (parsedStructuredData) {
      if (Array.isArray(parsedStructuredData)) {
        graphNodes.push(...parsedStructuredData);
      } else {
        graphNodes.push(parsedStructuredData);
      }
    }

    const existingScript = document.head.querySelector<HTMLScriptElement>(PAGE_SCHEMA_SELECTOR);

    if (graphNodes.length > 0) {
      const script = existingScript ?? document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-rubik-page-schema', 'true');
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': graphNodes,
      });
      if (!existingScript) {
        document.head.appendChild(script);
      }
    } else if (existingScript) {
      existingScript.remove();
    }

    return () => {
      const activeScript = document.head.querySelector<HTMLScriptElement>(PAGE_SCHEMA_SELECTOR);
      if (activeScript) {
        activeScript.remove();
      }
    };
  }, [
    title,
    description,
    canonicalUrl,
    ogType,
    image,
    noIndex,
    serializedBreadcrumbs,
    serializedStructuredData,
  ]);

  return null;
};

export default PageMeta;
