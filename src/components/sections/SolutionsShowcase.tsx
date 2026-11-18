import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Fingerprint,
  Scale,
  ArrowUpRight,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { SOLUTIONS_LIST, type RubikSolution } from '../../data/solutions';
import { SectionHeading } from '../ui/SectionHeading';
import { MagneticButton } from '../ui/MagneticButton';
import { useSectionReveal } from '../../lib/animation';
import { trackSolutionEvent } from '../../lib/analytics';

const resolveSolutionIcon = (slug: RubikSolution['slug']) => {
  if (slug === 'zkteco-attendance') {
    return <Fingerprint className="w-5 h-5 text-[#38BDF8]" aria-hidden="true" />;
  }
  return <Scale className="w-5 h-5 text-[#6366F1]" aria-hidden="true" />;
};

export const SolutionsShowcase: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  useSectionReveal(sectionRef, { stagger: 0.1, y: 24 });

  return (
    <section
      id="solutions"
      data-analytics-section="solutions"
      ref={sectionRef}
      aria-labelledby="solutions-heading"
      className="nexus-section relative border-t border-white/10 bg-[#080D1A]/75 overflow-x-clip"
    >
      <div className="nexus-container space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div id="solutions-heading">
            <SectionHeading
              indexTag="03"
              eyebrow="FLAGSHIP PLATFORMS"
              title="CONNECTED"
              highlight="SOLUTIONS."
              description="Purpose-built software platforms connecting physical biometric terminals and industrial weighing scales directly into centralized enterprise visibility."
              align="left"
            />
          </div>

          <div data-reveal className="font-mono text-xs uppercase tracking-[0.2em] text-[#94A3B8]">
            2 DEDICATED ENTERPRISE PLATFORMS
          </div>
        </div>

        {/* Two Flagship Solution Platforms */}
        <div
          data-reveal
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch"
        >
          {SOLUTIONS_LIST.map((solution) => {
            const isZKTeco = solution.slug === 'zkteco-attendance';

            return (
              <article
                key={solution.id}
                className="smoked-glass rounded-3xl p-7 sm:p-9 flex flex-col justify-between gap-8 border border-white/10 hover:border-[#38BDF8]/40 transition-colors relative overflow-hidden group"
              >
                {/* Subtle Corner Accent */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[110px] opacity-20 group-hover:opacity-35 transition-opacity"
                  style={{ backgroundColor: solution.accentColor }}
                />

                <div className="relative space-y-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#080D1A]/90 border border-white/15 flex items-center justify-center">
                        {resolveSolutionIcon(solution.slug)}
                      </div>
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#38BDF8] block">
                          SOLUTION // {solution.index}
                        </span>
                        <span className="font-mono text-[11px] text-[#94A3B8]">
                          {solution.eyebrow}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F8FAFC] leading-tight">
                      {solution.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
                      {solution.summary}
                    </p>
                  </div>

                  {/* Key Capabilities List */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#94A3B8]">
                      KEY CAPABILITIES
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                      {solution.capabilities.slice(0, 6).map((cap) => (
                        <li
                          key={cap}
                          className="flex items-start gap-2 text-xs sm:text-sm text-[#E2E8F0]"
                        >
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 mt-1 ${
                              isZKTeco ? 'text-[#38BDF8]' : 'text-[#6366F1]'
                            }`}
                            aria-hidden="true"
                          />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="relative pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <Link
                    to={solution.route}
                    onClick={() =>
                      trackSolutionEvent('solution_navigation_click', {
                        solution_slug: solution.slug,
                        solution_name: solution.title,
                        source: 'solutions_showcase',
                      })
                    }
                  >
                    <MagneticButton variant="primary" size="md">
                      <span>Explore Platform</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </MagneticButton>
                  </Link>

                  <Link
                    to={`/contact?service=${encodeURIComponent(
                      solution.serviceInquiryName
                    )}`}
                    state={{ preselectedService: solution.serviceInquiryName }}
                    onClick={() =>
                      trackSolutionEvent('solution_cta_click', {
                        solution_slug: solution.slug,
                        solution_name: solution.title,
                        source: 'solutions_showcase',
                      })
                    }
                    data-interactive="true"
                    data-cursor="interactive"
                    className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-[#94A3B8] hover:text-[#38BDF8] transition-colors"
                  >
                    <span>Request Solution Demo</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SolutionsShowcase;
