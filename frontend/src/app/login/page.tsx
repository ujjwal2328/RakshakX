'use client';

import React, { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Database, FileText, Search, ShieldCheck, BarChart3, Map,
  CheckCircle2, Lock, Eye, EyeOff,
} from 'lucide-react';

const DEMO_ACCOUNTS = [
  { username: 'admin', password: 'admin123', role: 'System Administrator' },
  { username: 'geologist', password: 'geo123', role: 'Senior Geologist' },
  { username: 'mining_eng', password: 'mine123', role: 'Mining Engineer' },
  { username: 'analyst', password: 'data123', role: 'Data Analyst' },
  { username: 'reviewer', password: 'rev123', role: 'Report Reviewer' },
  { username: 'management', password: 'mgmt123', role: 'Director (Technical)' },
  { username: 'admin_officer', password: 'adm123', role: 'Administrative Officer' },
];

export default function LoginPage() {
  const { login, loading, error, isAuthenticated } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null; // prevent flashing the login form while redirecting
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      router.push('/dashboard');
    } catch {
      // error is set by auth context
    }
  };

  const handleDemoLogin = async (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    try {
      await login(user, pass);
      router.push('/dashboard');
    } catch {
      // error handled
    }
  };

  return (
    <div className="login-page">
      {/* Left Panel — Login Form */}
      <div className="login-panel">
        <div className="login-brand">
          <div className="login-brand-icon">
            <Database size={22} />
          </div>
          <h1>Coal Intelligence & Reporting System</h1>
          <p>Advanced Geological, Mining & Reporting Solution</p>
        </div>

        <span className="login-env-badge">⚠ PROTOTYPE — DEMO ENVIRONMENT</span>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              id="username"
              className="form-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                className="form-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-neutral-400)',
                  padding: '4px',
                }}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ background: 'var(--color-primary-600)', border: 'none', padding: '12px' }}>
            <Lock size={14} />
            {loading ? 'Authenticating...' : 'Hackathon Judge Login (No Password Required)'}
          </button>
        </form>

        {/* Demo Accounts */}
        <div className="login-demo-info">
          <h4>Demo Accounts</h4>
          <table>
            <tbody>
              {DEMO_ACCOUNTS.map((acc) => (
                <tr key={acc.username} style={{ cursor: 'pointer' }} onClick={() => handleDemoLogin(acc.username, acc.password)}>
                  <td><code style={{ fontSize: '11px' }}>{acc.username}</code></td>
                  <td>{acc.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Panel — Info */}
      <div className="login-info-panel">
        <h2>Transforming Coal Sector Reporting Through Advanced Intelligence</h2>
        <p>
          A unified platform for CMPDI and CIL subsidiaries to process, analyze, and generate
          geological, mining, and administrative reports with full source traceability and
          evidence-backed system assistance.
        </p>
        <ul className="login-info-features">
          <li><FileText size={14} /> Document Intelligence</li>
          <li><Search size={14} /> Advanced Search & RAG</li>
          <li><ShieldCheck size={14} /> Data Validation</li>
          <li><BarChart3 size={14} /> Analytics & Trends</li>
          <li><Map size={14} /> GIS Integration</li>
          <li><CheckCircle2 size={14} /> Review & Approval Review</li>
          <li><Database size={14} /> Information Relationships</li>
          <li><Lock size={14} /> Enterprise Security</li>
        </ul>
      </div>
    </div>
  );
}
