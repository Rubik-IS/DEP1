import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { INDUSTRIES_DATA, CLIENT_PORTFOLIO } from '../data/rubikData';
import { ClientPortfolio } from '../components/sections/ClientPortfolio';
import { MagneticButton } from '../components/ui/MagneticButton';
import { BackToHomeLink } from '../components/ui/BackToHomeLink';
import { PageMeta } from '../components/seo/PageMeta';

export const IndustriesPage: React.FC = () => {
  return (
    <div className="pt-28 sm:pt-32">
      <PageMeta
        title="Industries We Serve | Rubik Integrated Systems"
        description="Explore how Rubik Integrated Systems serves Banking & Finance, Healthcare & Pharmaceuticals, Education, Real Estate, Industrial & Packaging, Technology & Telecom, and Retail."
        path="/industries"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Industries', path: '/industries' },
        ]}
      />
      {/* Editorial Route Header */}
      <section
        aria-label="Industries overview"
        className="nexus-container pt-6 pb-12 border-b border-white/10"
      >
        <div className="mb-8">
          <BackToHomeLink />
        </div>
        <div className="max-w-4xl space-y-5">
          <div className="font-mono text-xs uppercase tracking-[0.24em] text-[#38BDF8]">
            INDUSTRIES WE SERVE // 7 CORE SECTORS
          </div>
          <h1 className="font-display text-[clamp(2.25rem,4.5vw,4.25rem)] font-bold leading-[1.02] tracking-tight text-[#F8FAFC]">
            TECHNOLOGY FOR REAL-WORLD OPERATIONS.
          </h1>
          <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl leading-relaxed">
            Rubik Integrated Systems delivers connected infrastructure, custom software, and enterprise platforms across seven primary industry sectors—trusted by {CLIENT_PORTFOLIO.length} named organizations and 50+ customers overall.
          </p>
        </div>
      </section>

      {/* Detailed Sector-by-Sector Breakdown */}
      <section
        aria-label="Sector breakdown"
        className="nexus-section border-b border-white/10 bg-[#080D1A]/75"
      >
        <div className="nexus-container space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {INDUSTRIES_DATA.map((sector, idx) => (
              <article
                key={sector.id}
                className="smoked-glass rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between font-mono text-xs text-[#38BDF8]">
                    <span>0{idx + 1} // SECTOR</span>
                    <span className="text-[#94A3B8]">
                      {sector.organizations.length} LISTED ORGANIZATIONS
                    </span>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-[#F8FAFC]">
                    {sector.name}
                  </h2>
                  <p className="text-sm font-medium text-[#E2E8F0]">
                    {sector.headline}
                  </p>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    {sector.description}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#94A3B8] mb-2">
                      FOCUS CAPABILITIES
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sector.focusCapabilities.map((cap) => (
                        <span
                          key={cap}
                          className="font-mono text-xs px-2.5 py-1 rounded bg-[#080D1A]/80 border border-white/10 text-[#E2E8F0]"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#94A3B8] mb-1.5">
                      SELECTED ORGANIZATIONS
                    </div>
                    <p className="font-display text-sm text-[#38BDF8]">
                      {sector.organizations.join(' · ')}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="pt-4">
            <Link to="/contact">
              <MagneticButton variant="primary" size="md">
                <span>DISCUSS YOUR INDUSTRY REQUIREMENTS</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </MagneticButton>
            </Link>
          </div>
        </div>
      </section>

      <ClientPortfolio showExploreLink={false} />
    </div>
  );
};

export default IndustriesPage;
