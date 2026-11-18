export interface ViewportSpec {
  name: string;
  width: number;
  height: number;
}

export const TEST_VIEWPORTS: ViewportSpec[] = [
  { name: 'small-mobile', width: 320, height: 568 },
  { name: 'mobile', width: 375, height: 667 },
  { name: 'large-mobile', width: 430, height: 932 },
  { name: 'tablet-portrait', width: 768, height: 1024 },
  { name: 'tablet-landscape', width: 1024, height: 768 },
  { name: 'small-laptop', width: 1280, height: 720 },
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'large-desktop', width: 1920, height: 1080 },
  { name: 'ultrawide', width: 2560, height: 1440 },
];

export const CANONICAL_ROUTES = [
  '/',
  '/capabilities',
  '/solutions/zkteco-attendance',
  '/solutions/weighing-management',
  '/industries',
  '/events',
  '/about',
  '/contact',
] as const;

export const EXPECTED_SERVICE_TITLES = [
  'Infrastructure & Networking',
  'Cybersecurity & Protection',
  'Custom Software & Applications',
  'Enterprise Business Systems',
  'Retail & Industrial Technology',
  'IT Consulting & Technology Advisory',
  'IT Support & Managed IT Services',
  'AI Agents & Custom Intelligent Automation',
] as const;

export const EXPECTED_CORE_VALUE_TITLES = [
  'Customer Focus',
  'Continuous Improvement',
  'Customer Commitment',
  'Diversity',
  'Sustainability',
] as const;
