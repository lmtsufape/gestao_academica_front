import { AuthService } from './auth.service';

let tokenExpiration: number | null = null;
let refreshTimeout: NodeJS.Timeout | null = null;

function getTimeUntilExpiration(): number {
  if (!tokenExpiration) return 0;
  return tokenExpiration * 1000 - Date.now();
}

export function isTokenExpired(): boolean {
  return getTimeUntilExpiration() <= 0;
}

export function isTokenNearExpiration(): boolean {
  const ms = getTimeUntilExpiration();
  return ms > 0 && ms < 60 * 1000;
}

export function getTokenExpirationInfo() {
  const ms = getTimeUntilExpiration();
  return {
    expirationTimestamp: tokenExpiration,
    timeUntilExpiration: ms,
    isExpired: ms <= 0,
    isNearExpiration: ms > 0 && ms < 60 * 1000,
  };
}

function scheduleTokenRefresh() {
  if (refreshTimeout) clearTimeout(refreshTimeout);
  const msUntilRefresh = getTimeUntilExpiration() - 60 * 1000;
  if (msUntilRefresh <= 0) {
    doRefresh();
  } else {
    refreshTimeout = setTimeout(doRefresh, msUntilRefresh);
  }
}

async function doRefresh() {
  const success = await AuthService.refreshToken();
  if (!success) AuthService.redirectToLogin();
}

export function setTokenExpiration(exp: number): void {
  tokenExpiration = exp;
  scheduleTokenRefresh();
}

export function startTokenRefreshSchedule(): void {
  if (tokenExpiration) scheduleTokenRefresh();
}

export function stopTokenRefreshSchedule(): void {
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
    refreshTimeout = null;
  }
  tokenExpiration = null;
}