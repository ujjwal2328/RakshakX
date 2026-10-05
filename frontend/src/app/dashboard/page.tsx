'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { MineAuthorityDashboard, ParliamentaryDashboard, GeologistDashboard, ManagementDashboard } from './Dashboards';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'parliamentary_officer':
      return <ParliamentaryDashboard />;
    case 'mine_authority':
    case 'production_officer':
    case 'technical_officer':
    case 'mining_engineer':
    case 'system_admin':
      return <MineAuthorityDashboard />;
    case 'geologist':
      return <GeologistDashboard />;
    case 'management':
      return <ManagementDashboard />;
    default:
      return <MineAuthorityDashboard />;
  }
}
