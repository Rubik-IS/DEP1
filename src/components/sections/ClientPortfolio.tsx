import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import {
  INDUSTRIES_DATA,
  CLIENT_PORTFOLIO,
  type ClientSector,
} from '../../data/rubikData';
import { SectionHeading } from '../ui/SectionHeading';
import { useSectionReveal } from '../../lib/animation';

export interface ClientPortfolioProps {
  showExploreLink?: boolean;
}

export const ClientPortfolio: React.FC<ClientPortfolioProps> = ({
  showExploreLink = true,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  useSectionReveal(sectionRef, { stagger: 0.08, y: 24 });

  const [selectedSector, setSelectedSector] = useState<ClientSector | 'All'>(
    'All'
  );

  const activeIndustry =
    selectedSector === 'All'
      ? null
      : INDUSTRIES_DATA.find((item) => item.name === selectedSector) || null;

  return (
    <section
      id="industries"
      data-analytics-section="industries"
      ref={sectionRef}
      aria-labelledby="industries-heading"
      className="nexus-section relative overflow-x-clip"
    >
      <div className="nexus-container space-y-14">
        {/* Chapter Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div id="industries-heading">
            <SectionHeading
              indexTag="05"
              eyebrow="WHERE WE MAKE AN IMPACT"
              title="TECHNOLOGY FOR REAL-WORLD"
              highlight="OPERATIONS."
              description="Across banking, healthcare, education, real estate, industrial manufacturing, telecom, and retail, we engineer systems built around real operational demands."
              align="left"
            />
          </div>

          {showExploreLink && (
            <div data-reveal className="shrink-0">
              <Link
                to="/industries"
                data-interactive="true"
                data-cursor="interactive"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#38BDF8] hover:text-white border-b border-[#38BDF8]/40 hover:border-white pb-1 transition-colors"
              >
                <span>Explore Industry Breakdown</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>

        {/* Horizontal 7-Sector Editorial Selector */}
        <div data-reveal className="space-y-6">
          <div
            role="tablist"
            aria-label="Filter operations by industry sector"
            className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedSector === 'All'}
              onClick={() => setSelectedSector('All')}
              data-interactive="true"
              data-cursor="interactive"
              className={`px-3.5 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] ${
                selectedSector === 'All'
                  ? 'bg-[#151B29] text-[#38BDF8] border border-[#38BDF8]/50'
                  : 'text-[#94A3B8] border border-transparent hover:text-white hover:border-white/15'
              }`}
            >
              All Sectors (7)
            </button>

            {INDUSTRIES_DATA.map((sector) => {
              const isSelected = selectedSector === sector.name;
              return (
                <button
                  key={sector.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedSector(sector.name)}
                  data-interactive="true"
                  data-cursor="interactive"
                  className={`px-3.5 py-2 rounded-lg font-mono text-xs tracking-wide transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] ${
                    isSelected
                      ? 'bg-[#151B29] text-[#38BDF8] border border-[#38BDF8]/50'
                      : 'text-[#94A3B8] border border-transparent hover:text-white hover:border-white/15'
                  }`}
                >
                  {sector.name}
                </button>
              );
            })}
          </div>

          {/* Shared Editorial Sector Briefing Panel */}
          <div
            role="tabpanel"
            aria-live="polite"
            className="smoked-glass rounded-2xl p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {activeIndustry ? (
              <>
                <div className="lg:col-span-7 space-y-3">
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#38BDF8]">
                    SECTOR FOCUS // {activeIndustry.name}
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F8FAFC] leading-tight">
                    {activeIndustry.headline}
                  </h3>
                  <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl leading-relaxed">
                    {activeIndustry.description}
                  </p>
                </div>

                <div className="lg:col-span-5 space-y-4 lg:border-l lg:border-white/10 lg:pl-8">
                  <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#94A3B8]">
                    CORE DEPLOYMENT CAPABILITIES
                  </div>
                  <ul className="space-y-2">
                    {activeIndustry.focusCapabilities.map((cap) => (
                      <li
                        key={cap}
                        className="flex items-center gap-2.5 text-sm text-[#F8FAFC]"
                      >
                        <span
                          aria-hidden="true"
                          className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]"
                        />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div className="lg:col-span-7 space-y-3">
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#38BDF8]">
                    CROSS-SECTOR COVERAGE // 7 INDUSTRIES
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F8FAFC] leading-tight">
                    Unified infrastructure, software, and enterprise platforms across seven core sectors.
                  </h3>
                  <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl leading-relaxed">
                    Select any industry above to inspect how Rubik Integrated Systems connects physical hardware, custom applications, and Odoo ERP workflows to real operational demands.
                  </p>
                </div>

                <div className="lg:col-span-5 grid grid-cols-2 gap-3 lg:border-l lg:border-white/10 lg:pl-8">
                  {INDUSTRIES_DATA.map((sector) => (
                    <button
                      key={sector.id}
                      type="button"
                      onClick={() => setSelectedSector(sector.name)}
                      data-interactive="true"
                      data-cursor="interactive"
                      className="text-left text-xs font-mono text-[#94A3B8] hover:text-[#38BDF8] transition-colors py-1"
                    >
                      → {sector.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Clean SELECTED ORGANIZATIONS Typographic Wordmark Wall (17 Verified Names, No Duplication, No Fake Logos) */}
        <div data-reveal className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-[#F8FAFC]">
              SELECTED ORGANIZATIONS
            </span>
            <span className="font-mono text-[11px] text-[#94A3B8]">
              {selectedSector === 'All'
                ? `${CLIENT_PORTFOLIO.length} Confirmed Client Organizations`
                : `Highlighting ${
                    CLIENT_PORTFOLIO.filter((c) => c.sector === selectedSector)
                      .length
                  } in ${selectedSector}`}
            </span>
          </div>

          <ul
            aria-label="Selected client organizations"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 border-t border-l border-white/10"
          >
            {CLIENT_PORTFOLIO.map((client) => {
              const isHighlighted =
                selectedSector === 'All' || client.sector === selectedSector;

              return (
                <li
                  key={client.id}
                  className={`border-r border-b border-white/10 px-5 py-5 transition-all duration-300 flex flex-col justify-between gap-2 ${
                    isHighlighted
                      ? 'bg-[#0E172F]/35 opacity-100'
                      : 'bg-[#080D1A]/40 opacity-30'
                  }`}
                >
                  <div>
                    <div className="font-display text-base font-semibold tracking-tight text-[#F8FAFC]">
                      {client.name}
                    </div>
                    {client.arabicName && (
                      <div
                        dir="rtl"
                        lang="ar"
                        className="text-xs text-[#94A3B8] mt-1 font-medium"
                      >
                        {client.arabicName}
                      </div>
                    )}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#94A3B8]">
                    {client.sector}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ClientPortfolio;
