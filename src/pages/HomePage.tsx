import React from 'react';
import { Hero } from '../components/sections/Hero';
import { Services } from '../components/sections/Services';
import { SolutionsShowcase } from '../components/sections/SolutionsShowcase';
import { ProcessTimeline } from '../components/sections/ProcessTimeline';
import { ClientPortfolio } from '../components/sections/ClientPortfolio';
import { EventsPreview } from '../components/sections/EventsPreview';
import { About } from '../components/sections/About';
import { ContactTerminal } from '../components/sections/ContactTerminal';
import { PageMeta } from '../components/seo/PageMeta';
import type { NexusMode, CubieHoverInfo } from '../components/canvas/RubikSceneCanvas';

export interface HomePageProps {
  nexusMode: NexusMode;
  onChangeNexusMode: (mode: NexusMode) => void;
  activeServiceId: string | null;
  hoveredService: CubieHoverInfo | null;
  onSelectService: (serviceId: string | null) => void;
  preselectedService?: string;
  onSelectServiceForContact: (serviceTitle: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  nexusMode,
  onChangeNexusMode,
  activeServiceId,
  hoveredService,
  onSelectService,
  preselectedService,
  onSelectServiceForContact,
}) => {
  return (
    <>
      <PageMeta
        title="Rubik Integrated Systems | Technology, Connected. — The Rubik Nexus"
        description="Make every system work as one. Rubik Integrated Systems connects IT infrastructure, cybersecurity, custom software, AI automation, Odoo ERP, and industrial systems in Cairo, Egypt."
        path="/"
      />

      <Hero
        nexusMode={nexusMode}
        onChangeNexusMode={onChangeNexusMode}
        activeServiceId={activeServiceId}
        hoveredService={hoveredService}
        onSelectService={onSelectService}
        onDiscussService={onSelectServiceForContact}
      />

      <Services
        activeServiceId={activeServiceId}
        onSelectService={onSelectService}
        onSelectServiceForContact={onSelectServiceForContact}
      />

      <SolutionsShowcase />

      <div data-analytics-section="approach">
        <ProcessTimeline />
      </div>

      <ClientPortfolio />

      <EventsPreview />

      <About />

      <ContactTerminal preselectedService={preselectedService} />
    </>
  );
};

export default HomePage;
