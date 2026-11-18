import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Send,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import {
  COMPANY_INFO,
  SERVICES_LIST,
} from '../../data/rubikData';
import { SOLUTIONS_LIST } from '../../data/solutions';
import {
  validateContactForm,
  submitContactInquiry,
  buildMailtoFallback,
  type ContactFormPayload,
  type ContactSubmissionResult,
} from '../../lib/contactService';
import { SectionHeading } from '../ui/SectionHeading';
import { MagneticButton } from '../ui/MagneticButton';
import { useSectionReveal } from '../../lib/animation';
import { trackContactEvent, trackCtaClick } from '../../lib/analytics';

export interface ContactTerminalProps {
  preselectedService?: string;
}

const SERVICE_OPTIONS: string[] = [
  ...SERVICES_LIST.map((s) => s.title),
  ...SOLUTIONS_LIST.map((s) => s.serviceInquiryName),
  'General Enterprise Systems Consultation',
];

export const ContactTerminal: React.FC<ContactTerminalProps> = ({
  preselectedService,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  useSectionReveal(sectionRef, { stagger: 0.08, y: 24 });

  const [formData, setFormData] = useState<ContactFormPayload>({
    name: '',
    company: '',
    email: '',
    telephone: '',
    service: preselectedService || SERVICE_OPTIONS[0],
    description: '',
    honeypot: '',
  });

  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ContactFormPayload, string>>
  >({});
  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<keyof ContactFormPayload, boolean>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] =
    useState<ContactSubmissionResult | null>(null);
  const hasStartedFormRef = useRef(false);

  const handleFormFocusCapture = () => {
    if (hasStartedFormRef.current) return;
    hasStartedFormRef.current = true;
    trackContactEvent('contact_form_start', {
      form_location: 'contact_terminal',
      preselected_service: formData.service,
    });
  };

  useEffect(() => {
    if (preselectedService && preselectedService.trim().length > 0) {
      setFormData((prev) => ({
        ...prev,
        service: preselectedService,
      }));
    }
  }, [preselectedService]);

  const handleFieldChange = (
    field: keyof ContactFormPayload,
    value: string
  ) => {
    const nextData = { ...formData, [field]: value };
    setFormData(nextData);

    if (touchedFields[field]) {
      const validation = validateContactForm(nextData);
      setFieldErrors((prev) => ({
        ...prev,
        [field]: validation.errors[field],
      }));
    }
  };

  const handleFieldBlur = (field: keyof ContactFormPayload) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    const validation = validateContactForm(formData);
    setFieldErrors((prev) => ({
      ...prev,
      [field]: validation.errors[field],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouchedFields({
      name: true,
      company: true,
      email: true,
      telephone: true,
      service: true,
      description: true,
    });

    const validation = validateContactForm(formData);
    setFieldErrors(validation.errors);

    if (!validation.valid) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      const result = await submitContactInquiry(formData);
      setSubmissionResult(result);
      trackContactEvent('contact_form_submit', {
        service_category: formData.service,
        submission_status: result.status,
        submission_ok: result.ok,
      });
      if (result.ok) {
        trackContactEvent('generate_lead', {
          service_category: formData.service,
          lead_source: 'contact_terminal',
          smtp_configured: result.smtpConfigured,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const liveMailtoUrl =
    submissionResult?.mailtoFallbackUrl || buildMailtoFallback(formData);

  return (
    <section
      id="contact"
      data-analytics-section="contact"
      ref={sectionRef}
      aria-labelledby="contact-heading"
      className="nexus-section relative bg-[#080D1A] border-t border-white/10 overflow-x-clip"
    >
      <div className="nexus-container space-y-12">
        <div id="contact-heading">
          <SectionHeading
            indexTag="09"
            eyebrow="LET'S CONNECT"
            title="HAVE A SYSTEM TO SOLVE?"
            highlight="LET'S BUILD THE CONNECTION."
            description="Share your infrastructure, custom software, or Odoo ERP objectives with Rubik Integrated Systems."
            align="left"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
          {/* Left Column: Verified Corporate Channels */}
          <div
            data-reveal
            className="lg:col-span-5 smoked-glass rounded-2xl p-6 sm:p-8 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#38BDF8]">
                DIRECT CHANNELS
              </span>
              <span className="font-mono text-[11px] text-[#94A3B8]">
                CAIRO, EGYPT
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F8FAFC]">
                {COMPANY_INFO.name}
              </h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                24/7 hardware and software technical support alongside dedicated solution architecture and project consultancy.
              </p>
            </div>

            <div className="divide-y divide-white/10 border-y border-white/10">
              <a
                href={`tel:${COMPANY_INFO.phone.replace(/\s+/g, '')}`}
                onClick={() => trackCtaClick('Direct Phone', 'contact_terminal')}
                data-interactive="true"
                data-cursor="interactive"
                className="flex items-center gap-4 py-4 group"
              >
                <Phone
                  className="w-4 h-4 text-[#38BDF8] shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[#94A3B8]">
                    Telephone
                  </div>
                  <div className="font-mono text-sm font-semibold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                    {COMPANY_INFO.phone}
                  </div>
                </div>
              </a>

              <a
                href={`mailto:${COMPANY_INFO.email}`}
                onClick={() => trackCtaClick('Direct Email', 'contact_terminal')}
                data-interactive="true"
                data-cursor="interactive"
                className="flex items-center gap-4 py-4 group"
              >
                <Mail
                  className="w-4 h-4 text-[#38BDF8] shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[#94A3B8]">
                    Email
                  </div>
                  <div className="font-mono text-sm font-semibold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                    {COMPANY_INFO.email}
                  </div>
                </div>
              </a>

              <a
                href={COMPANY_INFO.website}
                target="_blank"
                rel="noopener noreferrer"
                data-interactive="true"
                data-cursor="interactive"
                className="flex items-center gap-4 py-4 group"
              >
                <Globe
                  className="w-4 h-4 text-[#38BDF8] shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[#94A3B8]">
                    Website
                  </div>
                  <div className="font-mono text-sm font-semibold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors inline-flex items-center gap-1.5">
                    <span>www.rubik-is.com</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-4 py-4">
                <MapPin
                  className="w-4 h-4 text-[#38BDF8] shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[#94A3B8]">
                    Location
                  </div>
                  <div className="text-sm font-medium text-[#F8FAFC]">
                    {COMPANY_INFO.location} · Founded {COMPANY_INFO.founded}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Glass Form */}
          <div
            data-reveal
            className="lg:col-span-7 smoked-glass rounded-2xl overflow-hidden"
          >
            <div className="px-6 py-4 bg-[#080D1A]/80 border-b border-white/10 flex items-center justify-between">
              <span className="font-mono text-xs text-[#94A3B8]">
                PROJECT INQUIRY TERMINAL
              </span>
              <span className="font-mono text-[11px] text-[#38BDF8]">
                VALIDATED UPLINK
              </span>
            </div>

            <form
              onSubmit={handleSubmit}
              onFocusCapture={handleFormFocusCapture}
              noValidate
              className="p-6 sm:p-8 space-y-6"
              aria-label="Project consultation and service inquiry form"
            >
              {/* Hidden Honeypot Field for Anti-Spam */}
              <div
                aria-hidden="true"
                className="sr-only"
                style={{ position: 'absolute', left: '-9999px' }}
              >
                <label htmlFor="contact-honeypot">
                  Leave this field empty if you are human
                </label>
                <input
                  id="contact-honeypot"
                  name="honeypot"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honeypot || ''}
                  onChange={(e) => handleFieldChange('honeypot', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block font-mono text-xs uppercase tracking-wider text-[#F8FAFC] mb-2"
                  >
                    Name <span className="text-[#38BDF8]">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    onBlur={() => handleFieldBlur('name')}
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={
                      fieldErrors.name ? 'contact-name-error' : undefined
                    }
                    className={`w-full px-4 py-3 rounded-xl bg-[#080D1A]/90 border text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 focus:outline-none focus:ring-2 transition-all ${
                      fieldErrors.name
                        ? 'border-rose-500/80 focus:ring-rose-500/50'
                        : 'border-white/15 focus:border-[#38BDF8] focus:ring-[#38BDF8]/30'
                    }`}
                  />
                  {fieldErrors.name && (
                    <p
                      id="contact-name-error"
                      role="alert"
                      className="mt-1.5 text-xs text-rose-400 font-mono"
                    >
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                {/* Company */}
                <div>
                  <label
                    htmlFor="contact-company"
                    className="block font-mono text-xs uppercase tracking-wider text-[#F8FAFC] mb-2"
                  >
                    Company <span className="text-[#38BDF8]">*</span>
                  </label>
                  <input
                    id="contact-company"
                    name="company"
                    type="text"
                    required
                    autoComplete="organization"
                    placeholder="Organization name"
                    value={formData.company}
                    onChange={(e) =>
                      handleFieldChange('company', e.target.value)
                    }
                    onBlur={() => handleFieldBlur('company')}
                    aria-invalid={Boolean(fieldErrors.company)}
                    aria-describedby={
                      fieldErrors.company ? 'contact-company-error' : undefined
                    }
                    className={`w-full px-4 py-3 rounded-xl bg-[#080D1A]/90 border text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 focus:outline-none focus:ring-2 transition-all ${
                      fieldErrors.company
                        ? 'border-rose-500/80 focus:ring-rose-500/50'
                        : 'border-white/15 focus:border-[#38BDF8] focus:ring-[#38BDF8]/30'
                    }`}
                  />
                  {fieldErrors.company && (
                    <p
                      id="contact-company-error"
                      role="alert"
                      className="mt-1.5 text-xs text-rose-400 font-mono"
                    >
                      {fieldErrors.company}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block font-mono text-xs uppercase tracking-wider text-[#F8FAFC] mb-2"
                  >
                    Email <span className="text-[#38BDF8]">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onBlur={() => handleFieldBlur('email')}
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={
                      fieldErrors.email ? 'contact-email-error' : undefined
                    }
                    className={`w-full px-4 py-3 rounded-xl bg-[#080D1A]/90 border text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 focus:outline-none focus:ring-2 transition-all ${
                      fieldErrors.email
                        ? 'border-rose-500/80 focus:ring-rose-500/50'
                        : 'border-white/15 focus:border-[#38BDF8] focus:ring-[#38BDF8]/30'
                    }`}
                  />
                  {fieldErrors.email && (
                    <p
                      id="contact-email-error"
                      role="alert"
                      className="mt-1.5 text-xs text-rose-400 font-mono"
                    >
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Telephone */}
                <div>
                  <label
                    htmlFor="contact-telephone"
                    className="block font-mono text-xs uppercase tracking-wider text-[#F8FAFC] mb-2"
                  >
                    Telephone <span className="text-[#38BDF8]">*</span>
                  </label>
                  <input
                    id="contact-telephone"
                    name="telephone"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="+20 100 101 0538"
                    value={formData.telephone}
                    onChange={(e) =>
                      handleFieldChange('telephone', e.target.value)
                    }
                    onBlur={() => handleFieldBlur('telephone')}
                    aria-invalid={Boolean(fieldErrors.telephone)}
                    aria-describedby={
                      fieldErrors.telephone
                        ? 'contact-telephone-error'
                        : undefined
                    }
                    className={`w-full px-4 py-3 rounded-xl bg-[#080D1A]/90 border text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 focus:outline-none focus:ring-2 transition-all ${
                      fieldErrors.telephone
                        ? 'border-rose-500/80 focus:ring-rose-500/50'
                        : 'border-white/15 focus:border-[#38BDF8] focus:ring-[#38BDF8]/30'
                    }`}
                  />
                  {fieldErrors.telephone && (
                    <p
                      id="contact-telephone-error"
                      role="alert"
                      className="mt-1.5 text-xs text-rose-400 font-mono"
                    >
                      {fieldErrors.telephone}
                    </p>
                  )}
                </div>
              </div>

              {/* Service Interested In */}
              <div>
                <label
                  htmlFor="contact-service"
                  className="block font-mono text-xs uppercase tracking-wider text-[#F8FAFC] mb-2"
                >
                  Service Interested In <span className="text-[#38BDF8]">*</span>
                </label>
                <select
                  id="contact-service"
                  name="service"
                  required
                  value={formData.service}
                  onChange={(e) => handleFieldChange('service', e.target.value)}
                  onBlur={() => handleFieldBlur('service')}
                  aria-invalid={Boolean(fieldErrors.service)}
                  aria-describedby={
                    fieldErrors.service ? 'contact-service-error' : undefined
                  }
                  className="w-full px-4 py-3 rounded-xl bg-[#080D1A]/90 border border-white/15 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/30 transition-all"
                >
                  {SERVICE_OPTIONS.map((option) => (
                    <option
                      key={option}
                      value={option}
                      className="bg-[#080D1A] text-[#F8FAFC]"
                    >
                      {option}
                    </option>
                  ))}
                </select>
                {fieldErrors.service && (
                  <p
                    id="contact-service-error"
                    role="alert"
                    className="mt-1.5 text-xs text-rose-400 font-mono"
                  >
                    {fieldErrors.service}
                  </p>
                )}
              </div>

              {/* Project Description */}
              <div>
                <label
                  htmlFor="contact-description"
                  className="block font-mono text-xs uppercase tracking-wider text-[#F8FAFC] mb-2"
                >
                  Project Description <span className="text-[#38BDF8]">*</span>
                </label>
                <textarea
                  id="contact-description"
                  name="description"
                  rows={4}
                  required
                  placeholder="Describe your operational challenge, infrastructure scope, software needs, or Odoo ERP objectives..."
                  value={formData.description}
                  onChange={(e) =>
                    handleFieldChange('description', e.target.value)
                  }
                  onBlur={() => handleFieldBlur('description')}
                  aria-invalid={Boolean(fieldErrors.description)}
                  aria-describedby={
                    fieldErrors.description
                      ? 'contact-description-error'
                      : undefined
                  }
                  className={`w-full px-4 py-3 rounded-xl bg-[#080D1A]/90 border text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 focus:outline-none focus:ring-2 transition-all resize-y ${
                    fieldErrors.description
                      ? 'border-rose-500/80 focus:ring-rose-500/50'
                      : 'border-white/15 focus:border-[#38BDF8] focus:ring-[#38BDF8]/30'
                  }`}
                />
                {fieldErrors.description && (
                  <p
                    id="contact-description-error"
                    role="alert"
                    className="mt-1.5 text-xs text-rose-400 font-mono"
                  >
                    {fieldErrors.description}
                  </p>
                )}
              </div>

              {/* Submit CTA & Direct Email Fallback */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                <MagneticButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2
                        className="w-4 h-4 animate-spin"
                        aria-hidden="true"
                      />
                      <span>SUBMITTING...</span>
                    </>
                  ) : (
                    <>
                      <span>START A CONVERSATION</span>
                      <Send className="w-4 h-4" aria-hidden="true" />
                    </>
                  )}
                </MagneticButton>

                <a
                  href={liveMailtoUrl}
                  onClick={() =>
                    trackCtaClick('Direct Email Button', 'contact_terminal')
                  }
                  data-interactive="true"
                  data-cursor="interactive"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#080D1A]/80 hover:bg-[#080D1A] border border-white/15 hover:border-[#38BDF8]/50 font-mono text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#38BDF8]" aria-hidden="true" />
                  <span>Send via Email ({COMPANY_INFO.email})</span>
                </a>
              </div>

              {/* Submission Status Terminal Output */}
              {submissionResult && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`mt-6 p-5 rounded-xl border font-mono text-xs leading-relaxed ${
                    submissionResult.ok
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {submissionResult.ok ? (
                      <CheckCircle2
                        className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                    ) : (
                      <AlertTriangle
                        className="w-5 h-5 text-amber-400 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                    )}
                    <div className="space-y-3 w-full">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-bold uppercase tracking-wider text-sm">
                          {submissionResult.ok
                            ? 'VALIDATED & LOGGED'
                            : 'LOCAL FALLBACK READY'}
                        </span>
                        {submissionResult.referenceId && (
                          <span className="px-2 py-0.5 rounded bg-black/40 text-[#38BDF8]">
                            REF: {submissionResult.referenceId}
                          </span>
                        )}
                      </div>

                      <p className="text-[#F8FAFC]/90 font-sans text-sm">
                        {submissionResult.message}
                      </p>

                      {!submissionResult.smtpConfigured && (
                        <p className="text-xs text-[#94A3B8] font-sans">
                          External SMTP credentials are not configured in this local/static environment. Use the button below to dispatch directly via your email client to {COMPANY_INFO.email}.
                        </p>
                      )}

                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <a
                          href={submissionResult.mailtoFallbackUrl}
                          onClick={() =>
                            trackCtaClick(
                              'Email Client Fallback',
                              'contact_terminal_status'
                            )
                          }
                          data-interactive="true"
                          data-cursor="interactive"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#38BDF8] text-[#080D1A] font-sans font-semibold text-xs hover:bg-[#38BDF8]/90 transition-colors"
                        >
                          <Mail className="w-4 h-4" aria-hidden="true" />
                          <span>Send via Email Client ({COMPANY_INFO.email})</span>
                        </a>
                        <a
                          href={`tel:${COMPANY_INFO.phone.replace(/\s+/g, '')}`}
                          onClick={() =>
                            trackCtaClick(
                              'Phone Fallback',
                              'contact_terminal_status'
                            )
                          }
                          data-interactive="true"
                          data-cursor="interactive"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#080D1A] text-[#F8FAFC] border border-white/20 hover:border-[#38BDF8] font-sans font-medium text-xs transition-colors"
                        >
                          <Phone
                            className="w-4 h-4 text-[#38BDF8]"
                            aria-hidden="true"
                          />
                          <span>Call {COMPANY_INFO.phone}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactTerminal;
