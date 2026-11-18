import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, CheckCircle2, Sparkles } from 'lucide-react';
import {
  TECH_MATRIX,
  AI_AGENTS_CAPABILITY,
  type TechMatrixCategory,
} from '../data/rubikData';
import { Services } from '../components/sections/Services';
import { ProcessTimeline } from '../components/sections/ProcessTimeline';
import { SolutionsShowcase } from '../components/sections/SolutionsShowcase';
import { SectionHeading } from '../components/ui/SectionHeading';
import { MagneticButton } from '../components/ui/MagneticButton';
import { BackToHomeLink } from '../components/ui/BackToHomeLink';
import { PageMeta } from '../components/seo/PageMeta';

export interface CapabilitiesPageProps {
  onSelectServiceForContact: (serviceTitle: string) => void;
}

const MATRIX_CATEGORIES: ('All' | TechMatrixCategory)[] = [
  'All',
  'Frontend',
  'Backend',
  'Cloud and DevOps',
  'Databases',
  'Enterprise ERP',
  'Networking and Security',
];

export const CapabilitiesPage: React.FC<CapabilitiesPageProps> = ({
  onSelectServiceForContact,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    'All' | TechMatrixCategory
  >('All');
  const [selectedUseCaseId, setSelectedUseCaseId] = useState<string>(
    AI_AGENTS_CAPABILITY.useCases[0].id
  );

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return TECH_MATRIX;
    return TECH_MATRIX.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const activeUseCase =
    AI_AGENTS_CAPABILITY.useCases.find((u) => u.id === selectedUseCaseId) ??
    AI_AGENTS_CAPABILITY.useCases[0];

  return (
    <div className="pt-28 sm:pt-32">
      <PageMeta
        title="Capabilities & Enterprise Services | Rubik Integrated Systems"
        description="Explore Rubik Integrated Systems' 8 enterprise services spanning custom web & cloud, mobile apps, Odoo ERP, hardware-software integration, IT consulting, 24/7 IT support, and custom AI automation."
        path="/capabilities"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Capabilities', path: '/capabilities' },
        ]}
      />
      {/* Editorial Route Header */}
      <section
        aria-label="Capabilities overview"
        className="nexus-container pt-6 pb-12 border-b border-white/10"
      >
        <div className="mb-8">
          <BackToHomeLink />
        </div>
        <div className="max-w-4xl space-y-5">
          <div className="font-mono text-xs uppercase tracking-[0.24em] text-[#38BDF8]">
            CAPABILITIES &amp; SERVICES // RUBIK INTEGRATED SYSTEMS
          </div>
          <h1 className="font-display text-[clamp(2.25rem,4.5vw,4.25rem)] font-bold leading-[1.02] tracking-tight text-[#F8FAFC]">
            INTEGRATED SERVICES, PLATFORMS &amp; AI AUTOMATION.
          </h1>
          <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl leading-relaxed">
            Explore how Rubik Integrated Systems connects infrastructure and security, custom software engineering, enterprise business systems, flagship operational platforms, and {AI_AGENTS_CAPABILITY.title.toLowerCase()}.
          </p>
        </div>
      </section>

      <Services onSelectServiceForContact={onSelectServiceForContact} />

      <SolutionsShowcase />

      {/* AI Agents & Custom Intelligent Automation */}
      <section
        aria-labelledby="capabilities-ai-heading"
        className="nexus-section border-t border-white/10 bg-[#080D1A]/85"
      >
        <div className="nexus-container space-y-10">
          <div id="capabilities-ai-heading">
            <SectionHeading
              indexTag="AI"
              eyebrow={AI_AGENTS_CAPABILITY.eyebrow}
              title={AI_AGENTS_CAPABILITY.title}
              description={AI_AGENTS_CAPABILITY.description}
              align="left"
            />
          </div>

          <div className="smoked-glass rounded-3xl p-6 sm:p-8 lg:p-10 space-y-8 border border-[#38BDF8]/20">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/10 pb-6">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[#38BDF8]">
                  <Bot className="w-4 h-4" aria-hidden="true" />
                  <span>{AI_AGENTS_CAPABILITY.eyebrow}</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
                  {AI_AGENTS_CAPABILITY.headline}
                </h3>
              </div>

              <Link
                to={`/contact?service=${encodeURIComponent(AI_AGENTS_CAPABILITY.title)}`}
                state={{ preselectedService: AI_AGENTS_CAPABILITY.title }}
                className="shrink-0"
              >
                <MagneticButton variant="primary" size="md">
                  <span>DISCUSS AI AUTOMATION</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </MagneticButton>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
              <div
                role="tablist"
                aria-label="AI Agents workflow capabilities"
                className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5"
              >
                {AI_AGENTS_CAPABILITY.useCases.map((useCase) => {
                  const isSelected = useCase.id === activeUseCase.id;
                  return (
                    <button
                      key={useCase.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setSelectedUseCaseId(useCase.id)}
                      data-interactive="true"
                      data-cursor="interactive"
                      className={`text-left px-4 py-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] ${
                        isSelected
                          ? 'bg-[#151B29] border-[#38BDF8]/60 text-[#F8FAFC]'
                          : 'bg-[#080D1A]/65 border-white/10 text-[#94A3B8] hover:text-[#F8FAFC] hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`font-mono text-[11px] px-2 py-0.5 rounded shrink-0 ${
                            isSelected
                              ? 'bg-[#38BDF8]/15 text-[#38BDF8]'
                              : 'bg-white/5 text-[#94A3B8]'
                          }`}
                        >
                          {useCase.code}
                        </span>
                        <span className="font-display text-sm font-semibold truncate">
                          {useCase.title}
                        </span>
                      </div>
                      <Sparkles
                        className={`w-3.5 h-3.5 shrink-0 transition-opacity ${
                          isSelected ? 'text-[#38BDF8] opacity-100' : 'opacity-0'
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>

              <div
                role="tabpanel"
                aria-live="polite"
                className="lg:col-span-7 brushed-metal rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6"
              >
                <div className="space-y-4">
                  <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#38BDF8]">
                    AGENTIC WORKFLOW // {activeUseCase.code}
                  </div>
                  <h4 className="font-display text-xl sm:text-2xl font-bold text-[#F8FAFC]">
                    {activeUseCase.title}
                  </h4>
                  <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed max-w-2xl">
                    {activeUseCase.summary}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex flex-wrap gap-2">
                    {activeUseCase.connectedSystems.map((sys) => (
                      <span
                        key={sys}
                        className="font-mono text-xs px-3 py-1.5 rounded-lg bg-[#080D1A]/90 border border-[#38BDF8]/25 text-[#E2E8F0]"
                      >
                        {sys}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-start gap-2.5 p-4 rounded-xl bg-[#080D1A]/75 border border-white/10">
                    <CheckCircle2
                      className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                      <strong className="text-[#F8FAFC]">Operational Impact:</strong>{' '}
                      {activeUseCase.outcome}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProcessTimeline />

      {/* Detailed Verified Technology Matrix */}
      <section
        aria-labelledby="detailed-stack-heading"
        className="nexus-section border-t border-white/10 bg-[#080D1A]/85"
      >
        <div className="nexus-container space-y-10">
          <div id="detailed-stack-heading">
            <SectionHeading
              indexTag="STACK"
              eyebrow="VERIFIED ENGINEERING INVENTORY"
              title="FULL TECHNOLOGY"
              highlight="SPECIFICATION."
              description="Filter our verified technical inventory across networking, cloud infrastructure, databases, Odoo ERP, security, and software engineering."
              align="left"
            />
          </div>

          <div
            role="tablist"
            aria-label="Filter technology specification"
            className="flex flex-wrap gap-2 border-b border-white/10 pb-4"
          >
            {MATRIX_CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedCategory(category)}
                  data-interactive="true"
                  data-cursor="interactive"
                  className={`px-3.5 py-2 rounded-lg font-mono text-xs transition-colors ${
                    isSelected
                      ? 'bg-[#151B29] text-[#38BDF8] border border-[#38BDF8]/50'
                      : 'text-[#94A3B8] border border-transparent hover:text-white hover:border-white/15'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/10"
          >
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="border-r border-b border-white/10 p-6 bg-[#0E172F]/35 space-y-2.5"
              >
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#38BDF8]">
                  {item.category}
                </div>
                <h3 className="font-display text-lg font-bold text-[#F8FAFC]">
                  {item.name}
                </h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  {item.role}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-start">
            <Link to="/contact">
              <MagneticButton variant="primary" size="md">
                <span>DISCUSS YOUR ARCHITECTURE</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </MagneticButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CapabilitiesPage;
