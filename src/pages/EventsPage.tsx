import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react';
import { getUpcomingEvents, getPastEvents } from '../data/events';
import { EventPhotoGallery } from '../components/sections/EventsPreview';
import { MagneticButton } from '../components/ui/MagneticButton';
import { BackToHomeLink } from '../components/ui/BackToHomeLink';
import { PageMeta } from '../components/seo/PageMeta';

export const EventsPage: React.FC = () => {
  const upcomingEvents = getUpcomingEvents();
  const pastEvents = getPastEvents();

  return (
    <div className="pt-28 sm:pt-32">
      <PageMeta
        title="Events & Partner Briefings | Rubik Integrated Systems"
        description="View Rubik Integrated Systems' upcoming briefings and past industry events, including Unlocking the Power of IBM Storage in Cairo."
        path="/events"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Events', path: '/events' },
        ]}
      />
      {/* Editorial Route Header */}
      <section
        aria-label="Events registry header"
        className="nexus-container pt-6 pb-12 border-b border-white/10"
      >
        <div className="mb-8">
          <BackToHomeLink />
        </div>
        <div className="max-w-4xl space-y-5">
          <div className="font-mono text-xs uppercase tracking-[0.24em] text-[#38BDF8]">
            CONNECT WITH RUBIK // EVENTS &amp; BRIEFINGS
          </div>
          <h1 className="font-display text-[clamp(2.25rem,4.5vw,4.25rem)] font-bold leading-[1.02] tracking-tight text-[#F8FAFC]">
            BE PART OF THE CONVERSATION.
          </h1>
          <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl leading-relaxed">
            Official public exhibitions, partner technical sessions, and industry gatherings hosted or attended by Rubik Integrated Systems.
          </p>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section
        aria-labelledby="upcoming-events-heading"
        className="nexus-section border-b border-white/10"
      >
        <div className="nexus-container space-y-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2
              id="upcoming-events-heading"
              className="font-mono text-xs uppercase tracking-[0.24em] text-[#38BDF8]"
            >
              UPCOMING EVENTS
            </h2>
            <span className="font-mono text-xs text-[#94A3B8]">
              {upcomingEvents.length} SCHEDULED
            </span>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.slug}`}
                  data-interactive="true"
                  data-cursor="interactive"
                  className="group smoked-glass rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-6 hover:border-[#38BDF8]/50 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider">
                      <span className="text-[#38BDF8]">{event.type}</span>
                      <span className="text-[#94A3B8]">{event.format}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-[#94A3B8] leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-2 font-mono text-xs text-[#94A3B8]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#38BDF8]" aria-hidden="true" />
                      <span>{event.startDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" aria-hidden="true" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="smoked-glass rounded-2xl p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <div className="font-mono text-xs uppercase tracking-[0.22em] text-[#38BDF8]">
                  NO UPCOMING PUBLIC EVENTS
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
                  Stay connected with Rubik for future industry events and announcements.
                </h3>
                <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
                  Interested in a dedicated architecture session, enterprise storage briefing, or Odoo ERP workshop for your team? Contact us directly.
                </p>
              </div>
              <div className="shrink-0">
                <Link to="/contact">
                  <MagneticButton variant="primary" size="md">
                    <span>CONTACT RUBIK</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </MagneticButton>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* PAST EVENTS */}
      <section
        aria-labelledby="past-events-heading"
        className="nexus-section bg-[#080D1A]/80"
      >
        <div className="nexus-container space-y-10">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2
              id="past-events-heading"
              className="font-mono text-xs uppercase tracking-[0.24em] text-[#38BDF8]"
            >
              PAST EVENTS
            </h2>
            <span className="font-mono text-xs text-[#94A3B8]">
              {pastEvents.length} ARCHIVED
            </span>
          </div>

          {pastEvents.length > 0 ? (
            <div className="space-y-10">
              {pastEvents.map((event) => (
                <article
                  key={event.id}
                  className="smoked-glass rounded-3xl p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center"
                >
                  <div className="lg:col-span-5 space-y-5">
                    <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em]">
                      <span className="px-2.5 py-1 rounded bg-[#151B29] border border-[#38BDF8]/30 text-[#38BDF8]">
                        {event.type}
                      </span>
                      <span className="text-[#94A3B8]">{event.format}</span>
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F8FAFC] leading-tight">
                      {event.title}
                    </h3>

                    <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
                      {event.description}
                    </p>

                    <div className="flex flex-wrap gap-5 font-mono text-xs text-[#CBD5E1]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#38BDF8]" aria-hidden="true" />
                        <span>{event.startDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#38BDF8]" aria-hidden="true" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    {event.agenda && event.agenda.length > 0 && (
                      <div className="pt-3 border-t border-white/10 space-y-2">
                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#94A3B8]">
                          SESSION HIGHLIGHTS
                        </div>
                        <ul className="space-y-1.5">
                          {event.agenda.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2 text-xs sm:text-sm text-[#E2E8F0]"
                            >
                              <span
                                aria-hidden="true"
                                className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] mt-1.5 shrink-0"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-2">
                      <Link
                        to={`/events/${event.slug}`}
                        data-interactive="true"
                        data-cursor="interactive"
                        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#38BDF8] hover:text-white border-b border-[#38BDF8]/40 hover:border-white pb-1 transition-colors"
                      >
                        <span>Open Full Event Record</span>
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-7">
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
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="border border-white/10 rounded-2xl p-8 bg-[#151B29]/40">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#94A3B8]">
                PAST EVENTS ARCHIVE // NO PUBLIC RECORDS PUBLISHED YET
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
