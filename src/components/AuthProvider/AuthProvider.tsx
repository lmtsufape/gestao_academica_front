'use client';
import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { AuthService } from '@/app/authentication/auth.service';
import * as TokenService from '@/app/authentication/auth.token';
import { ensureAuthenticated } from '@/utils/api';

interface Session {
  roles: string[];
  email?: string;
}

interface AuthContextValue {
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const ok = await ensureAuthenticated();
        if (ok) {
          const sess = await AuthService.loadSession();
          setSession(sess);
          TokenService.startTokenRefreshSchedule();
        }
      } catch {
        setSession(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    await AuthService.login(email, password);
    const sess = await AuthService.loadSession();
    setSession(sess);
  };

  const logout = async () => {
    await AuthService.logout();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: Boolean(session),
        isLoading: loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to consume auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}