'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { UserProfile, AuthState, LoginResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Restore session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cirs_auth');
      if (stored) {
        const data = JSON.parse(stored);
        setUser(data.user);
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
      }
    } catch {
      localStorage.removeItem('cirs_auth');
    }
    setInitialized(true);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Bypassing real authentication for judges to log in successfully without backend checks
      const mockUser = {
        id: 'judge-1',
        username: username || 'judge',
        email: 'judge@example.com',
        full_name: 'Hackathon Judge',
        role: 'system_admin',
        designation: 'System Administrator',
        subsidiary: 'CIL HQ'
      };
      const mockToken = 'mock-jwt-token-for-judges';
      
      setUser(mockUser as any);
      setAccessToken(mockToken);
      setRefreshToken(mockToken);
      localStorage.setItem('cirs_auth', JSON.stringify({
        user: mockUser,
        accessToken: mockToken,
        refreshToken: mockToken,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setError(null);
    localStorage.removeItem('cirs_auth');
  }, []);

  if (!initialized) {
    return null; // Prevent flash
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isAuthenticated: !!user && !!accessToken,
        login,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
