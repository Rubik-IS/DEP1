export interface CompanyInfo {
  name: string;
  shortName: string;
  concept: string;
  founded: number;
  website: string;
  phone: string;
  email: string;
  location: string;
  tagline: string;
  supportingMessage: string;
  mission: string;
  philosophyHeadline: string;
}

export interface CoreValue {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface VerifiedMetric {
  id: string;
  value: number;
  suffix: string;
  displayValue: string;
  label: string;
  contextNote: string;
}

export interface TechPartner {
  id: string;
  name: string;
  category: string;
  accentColor: string;
  monogram: string;
  description: string;
}

export interface TechGroup {
  id: string;
  title: string;
  summary: string;
  items: string[];
}

export interface AiAgentUseCase {
  id: string;
  code: string;
  title: string;
  summary: string;
  connectedSystems: string[];
  outcome: string;
}

export interface AiAgentsCapability {
  eyebrow: string;
  title: string;
  headline: string;
  description: string;
  useCases: AiAgentUseCase[];
}

export interface BusinessPillar {
  id: 'solution-provider' | 'software-engineering' | 'business-consultancy';
  number: '01' | '02' | '03';
  title: string;
  headline: string;
  subtitle: string;
  description: string;
  capabilities: string[];
  cubeState: 'assembled' | 'expanded' | 'matrix';
  accentColor: string;
}

export type ServiceFocusMode =
  | 'assembled'
  | 'exploded'
  | 'pillar-01'
  | 'pillar-02'
  | 'pillar-03'
  | 'matrix';

export interface ServiceSubgroup {
  label: string;
  title: string;
  items: string[];
}

export interface ServiceFramework {
  name: string;
  focus: string;
}

export interface ServiceItem {
  id: string;
  index: string;
  title: string;
  shortTitle: string;
  category: string;
  description: string;
  capabilities: string[];
  deliverables: string[];
  businessValue: string;
  subgroups?: ServiceSubgroup[];
  frameworks?: ServiceFramework[];
  technologies: string[];
  ctaLabel: string;
  iconName: string;
  cubieRangeLabel: string;
  nexusFocusMode: ServiceFocusMode;
}

export interface ProcessStage {
  id: string;
  number: '01' | '02' | '03' | '04';
  tag: string;
  title: 'UNDERSTAND' | 'ARCHITECT' | 'IMPLEMENT' | 'SUPPORT';
  summary: string;
  description: string;
  focusAreas: string[];
}

export type TechMatrixCategory =
  | 'Frontend'
  | 'Backend'
  | 'Cloud and DevOps'
  | 'Databases'
  | 'Enterprise ERP'
  | 'Networking and Security';

export interface TechMatrixItem {
  id: string;
  name: string;
  category: TechMatrixCategory;
  role: string;
  verifiedSource: string;
}

export type ClientSector =
  | 'Banking and Finance'
  | 'Healthcare and Pharmaceuticals'
  | 'Education'
  | 'Real Estate and Investments'
  | 'Industrial and Packaging'
  | 'Technology and Telecommunications'
  | 'Retail and Consumer';

export interface ClientPortfolioItem {
  id: string;
  name: string;
  arabicName?: string;
  sector: ClientSector;
  monogram: string;
}

export interface IndustrySectorInfo {
  id: string;
  name: ClientSector;
  headline: string;
  description: string;
  focusCapabilities: string[];
  organizations: string[];
}

export const COMPANY_INFO: CompanyInfo = {
  name: 'Rubik Integrated Systems',
  shortName: 'Rubik.I.S',
  concept: 'Technology, Connected.',
  founded: 2021,
  website: 'https://www.rubik-is.com',
  phone: '+20 100 101 0538',
  email: 'info@rubik-is.com',
  location: 'Cairo, Egypt',
  tagline: 'Make every system work as one.',
  supportingMessage:
    'Rubik Integrated Systems connects infrastructure, software and business platforms to help organizations solve operational challenges through practical, integrated technology solutions.',
  mission:
    'We at Rubik-IS provide you with the most efficient tool using the minimum financial requirement to achieve your goal, one of the most valuable assets that we are always looking forward to add value to our customers.',
  philosophyHeadline: 'The right technology, designed around the way your business works.',
};

export const CORE_VALUES: CoreValue[] = [
  {
    id: 'customer-focus',
    title: 'Customer Focus',
    description:
      'Aligning every architecture and technical decision around measurable client outcomes and operational clarity.',
    iconName: 'Target',
  },
  {
    id: 'continuous-improvement',
    title: 'Continuous Improvement',
    description:
      'Refining software engineering, infrastructure resilience, and delivery practices to keep enterprise systems dependable.',
    iconName: 'TrendingUp',
  },
  {
    id: 'customer-commitment',
    title: 'Customer Commitment',
    description:
      'Standing behind every deployment with long-term accountability, transparent communication, and 24/7 support.',
    iconName: 'ShieldCheck',
  },
  {
    id: 'diversity',
    title: 'Diversity',
    description:
      'Uniting specialized engineers across IT infrastructure, custom software, and enterprise business platforms.',
    iconName: 'Layers',
  },
  {
    id: 'sustainability',
    title: 'Sustainability',
    description:
      'Building durable, resource-efficient systems that scale cleanly while protecting your technology investment.',
    iconName: 'Cpu',
  },
];

export const VERIFIED_METRICS: VerifiedMetric[] = [
  {
    id: 'year-founded',
    value: 2021,
    suffix: '',
    displayValue: 'Founded 2021',
    label: 'Year Founded',
    contextNote: 'Established in Cairo, Egypt',
  },
  {
    id: 'customers-served',
    value: 50,
    suffix: '+',
    displayValue: '50+ Customers',
    label: 'Customers Served (2022–2027 Profile)',
    contextNote: '2022–2027 Company Profile Milestone',
  },
  {
    id: 'enterprise-projects',
    value: 25,
    suffix: '+',
    displayValue: '25+ Projects',
    label: 'Projects Delivered (2022–2027 Profile)',
    contextNote: '2022–2027 Company Profile Milestone',
  },
  {
    id: 'support-desk',
    value: 24,
    suffix: '/7',
    displayValue: '24/7 Technical Support',
    label: 'Technical Support & Service Desk',
    contextNote: 'Hardware & Software Support Coverage',
  },
];

export const TECH_PARTNERS: TechPartner[] = [
  {
    id: 'red-hat',
    name: 'Red Hat',
    category: 'Enterprise Linux & Hybrid Cloud',
    accentColor: '#EE0000',
    monogram: 'RH',
    description: 'Enterprise open-source operating systems, Linux infrastructure, and hybrid platforms.',
  },
  {
    id: 'ibm',
    name: 'IBM',
    category: 'Enterprise Infrastructure & Storage',
    accentColor: '#2563EB',
    monogram: 'IBM',
    description: 'Enterprise compute, IBM Storage architecture, middleware integration, and resilient data center systems.',
  },
  {
    id: 'huawei',
    name: 'Huawei',
    category: 'Carrier & Enterprise Networking',
    accentColor: '#E11D48',
    monogram: 'HW',
    description: 'High-density switching, enterprise routing, campus wireless networks, and infrastructure hardware.',
  },
  {
    id: 'tenable',
    name: 'Tenable',
    category: 'Cyber Exposure & Vulnerability Management',
    accentColor: '#00B4D8',
    monogram: 'TN',
    description: 'Continuous vulnerability assessment, exposure visibility, and risk-prioritized security auditing.',
  },
  {
    id: 'odoo',
    name: 'Odoo',
    category: 'Enterprise ERP & Business Automation',
    accentColor: '#9333EA',
    monogram: 'OD',
    description: 'Modular ERP customization, accounting, inventory, manufacturing, HR, and POS workflows.',
  },
  {
    id: 'fortinet',
    name: 'Fortinet',
    category: 'Next-Gen Network Security & Firewalls',
    accentColor: '#DC2626',
    monogram: 'FT',
    description: 'FortiGate NGFW perimeter defense, SD-WAN secure connectivity, and network segmentation.',
  },
  {
    id: 'veeam',
    name: 'Veeam',
    category: 'Backup, Disaster Recovery & Data Resilience',
    accentColor: '#10B981',
    monogram: 'VM',
    description: 'Enterprise backups, disaster recovery orchestration, and resilient data protection.',
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'Customer Relationship Management (CRM)',
    accentColor: '#0EA5E9',
    monogram: 'SF',
    description: 'Customer lifecycle automation, sales pipeline intelligence, and enterprise CRM integration.',
  },
  {
    id: 'zebra',
    name: 'Zebra Technologies',
    category: 'Industrial Auto-ID, POS & Edge Hardware',
    accentColor: '#F59E0B',
    monogram: 'ZB',
    description: 'Enterprise barcode scanners, RFID tracking, rugged terminals, and retail POS hardware.',
  },
];

export const TECH_GROUPS: TechGroup[] = [
  {
    id: 'networking-infrastructure',
    title: 'Networking & Infrastructure',
    summary: 'Enterprise compute, storage fabrics, and structured campus switching designed for continuous availability.',
    items: ['Cisco', 'Dell', 'HPE', 'HP', 'IBM', 'Huawei', 'Red Hat', 'Enterprise Servers & Switching'],
  },
  {
    id: 'cloud-infrastructure-platforms',
    title: 'Cloud & Infrastructure Platforms',
    summary: 'Scalable public, private, and hybrid-cloud architectures unified with automated backup and disaster recovery.',
    items: ['AWS', 'Microsoft Azure', 'Google Cloud', 'Hybrid-Cloud & Virtualization', 'Veeam Backup & Continuity'],
  },
  {
    id: 'enterprise-productivity',
    title: 'Enterprise & Productivity',
    summary: 'Core operational suites and business platforms connecting finance, supply chain, sales, and workforce collaboration.',
    items: ['Microsoft 365', 'Google Workspace', 'Odoo ERP', 'Salesforce CRM', 'Enterprise Collaboration'],
  },
  {
    id: 'cybersecurity-identity',
    title: 'Cybersecurity & Identity',
    summary: 'Layered perimeter defense, continuous vulnerability visibility, identity governance, and cloud security posture.',
    items: ['Fortinet', 'Tenable', 'Network Security', 'Endpoint Protection', 'Identity & Access Management (IAM)', 'Cloud Security'],
  },
  {
    id: 'data-databases',
    title: 'Data & Databases',
    summary: 'High-integrity transactional storage, distributed data pipelines, and actionable business intelligence.',
    items: ['SQL & NoSQL Databases', 'Distributed Databases', 'Data Engineering', 'Analytics & Business Intelligence'],
  },
  {
    id: 'software-digital-experience',
    title: 'Software Engineering & Digital Experience',
    summary: 'Custom enterprise applications, API orchestration, and intuitive web and mobile products built around real operations.',
    items: ['Custom Enterprise Applications', 'API & System Integration', 'UX/UI Engineering', 'Full-Stack Web & Mobile', 'DevOps & Automated QA'],
  },
];

export const AI_AGENTS_CAPABILITY: AiAgentsCapability = {
  eyebrow: 'INTELLIGENT AUTOMATION',
  title: 'AI Agents & Custom Intelligent Automation',
  headline: 'AI Agents Built Around Your Workflows.',
  description:
    'We design and integrate custom AI agents and intelligent automation pipelines that connect directly to your ERP, CRM, internal knowledge bases, and operational tools—turning manual bottlenecks into reliable, auditable execution.',
  useCases: [
    {
      id: 'custom-workflow-agents',
      code: 'AG-01',
      title: 'Custom Workflow Agents',
      summary:
        'Purpose-built AI agents engineered around your organization’s approval chains, exception handling, and operational rules.',
      connectedSystems: ['Internal Portals', 'REST & Webhook APIs', 'Approval Queues'],
      outcome: 'Reduces repetitive operational triage while keeping human oversight on critical decisions.',
    },
    {
      id: 'business-process-automation',
      code: 'AG-02',
      title: 'Business Process Automation & Task Execution',
      summary:
        'End-to-end intelligent task execution that classifies incoming requests, validates structured records, and triggers downstream actions.',
      connectedSystems: ['Document Pipelines', 'Ticketing Systems', 'Reporting Engines'],
      outcome: 'Accelerates multi-step back-office workflows with consistent data validation.',
    },
    {
      id: 'internal-customer-assistants',
      code: 'AG-03',
      title: 'Internal & Customer AI Assistants',
      summary:
        'Role-aware conversational assistants tailored for service desks, operations staff, and customer-facing support portals.',
      connectedSystems: ['Service Desk', 'Web & Mobile Apps', 'Role-Based Access Control'],
      outcome: 'Delivers fast, accurate guided responses grounded in verified company procedures.',
    },
    {
      id: 'erp-crm-agentic-workflows',
      code: 'AG-04',
      title: 'ERP & CRM Connected Agentic Workflows',
      summary:
        'Tool-connected agents that read and update structured records across Odoo ERP, Salesforce CRM, and enterprise databases.',
      connectedSystems: ['Odoo ERP', 'Salesforce CRM', 'Enterprise Databases'],
      outcome: 'Bridges natural-language operational requests directly to governed enterprise transactions.',
    },
    {
      id: 'knowledge-retrieval',
      code: 'AG-05',
      title: 'Organizational Knowledge Retrieval',
      summary:
        'Private, permission-scoped knowledge assistants indexing SOPs, technical manuals, policies, and historical project documentation.',
      connectedSystems: ['Microsoft 365', 'Google Workspace', 'Internal Repositories'],
      outcome: 'Surfaces cited internal answers in seconds without exposing private organizational data.',
    },
    {
      id: 'cross-tool-orchestration',
      code: 'AG-06',
      title: 'Cross-Tool Agent Coordination',
      summary:
        'Multi-step agentic workflows coordinating notifications, inventory checks, service tickets, and analytics across connected systems.',
      connectedSystems: ['ERP & Inventory', 'Email & Collaboration', 'Monitoring Telemetry'],
      outcome: 'Unifies disconnected software tools into a cohesive, event-driven operating layer.',
    },
  ],
};

export const BUSINESS_PILLARS: BusinessPillar[] = [
  {
    id: 'solution-provider',
    number: '01',
    title: 'Infrastructure & Security',
    headline: 'Build a reliable foundation.',
    subtitle: 'Build a reliable foundation.',
    description:
      'From enterprise hardware and network architecture to security and technical support, we provide the infrastructure businesses depend on.',
    capabilities: [
      'IT Hardware and Infrastructure',
      'Enterprise Networking',
      'Cybersecurity',
      'Hardware and Software Integration',
      'Technical Support and Service Desk',
    ],
    cubeState: 'assembled',
    accentColor: '#38BDF8',
  },
  {
    id: 'software-engineering',
    number: '02',
    title: 'Software & Digital Engineering',
    headline: 'Engineer what your business needs.',
    subtitle: 'Engineer what your business needs.',
    description:
      'We develop custom digital applications, intelligent automation, and software solutions that connect workflows, people and operational systems.',
    capabilities: [
      'Custom Web Applications',
      'Mobile Application Development',
      'Full-Stack Software Engineering',
      'AI Agents & Workflow Automation',
      'DevOps and Software Testing',
      'Software Architecture',
    ],
    cubeState: 'expanded',
    accentColor: '#00F0FF',
  },
  {
    id: 'business-consultancy',
    number: '03',
    title: 'Enterprise & Industrial Systems',
    headline: 'Connect technology to operations.',
    subtitle: 'Connect technology to operations.',
    description:
      'We integrate enterprise platforms, business processes and specialized systems to improve how organizations operate.',
    capabilities: [
      'Odoo ERP',
      'CRM Solutions',
      'Retail Software',
      'Industrial Solutions',
      'Facility Management Systems',
      'Specialized Hardware Integration',
    ],
    cubeState: 'matrix',
    accentColor: '#6366F1',
  },
];

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: 'infrastructure-networking',
    index: '01',
    title: 'Infrastructure & Networking',
    shortTitle: 'Infrastructure & Networking',
    category: 'Infrastructure & Security',
    description:
      'Sizing, procurement, and deployment of enterprise compute, IBM/multi-vendor storage, structured campus switching, and resilient server environments.',
    capabilities: [
      'Enterprise Compute & Server Architecture (IBM / Dell / HPE)',
      'IBM & Multi-Vendor High-Availability Storage Systems',
      'Campus Switching & Wireless Backbones (Cisco / Huawei)',
      'Red Hat Enterprise Linux & Virtualization Platforms',
      'Veeam Backup, Replication & Disaster Recovery',
      'Structured Cabling & Hardware-Software Integration',
    ],
    deliverables: [
      'Enterprise Compute & Server Architecture (IBM / Dell / HPE)',
      'IBM & Multi-Vendor High-Availability Storage Systems',
      'Campus Switching & Wireless Backbones (Cisco / Huawei)',
      'Veeam Backup, Replication & Disaster Recovery',
    ],
    businessValue:
      'Delivers predictable uptime, lower latency across branches, and scalable hardware capacity ready for mission-critical enterprise workloads.',
    technologies: ['IBM', 'Red Hat', 'Huawei', 'Cisco', 'Dell', 'HPE', 'Veeam'],
    ctaLabel: 'Discuss This Service',
    iconName: 'Server',
    cubieRangeLabel: 'INFRASTRUCTURE // NODES 01–04',
    nexusFocusMode: 'pillar-01',
  },
  {
    id: 'cybersecurity-protection',
    index: '02',
    title: 'Cybersecurity & Protection',
    shortTitle: 'Cybersecurity & Protection',
    category: 'Infrastructure & Security',
    description:
      'Layered perimeter security, continuous vulnerability assessment, identity governance, and data resilience designed to safeguard critical business operations.',
    capabilities: [
      'Fortinet Next-Generation Firewalls & Secure SD-WAN',
      'Tenable Cyber Exposure & Vulnerability Scanning',
      'Zero-Trust Network Segmentation & Access Control',
      'Endpoint Detection, Hardening & Patch Governance',
      'Identity & Access Management (IAM / MFA)',
      'Immutable Backup & Cloud Security Posture',
    ],
    deliverables: [
      'Fortinet Next-Generation Firewalls & Secure SD-WAN',
      'Tenable Cyber Exposure & Vulnerability Scanning',
      'Zero-Trust Network Segmentation & Access Control',
      'Immutable Backup & Cloud Security Posture',
    ],
    businessValue:
      'Reduces organizational attack surface, accelerates threat containment, and protects business continuity against ransomware and operational disruption.',
    technologies: ['Fortinet', 'Tenable', 'Veeam', 'IAM', 'Cloud Security'],
    ctaLabel: 'Discuss This Service',
    iconName: 'ShieldCheck',
    cubieRangeLabel: 'SECURITY // NODES 05–08',
    nexusFocusMode: 'pillar-01',
  },
  {
    id: 'custom-software-applications',
    index: '03',
    title: 'Custom Software & Applications',
    shortTitle: 'Custom Software & Apps',
    category: 'Software & Digital Engineering',
    description:
      'Bespoke web platforms, mobile applications, and full-stack software engineered around your organization’s exact operational workflows.',
    capabilities: [
      'Custom Enterprise Web Portals & Internal Platforms',
      'Native & Cross-Platform Mobile Application Engineering',
      'Full-Stack Java, .NET & TypeScript Service Systems',
      'REST / GraphQL API & Cross-System Integration',
      'CI/CD Delivery Pipelines & Cloud-Native Deployment',
      'Automated QA Testing & Performance Verification',
    ],
    deliverables: [
      'Custom Enterprise Web Portals & Internal Platforms',
      'Native & Cross-Platform Mobile Application Engineering',
      'REST / GraphQL API & Cross-System Integration',
      'CI/CD Delivery Pipelines & Automated QA Testing',
    ],
    businessValue:
      'Eliminates spreadsheet workarounds and disconnected legacy tools by delivering maintainable software tailored to how your teams actually operate.',
    technologies: ['Full-Stack Web & Mobile', 'Java', '.NET', 'TypeScript', 'DevOps'],
    ctaLabel: 'Discuss This Service',
    iconName: 'Code2',
    cubieRangeLabel: 'SOFTWARE // NODES 09–12',
    nexusFocusMode: 'pillar-02',
  },
  {
    id: 'enterprise-business-systems',
    index: '04',
    title: 'Enterprise Business Systems',
    shortTitle: 'Enterprise Business Systems',
    category: 'Enterprise & Industrial Systems',
    description:
      'End-to-end implementation and customization of Odoo ERP, Salesforce CRM, and facility management platforms across departments.',
    capabilities: [
      'Odoo ERP Implementation & Custom Module Engineering',
      'Salesforce CRM & Customer Lifecycle Automation',
      'Finance, Inventory, HR & Procurement Synchronization',
      'Facility Management & Multi-Site Operations Platforms',
      'Microsoft 365 & Google Workspace Enterprise Rollout',
      'Cross-Departmental Reporting & Approval Workflows',
    ],
    deliverables: [
      'Odoo ERP Implementation & Custom Module Engineering',
      'Salesforce CRM & Customer Lifecycle Automation',
      'Facility Management & Multi-Site Operations Platforms',
      'Finance, Inventory, HR & Procurement Synchronization',
    ],
    businessValue:
      'Unifies finance, sales, inventory, and operations on a single source of truth for faster executive visibility and cleaner audit trails.',
    technologies: ['Odoo ERP', 'Salesforce CRM', 'Microsoft 365', 'Google Workspace'],
    ctaLabel: 'Discuss This Service',
    iconName: 'Database',
    cubieRangeLabel: 'ENTERPRISE ERP // NODES 13–16',
    nexusFocusMode: 'pillar-03',
  },
  {
    id: 'retail-industrial-technology',
    index: '05',
    title: 'Retail & Industrial Technology',
    shortTitle: 'Retail & Industrial Tech',
    category: 'Enterprise & Industrial Systems',
    description:
      'Turnkey operational systems uniting Zebra Auto-ID hardware, retail POS software, industrial scales, and factory-floor software telemetry.',
    capabilities: [
      'Retail POS & Multi-Branch Inventory Control',
      'Zebra Barcode, RFID & Rugged Mobile Terminals',
      'Industrial Scales & Centralized Weighbridge Systems',
      'Biometric Time Attendance & Access Hardware Sync',
      'Factory-Floor Telemetry & Production Tracking',
      'Real-Time Edge Hardware-to-ERP Synchronization',
    ],
    deliverables: [
      'Retail POS & Multi-Branch Inventory Control',
      'Zebra Barcode, RFID & Rugged Mobile Terminals',
      'Industrial Scales & Centralized Weighbridge Systems',
      'Real-Time Edge Hardware-to-ERP Synchronization',
    ],
    businessValue:
      'Captures accurate physical-world weights, attendance, and inventory movements automatically into ERP with zero manual re-entry.',
    technologies: ['Zebra Technologies', 'Odoo POS', 'Industrial Systems', 'IoT Telemetry'],
    ctaLabel: 'Discuss This Service',
    iconName: 'Factory',
    cubieRangeLabel: 'RETAIL & INDUSTRIAL // NODES 17–20',
    nexusFocusMode: 'pillar-03',
  },
  {
    id: 'it-consulting',
    index: '06',
    title: 'IT Consulting & Technology Advisory',
    shortTitle: 'IT Consulting',
    category: 'IT Consulting',
    description:
      'Strategic technology advisory helping organizations make informed IT decisions, optimize infrastructure environments, manage risk, and build scalable roadmaps.',
    capabilities: [
      'IT Strategy & Digital Transformation Roadmaps',
      'Enterprise & Infrastructure Architecture Design',
      'IT Governance, Risk & Compliance Advisory',
      'Cybersecurity Strategy & Continuity Planning',
      'Cloud Strategy & Infrastructure Optimization',
      'IT Process Improvement & Vendor Assessment',
    ],
    deliverables: [
      'IT Strategy & Digital Transformation Roadmaps',
      'Enterprise & Infrastructure Architecture Design',
      'IT Governance, Risk & Compliance Advisory',
      'Cybersecurity Strategy & Continuity Planning',
    ],
    businessValue:
      'Aligns technology investments directly with business priorities, reducing wasted spend and de-risking major infrastructure or software transitions.',
    frameworks: [
      {
        name: 'TOGAF',
        focus: 'Enterprise architecture, business & technology alignment, architecture governance',
      },
      {
        name: 'COBIT',
        focus: 'IT governance, management controls, risk, and performance',
      },
      {
        name: 'ISO/IEC 27001',
        focus: 'Information security management & risk-based security practices',
      },
      {
        name: 'NIST Cybersecurity Framework (CSF)',
        focus: 'Cybersecurity risk identification, protection, detection, response, and recovery',
      },
      {
        name: 'ITIL',
        focus: 'IT service management strategy & continual improvement',
      },
      {
        name: 'ISO 22301',
        focus: 'Business continuity management',
      },
    ],
    technologies: ['TOGAF', 'COBIT', 'ISO/IEC 27001', 'NIST CSF', 'ITIL', 'ISO 22301'],
    ctaLabel: 'Discuss This Service',
    iconName: 'Compass',
    cubieRangeLabel: 'IT CONSULTING // NODES 21–23',
    nexusFocusMode: 'assembled',
  },
  {
    id: 'it-support',
    index: '07',
    title: 'IT Support & Managed IT Services',
    shortTitle: 'IT Support',
    category: 'IT Support',
    description:
      'Dependable service desk and onsite field engineering keeping your workstations, networks, Microsoft 365, and servers stable and secure.',
    capabilities: [
      'L1, L2 & L3 Service Desk & Remote Troubleshooting',
      'Incident, Request, Problem & Asset Management',
      'Microsoft 365, User Identity & Endpoint Support',
      'Onsite Field Engineering & Workstation Deployment',
      'Network, Connectivity & Server Maintenance',
      'Preventive Health Checks & Peripheral Support',
    ],
    deliverables: [
      'L1, L2 & L3 Service Desk & Remote Troubleshooting',
      'Incident, Request, Problem & Asset Management',
      'Onsite Field Engineering & Workstation Deployment',
      'Preventive Health Checks & Infrastructure Support',
    ],
    businessValue:
      'Maximizes workforce productivity with fast issue resolution, structured SLA accountability, and proactive maintenance before outages occur.',
    subgroups: [
      {
        label: 'A',
        title: 'Service Desk & Remote IT Support',
        items: [
          'L1, L2, and L3 technical support capabilities (where applicable)',
          'IT Helpdesk and Service Desk Operations',
          'Incident and Request Management',
          'Problem Management',
          'User and Identity Support',
          'Microsoft 365 Support',
          'Endpoint and Device Management',
          'Remote Troubleshooting and Technical Assistance',
          'IT Asset and Configuration Management',
        ],
      },
      {
        label: 'B',
        title: 'Onsite IT Support & Infrastructure Operations',
        items: [
          'Onsite IT Support and Field Engineering',
          'End-User Device Deployment and Maintenance',
          'Workstation and Laptop Management',
          'Network and Connectivity Support',
          'Server and Infrastructure Support',
          'Printer and Peripheral Management',
          'IT Equipment Installation and Configuration',
          'Preventive Maintenance and Operational Support',
          'Infrastructure Maintenance and Operational Assistance',
        ],
      },
    ],
    frameworks: [
      {
        name: 'ITIL',
        focus: 'Incident, problem, request, change, and service-level management',
      },
      {
        name: 'ISO/IEC 20000-1',
        focus: 'IT Service Management System requirements',
      },
      {
        name: 'ISO/IEC 27001',
        focus: 'Information security practices & protection of IT environments',
      },
      {
        name: 'COBIT',
        focus: 'Governance and control alignment for IT operations',
      },
    ],
    technologies: ['ITIL', 'ISO/IEC 20000-1', 'ISO/IEC 27001', 'COBIT', 'Microsoft 365'],
    ctaLabel: 'Discuss This Service',
    iconName: 'Headphones',
    cubieRangeLabel: 'IT SUPPORT // NODES 24–25',
    nexusFocusMode: 'matrix',
  },
  {
    id: 'ai-agents-automation',
    index: '08',
    title: 'AI Agents & Custom Intelligent Automation',
    shortTitle: 'AI Agents & Automation',
    category: 'Software & Digital Engineering',
    description:
      'Custom AI agents, internal knowledge retrieval assistants, and tool-connected agentic workflows integrated securely into your ERP, CRM, and operations.',
    capabilities: [
      'Custom Workflow Agents & Process Automation',
      'Internal & Customer-Facing AI Assistants',
      'Organizational Knowledge & Document Intelligence',
      'ERP / CRM Tool-Connected Agentic Orchestration',
      'Role-Based Access & Guardrail Governance',
      'Human-in-the-Loop Escalation & Audit Logging',
    ],
    deliverables: [
      'Custom Workflow Agents & Process Automation',
      'Internal & Customer-Facing AI Assistants',
      'Organizational Knowledge & Document Intelligence',
      'ERP / CRM Tool-Connected Agentic Orchestration',
    ],
    businessValue:
      'Automates repetitive triage, document lookup, and cross-system approvals while keeping sensitive corporate data governed and auditable.',
    technologies: ['AI Agents', 'Workflow Automation', 'Odoo / CRM APIs', 'Knowledge Retrieval'],
    ctaLabel: 'Discuss This Service',
    iconName: 'Bot',
    cubieRangeLabel: 'AI AUTOMATION // NODES 26–27',
    nexusFocusMode: 'exploded',
  },
];

export const PROCESS_STAGES: ProcessStage[] = [
  {
    id: 'understand',
    number: '01',
    tag: '01 — UNDERSTAND',
    title: 'UNDERSTAND',
    summary: 'Business workflows, constraints, and operational context first.',
    description:
      'Every successful technology initiative begins with understanding the business behind it—auditing existing infrastructure, manual bottlenecks, and financial objectives.',
    focusAreas: ['Operational Discovery', 'Infrastructure Audit', 'Financial Efficiency Alignment'],
  },
  {
    id: 'architect',
    number: '02',
    tag: '02 — ARCHITECT',
    title: 'ARCHITECT',
    summary: 'Cohesive system design uniting hardware, software, and platforms.',
    description:
      'We blueprint practical, integrated architectures connecting network security, custom software, and enterprise ERP or industrial hardware into a single coherent system.',
    focusAreas: ['Solution Architecture', 'Security & Network Topology', 'Data & ERP Integration Design'],
  },
  {
    id: 'implement',
    number: '03',
    tag: '03 — IMPLEMENT',
    title: 'IMPLEMENT',
    summary: 'Disciplined engineering, hardware integration, and rigorous QA.',
    description:
      'Our multidisciplinary teams configure infrastructure, build custom applications, customize Odoo workflows, and verify every integration point before production launch.',
    focusAreas: ['Full-Stack & ERP Delivery', 'Hardware-Software Integration', 'Automated & Manual QA'],
  },
  {
    id: 'support',
    number: '04',
    tag: '04 — SUPPORT',
    title: 'SUPPORT',
    summary: 'Long-term continuity backed by 24/7 hardware and software support.',
    description:
      'Post-deployment, our 24/7 service desk, preventive monitoring, and continuous engineering support ensure your connected systems scale reliably.',
    focusAreas: ['24/7 HW & SW Service Desk', 'Vulnerability & Backup Care', 'Continuous Optimization'],
  },
];

export const TECH_MATRIX: TechMatrixItem[] = [
  {
    id: 'html5',
    name: 'HTML5',
    category: 'Frontend',
    role: 'Semantic document architecture and accessible enterprise web interfaces',
    verifiedSource: 'Rubik.I.S 2024 Profile — Page 6 (Software Engineering)',
  },
  {
    id: 'css3',
    name: 'CSS3',
    category: 'Frontend',
    role: 'Responsive layout systems, fluid typography, and high-contrast interface styling',
    verifiedSource: 'Rubik.I.S 2024 Profile — Page 6 (Software Engineering)',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'Frontend',
    role: 'Interactive client-side runtime and asynchronous browser application logic',
    verifiedSource: 'Rubik.I.S 2024 Profile — Page 6 (Software Engineering)',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Frontend',
    role: 'Strictly typed enterprise frontend architecture and predictable state contracts',
    verifiedSource: 'Rubik.I.S 2024 Profile — Page 6 (Software Engineering)',
  },
  {
    id: 'react',
    name: 'React',
    category: 'Frontend',
    role: 'Component-driven web applications and real-time operational portals',
    verifiedSource: 'Rubik.I.S 2024 Profile — Page 6 (Software Engineering)',
  },
  {
    id: 'java-fullstack',
    name: 'Java (Full-Stack)',
    category: 'Backend',
    role: 'High-concurrency enterprise backend services, middleware, and transactional APIs',
    verifiedSource: 'Rubik.I.S 2024 Profile — Page 6 (Software Engineering)',
  },
  {
    id: 'dotnet',
    name: '.NET',
    category: 'Backend',
    role: 'Enterprise services, industrial hardware integration, and core business APIs',
    verifiedSource: 'Rubik.I.S 2024 Profile — Page 6 (Software Engineering)',
  },
  {
    id: 'solution-architecture',
    name: 'Solution Architecture',
    category: 'Backend',
    role: 'End-to-end system blueprints bridging distributed software, ERP, AI workflows, and physical hardware',
    verifiedSource: 'Rubik.I.S 2024 Profile — Page 6 (Software Engineering)',
  },
  {
    id: 'devops-cicd',
    name: 'DevOps & CI/CD',
    category: 'Cloud and DevOps',
    role: 'Automated build pipelines, testing gates, and reliable release engineering',
    verifiedSource: 'Rubik.I.S 2024 Profile — Page 5 & 6 (Software Engineering)',
  },
  {
    id: 'red-hat-linux',
    name: 'Red Hat Enterprise Linux',
    category: 'Cloud and DevOps',
    role: 'Hardened production operating systems and hybrid cloud workload foundations',
    verifiedSource: 'Rubik.I.S 2024 Profile — Page 3 (Technology Partners)',
  },
  {
    id: 'ibm-infrastructure',
    name: 'IBM Infrastructure',
    category: 'Cloud and DevOps',
    role: 'Enterprise compute servers, storage fabrics, hybrid systems, and high-availability data centers',
    verifiedSource: 'Rubik.I.S 2024 Profile — Page 3 (Technology Partners)',
  },
  {
    id: 'veeam-backup',
    name: 'Veeam Data Backup',
    category: 'Cloud and DevOps',
    role: 'Automated backup replication, recovery points, and disaster continuity',
    verifiedSource: 'Rubik.I.S 2024 Profile — Page 3 (Technology Partners)',
  },
  {
    id: 'relational-enterprise-db',
    name: 'Relational & Enterprise Databases',
    category: 'Databases',
    role: 'ACID-compliant transactional data stores, ERP persistence, and analytical indexing',
    verifiedSource: 'Rubik.I.S 2024 Profile — Page 6 (Software Engineering — DB)',
  },
  {
    id: 'odoo-erp-platform',
    name: 'Odoo ERP',
    category: 'Enterprise ERP',
    role: 'Unified enterprise resource planning for finance, inventory, manufacturing, HR, and POS',
    verifiedSource: 'Rubik.I.S 2024 Profile — Page 3 & 7 (Business Consultancy)',
  },
  {
    id: 'salesforce-crm',
    name: 'Salesforce CRM',
    category: 'Enterprise ERP',
    role: 'Enterprise customer relationship management, sales automation, and service pipelines',
    verifiedSource: 'Rubik.I.S 2024 Profile — Page 3 & 7 (Business Consultancy)',
  },
  {
    id: 'zebra-hardware-integration',
    name: 'Zebra Hardware Integration',
    category: 'Enterprise ERP',
    role: 'Barcode, RFID, mobile terminal, and industrial scale telemetry connected directly to ERP',
    verifiedSource: 'Rubik.I.S 2024 Profile — Page 3 & 7 (Retail & Industrial Systems)',
  },
  {
    id: 'fortinet-security',
    name: 'Fortinet Network Security',
    category: 'Networking and Security',
    role: 'Next-generation firewalls (NGFW), secure SD-WAN, and enterprise perimeter defense',
    verifiedSource: 'Rubik.I.S 2024 Profile — Page 3 & 4 (Solution Provider)',
  },
  {
    id: 'tenable-vulnerability',
    name: 'Tenable Vulnerability Management',
    category: 'Networking and Security',
    role: 'Continuous cyber exposure monitoring, vulnerability scanning, and compliance auditing',
    verifiedSource: 'Rubik.I.S 2024 Profile — Page 3 & 4 (Solution Provider)',
  },
  {
    id: 'huawei-networking',
    name: 'Huawei Enterprise Networking',
    category: 'Networking and Security',
    role: 'High-throughput campus switches, enterprise routers, and resilient network backbones',
    verifiedSource: 'Rubik.I.S 2024 Profile — Page 3 & 4 (Solution Provider)',
  },
];

export const CLIENT_PORTFOLIO: ClientPortfolioItem[] = [
  {
    id: 'banque-misr',
    name: 'Banque Misr',
    arabicName: 'بنك مصر',
    sector: 'Banking and Finance',
    monogram: 'BM',
  },
  {
    id: 'dabur',
    name: 'Dabur',
    sector: 'Retail and Consumer',
    monogram: 'DB',
  },
  {
    id: 'macro-pharmaceuticals',
    name: 'Macro Pharmaceuticals',
    sector: 'Healthcare and Pharmaceuticals',
    monogram: 'MP',
  },
  {
    id: 'miu',
    name: 'Misr International University (MIU)',
    sector: 'Education',
    monogram: 'MIU',
  },
  {
    id: 'ora-developers',
    name: 'ORA Developers (OGA)',
    sector: 'Real Estate and Investments',
    monogram: 'ORA',
  },
  {
    id: 'tuv-austria',
    name: 'TÜV AUSTRIA',
    sector: 'Industrial and Packaging',
    monogram: 'TÜV',
  },
  {
    id: 'global-telecom-holding',
    name: 'Global Telecom Holding',
    sector: 'Technology and Telecommunications',
    monogram: 'GTH',
  },
  {
    id: 'awqaf-investments',
    name: 'National Group for Awqaf Investments',
    arabicName: 'المجموعة الوطنية لاستثمارات الأوقاف',
    sector: 'Real Estate and Investments',
    monogram: 'NGA',
  },
  {
    id: 'el-maaergy-scales',
    name: 'El-Maaergy Scales',
    sector: 'Industrial and Packaging',
    monogram: 'EMS',
  },
  {
    id: 'iss-safety',
    name: 'ISS (Intelligent Safety Solutions)',
    sector: 'Industrial and Packaging',
    monogram: 'ISS',
  },
  {
    id: 'dr-nour-mostafa',
    name: 'Dr. Nour Mostafa Dental Clinic',
    sector: 'Healthcare and Pharmaceuticals',
    monogram: 'DNM',
  },
  {
    id: 'byganz',
    name: 'ByGanz',
    sector: 'Retail and Consumer',
    monogram: 'BG',
  },
  {
    id: 'quality-pack',
    name: 'Quality Pack',
    sector: 'Industrial and Packaging',
    monogram: 'QP',
  },
  {
    id: 'eq-5d',
    name: 'EQ-5D',
    sector: 'Healthcare and Pharmaceuticals',
    monogram: 'EQ',
  },
  {
    id: 'musqueteer',
    name: 'Musqueteer',
    sector: 'Retail and Consumer',
    monogram: 'MQ',
  },
  {
    id: 'dot-robot',
    name: 'Dot Robot',
    sector: 'Technology and Telecommunications',
    monogram: 'DR',
  },
  {
    id: 'sofipack',
    name: 'Sofipack',
    sector: 'Industrial and Packaging',
    monogram: 'SP',
  },
];

export const INDUSTRIES_DATA: IndustrySectorInfo[] = [
  {
    id: 'banking-finance',
    name: 'Banking and Finance',
    headline: 'High-trust infrastructure and security for financial institutions.',
    description:
      'Delivering hardened enterprise infrastructure, perimeter security, and reliable software integration aligned with strict operational governance.',
    focusCapabilities: ['Enterprise Infrastructure', 'Network Security', 'Business Continuity & Backup'],
    organizations: ['Banque Misr (بنك مصر)'],
  },
  {
    id: 'healthcare-pharma',
    name: 'Healthcare and Pharmaceuticals',
    headline: 'Connected clinical, pharmaceutical, and compliance systems.',
    description:
      'Integrating patient-facing workflows, pharmaceutical operations, and dependable IT infrastructure to support uninterrupted care and supply.',
    focusCapabilities: ['Odoo ERP & Supply Chain', 'Custom Applications', '24/7 Infrastructure Support'],
    organizations: ['Macro Pharmaceuticals', 'Dr. Nour Mostafa Dental Clinic', 'EQ-5D'],
  },
  {
    id: 'education',
    name: 'Education',
    headline: 'Campus-wide connectivity and resilient digital platforms.',
    description:
      'Supporting academic environments with structured enterprise networking, secure data systems, and scalable administrative software.',
    focusCapabilities: ['Campus Networking', 'Cybersecurity Hardening', 'Web & Administrative Portals'],
    organizations: ['Misr International University (MIU)'],
  },
  {
    id: 'real-estate-investments',
    name: 'Real Estate and Investments',
    headline: 'Facility management, enterprise ERP, and portfolio visibility.',
    description:
      'Unifying asset operations, facility management platforms, financial workflows, and multi-site infrastructure across investment portfolios.',
    focusCapabilities: ['Facility Management Systems', 'Odoo ERP & Accounting', 'Enterprise Networking'],
    organizations: [
      'ORA Developers (OGA)',
      'National Group for Awqaf Investments (المجموعة الوطنية لاستثمارات الأوقاف)',
    ],
  },
  {
    id: 'industrial-packaging',
    name: 'Industrial and Packaging',
    headline: 'Bridging factory-floor hardware with enterprise operations.',
    description:
      'Connecting industrial scales, safety hardware, manufacturing lines, and packaging inventories directly into centralized software and ERP platforms.',
    focusCapabilities: ['Industrial Scales & Automation', 'Zebra Auto-ID & RFID', 'Manufacturing & QA Systems'],
    organizations: [
      'TÜV AUSTRIA',
      'El-Maaergy Scales',
      'ISS (Intelligent Safety Solutions)',
      'Quality Pack',
      'Sofipack',
    ],
  },
  {
    id: 'technology-telecom',
    name: 'Technology and Telecommunications',
    headline: 'Scalable software engineering and enterprise backbone architecture.',
    description:
      'Partnering with technology-driven organizations on full-stack application delivery, DevOps automation, and carrier-grade networking.',
    focusCapabilities: ['Full-Stack Engineering', 'DevOps & Cloud Platforms', 'Enterprise Networking'],
    organizations: ['Global Telecom Holding', 'Dot Robot'],
  },
  {
    id: 'retail-consumer',
    name: 'Retail and Consumer',
    headline: 'Omnichannel POS, supply chain tracking, and CRM integration.',
    description:
      'Empowering consumer brands and retail operators with synchronized point-of-sale software, warehouse barcode tracking, and ERP inventory control.',
    focusCapabilities: ['Retail POS Systems', 'Odoo Inventory & Supply Chain', 'CRM & Customer Engagement'],
    organizations: ['Dabur', 'ByGanz', 'Musqueteer'],
  },
];
