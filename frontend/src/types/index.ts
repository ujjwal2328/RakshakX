/* ── User & Auth ─────────────────────────────────────────── */

export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  email: string;
  role: UserRole;
  role_display: string;
  organization: string;
  subsidiary?: string | null;
  department?: string | null;
  designation?: string | null;
}

export type UserRole =
  | 'mine_authority'
  | 'technical_officer'
  | 'geologist'
  | 'mining_engineer'
  | 'production_officer'
  | 'report_reviewer'
  | 'management'
  | 'parliamentary_officer'
  | 'system_admin';

export interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: UserProfile;
}

/* ── Documents ───────────────────────────────────────────── */

export type DocumentStatus =
  | 'Uploaded'
  | 'Processing'
  | 'Indexed'
  | 'Validation Required'
  | 'Ready'
  | 'Failed';

export interface Document {
  id: string;
  name: string;
  document_type: string;
  subsidiary: string;
  department: string;
  year: number;
  reporting_period: string;
  source: string;
  status: DocumentStatus;
  indexed: boolean;
  uploaded_by: string;
  last_updated: string;
  pages?: number | null;
  file_size?: string | null;
}

export interface DocumentListResponse {
  documents: Document[];
  total: number;
  page: number;
  page_size: number;
}

/* ── Notifications ───────────────────────────────────────── */

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'action' | 'error';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
}

/* ── Navigation ──────────────────────────────────────────── */

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: number;
  roles?: UserRole[];
  section?: string;
}

/* ── Dashboard ───────────────────────────────────────────── */

export interface KPIData {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'warning' | 'neutral';
}

export interface AttentionItem {
  id: string;
  type: 'warning' | 'danger' | 'info' | 'action';
  title: string;
  meta: string;
  actionLabel?: string;
}

export interface ActivityItem {
  id: string;
  type: 'upload' | 'report' | 'validation' | 'query' | 'approval';
  text: string;
  time: string;
}

/* ── Reports ─────────────────────────────────────────────── */

export interface ReportTemplate {
  id: string;
  name: string;
  sections: number;
}

export type ReportStatus =
  | 'Draft'
  | 'Validating'
  | 'Under Review'
  | 'Approved'
  | 'Published'
  | 'Rejected';

export interface Report {
  id: string;
  title: string;
  template: string;
  subsidiary: string;
  period: string;
  status: ReportStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

/* ── Query ───────────────────────────────────────────────── */

export interface QueryResponse {
  query_id: string;
  question: string;
  answer: string;
  confidence: 'High' | 'Medium' | 'Requires Review';
  sources: QuerySource[];
  evidence: EvidenceItem[];
}

export interface QuerySource {
  document: string;
  page: number;
  section?: string;
  relevance: number;
}

export interface EvidenceItem {
  text: string;
  source: string;
  page: number;
}

/* ── Subsidiary / Organization ───────────────────────────── */

export interface Subsidiary {
  code: string;
  name: string;
  full_name: string;
}

export const SUBSIDIARIES: Subsidiary[] = [
  { code: 'CIL', name: 'CIL', full_name: 'Coal India Limited' },
  { code: 'CMPDI', name: 'CMPDI', full_name: 'Central Mine Planning & Design Institute' },
  { code: 'ECL', name: 'ECL', full_name: 'Eastern Coalfields Limited' },
  { code: 'BCCL', name: 'BCCL', full_name: 'Bharat Coking Coal Limited' },
  { code: 'CCL', name: 'CCL', full_name: 'Central Coalfields Limited' },
  { code: 'NCL', name: 'NCL', full_name: 'Northern Coalfields Limited' },
  { code: 'WCL', name: 'WCL', full_name: 'Western Coalfields Limited' },
  { code: 'SECL', name: 'SECL', full_name: 'South Eastern Coalfields Limited' },
  { code: 'MCL', name: 'MCL', full_name: 'Mahanadi Coalfields Limited' },
  { code: 'NEC', name: 'NEC', full_name: 'North Eastern Coalfields' },
];
