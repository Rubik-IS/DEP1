import { describe, it, expect } from 'vitest';
import {
  validateContactForm,
  sanitizeInput,
  buildMailtoFallback,
  type ContactFormPayload,
} from '../../src/lib/contactService';

describe('Contact Validation & Input Sanitization', () => {
  const validPayload: ContactFormPayload = {
    name: 'Ahmed Hassan',
    email: 'ahmed@enterprise-eg.com',
    company: 'Enterprise Logistics Egypt',
    telephone: '+20 100 123 4567',
    service: 'Infrastructure & Networking',
    description:
      'We need an enterprise IBM storage and Fortinet firewall rollout.',
    honeypot: '',
  };

  it('accepts a valid inquiry payload with zero errors', () => {
    const result = validateContactForm(validPayload);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('rejects invalid email and short project descriptions', () => {
    const result = validateContactForm({
      ...validPayload,
      email: 'not-an-email',
      description: 'short',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
    expect(result.errors.description).toBeDefined();
  });

  it('flags honeypot-populated submissions as invalid spam', () => {
    const result = validateContactForm({
      ...validPayload,
      honeypot: 'http://spam.invalid',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.honeypot).toBeDefined();
  });

  it('strips angle brackets and control characters in sanitizeInput', () => {
    expect(sanitizeInput('  <script>alert(1)</script>\u0007Hello  ')).toBe(
      'scriptalert(1)/script Hello'
    );
  });

  it('builds a mailto fallback URL targeting info@rubik-is.com', () => {
    const url = buildMailtoFallback(validPayload);
    expect(url.startsWith('mailto:info@rubik-is.com?')).toBe(true);
    expect(url).toContain('subject=');
    expect(url).toContain('body=');
  });
});
