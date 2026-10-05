'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, FileText, BookOpen, Search, FileOutput, Tags,
  BarChart3, Map, MessageSquare, ShieldCheck, CheckCircle2,
  ScrollText, Settings, Database, Server,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { getNavForRole, type NavItem } from '@/lib/navigation';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  LayoutDashboard, FileText, BookOpen, Search, FileOutput, Tags,
  BarChart3, Map, MessageSquare, ShieldCheck, CheckCircle2,
  ScrollText, Settings, Server,
};

function NavIcon({ name, size = 16 }: { name: string; size?: number }) {
  const Icon = ICON_MAP[name] || Database;
  return <Icon size={size} />;
}

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const sections = getNavForRole(user.role);

  return (
    <aside className="app-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Database size={16} />
        </div>
        <div>
          <div className="sidebar-title">CIRS</div>
          <div className="sidebar-subtitle">Coal Intelligence & Reporting</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {sections.map((section) => (
          <div className="sidebar-section" key={section.label}>
            <div className="sidebar-section-label">{section.label}</div>
            {section.items.map((item: NavItem) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`sidebar-item${isActive ? ' active' : ''}`}
                >
                  <NavIcon name={item.icon} />
                  <span>{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="sidebar-badge">{item.badge}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ marginBottom: '4px' }}>v1.0.0 — Prototype</div>
        <div>Connected to CIL Database</div>
      </div>
    </aside>
  );
}
