import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Phone, Mail, Globe } from 'lucide-react';
import { COMPANY_INFO } from '../../data/rubikData';
import { scrollToSection } from '../../lib/animation';
import { trackEvent, trackNavClick } from '../../lib/analytics';

interface FooterNavItem {
  index: string;
  label: string;
  to: string;
  sectionId?: string;
}

const FOOTER_NAV_LINKS: FooterNavItem[] = [
  { index: '01', label: 'Services', to: '/#services', sectionId: 'services' },
  { index: '02', label: 'Solutions', to: '/#solutions', sectionId: 'solutions' },
  { index: '03', label: 'Industries', to: '/industries' },
  { index: '04', label: 'Events', to: '/events' },
  { index: '05', label: 'About', to: '/about' },
  { index: '06', label: 'Contact', to: '/contact' },
];

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSectionNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    label: string,
    sectionId: string
  ) => {
    e.preventDefault();
    trackNavClick(`Footer ${label}`, `/#${sectionId}`);
    if (location.pathname === '/') {
      scrollToSection(sectionId);
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <footer
      role="contentinfo"
      className="w-full relative bg-[#080D1A] border-t border-white/10 pt-16 pb-10 overflow-x-clip"
    >
      <div className="nexus-container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Refined Unified Brand Lockup (No "I.S" badge) */}
          <div className="md:col-span-5 space-y-4">
            <Link
              to="/"
              onClick={() => trackNavClick('Footer Home', '/')}
              data-interactive="true"
              data-cursor="interactive"
              className="inline-flex items-center gap-3.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] rounded-xl p-0.5"
            >
              <div
                aria-hidden="true"
                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#151B29] to-[#080D1A] border border-slate-400/25 group-hover:border-[#38BDF8]/60 shadow-[0_0_18px_rgba(56,189,248,0.12)] transition-all duration-300"
              >
                <svg
                  viewBox="0 0 36 36"
                  className="w-5 h-5 overflow-visible transition-transform duration-500 ease-out group-hover:rotate-6 motion-reduce:transition-none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="3" y="3" width="8" height="8" rx="2" fill="#38BDF8" opacity="0.85" />
                  <rect x="13.5" y="3" width="8" height="8" rx="2" fill="#38BDF8" opacity="0.9" />
                  <rect x="24" y="3" width="8" height="8" rx="2" fill="#38BDF8" />
                  <rect x="3" y="13.5" width="8" height="8" rx="2" fill="#38BDF8" opacity="0.9" />
                  <rect x="13.5" y="13.5" width="8" height="8" rx="2" fill="#6366F1" />
                  <rect x="24" y="13.5" width="8" height="8" rx="2" fill="#38BDF8" opacity="0.95" />
                  <rect x="3" y="24" width="8" height="8" rx="2" fill="#38BDF8" opacity="0.8" />
                  <rect x="13.5" y="24" width="8" height="8" rx="2" fill="#38BDF8" opacity="0.9" />
                  <rect
                    x="25.8"
                    y="25.8"
                    width="8"
                    height="8"
                    rx="2"
                    fill="#6366F1"
                    className="animate-pulse motion-reduce:animate-none transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                  />
                </svg>
              </div>

              <div className="flex flex-col leading-none">
                <span className="font-display text-base font-bold tracking-[0.14em] text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                  RUBIK
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#94A3B8] mt-1">
                  INTEGRATED SYSTEMS
                </span>
              </div>
              <span className="sr-only"> Home</span>
            </Link>

            <p className="text-sm text-[#94A3B8] max-w-md leading-relaxed">
              <span className="text-[#E2E8F0] font-medium">Technology, connected.</span>{' '}
              {COMPANY_INFO.tagline} Connecting infrastructure, custom software, AI automation, and enterprise platforms.
            </p>
          </div>

          {/* Primary Navigation (Aligned to Main Header) */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="type-eyebrow text-[#94A3B8]">
              Navigation
            </h3>
            <ul className="space-y-2">
              {FOOTER_NAV_LINKS.map((link) => (
                <li key={link.label}>
                  {link.sectionId ? (
                    <a
                      href={link.to}
                      onClick={(e) =>
                        handleSectionNavigation(e, link.label, link.sectionId!)
                      }
                      data-interactive="true"
                      data-cursor="interactive"
                      className="inline-flex items-center gap-2 text-sm text-[#CBD5E1] hover:text-[#38BDF8] transition-colors"
                    >
                      <span className="text-[11px] font-semibold text-[#94A3B8] tabular-nums">
                        {link.index}
                      </span>
                      <span>{link.label}</span>
                    </a>
                  ) : (
                    <Link
                      to={link.to}
                      onClick={() => trackNavClick(`Footer ${link.label}`, link.to)}
                      data-interactive="true"
                      data-cursor="interactive"
                      className="inline-flex items-center gap-2 text-sm text-[#CBD5E1] hover:text-[#38BDF8] transition-colors"
                    >
                      <span className="text-[11px] font-semibold text-[#94A3B8] tabular-nums">
                        {link.index}
                      </span>
                      <span>{link.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Verified Contact */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="type-eyebrow text-[#94A3B8]">
              Contact
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  onClick={() =>
                    trackEvent('outbound_click', {
                      link_type: 'email',
                      location: 'footer',
                    })
                  }
                  data-interactive="true"
                  data-cursor="interactive"
                  className="inline-flex items-center gap-2.5 text-[#F8FAFC] hover:text-[#38BDF8] transition-colors font-mono text-xs"
                >
                  <Mail className="w-3.5 h-3.5 text-[#38BDF8]" aria-hidden="true" />
                  <span>{COMPANY_INFO.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${COMPANY_INFO.phone.replace(/\s+/g, '')}`}
                  onClick={() =>
                    trackEvent('outbound_click', {
                      link_type: 'phone',
                      location: 'footer',
                    })
                  }
                  data-interactive="true"
                  data-cursor="interactive"
                  className="inline-flex items-center gap-2.5 text-[#F8FAFC] hover:text-[#38BDF8] transition-colors font-mono text-xs"
                >
                  <Phone className="w-3.5 h-3.5 text-[#38BDF8]" aria-hidden="true" />
                  <span>{COMPANY_INFO.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={COMPANY_INFO.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent('outbound_click', {
                      link_type: 'website',
                      destination: 'www.rubik-is.com',
                      location: 'footer',
                    })
                  }
                  data-interactive="true"
                  data-cursor="interactive"
                  className="inline-flex items-center gap-2.5 text-[#94A3B8] hover:text-[#38BDF8] transition-colors font-mono text-xs"
                >
                  <Globe className="w-3.5 h-3.5 text-[#38BDF8]" aria-hidden="true" />
                  <span>www.rubik-is.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-[#94A3B8] text-center sm:text-left">
            © {currentYear} {COMPANY_INFO.name}. {COMPANY_INFO.location}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
