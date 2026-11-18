import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import {
  COMPANY_INFO,
  CORE_VALUES,
  VERIFIED_METRICS,
} from '../../data/rubikData';
import { SectionHeading } from '../ui/SectionHeading';
import { useSectionReveal } from '../../lib/animation';

export interface AboutProps {
  showAboutLink?: boolean;
}

export const About: React.FC<AboutProps> = ({ showAboutLink = true }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  useSectionReveal(sectionRef, { stagger: 0.08, y: 24 });

  return (
    <section
      id="about"
      data-analytics-section="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="nexus-section relative border-t border-white/10 overflow-x-clip"
    >
      <div className="nexus-container space-y-16">
        {/* Header + Restraint Link */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div id="about-heading">
            <SectionHeading
              indexTag="08"
              eyebrow="WHO WE ARE"
              title="INTEGRATING TECHNOLOGY."
              highlight="CREATING VALUE."
              description={COMPANY_INFO.supportingMessage}
              align="left"
            />
          </div>

          {showAboutLink && (
            <div data-reveal className="shrink-0">
              <Link
                to="/about"
                data-interactive="true"
                data-cursor="interactive"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#38BDF8] hover:text-white border-b border-[#38BDF8]/40 hover:border-white pb-1 transition-colors"
              >
                <span>About Rubik.I.S</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>

        {/* Two-Column Editorial Narrative & Corporate Mission */}
        <div
          data-reveal
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
        >
          <div className="lg:col-span-7 smoked-glass rounded-2xl p-7 sm:p-10 space-y-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#38BDF8]">
              DESIGN PHILOSOPHY // CAIRO, EGYPT
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F8FAFC] leading-snug max-w-2xl">
              {COMPANY_INFO.philosophyHeadline}
            </h3>
            <blockquote className="text-base sm:text-lg text-[#E2E8F0] leading-relaxed border-l-2 border-[#38BDF8]/70 pl-5 max-w-2xl">
              &ldquo;{COMPANY_INFO.mission}&rdquo;
            </blockquote>
          </div>

          {/* Historical 2024 Profile Metrics (Editorial Hairline Grid) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#94A3B8]">
                VERIFIED CREDENTIALS
              </span>
              <span className="font-mono text-[10px] text-[#38BDF8]">
                2022–2027 PROFILE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-xl overflow-hidden">
              {VERIFIED_METRICS.map((metric) => (
                <div
                  key={metric.id}
                  className="bg-[#0E172F]/60 p-5 flex flex-col justify-between gap-2"
                >
                  <div className="font-display text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
                    {metric.displayValue}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#CBD5E1]">
                      {metric.label}
                    </div>
                    <div className="font-mono text-[10px] text-[#94A3B8] mt-0.5">
                      {metric.contextNote}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Editorial 5 Core Values Grid — Clean Responsive Typography & Balanced Proportions */}
        <div data-reveal className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
            <span className="type-eyebrow text-[#F8FAFC]">
              FIVE CORE VALUES
            </span>
            <span className="type-caption text-[#94A3B8]">
              Guiding Principles Across Every Engagement
            </span>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 list-none m-0 p-0">
            {CORE_VALUES.map((value, idx) => (
              <li
                key={value.id}
                className={`min-w-0 rounded-2xl border border-white/10 bg-[#151B29]/55 p-5 sm:p-6 flex flex-col justify-start gap-2.5 ${
                  idx === 4 ? 'sm:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className="type-caption font-semibold text-[#38BDF8] tracking-[0.14em]">
                  0{idx + 1}
                </div>
                <h4 className="type-h3 text-base sm:text-[1.0625rem] text-[#F8FAFC] leading-snug">
                  {value.title}
                </h4>
                <p className="text-sm text-[#CBD5E1]/90 leading-relaxed min-w-0">
                  {value.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default About;
