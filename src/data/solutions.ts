/**
 * Rubik Integrated Systems — Flagship Operational Solutions Registry
 *
 * Strictly grounded in Rubik Integrated Systems' verified platform capabilities:
 * 1. Rubik ZKTeco Attendance Management System (/solutions/zkteco-attendance)
 * 2. Centralized Weighing Machine Management System (/solutions/weighing-management)
 */

export interface SolutionHighlight {
  code: string;
  title: string;
  description: string;
}

export interface SolutionWorkflowStep {
  step: string;
  title: string;
  detail: string;
}

export interface RubikSolution {
  id: string;
  slug: 'zkteco-attendance' | 'weighing-management';
  route: string;
  index: string;
  eyebrow: string;
  title: string;
  shortTitle: string;
  headline: string;
  summary: string;
  overview: string;
  accentColor: string;
  serviceInquiryName: string;
  capabilities: string[];
  highlights: SolutionHighlight[];
  workflow: SolutionWorkflowStep[];
  architecturePillars: string[];
  outcomes: string[];
}

export const SOLUTIONS_LIST: RubikSolution[] = [
  {
    id: 'rubik-zkteco-attendance',
    slug: 'zkteco-attendance',
    route: '/solutions/zkteco-attendance',
    index: '01',
    eyebrow: 'WORKFORCE & BIOMETRIC PLATFORM',
    title: 'Rubik ZKTeco Attendance Management System',
    shortTitle: 'ZKTeco Attendance',
    headline: 'Centralized Workforce Attendance Connected Directly to ZKTeco Devices.',
    summary:
      'A unified enterprise attendance platform integrating ZKTeco biometric terminals across multi-location sites with automated shift rules, bilingual EN/AR workflows, and actionable HR analytics.',
    overview:
      'Designed for organizations operating across branches, factories, campuses, and corporate offices, the Rubik ZKTeco Attendance Management System bridges physical biometric terminals with centralized HR governance—eliminating manual attendance reconciliation while supporting full English and Arabic operations.',
    accentColor: '#38BDF8',
    serviceInquiryName: 'Rubik ZKTeco Attendance Management System',
    capabilities: [
      'Centralized employee attendance management',
      'Integration & synchronization with ZKTeco biometric devices',
      'Employee & department management',
      'Multi-location sites & shift schedules',
      'Working hours, lateness & absence tracking',
      'Overtime & exception approvals',
      'Role-based access control',
      'Bilingual (EN/AR) support',
      'Attendance dashboards, reports & actionable analytics',
    ],
    highlights: [
      {
        code: 'ZK-01',
        title: 'ZKTeco Biometric Device Synchronization',
        description:
          'Direct integration and scheduled/real-time synchronization with ZKTeco biometric terminals across headquarters, branches, and remote sites.',
      },
      {
        code: 'ZK-02',
        title: 'Multi-Location Sites & Shift Schedules',
        description:
          'Configure flexible shifts, rotating schedules, department hierarchies, and site-specific attendance policies from one central console.',
      },
      {
        code: 'ZK-03',
        title: 'Hours, Lateness, Overtime & Exception Approvals',
        description:
          'Automated calculation of working hours, lateness, and absences paired with structured manager approval workflows for overtime and exceptions.',
      },
      {
        code: 'ZK-04',
        title: 'Role-Based Access & Bilingual (EN/AR) Interface',
        description:
          'Granular role-based permissions for HR, supervisors, and administrators with full English and Arabic (EN/AR) interface and reporting support.',
      },
    ],
    workflow: [
      {
        step: '01',
        title: 'Capture',
        detail: 'Employees check in and out across connected ZKTeco biometric terminals at any site.',
      },
      {
        step: '02',
        title: 'Synchronize',
        detail: 'Device logs synchronize centrally and map cleanly to employee profiles, departments, and assigned shifts.',
      },
      {
        step: '03',
        title: 'Govern',
        detail: 'Working hours, lateness, absences, and overtime/exception requests route through role-based approval rules.',
      },
      {
        step: '04',
        title: 'Analyze',
        detail: 'HR and operations teams review bilingual (EN/AR) attendance dashboards, audit trails, and exportable reports.',
      },
    ],
    architecturePillars: [
      'ZKTeco Biometric Hardware Synchronization',
      'Multi-Site & Department Policy Engine',
      'Role-Based Access Control (RBAC)',
      'Bilingual EN / AR Web Interface & Reports',
    ],
    outcomes: [
      'Eliminates fragmented per-branch attendance spreadsheets',
      'Standardizes shift, lateness, and overtime approval governance',
      'Provides unified visibility for HR and branch managers in English and Arabic',
    ],
  },
  {
    id: 'rubik-weighing-management',
    slug: 'weighing-management',
    route: '/solutions/weighing-management',
    index: '02',
    eyebrow: 'INDUSTRIAL & SCALE TELEMETRY PLATFORM',
    title: 'Centralized Weighing Machine Management System',
    shortTitle: 'Weighing Management',
    headline: 'Unified Monitoring, Data Consolidation & Analytics Across Weighing Operations.',
    summary:
      'A centralized operational software platform that connects, consolidates, and analyzes weighing records across multiple machines and locations—turning raw scale activity into reliable historical records and actionable insights.',
    overview:
      'Built for industrial, manufacturing, logistics, and packaging environments where accurate weight governance matters, the Centralized Weighing Machine Management System brings multi-machine and multi-site weighing data into a single governed platform for reporting, discrepancy detection, and operational oversight.',
    accentColor: '#6366F1',
    serviceInquiryName: 'Centralized Weighing Machine Management System',
    capabilities: [
      'Centralized management and monitoring of connected weighing machines/scales',
      'Consolidation of weighing data across multiple machines or locations',
      'Real-time or near-real-time visibility (depending on device integration capabilities)',
      'Centralized records & historical weighing data',
      'Comprehensive reports & performance dashboards',
      'Analytics & operational insights',
      'Identification of trends, discrepancies & potential operational issues',
    ],
    highlights: [
      {
        code: 'WM-01',
        title: 'Multi-Scale & Multi-Location Consolidation',
        description:
          'Unify weighing machines across production lines, warehouses, and remote facilities into one centralized management layer.',
      },
      {
        code: 'WM-02',
        title: 'Real-Time or Near-Real-Time Visibility',
        description:
          'Monitor active scale status and incoming weighing transactions in real time or near-real time depending on device integration capabilities.',
      },
      {
        code: 'WM-03',
        title: 'Centralized Historical Records & Reporting',
        description:
          'Maintain auditable, searchable historical weighing logs with comprehensive operational reports and performance dashboards.',
      },
      {
        code: 'WM-04',
        title: 'Trend & Discrepancy Detection',
        description:
          'Surface operational trends, weight variances, and potential bottlenecks early through structured analytics and exception insights.',
      },
    ],
    workflow: [
      {
        step: '01',
        title: 'Connect',
        detail: 'Integrate supported weighing machines and scales across machines and facility locations.',
      },
      {
        step: '02',
        title: 'Consolidate',
        detail: 'Streamline weighing transactions into centralized records with real-time or near-real-time visibility.',
      },
      {
        step: '03',
        title: 'Audit',
        detail: 'Track historical weighing logs, machine activity, and multi-location performance from one dashboard.',
      },
      {
        step: '04',
        title: 'Optimize',
        detail: 'Identify trends, discrepancies, and potential operational issues through actionable analytics.',
      },
    ],
    architecturePillars: [
      'Hardware-to-Software Scale Integration Layer',
      'Multi-Location Data Consolidation Store',
      'Historical Audit Trail & Reporting Engine',
      'Discrepancy & Operational Analytics Dashboards',
    ],
    outcomes: [
      'Replaces isolated per-scale logs with a single governed source of truth',
      'Improves visibility across multiple machines and distributed sites',
      'Helps operations teams spot discrepancies and recurring trends faster',
    ],
  },
];

export function getSolutionBySlug(slug: string): RubikSolution | undefined {
  return SOLUTIONS_LIST.find((solution) => solution.slug === slug);
}
