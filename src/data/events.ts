/**
 * Rubik Integrated Systems — Official Events & Gatherings Registry
 *
 * HOW TO ADD NEW EVENTS WITHOUT REWRITING PAGES:
 * 1. Append a new `RubikEvent` object to `EVENTS_LIST` below.
 * 2. Set `status: 'upcoming'` or `status: 'past'` (and use a unique `slug` for `/events/:slug`).
 * 3. Optional: attach `gallery` items (`{ src, alt, caption }`) for multi-photo event showcases.
 * 4. `EventsPreview` (Home Chapter 07), `EventsPage` (`/events`), and `EventDetailPage` (`/events/:slug`)
 *    automatically read from `getUpcomingEvents()`, `getPastEvents()`, and `getEventBySlug(slug)`.
 *
 * NOTE: Keep `EVENTS_LIST` strictly factual. Do not publish unverified or placeholder events.
 */

export type RubikEventType =
  | 'exhibition'
  | 'conference'
  | 'webinar'
  | 'workshop'
  | 'partner-event'
  | 'roundtable'
  | 'gathering';

export type RubikEventStatus = 'upcoming' | 'past';

export type RubikEventFormat = 'In-Person' | 'Online' | 'Hybrid';

export interface RubikEventGalleryItem {
  src: string;
  alt: string;
  caption: string;
}

export interface RubikEvent {
  id: string;
  slug: string;
  title: string;
  type: RubikEventType;
  status: RubikEventStatus;
  startDate: string;
  endDate?: string;
  location: string;
  format: RubikEventFormat;
  description: string;
  image?: string;
  gallery?: RubikEventGalleryItem[];
  registrationUrl?: string;
  agenda?: string[];
  featured?: boolean;
  publishedAt: string;
}

const BASE_URL =
  typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL
    ? import.meta.env.BASE_URL
    : '/';

export const EVENTS_LIST: RubikEvent[] = [
  {
    id: 'ibm-storage-systems-event',
    slug: 'unlocking-the-power-of-ibm-storage',
    title: 'Unlocking the Power of IBM Storage',
    type: 'partner-event',
    status: 'past',
    startDate: '2024',
    location: 'Cairo, Egypt',
    format: 'In-Person',
    description:
      'An executive and technical briefing hosted in Cairo exploring interoperable enterprise storage architectures, data mobility, and live fabric monitoring with IBM Storage Insights.',
    image: `${BASE_URL}assets/events/ibm-storage-1.jpeg`,
    gallery: [
      {
        src: `${BASE_URL}assets/events/ibm-storage-1.jpeg`,
        alt: 'Rubik Integrated Systems keynote stage at the Unlocking the Power of IBM Storage event',
        caption: 'Opening session: Connecting integrated infrastructure and enterprise storage systems.',
      },
      {
        src: `${BASE_URL}assets/events/ibm-storage-2.jpeg`,
        alt: 'Technical presentation on interoperable enterprise storage and data mobility',
        caption: 'Interoperable enterprise storage: data mobility, tiering, encryption, and multi-vendor visibility.',
      },
      {
        src: `${BASE_URL}assets/events/ibm-storage-3.jpeg`,
        alt: 'Live demonstration of fabric monitoring in IBM Storage Insights',
        caption: 'Live technical walkthrough: SAN fabric performance and port telemetry in Storage Insights.',
      },
    ],
    agenda: [
      'Integrated Systems & Enterprise Storage Foundations',
      'Interoperable Data Mobility, Tiering & Encryption',
      'Live Fabric Monitoring with IBM Storage Insights',
    ],
    featured: true,
    publishedAt: '2024-01-01',
  },
];

function parseSortableTimestamp(dateValue: string): number {
  const parsed = Date.parse(dateValue);
  return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * Returns all confirmed upcoming events sorted chronologically by startDate (ascending).
 */
export function getUpcomingEvents(): RubikEvent[] {
  return EVENTS_LIST.filter((event) => event.status === 'upcoming').sort(
    (a, b) => parseSortableTimestamp(a.startDate) - parseSortableTimestamp(b.startDate)
  );
}

/**
 * Returns all past events sorted reverse-chronologically by publishedAt / startDate (most recent first).
 */
export function getPastEvents(): RubikEvent[] {
  return EVENTS_LIST.filter((event) => event.status === 'past').sort(
    (a, b) =>
      parseSortableTimestamp(b.publishedAt || b.startDate) -
      parseSortableTimestamp(a.publishedAt || a.startDate)
  );
}

/**
 * Looks up a single event by its URL slug for `/events/:slug`.
 */
export function getEventBySlug(slug: string): RubikEvent | undefined {
  return EVENTS_LIST.find((event) => event.slug === slug);
}
