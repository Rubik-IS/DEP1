import React from 'react';

export interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: 'left' | 'center';
  indexTag?: string;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  highlight,
  description,
  align = 'left',
  indexTag,
  className = '',
}) => {
  const isCenter = align === 'center';

  const renderTitleContent = () => {
    if (!highlight) {
      return title;
    }

    const highlightClasses =
      'bg-gradient-to-r from-[#38BDF8] via-[#60A5FA] to-[#6366F1] bg-clip-text text-transparent';

    if (title.includes(highlight)) {
      const parts = title.split(highlight);
      return (
        <>
          {parts[0]}
          <span className={highlightClasses}>{highlight}</span>
          {parts.slice(1).join(highlight)}
        </>
      );
    }

    return (
      <>
        {title}{' '}
        <span className={highlightClasses}>{highlight}</span>
      </>
    );
  };

  return (
    <div
      className={`flex flex-col ${
        isCenter ? 'items-center text-center mx-auto max-w-3xl' : 'items-start text-left max-w-3xl'
      } ${className}`}
    >
      {/* Eyebrow Badge + Rubik 3x3 Mini Matrix + Monospace Index Tag */}
      <div
        data-reveal
        className="mb-4 inline-flex items-center gap-3 rounded-full border border-[#38BDF8]/25 bg-[#0E172F]/80 px-4 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(56,189,248,0.1)]"
      >
        {/* Rubik 3x3 Mini Matrix Indicator */}
        <span
          aria-hidden="true"
          className="grid h-3.5 w-3.5 grid-cols-3 gap-[2px]"
        >
          {Array.from({ length: 9 }).map((_, idx) => {
            const isOffsetNode = idx === 8;
            return (
              <span
                key={idx}
                className={` rounded-[1px] transition-transform duration-300 ${
                  isOffsetNode
                    ? 'translate-x-[1.5px] translate-y-[1.5px] bg-[#38BDF8] shadow-[0_0_6px_#38BDF8]'
                    : idx % 2 === 0
                    ? 'bg-[#38BDF8]/80'
                    : 'bg-[#6366F1]/80'
                }`}
              />
            );
          })}
        </span>

        {indexTag && (
          <>
            <span className="font-mono text-xs font-medium tracking-wider text-[#38BDF8]">
              {indexTag}
            </span>
            <span
              aria-hidden="true"
              className="h-3 w-px bg-white/15"
            />
          </>
        )}

        <span className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#F8FAFC]/90">
          {eyebrow}
        </span>
      </div>

      {/* Main High-Contrast Headline */}
      <h2
        data-reveal
        className="type-h2 text-3xl text-[#F8FAFC] sm:text-4xl lg:text-5xl"
      >
        {renderTitleContent()}
      </h2>

      {/* Optional Architectural Description */}
      {description && (
        <p
          data-reveal
          className="mt-4 type-lead text-[#CBD5E1]/90"
        >
          {description}
        </p>
      )}
    </div>
  );
};
