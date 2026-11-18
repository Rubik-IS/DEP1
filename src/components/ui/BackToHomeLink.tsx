import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export interface BackToHomeLinkProps {
  className?: string;
}

export const BackToHomeLink: React.FC<BackToHomeLinkProps> = ({
  className = '',
}) => {
  return (
    <Link
      to="/"
      data-interactive="true"
      data-cursor="interactive"
      aria-label="Back to Home"
      className={`group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#94A3B8] hover:text-[#38BDF8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] rounded-md py-1 ${className}`}
    >
      <ArrowLeft
        className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
        aria-hidden="true"
      />
      <span>Back to Home</span>
    </Link>
  );
};

export default BackToHomeLink;
