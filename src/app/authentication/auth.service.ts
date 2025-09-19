import * as TokenService from './auth.token';

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://lmtsteste23.ufape.edu.br";

export class AuthService {
  static async login(email: string, password: string): Promise<void> {
    const params = new URLSearchParams({ email, senha: password });
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    if (!res.ok) {
      let errMsg = 'Login falhou';
      try {
        const errData = await res.json();
        if (errData?.mensagem) errMsg = errData.mensagem;
      } catch {}
      throw new Error(errMsg);
    }
    const data = await res.json();
    if (data.exp) TokenService.setTokenExpiration(data.exp);
    await this.loadSession();
  }

  static async loadSession(): Promise<{ roles: string[]; email?: string }> {
    const [rolesRes, userRes] = await Promise.all([
      fetch(`${BASE}/auth/roles`, { credentials: 'include' }),
      fetch(`${BASE}/auth/usuario/current`, { credentials: 'include' }),
    ]);
    if (!rolesRes.ok) throw new Error('Não conseguiu obter roles');
    const roles = (await rolesRes.json()) as string[];
    const { email } = userRes.ok ? await userRes.json() : { email: undefined };
    return { roles, email };
  }

  static async refreshToken(): Promise<boolean> {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) return false;
    const data = await res.json().catch(() => ({}));
    if (data.exp) TokenService.setTokenExpiration(data.exp);
    return true;
  }

  static async logout(): Promise<void> {
    await fetch(`${BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    TokenService.stopTokenRefreshSchedule();
  }

  static async resetPassword(email: string): Promise<any> {
    const params = new URLSearchParams({ email });
    const res = await fetch(`${BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    
    const data = await res.json().catch(() => ({}));
    
    return {
      status: res.status,
      ok: res.ok,
      data
    };
  }

  static redirectToLogin(): void {
    window.location.href = '/login';
  }
}
