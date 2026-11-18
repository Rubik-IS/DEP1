import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Cpu, Layers, Mail, Scale } from 'lucide-react';
import { BackToHomeLink } from '../components/ui/BackToHomeLink';
import { PageMeta } from '../components/seo/PageMeta';

const SUGGESTED_ROUTES = [
  {
    to: '/capabilities',
    label: 'Capabilities & Services',
    code: '01 // SERVICES',
    description: 'Infrastructure, cybersecurity, custom software, Odoo ERP, IT advisory, and support.',
    icon: Layers,
  },
  {
    to: '/solutions/zkteco-attendance',
    label: 'ZKTeco Attendance System',
    code: '02 // SOLUTION',
    description: 'Biometric terminal synchronization, shifts, leave workflows, and HR payroll integration.',
    icon: Cpu,
  },
  {
    to: '/solutions/weighing-management',
    label: 'Weighing Management System',
    code: '03 // SOLUTION',
    description: 'Centralized weighbridge capture, multi-site monitoring, and ERP operational records.',
    icon: Scale,
  },
  {
    to: '/contact',
    label: 'Contact Rubik',
    code: '04 // CONNECT',
    description: 'Discuss a systems integration challenge or request a solution demonstration.',
    icon: Mail,
  },
];

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <PageMeta
        title="Page Not Found | Rubik Integrated Systems"
        description="The requested route could not be found on Rubik Integrated Systems. Explore our capabilities, solutions, or contact our team."
        path="/404"
        noIndex
      />

      <section
        aria-labelledby="not-found-heading"
        className="pt-28 sm:pt-32 pb-20 sm:pb-28 nexus-container min-h-[82vh] flex flex-col justify-center"
      >
        <div className="mb-8">
          <BackToHomeLink />
        </div>

        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full hairline-border bg-[#151B29]/75 font-mono text-xs uppercase tracking-[0.22em] text-[#38BDF8]">
            <Compass className="w-3.5 h-3.5" aria-hidden="true" />
            <span>HTTP 404 // ROUTE NOT FOUND</span>
          </div>

          <h1
            id="not-found-heading"
            className="font-display text-[clamp(2.5rem,5.2vw,4.75rem)] font-bold leading-[0.98] tracking-tight text-[#F8FAFC]"
          >
            THIS NODE IS OUTSIDE THE NEXUS.
          </h1>

          <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl leading-relaxed">
            The page you requested may have moved, been renamed, or does not exist. Use the direct pathways below to continue exploring Rubik Integrated Systems.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to="/"
              data-interactive="true"
              data-cursor="interactive"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#38BDF8] text-[#080D1A] font-display text-sm font-semibold tracking-wide hover:bg-[#7DD3FC] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Return to Home</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              to="/contact"
              data-interactive="true"
              data-cursor="interactive"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl hairline-border bg-[#151B29]/70 text-[#F8FAFC] font-display text-sm font-medium hover:border-[#38BDF8]/50 hover:text-[#38BDF8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
            >
              <span>Contact Engineering</span>
            </Link>
          </div>
        </div>

        <div className="mt-14 pt-10 border-t border-white/10">
          <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-[#94A3B8] mb-6">
            VERIFIED DESTINATIONS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SUGGESTED_ROUTES.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  data-interactive="true"
                  data-cursor="interactive"
                  className="group glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#38BDF8]">
                        {item.code}
                      </span>
                      <Icon
                        className="w-4 h-4 text-[#94A3B8] group-hover:text-[#38BDF8] transition-colors"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                      {item.label}
                    </h3>
                    <p className="text-sm text-[#94A3B8] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 font-mono text-xs text-[#E2E8F0] group-hover:text-[#38BDF8] transition-colors">
                    <span>Open Route</span>
                    <ArrowRight
                      className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFoundPage;
