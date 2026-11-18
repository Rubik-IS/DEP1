import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Camera,
} from 'lucide-react';
import {
  getUpcomingEvents,
  getPastEvents,
  type RubikEventGalleryItem,
} from '../../data/events';
import { SectionHeading } from '../ui/SectionHeading';
import { MagneticButton } from '../ui/MagneticButton';
import { useSectionReveal } from '../../lib/animation';

export interface EventPhotoGalleryProps {
  gallery: RubikEventGalleryItem[];
  eventTitle: string;
}

export const EventPhotoGallery: React.FC<EventPhotoGalleryProps> = ({
  gallery,
  eventTitle,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const safeIndex = activeIndex < gallery.length ? activeIndex : 0;
  const activePhoto = gallery[safeIndex];

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  }, [gallery.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % gallery.length);
  }, [gallery.length]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, handlePrev, handleNext]);

  if (!gallery || gallery.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Main Active Stage */}
      <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#080D1A] group">
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <img
            src={activePhoto.src}
            alt={activePhoto.alt}
            loading="lazy"
            className="w-full h-full object-cover brightness-[0.82] contrast-[1.08] saturate-[0.82] hue-rotate-[-4deg] transition-[transform,filter] duration-500 group-hover:scale-[1.02] group-hover:brightness-[0.92] group-hover:saturate-[0.92]"
          />
          {/* Subtle Dark Luxury Cyber Atmospheric Color Grade & Vignette */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[#080D1A]/20 mix-blend-multiply"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#080D1A]/45 via-transparent to-[#0E172F]/35"
          />
        </div>

        {/* Bottom Caption Scrim */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#080D1A]/95 via-[#080D1A]/75 to-transparent px-4 sm:px-5 pt-10 pb-4 flex items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#38BDF8] flex items-center gap-1.5">
              <Camera className="w-3 h-3" aria-hidden="true" />
              <span>
                PHOTO {String(safeIndex + 1).padStart(2, '0')} /{' '}
                {String(gallery.length).padStart(2, '0')}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#F8FAFC] leading-snug">
              {activePhoto.caption}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label={`Expand ${eventTitle} photo ${safeIndex + 1}`}
            data-interactive="true"
            data-cursor="interactive"
            className="shrink-0 w-9 h-9 rounded-xl bg-[#080D1A]/85 border border-white/20 hover:border-[#38BDF8] text-[#F8FAFC] hover:text-[#38BDF8] flex items-center justify-center transition-colors"
          >
            <Maximize2 className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Prev / Next Overlay Controls */}
        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous event photo"
              data-interactive="true"
              data-cursor="interactive"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#080D1A]/80 border border-white/15 hover:border-[#38BDF8] text-[#F8FAFC] flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next event photo"
              data-interactive="true"
              data-cursor="interactive"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#080D1A]/80 border border-white/15 hover:border-[#38BDF8] text-[#F8FAFC] flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {gallery.length > 1 && (
        <div
          className="grid grid-cols-3 gap-2.5"
          role="tablist"
          aria-label={`${eventTitle} photo thumbnails`}
        >
          {gallery.map((photo, idx) => {
            const isSelected = idx === safeIndex;
            return (
              <button
                key={photo.src}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`View photo ${idx + 1}: ${photo.caption}`}
                onClick={() => setActiveIndex(idx)}
                data-interactive="true"
                data-cursor="interactive"
                className={`relative rounded-xl overflow-hidden border aspect-[16/10] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] ${
                  isSelected
                    ? 'border-[#38BDF8] ring-1 ring-[#38BDF8]/60 opacity-100'
                    : 'border-white/10 opacity-65 hover:opacity-100 hover:border-white/30'
                }`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className={`w-full h-full object-cover contrast-[1.08] transition-[filter] duration-300 ${
                    isSelected
                      ? 'brightness-[0.88] saturate-[0.9]'
                      : 'brightness-[0.74] saturate-[0.75] hover:brightness-[0.88]'
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${eventTitle} photo viewer`}
          className="fixed inset-0 z-[100] bg-[#080D1A]/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="flex items-center justify-between gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#38BDF8]">
              {eventTitle} // {String(safeIndex + 1).padStart(2, '0')} OF{' '}
              {String(gallery.length).padStart(2, '0')}
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close photo viewer"
              data-interactive="true"
              data-cursor="interactive"
              className="w-10 h-10 rounded-xl bg-[#151B29] border border-white/20 hover:border-[#38BDF8] text-[#F8FAFC] flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <div
            className="relative flex-1 flex items-center justify-center my-4 min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activePhoto.src}
              alt={activePhoto.alt}
              className="max-h-[75vh] max-w-full object-contain rounded-xl border border-white/15 shadow-2xl brightness-[0.92] contrast-[1.05] saturate-[0.92]"
            />

            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous photo"
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#080D1A]/90 border border-white/20 hover:border-[#38BDF8] text-[#F8FAFC] flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next photo"
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#080D1A]/90 border border-white/20 hover:border-[#38BDF8] text-[#F8FAFC] flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </>
            )}
          </div>

          <div
            className="text-center max-w-2xl mx-auto space-y-1"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm sm:text-base text-[#F8FAFC]">
              {activePhoto.caption}
            </p>
            <p className="font-mono text-[11px] text-[#94A3B8]">
              Use Left/Right arrows to navigate · Press Esc to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export const EventsPreview: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  useSectionReveal(sectionRef, { stagger: 0.08, y: 24 });

  const upcomingEvents = getUpcomingEvents();
  const pastEvents = getPastEvents();
  const featuredPastEvent = pastEvents[0];

  return (
    <section
      id="events"
      data-analytics-section="events"
      ref={sectionRef}
      aria-labelledby="events-heading"
      className="nexus-section relative overflow-x-clip"
    >
      <div className="nexus-container space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div id="events-heading">
            <SectionHeading
              indexTag="07"
              eyebrow="CONNECT WITH RUBIK"
              title="BE PART OF THE"
              highlight="CONVERSATION."
              description="Official exhibitions, partner technical briefings, and public announcements from Rubik Integrated Systems."
              align="left"
            />
          </div>

          <div data-reveal className="shrink-0">
            <Link
              to="/events"
              data-interactive="true"
              data-cursor="interactive"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#38BDF8] hover:text-white border-b border-[#38BDF8]/40 hover:border-white pb-1 transition-colors"
            >
              <span>Explore All Events</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Upcoming Events State (Honest Empty Notice when None Scheduled) */}
        {upcomingEvents.length > 0 ? (
          <div data-reveal className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.slice(0, 3).map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.slug}`}
                data-interactive="true"
                data-cursor="interactive"
                className="group smoked-glass rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-6 hover:border-[#38BDF8]/45 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-wider">
                    <span className="text-[#38BDF8]">
                      UPCOMING · {event.type}
                    </span>
                    <span className="text-[#94A3B8]">{event.format}</span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-sm text-[#94A3B8] leading-relaxed line-clamp-3">
                    {event.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2 font-mono text-xs text-[#94A3B8]">
                  <div className="flex items-center gap-2">
                    <Calendar
                      className="w-3.5 h-3.5 text-[#38BDF8]"
                      aria-hidden="true"
                    />
                    <span>{event.startDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin
                      className="w-3.5 h-3.5 text-[#38BDF8]"
                      aria-hidden="true"
                    />
                    <span>{event.location}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div
            data-reveal
            className="smoked-glass rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="font-mono text-xs uppercase tracking-[0.22em] text-[#38BDF8]">
                NO UPCOMING PUBLIC EVENTS
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F8FAFC]">
                Stay connected with Rubik for future industry events and announcements.
              </h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Looking to arrange a private architecture briefing, IBM storage session, or Odoo ERP walkthrough for your organization?
              </p>
            </div>

            <div className="shrink-0">
              <Link to="/contact" className="inline-block">
                <MagneticButton variant="primary" size="md">
                  <span>CONTACT RUBIK</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </MagneticButton>
              </Link>
            </div>
          </div>
        )}

        {/* Featured Past Event Highlight with Real Photo Gallery */}
        {featuredPastEvent && (
          <div
            data-reveal
            className="smoked-glass rounded-3xl p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center"
          >
            <div className="lg:col-span-5 space-y-5">
              <div className="flex flex-wrap items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em]">
                <span className="px-2.5 py-1 rounded-md bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
                  PAST EVENT HIGHLIGHT
                </span>
                <span className="text-[#94A3B8]">
                  {featuredPastEvent.format}
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F8FAFC] leading-tight">
                {featuredPastEvent.title}
              </h3>

              <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
                {featuredPastEvent.description}
              </p>

              <div className="flex flex-wrap gap-5 pt-1 font-mono text-xs text-[#CBD5E1]">
                <div className="flex items-center gap-2">
                  <Calendar
                    className="w-4 h-4 text-[#38BDF8]"
                    aria-hidden="true"
                  />
                  <span>{featuredPastEvent.startDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin
                    className="w-4 h-4 text-[#38BDF8]"
                    aria-hidden="true"
                  />
                  <span>{featuredPastEvent.location}</span>
                </div>
              </div>

              {featuredPastEvent.agenda && featuredPastEvent.agenda.length > 0 && (
                <ul className="space-y-1.5 pt-3 border-t border-white/10">
                  {featuredPastEvent.agenda.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs sm:text-sm text-[#CBD5E1]"
                    >
                      <span
                        aria-hidden="true"
                        className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] mt-1.5 shrink-0"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="pt-2">
                <Link
                  to={`/events/${featuredPastEvent.slug}`}
                  data-interactive="true"
                  data-cursor="interactive"
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#38BDF8] hover:text-white border-b border-[#38BDF8]/40 hover:border-white pb-1 transition-colors"
                >
                  <span>View Event Briefing &amp; Gallery</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              {featuredPastEvent.gallery && featuredPastEvent.gallery.length > 0 ? (
                <EventPhotoGallery
                  gallery={featuredPastEvent.gallery}
                  eventTitle={featuredPastEvent.title}
                />
              ) : featuredPastEvent.image ? (
                <img
                  src={featuredPastEvent.image}
                  alt={featuredPastEvent.title}
                  className="w-full rounded-2xl border border-white/15 object-cover aspect-[16/10]"
                />
              ) : null}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsPreview;
