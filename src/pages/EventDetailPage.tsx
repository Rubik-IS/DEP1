import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { getEventBySlug } from '../data/events';
import { EventPhotoGallery } from '../components/sections/EventsPreview';
import { MagneticButton } from '../components/ui/MagneticButton';
import { BackToHomeLink } from '../components/ui/BackToHomeLink';
import { PageMeta } from '../components/seo/PageMeta';

export const EventDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const event = slug ? getEventBySlug(slug) : undefined;

  return (
    <div className="pt-28 sm:pt-32">
      <PageMeta
        title={
          event
            ? `${event.title} | Events — Rubik Integrated Systems`
            : 'Event Not Found | Rubik Integrated Systems'
        }
        description={
          event
            ? event.description
            : 'Requested event briefing record was not found in the Rubik Integrated Systems registry.'
        }
        path={event ? `/events/${event.slug}` : '/events'}
        ogType={event ? 'article' : 'website'}
        noIndex={!event}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Events', path: '/events' },
          ...(event
            ? [{ name: event.title, path: `/events/${event.slug}` }]
            : []),
        ]}
      />
      <section className="nexus-section">
        <div className="nexus-container max-w-5xl space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <BackToHomeLink />
            <Link
              to="/events"
              data-interactive="true"
              data-cursor="interactive"
              className="font-mono text-xs uppercase tracking-[0.18em] text-[#94A3B8] hover:text-[#38BDF8] transition-colors"
            >
              All Events Registry →
            </Link>
          </div>

          {event ? (
            <article className="smoked-glass rounded-3xl p-7 sm:p-10 space-y-8">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.2em]">
                  <span className="text-[#38BDF8]">
                    {event.status === 'upcoming' ? 'UPCOMING' : 'PAST EVENT'}
                  </span>
                  <span className="text-white/20">·</span>
                  <span className="text-[#94A3B8]">{event.type}</span>
                  <span className="text-white/20">·</span>
                  <span className="text-[#94A3B8]">{event.format}</span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F8FAFC] leading-tight">
                  {event.title}
                </h1>

                <div className="flex flex-wrap gap-6 pt-2 font-mono text-xs text-[#CBD5E1]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#38BDF8]" aria-hidden="true" />
                    <span>
                      {event.startDate}
                      {event.endDate ? ` — ${event.endDate}` : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#38BDF8]" aria-hidden="true" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              {event.gallery && event.gallery.length > 0 ? (
                <EventPhotoGallery
                  gallery={event.gallery}
                  eventTitle={event.title}
                />
              ) : event.image ? (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full rounded-2xl border border-white/15 object-cover aspect-[16/10]"
                />
              ) : null}

              <div className="hairline-divider" />

              <p className="text-base sm:text-lg text-[#E2E8F0] leading-relaxed max-w-3xl">
                {event.description}
              </p>

              {event.agenda && event.agenda.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-[#38BDF8]">
                    AGENDA &amp; SESSIONS
                  </h2>
                  <ul className="space-y-2">
                    {event.agenda.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-[#CBD5E1]"
                      >
                        <span
                          aria-hidden="true"
                          className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] mt-2 shrink-0"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 flex flex-wrap gap-4">
                {event.registrationUrl && (
                  <MagneticButton
                    variant="primary"
                    size="md"
                    href={event.registrationUrl}
                  >
                    <span>REGISTER FOR EVENT</span>
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  </MagneticButton>
                )}
                <Link to="/contact">
                  <MagneticButton variant="outline" size="md">
                    <span>CONTACT RUBIK TEAM</span>
                  </MagneticButton>
                </Link>
              </div>
            </article>
          ) : (
            <div className="smoked-glass rounded-2xl p-8 sm:p-12 space-y-5">
              <div className="font-mono text-xs uppercase tracking-[0.22em] text-[#38BDF8]">
                EVENT NOT FOUND
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
                This event record is unavailable or has not been published.
              </h1>
              <p className="text-sm sm:text-base text-[#94A3B8] max-w-xl">
                Check the official events registry for upcoming announcements or reach out directly to our team.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link to="/events">
                  <MagneticButton variant="primary" size="md">
                    <span>VIEW EVENTS REGISTRY</span>
                  </MagneticButton>
                </Link>
                <Link to="/contact">
                  <MagneticButton variant="outline" size="md">
                    <span>CONTACT RUBIK</span>
                  </MagneticButton>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EventDetailPage;
