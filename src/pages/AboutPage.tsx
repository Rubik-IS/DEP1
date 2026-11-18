import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { About } from '../components/sections/About';
import { ProcessTimeline } from '../components/sections/ProcessTimeline';
import { MagneticButton } from '../components/ui/MagneticButton';
import { BackToHomeLink } from '../components/ui/BackToHomeLink';
import { PageMeta } from '../components/seo/PageMeta';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-28 sm:pt-32">
      <PageMeta
        title="About Rubik Integrated Systems | Technology, Connected."
        description="Founded in Cairo in 2021, Rubik Integrated Systems unites IT infrastructure, custom software, AI automation, and Odoo ERP for maximum efficiency with optimal investment."
        path="/about"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ]}
      />
      {/* Editorial Route Header */}
      <section
        aria-label="About Rubik header"
        className="nexus-container pt-6 pb-12 border-b border-white/10"
      >
        <div className="mb-8">
          <BackToHomeLink />
        </div>
        <div className="max-w-4xl space-y-5">
          <div className="font-mono text-xs uppercase tracking-[0.24em] text-[#38BDF8]">
            ABOUT RUBIK INTEGRATED SYSTEMS // EST. 2021
          </div>
          <h1 className="font-display text-[clamp(2.25rem,4.5vw,4.25rem)] font-bold leading-[1.02] tracking-tight text-[#F8FAFC]">
            INTEGRATING TECHNOLOGY. CREATING VALUE.
          </h1>
          <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl leading-relaxed">
            Established in Cairo, Egypt in 2021, Rubik Integrated Systems connects infrastructure, custom software, and business platforms to deliver practical operational efficiency with optimal financial investment.
          </p>
        </div>
      </section>

      <About showAboutLink={false} />

      <ProcessTimeline />

      <section className="nexus-container pb-20">
        <div className="smoked-glass rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#38BDF8]">
              READY TO COLLABORATE
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
              Let&apos;s align technology around the way your business works.
            </h2>
          </div>
          <Link to="/contact" className="shrink-0">
            <MagneticButton variant="primary" size="md">
              <span>START A CONVERSATION</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </MagneticButton>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
