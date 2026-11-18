import { describe, it, expect } from 'vitest';
import {
  SERVICES_LIST,
  CORE_VALUES,
  TECH_PARTNERS,
  CLIENT_PORTFOLIO,
  COMPANY_INFO,
} from '../../src/data/rubikData';
import { SOLUTIONS_LIST, getSolutionBySlug } from '../../src/data/solutions';
import {
  EVENTS_LIST,
  getUpcomingEvents,
  getPastEvents,
  getEventBySlug,
} from '../../src/data/events';

describe('SERVICES_LIST & Verified Company Data', () => {
  it('contains 8 services in sequential order 01 through 08', () => {
    expect(SERVICES_LIST).toHaveLength(8);
    expect(SERVICES_LIST.map((s) => s.index)).toEqual([
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
    ]);
  });

  it('standardizes all 8 services to 6 capabilities and non-empty businessValue', () => {
    for (const service of SERVICES_LIST) {
      expect(service.capabilities).toHaveLength(6);
      expect(service.businessValue.trim().length).toBeGreaterThan(20);
      expect(service.ctaLabel.trim().length).toBeGreaterThan(0);
    }
  });

  it('includes 06 it-consulting with 6 referenced frameworks', () => {
    const consulting = SERVICES_LIST.find((s) => s.id === 'it-consulting');
    expect(consulting).toBeDefined();
    expect(consulting?.index).toBe('06');
    expect(consulting?.title).toBe('IT Consulting & Technology Advisory');
    expect(consulting?.frameworks).toHaveLength(6);
    expect(consulting?.frameworks?.map((f) => f.name)).toEqual([
      'TOGAF',
      'COBIT',
      'ISO/IEC 27001',
      'NIST Cybersecurity Framework (CSF)',
      'ITIL',
      'ISO 22301',
    ]);
  });

  it('includes 07 it-support with Subgroups A & B and 4 referenced frameworks', () => {
    const support = SERVICES_LIST.find((s) => s.id === 'it-support');
    expect(support).toBeDefined();
    expect(support?.index).toBe('07');
    expect(support?.title).toBe('IT Support & Managed IT Services');
    expect(support?.subgroups).toHaveLength(2);
    expect(support?.subgroups?.[0].title).toBe('Service Desk & Remote IT Support');
    expect(support?.subgroups?.[1].title).toBe(
      'Onsite IT Support & Infrastructure Operations'
    );
    expect(support?.frameworks).toHaveLength(4);
  });

  it('maintains 5 concise core values, factual company info, 9 partners, and 17 clients', () => {
    expect(CORE_VALUES).toHaveLength(5);
    for (const val of CORE_VALUES) {
      expect(val.title.trim().length).toBeGreaterThan(3);
      expect(val.description.trim().length).toBeGreaterThan(40);
    }
    expect(COMPANY_INFO.name).toBe('Rubik Integrated Systems');
    expect(COMPANY_INFO.email).toBe('info@rubik-is.com');
    expect(COMPANY_INFO.founded).toBe(2021);
    expect(TECH_PARTNERS).toHaveLength(9);
    expect(CLIENT_PORTFOLIO).toHaveLength(17);
  });
});

describe('SOLUTIONS_LIST', () => {
  it('contains both flagship Rubik operational solutions with canonical routes', () => {
    expect(SOLUTIONS_LIST).toHaveLength(2);
    expect(SOLUTIONS_LIST.map((s) => s.route)).toEqual([
      '/solutions/zkteco-attendance',
      '/solutions/weighing-management',
    ]);
  });

  it('resolves both solutions via getSolutionBySlug', () => {
    const zk = getSolutionBySlug('zkteco-attendance');
    const weigh = getSolutionBySlug('weighing-management');
    expect(zk?.title).toBe('Rubik ZKTeco Attendance Management System');
    expect(weigh?.title).toBe('Centralized Weighing Machine Management System');
    expect(getSolutionBySlug('nonexistent')).toBeUndefined();
  });
});

describe('EVENTS_LIST', () => {
  it('returns zero upcoming events and 1 verified IBM Storage past event with 3 gallery photos', () => {
    expect(getUpcomingEvents()).toHaveLength(0);
    const past = getPastEvents();
    expect(past).toHaveLength(1);
    expect(EVENTS_LIST).toHaveLength(1);
    const ibm = getEventBySlug('unlocking-the-power-of-ibm-storage');
    expect(ibm?.title).toBe('Unlocking the Power of IBM Storage');
    expect(ibm?.gallery).toHaveLength(3);
  });
});
