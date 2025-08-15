'use client';

import { useContext, useMemo, useCallback } from 'react';
import { AuthContext } from '@/components/AuthProvider/AuthProvider';


export const ROLE_ADMIN = 'administrador';
export const ROLE_GESTOR = 'gestor';
export const ROLE_TECNICO = 'tecnico';
export const ROLE_PROFESSOR = 'professor';
export const ROLE_PROFISSIONAL = 'profissional';
export const ROLE_ALUNO = 'aluno';
export const ROLE_VISITANTE = 'visitante';
export const ROLE_PRAE_ACCESS = 'prae_access';


export function useAuthService() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthService must be used within an AuthProvider');
  }
  const { session, isAuthenticated, isLoading, login, logout } = context;
  const roles = useMemo(() => session?.roles ?? [], [session]);
  const isAdmin = useCallback(() => roles.includes(ROLE_ADMIN), [roles]);
  const isGestor = useCallback(() => roles.includes(ROLE_GESTOR), [roles]);
  const isTecnico = useCallback(() => roles.includes(ROLE_TECNICO), [roles]);
  const isProfessor = useCallback(() => roles.includes(ROLE_PROFESSOR), [roles]);
  const isProfissional = useCallback(() => roles.includes(ROLE_PROFISSIONAL), [roles]);
  const isAluno = useCallback(() => roles.includes(ROLE_ALUNO), [roles]);
  const isVisitante = useCallback(() => roles.includes(ROLE_VISITANTE), [roles]);
  const isPraeAccess = useCallback(() => roles.includes(ROLE_PRAE_ACCESS), [roles]);
  console.log("DEBUG: AuthService session:", session?.roles);
  return useMemo(
    () => ({
      session,
      isAuthenticated,
      isLoading,
      login,
      logout,
      roles,
      getUserRoles: () => roles,
      isAdmin,
      isGestor,
      isTecnico,
      isProfessor,
      isProfissional,
      isAluno,
      isVisitante,
      isPraeAccess,
    }),
    [session, isAuthenticated, isLoading, login, logout, roles, isAdmin, isGestor, isTecnico, isProfessor, isProfissional, isAluno, isVisitante, isPraeAccess]
  );
}

/**
 * Static utility functions for backward compatibility
 */
export const AuthUtils = {
  redirectToLogin: (redirectUrl: string = '/login'): void => {
    if (typeof window !== 'undefined') {
      window.location.href = redirectUrl;
    }
  },
  ROLES: {
    ADMIN: ROLE_ADMIN,
    GESTOR: ROLE_GESTOR,
    TECNICO: ROLE_TECNICO,
    PROFESSOR: ROLE_PROFESSOR,
    PROFISSIONAL: ROLE_PROFISSIONAL,
    ALUNO: ROLE_ALUNO,
    VISITANTE: ROLE_VISITANTE,
  },
};

/**
 * Legacy class export for backward compatibility
 */
export class AuthService {
  public static readonly ROLE_ADMIN = ROLE_ADMIN;
  public static readonly ROLE_GESTOR = ROLE_GESTOR;
  public static readonly ROLE_TECNICO = ROLE_TECNICO;
  public static readonly ROLE_PROFESSOR = ROLE_PROFESSOR;
  public static readonly ROLE_PROFISSIONAL = ROLE_PROFISSIONAL;
  public static readonly ROLE_ALUNO = ROLE_ALUNO;
  public static readonly ROLE_VISITANTE = ROLE_VISITANTE;
  public static redirectToLogin = AuthUtils.redirectToLogin;
}

export default AuthService;