import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import * as TokenService from '@/app/authentication/auth.token';
import { AuthService } from '@/app/authentication/auth.service';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://lmtsteste23.ufape.edu.br';
const PUBLIC_ROUTES = [
  '/login',
  '/conta/criar-conta',
  '/conta/recuperar-senha',
  '/conta/redefinir-senha',
];

axios.defaults.withCredentials = true;

const isPublicRoute = (): boolean => {
  if (typeof window === 'undefined') return false;
  return PUBLIC_ROUTES.some(route => window.location.pathname.startsWith(route));
};

const safeRedirectToLogin = (): void => {
  if (!isPublicRoute()) window.location.href = '/login';
};

const clearTokenData = (): void => {
  TokenService.stopTokenRefreshSchedule();
};

export async function ensureAuthenticated(): Promise<boolean> {
  if (isPublicRoute()) return true;

  // If token still valid
  if (!TokenService.isTokenExpired()) {
    // If near expiration, attempt proactive refresh
    if (TokenService.isTokenNearExpiration()) {
      const refreshed = await AuthService.refreshToken();
      if (refreshed) return true;
      // if refresh failed but token not yet expired, allow current token
      if (!TokenService.isTokenExpired()) return true;
    } else {
      // token valid and not near expiration
      return true;
    }
  }

  // Token expired or refresh needed
  const refreshed = await AuthService.refreshToken();
  if (refreshed) return true;

  // If refresh failed, clear and redirect
  clearTokenData();
  safeRedirectToLogin();
  return false;
}

interface ApiParams {
  metodo: string;
  uri: string;
  params?: any;
  data?: any;
  contentType?: string;
  responseType?: AxiosRequestConfig['responseType'];
}

async function handleApiError(error: any) {
  let message = 'Ocorreu um erro ao processar sua requisição.';
  if (error.response) {
    const status = error.response.status;
    switch (status) {
      case 401:
        message = 'Sessão expirada. Faça login novamente.';
        safeRedirectToLogin();
        break;
      case 404:
        message = 'Recurso não encontrado.';
        break;
      case 500:
        message = 'Erro interno do servidor.';
        break;
      default:
        message = error.response.data?.message || message;
    }
    toast.error(message, { position: 'top-left' });
    return { status, data: { message } };
  } else if (error.code === 'ERR_NETWORK') {
    message = 'Falha na conexão com o servidor.';
    toast.error(message, { position: 'top-left' });
    safeRedirectToLogin();
  }
  return { status: 500, data: { message } };
}

export async function api({
  metodo,
  uri,
  params = {},
  data = {},
  contentType = 'application/json',
  responseType = 'json'
}: ApiParams) {
  if (!(await ensureAuthenticated()))
    return { status: 401, data: { message: 'Sessão inválida' } };
  try {
    const response = await axios({
      method: metodo,
      url: `${BASE_URL}${uri}`,
      params,
      data,
      headers: { 'Content-Type': contentType },
      responseType,
      withCredentials: true,
    });
    return response;
  } catch (error: any) {
    return handleApiError(error);
  }
}

// Legacy generica: supports both object param and optional contentType
export async function generica(
  params: ApiParams,
  contentType?: string
): Promise<any> {
  const finalParams: ApiParams = contentType
    ? { ...params, contentType }
    : params;
  return api(finalParams);
}

export async function geracsv(uri = '', fileName = '') {
  return generica({ metodo: 'get', uri, responseType: 'blob' });
}

export async function downloadExcel(uri = '', fileName = '') {
  return generica({ metodo: 'get', uri, responseType: 'blob' });
}

export async function uploadFile(uri: string, formData: FormData) {
  return generica({
    metodo: 'post',
    uri,
    data: formData,
    contentType: 'multipart/form-data',
  });
}

export async function genericaMultiForm({
  metodo = 'post',
  uri = '',
  params = {},
  data = {},
  responseType = 'json',
}: ApiParams) {
  return generica({
    metodo,
    uri,
    params,
    data,
    contentType: 'multipart/form-data',
    responseType,
  });
}

/**
 * Use for public auth endpoints (signup, recover password)
 */
export async function genericaApiAuth({
  metodo,
  uri,
  params = {},
  data = {},
  contentType = 'application/json',
  responseType = 'json'
}: ApiParams) {
  try {
    const response = await axios({
      method: metodo,
      url: `${BASE_URL}/auth${uri}`,
      params,
      data,
      headers: { 'Content-Type': contentType },
      responseType,
      withCredentials: true,
    });
    return response;
  } catch (error: any) {
    return handleApiError(error);
  }
}


export { genericaApiAuth as authApi };
export { uploadFile as uploadApi, geracsv as csvApi, downloadExcel as excelApi };
