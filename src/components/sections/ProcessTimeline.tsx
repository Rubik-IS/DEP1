import React, { useRef, useState } from 'react';
import { PROCESS_STAGES } from '../../data/rubikData';
import { SectionHeading } from '../ui/SectionHeading';
import { useSectionReveal } from '../../lib/animation';

export const ProcessTimeline: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);

  useSectionReveal(sectionRef, { stagger: 0.08, y: 24 });

  const activeStage = PROCESS_STAGES[activeStageIndex] ?? PROCESS_STAGES[0];
  const progressPercent = ((activeStageIndex + 1) / PROCESS_STAGES.length) * 100;

  return (
    <section
      id="approach"
      ref={sectionRef}
      aria-label="Our Approach — Four-Stage Execution Timeline"
      className="nexus-section relative w-full border-t border-white/10 bg-[#080D1A]/75 backdrop-blur-sm overflow-x-clip"
    >
      <div className="nexus-container w-full px-[clamp(1rem,3.5vw,4.5rem)] space-y-12 xl:space-y-14">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <SectionHeading
            indexTag="// 04"
            eyebrow="OUR APPROACH"
            title="FROM COMPLEXITY"
            highlight="TO CLARITY."
            description="Every successful technology initiative begins with understanding the business behind it."
            align="left"
          />

          <div
            data-reveal
            className="font-mono text-xs uppercase tracking-[0.18em] text-[#38BDF8] self-start lg:self-end"
          >
            STAGE {activeStage.number} / 04 // {activeStage.title}
          </div>
        </div>

        {/* Single Continuous Architectural 4-Stage Timeline */}
        <div
          data-reveal
          className="smoked-glass rounded-3xl p-6 sm:p-10 xl:p-12 space-y-10"
        >
          {/* Continuous Animated Track Rail */}
          <div className="relative">
            <div
              aria-hidden="true"
              className="hidden md:block absolute top-5 left-0 right-0 h-px bg-white/10"
            />
            <div
              aria-hidden="true"
              className="hidden md:block absolute top-5 left-0 h-px bg-gradient-to-r from-[#38BDF8] to-[#6366F1] transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />

            <ol
              className="relative grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4"
              aria-label="Four-stage delivery methodology"
            >
              {PROCESS_STAGES.map((stage, idx) => {
                const isActive = idx === activeStageIndex;
                const isReached = idx <= activeStageIndex;

                return (
                  <li key={stage.id} className="relative">
                    <button
                      type="button"
                      onClick={() => setActiveStageIndex(idx)}
                      aria-current={isActive ? 'step' : undefined}
                      className="group w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] rounded-xl p-1"
                    >
                      <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-4">
                        <span
                          className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full font-mono text-xs font-bold border transition-all duration-300 ${
                            isActive
                              ? 'bg-[#38BDF8] text-[#080D1A] border-[#38BDF8] shadow-[0_0_24px_rgba(56,189,248,0.45)]'
                              : isReached
                              ? 'bg-[#151B29] text-[#38BDF8] border-[#38BDF8]/50'
                              : 'bg-[#080D1A] text-slate-400 border-white/15 group-hover:border-white/35 group-hover:text-white'
                          }`}
                        >
                          {stage.number}
                        </span>

                        <div className="space-y-1">
                          <div
                            className={`font-mono text-xs uppercase tracking-[0.18em] transition-colors ${
                              isActive ? 'text-[#38BDF8]' : 'text-slate-400 group-hover:text-slate-200'
                            }`}
                          >
                            {stage.tag}
                          </div>
                          <p className="text-xs sm:text-sm text-slate-300 leading-snug max-w-xs">
                            {stage.summary}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Continuous Stage Detail Readout Strip */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-2">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#38BDF8]">
                ACTIVE PHASE // {activeStage.tag}
              </div>
              <p className="text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
                {activeStage.description}
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-wrap lg:justify-end gap-2">
              {activeStage.focusAreas.map((area) => (
                <span
                  key={area}
                  className="font-mono text-xs px-3 py-1.5 rounded-xl bg-[#080D1A]/80 border border-white/10 text-slate-200"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessTimeline;
