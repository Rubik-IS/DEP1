export interface ContactFormPayload {
  name: string;
  company: string;
  email: string;
  telephone: string;
  service: string;
  description: string;
  honeypot?: string;
}

export interface ContactValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactFormPayload, string>>;
}

export interface ContactSubmissionResult {
  ok: boolean;
  status:
    | 'accepted_local_relay'
    | 'validation_error'
    | 'rate_limited'
    | 'spam_blocked'
    | 'network_error';
  message: string;
  referenceId?: string;
  smtpConfigured: boolean;
  mailtoFallbackUrl: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[+\d][\d\s().-]{6,24}$/;

export function sanitizeInput(value: string, maxLength = 500): string {
  return value
    .replace(/[<>]/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export function validateContactForm(payload: ContactFormPayload): ContactValidationResult {
  const errors: Partial<Record<keyof ContactFormPayload, string>> = {};

  if (payload.honeypot && payload.honeypot.trim().length > 0) {
    errors.honeypot = 'Spam check triggered.';
  }

  const name = sanitizeInput(payload.name || '', 120);
  const company = sanitizeInput(payload.company || '', 140);
  const email = sanitizeInput(payload.email || '', 160);
  const telephone = sanitizeInput(payload.telephone || '', 45);
  const service = sanitizeInput(payload.service || '', 120);
  const description = sanitizeInput(payload.description || '', 2500);

  if (name.length < 2) {
    errors.name = 'Please enter your full name (at least 2 characters).';
  }

  if (company.length < 2) {
    errors.company = 'Please enter your organization or company name.';
  }

  if (!email) {
    errors.email = 'Please provide your business email address.';
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Please enter a valid email address (e.g., name@company.com).';
  }

  if (!telephone) {
    errors.telephone = 'Please provide a contact telephone number.';
  } else if (!PHONE_PATTERN.test(telephone)) {
    errors.telephone = 'Please enter a valid telephone number (e.g., +20 100 101 0538).';
  }

  if (!service || service.length < 2) {
    errors.service = 'Please select the Rubik service or pillar you are interested in.';
  }

  if (!description || description.length < 15) {
    errors.description = 'Please describe your project requirements (at least 15 characters).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function buildMailtoFallback(payload: ContactFormPayload): string {
  const name = sanitizeInput(payload.name || 'Prospective Client', 120);
  const company = sanitizeInput(payload.company || 'Enterprise Inquiry', 140);
  const email = sanitizeInput(payload.email || '', 160);
  const telephone = sanitizeInput(payload.telephone || '', 45);
  const service = sanitizeInput(payload.service || 'General Systems Inquiry', 120);
  const description = sanitizeInput(payload.description || '', 2500);

  const subject = encodeURIComponent(`[Rubik Nexus Inquiry] ${service} — ${company} (${name})`);
  const body = encodeURIComponent(
    [
      `Name: ${name}`,
      `Company: ${company}`,
      `Email: ${email}`,
      `Telephone: ${telephone}`,
      `Service Interested In: ${service}`,
      '',
      'Project Description:',
      description,
    ].join('\n')
  );

  return `mailto:info@rubik-is.com?subject=${subject}&body=${body}`;
}

export async function submitContactInquiry(
  payload: ContactFormPayload
): Promise<ContactSubmissionResult> {
  const mailtoFallbackUrl = buildMailtoFallback(payload);

  if (payload.honeypot && payload.honeypot.trim().length > 0) {
    return {
      ok: false,
      status: 'spam_blocked',
      message: 'Automated submission blocked.',
      smtpConfigured: false,
      mailtoFallbackUrl,
    };
  }

  const validation = validateContactForm(payload);
  if (!validation.valid) {
    const firstError =
      Object.values(validation.errors)[0] || 'Please check the highlighted form fields.';
    return {
      ok: false,
      status: 'validation_error',
      message: firstError,
      smtpConfigured: false,
      mailtoFallbackUrl,
    };
  }

  const sanitizedPayload: ContactFormPayload = {
    name: sanitizeInput(payload.name, 120),
    company: sanitizeInput(payload.company, 140),
    email: sanitizeInput(payload.email, 160),
    telephone: sanitizeInput(payload.telephone, 45),
    service: sanitizeInput(payload.service, 120),
    description: sanitizeInput(payload.description, 2500),
    honeypot: payload.honeypot || '',
  };

  const endpoint =
    (typeof import.meta !== 'undefined' &&
      (import.meta.env?.VITE_CONTACT_ENDPOINT as string | undefined)?.trim()) ||
    '/api/contact';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(sanitizedPayload),
    });

    const data = (await response.json()) as Partial<ContactSubmissionResult>;

    if (!response.ok || !data.ok) {
      return {
        ok: false,
        status: data.status || 'validation_error',
        message:
          data.message ||
          'Unable to process inquiry via local relay. You can dispatch directly via your email client below.',
        referenceId: data.referenceId,
        smtpConfigured: Boolean(data.smtpConfigured),
        mailtoFallbackUrl: data.mailtoFallbackUrl || mailtoFallbackUrl,
      };
    }

    return {
      ok: true,
      status: data.status || 'accepted_local_relay',
      message:
        data.message ||
        'Inquiry validated and logged by the local Rubik API relay. Use the button below to dispatch directly via your email client to info@rubik-is.com.',
      referenceId: data.referenceId,
      smtpConfigured: Boolean(data.smtpConfigured),
      mailtoFallbackUrl: data.mailtoFallbackUrl || mailtoFallbackUrl,
    };
  } catch {
    return {
      ok: false,
      status: 'network_error',
      message:
        'Static hosting or offline mode detected (/api/contact relay unreachable). Your inquiry is ready to send directly to info@rubik-is.com via your email client or by calling +20 100 101 0538.',
      smtpConfigured: false,
      mailtoFallbackUrl,
    };
  }
}
