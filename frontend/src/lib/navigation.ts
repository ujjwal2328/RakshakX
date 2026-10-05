import type { UserRole } from '@/types';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: number;
  roles?: UserRole[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

/**
 * Navigation structure with RBAC.
 * If `roles` is undefined, the item is visible to all roles.
 */
export const NAV_SECTIONS: NavSection[] = [
  {
    label: 'OVERVIEW',
    items: [
      { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    ],
  },
  {
    label: 'DOCUMENT MANAGEMENT',
    items: [
      {
        id: 'documents',
        label: 'Documents',
        href: '/documents',
        icon: 'FileText',
        roles: ['system_admin', 'mine_authority', 'geologist', 'mining_engineer', 'technical_officer', 'production_officer'],
      },
      {
        id: 'ingestion',
        label: 'Document Processing',
        href: '/ingestion',
        icon: 'Server',
        roles: ['system_admin', 'mine_authority', 'technical_officer'],
      },
      {
        id: 'knowledge',
        label: 'Information Repository',
        href: '/knowledge',
        icon: 'BookOpen',
        roles: ['system_admin', 'mine_authority', 'geologist', 'mining_engineer', 'technical_officer', 'production_officer'],
      },
      {
        id: 'mining_info',
        label: 'Mining Information',
        href: '/mining',
        icon: 'Pickaxe',
        roles: ['system_admin', 'mine_authority', 'mining_engineer', 'production_officer', 'technical_officer'],
      },
      {
        id: 'geology_info',
        label: 'Geological Information',
        href: '/geology',
        icon: 'Mountain',
        roles: ['system_admin', 'mine_authority', 'geologist'],
      },
    ],
  },
  {
    label: 'INFORMATION ACCESS',
    items: [
      {
        id: 'query',
        label: 'Information Search',
        href: '/query',
        icon: 'Search',
        roles: ['system_admin', 'mine_authority', 'parliamentary_officer', 'geologist', 'management', 'report_reviewer', 'technical_officer'],
      },
      {
        id: 'queries',
        label: 'Query & Correspondence',
        href: '/parliamentary',
        icon: 'MessageSquare',
        roles: ['system_admin', 'mine_authority', 'parliamentary_officer', 'management'],
      },
      {
        id: 'previous_queries',
        label: 'Previous Queries & Responses',
        href: '/previous-queries',
        icon: 'History',
        roles: ['system_admin', 'parliamentary_officer', 'management'],
      },
      {
        id: 'topics',
        label: 'Subject & Trend Analysis',
        href: '/topics',
        icon: 'Tags',
        roles: ['system_admin', 'mine_authority', 'geologist', 'mining_engineer', 'technical_officer'],
      },
    ],
  },
  {
    label: 'REPORTING',
    items: [
      {
        id: 'reports',
        label: 'Report Preparation',
        href: '/reports',
        icon: 'FileOutput',
        roles: ['system_admin', 'mine_authority', 'geologist', 'mining_engineer', 'technical_officer', 'production_officer'],
      },
      {
        id: 'reports_records',
        label: 'Reports & Records',
        href: '/records',
        icon: 'Files',
        roles: ['system_admin', 'parliamentary_officer', 'management'],
      },
    ],
  },
  {
    label: 'DATA & ANALYSIS',
    items: [
      {
        id: 'analytics',
        label: 'Analytics',
        href: '/analytics',
        icon: 'BarChart3',
        roles: ['system_admin', 'mine_authority', 'parliamentary_officer', 'management'],
      },
      {
        id: 'gis',
        label: 'Geographic Information',
        href: '/gis',
        icon: 'Map',
        roles: ['system_admin', 'mine_authority', 'parliamentary_officer', 'geologist', 'technical_officer'],
      },
      {
        id: 'validation',
        label: 'Data Verification',
        href: '/validation',
        icon: 'ShieldCheck',
        roles: ['system_admin', 'mine_authority', 'geologist', 'technical_officer', 'report_reviewer'],
      },
    ],
  },
  {
    label: 'WORKFLOW',
    items: [
      {
        id: 'approvals',
        label: 'Review & Approval',
        href: '/approvals',
        icon: 'CheckCircle2',
        badge: 3,
        roles: ['system_admin', 'mine_authority', 'parliamentary_officer', 'geologist', 'report_reviewer', 'management'],
      },
      {
        id: 'audit',
        label: 'Audit Trail',
        href: '/audit',
        icon: 'ScrollText',
        roles: ['system_admin', 'mine_authority', 'parliamentary_officer', 'management'],
      },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      {
        id: 'admin',
        label: 'Administration',
        href: '/admin',
        icon: 'Settings',
        roles: ['system_admin'],
      },
    ],
  },
];

/**
 * Filter navigation sections based on user role.
 */
export function getNavForRole(role: UserRole): NavSection[] {
  return NAV_SECTIONS
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => !item.roles || item.roles.includes(role)
      ),
    }))
    .filter((section) => section.items.length > 0);
}
