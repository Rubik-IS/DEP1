import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Fingerprint,
  CheckCircle2,
  ArrowRight,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { getSolutionBySlug } from '../data/solutions';
import { SectionHeading } from '../components/ui/SectionHeading';
import { MagneticButton } from '../components/ui/MagneticButton';
import { BackToHomeLink } from '../components/ui/BackToHomeLink';
import { PageMeta } from '../components/seo/PageMeta';
import { trackSolutionEvent } from '../lib/analytics';

export const SolutionZKTecoPage: React.FC = () => {
  const solution = getSolutionBySlug('zkteco-attendance');
  const navigate = useNavigate();

  useEffect(() => {
    if (!solution) return;
    trackSolutionEvent('solution_view', {
      solution_slug: solution.slug,
      solution_name: solution.title,
    });
  }, [solution]);

  if (!solution) {
    return null;
  }

  const handleRequestDemo = () => {
    trackSolutionEvent('solution_cta_click', {
      solution_slug: solution.slug,
      solution_name: solution.title,
      source: 'solution_page',
    });
    navigate(
      `/contact?service=${encodeURIComponent(solution.serviceInquiryName)}`,
      { state: { preselectedService: solution.serviceInquiryName } }
    );
  };

  return (
    <div className="pt-28 sm:pt-32">
      <PageMeta
        title={`${solution.title} | Rubik Integrated Systems`}
        description={solution.summary}
        path={solution.route}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Solutions', path: '/#solutions' },
          { name: solution.shortTitle, path: solution.route },
        ]}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: solution.title,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          description: solution.overview,
          provider: {
            '@type': 'Organization',
            name: 'Rubik Integrated Systems',
            url: 'https://www.rubik-is.com',
          },
        }}
      />
      {/* Editorial Hero Header */}
      <section
        aria-label={solution.title}
        className="nexus-container pt-6 pb-14 border-b border-white/10"
      >
        <div className="mb-8">
          <BackToHomeLink />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-8 space-y-5">
            <div className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.24em] text-[#38BDF8]">
              <Fingerprint className="w-4 h-4" aria-hidden="true" />
              <span>{solution.eyebrow}</span>
            </div>

            <h1 className="font-display text-[clamp(2.25rem,4.5vw,4.15rem)] font-bold leading-[1.03] tracking-tight text-[#F8FAFC]">
              {solution.title}
            </h1>

            <p className="text-base sm:text-lg text-[#CBD5E1] max-w-3xl leading-relaxed">
              {solution.overview}
            </p>
          </div>

          <div className="lg:col-span-4 flex lg:justify-end">
            <MagneticButton
              variant="primary"
              size="lg"
              onClick={handleRequestDemo}
            >
              <span>Request Solution Demo</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Core Capabilities & Architecture Highlights */}
      <section className="nexus-section border-b border-white/10 bg-[#080D1A]/75">
        <div className="nexus-container space-y-12">
          <SectionHeading
            indexTag="01"
            eyebrow="PLATFORM CAPABILITIES"
            title={solution.headline}
            description={solution.summary}
            align="left"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Complete Grounded Capabilities List */}
            <div className="lg:col-span-5 smoked-glass rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#38BDF8]">
                VERIFIED SYSTEM CAPABILITIES
              </div>
              <ul className="space-y-3">
                {solution.capabilities.map((cap) => (
                  <li
                    key={cap}
                    className="flex items-start gap-3 text-sm text-[#F8FAFC]"
                  >
                    <CheckCircle2
                      className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-white/10 space-y-2.5">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#94A3B8]">
                  ARCHITECTURE PILLARS
                </div>
                <div className="flex flex-wrap gap-2">
                  {solution.architecturePillars.map((pillar) => (
                    <span
                      key={pillar}
                      className="font-mono text-[11px] px-2.5 py-1 rounded bg-[#080D1A]/90 border border-white/10 text-[#CBD5E1]"
                    >
                      {pillar}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: 4 Key Functional Highlights */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {solution.highlights.map((highlight) => (
                <div
                  key={highlight.code}
                  className="brushed-metal rounded-2xl p-6 space-y-3"
                >
                  <div className="font-mono text-[11px] tracking-[0.2em] text-[#38BDF8]">
                    {highlight.code}
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#F8FAFC]">
                    {highlight.title}
                  </h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Operational Workflow */}
      <section className="nexus-section border-b border-white/10">
        <div className="nexus-container space-y-10">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-[#38BDF8]">
            <Layers className="w-4 h-4" aria-hidden="true" />
            <span>OPERATIONAL WORKFLOW // END-TO-END FLOW</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 border-t border-l border-white/10 rounded-2xl overflow-hidden bg-[#151B29]/45">
            {solution.workflow.map((item) => (
              <div
                key={item.step}
                className="border-r border-b border-white/10 p-6 sm:p-7 space-y-3"
              >
                <div className="font-mono text-xs text-[#38BDF8]">
                  STEP {item.step}
                </div>
                <h3 className="font-display text-xl font-bold text-[#F8FAFC]">
                  {item.title}
                </h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>

          {/* Outcomes + Bottom Demo CTA */}
          <div className="smoked-glass rounded-2xl p-7 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#38BDF8]">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                <span>OPERATIONAL OUTCOMES</span>
              </div>
              <ul className="space-y-2">
                {solution.outcomes.map((outcome) => (
                  <li
                    key={outcome}
                    className="flex items-start gap-2.5 text-sm text-[#E2E8F0]"
                  >
                    <span
                      aria-hidden="true"
                      className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] mt-2 shrink-0"
                    />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="shrink-0">
              <MagneticButton
                variant="primary"
                size="lg"
                onClick={handleRequestDemo}
              >
                <span>Request Solution Demo</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SolutionZKTecoPage;
