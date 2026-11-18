import React from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ContactTerminal } from '../components/sections/ContactTerminal';
import { BackToHomeLink } from '../components/ui/BackToHomeLink';
import { PageMeta } from '../components/seo/PageMeta';

export interface ContactPageProps {
  preselectedService?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  preselectedService,
}) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const routeState = location.state as { preselectedService?: string } | null;
  const resolvedService =
    routeState?.preselectedService ||
    searchParams.get('service') ||
    preselectedService;

  return (
    <div className="pt-28 sm:pt-32">
      <PageMeta
        title="Contact Rubik Integrated Systems | Start a Conversation"
        description="Connect with Rubik Integrated Systems in Cairo, Egypt (+20 100 101 0538 | info@rubik-is.com) to scope infrastructure, custom software, AI automation, or enterprise platforms."
        path="/contact"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]}
      />
      <section
        aria-label="Contact Rubik header"
        className="nexus-container pt-6 pb-8 border-b border-white/10"
      >
        <div className="mb-8">
          <BackToHomeLink />
        </div>
        <div className="max-w-4xl space-y-4">
          <div className="type-eyebrow text-[#38BDF8]">
            CONTACT RUBIK INTEGRATED SYSTEMS // CAIRO, EGYPT
          </div>
          <h1 className="type-hero text-[clamp(2.25rem,4.5vw,4rem)] text-[#F8FAFC]">
            START A CONVERSATION.
          </h1>
          <p className="type-lead text-[#CBD5E1]/90 max-w-2xl">
            Connect directly with our infrastructure, software engineering, and enterprise systems specialists.
          </p>
        </div>
      </section>
      <ContactTerminal preselectedService={resolvedService} />
    </div>
  );
};

export default ContactPage;
