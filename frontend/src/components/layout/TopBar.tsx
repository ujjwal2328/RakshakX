'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell, HelpCircle, ChevronDown, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { SUBSIDIARIES } from '@/types';

const PATH_LABELS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/documents': 'Documents',
  '/knowledge': 'Information Repository',
  '/query': 'Information Search',
  '/reports': 'Report Preparation',
  '/topics': 'Subject & Trend Analysis',
  '/analytics': 'Analytics',
  '/gis': 'Geographic Information',
  '/parliamentary': 'Query & Correspondence',
  '/validation': 'Data Verification',
  '/approvals': 'Review & Approval',
  '/audit': 'Audit Trail',
  '/admin': 'Administration',
};

export default function TopBar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!user) return null;

  const currentPage = PATH_LABELS[pathname] || 'Dashboard';
  const initials = user.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="app-topbar">
      {/* Breadcrumb */}
      <div className="topbar-breadcrumb">
        CIRS <ChevronRight size={12} /> <span>{currentPage}</span>
      </div>

      {/* Org Selector */}
      <div className="topbar-org-selector">
        <span>{user.subsidiary || user.organization}</span>
        <ChevronDown size={12} />
      </div>

      {/* Global Search */}
      <div className="topbar-search">
        <Search size={14} />
        <input
          type="text"
          placeholder="Search documents, reports, entities..."
          aria-label="Global search"
        />
      </div>

      <div className="topbar-spacer" />

      {/* Actions */}
      <div className="topbar-actions">
        <button className="topbar-btn" title="Notifications" aria-label="Notifications">
          <Bell size={16} />
          <span className="notification-dot" />
        </button>

        <button className="topbar-btn" title="Help" aria-label="Help">
          <HelpCircle size={16} />
        </button>

        <div className="topbar-divider" />

        {/* User */}
        <div
          className="topbar-user"
          onClick={() => setShowUserMenu(!showUserMenu)}
          role="button"
          tabIndex={0}
          aria-label="User menu"
          onKeyDown={(e) => e.key === 'Enter' && setShowUserMenu(!showUserMenu)}
        >
          <div className="topbar-user-avatar">{initials}</div>
          <div className="topbar-user-info">
            <div className="topbar-user-name">{user.full_name}</div>
            <div className="topbar-user-role">{user.role_display}</div>
          </div>
        </div>

        {showUserMenu && (
          <div style={{
            position: 'absolute',
            top: '48px',
            right: '16px',
            background: 'var(--color-white)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius-md)',
            boxShadow: 'var(--shadow-md)',
            padding: 'var(--space-2)',
            zIndex: 200,
            minWidth: '200px',
          }}>
            <div style={{ padding: 'var(--space-2) var(--space-3)', borderBottom: '1px solid var(--border-color)', marginBottom: 'var(--space-1)' }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-neutral-800)' }}>{user.full_name}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)' }}>{user.email}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)', marginTop: '2px' }}>{user.designation}</div>
            </div>
            <button
              onClick={logout}
              className="sidebar-item"
              style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
