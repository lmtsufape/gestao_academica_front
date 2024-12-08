import axios, { AxiosError } from "axios";
import { APP_ROUTES } from "@/constants/app-routes";
import { getStorageItem, setStorageItem } from "@/utils/localStore";
import { setUserLogin } from "@/redux/userLogin/userLoginSlice";
import store from "@/redux/store";

// Acessa o token diretamente do localStorage
const token = getStorageItem("token");

const api = axios.create({
  baseURL: "https://lmtsteste24.ufape.edu.br/",
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }), // Adiciona o cabeçalho Authorization somente se o token existir
  },
  withCredentials: true, // Necessário para enviar cookies HTTP-only
});

// Função para obter um novo token
async function refreshAccessToken() {
  try {
    const response = await axios.post(
      "https://lmtsteste24.ufape.edu.br/auth/refresh",
      {}, // Nenhum corpo é necessário, pois o cookie é enviado automaticamente
      { withCredentials: true } // Garante que os cookies sejam enviados
    );

    const { access_token } = response.data; // O campo é 'access_token', não 'accessToken'

    // Atualiza o access token no localStorage
    setStorageItem("token", access_token);

    // Atualiza os cabeçalhos padrão do Axios
    api.defaults.headers.Authorization = `Bearer ${access_token}`;
    return access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Erro ao renovar o token:", error.response?.data || error.message);
    } else {
      console.error("Erro inesperado ao renovar o token:", error);
    }
    throw error; // Propaga o erro para o interceptor
  }
}

// Interceptor para lidar com erros de autenticação (401)
api.interceptors.response.use(
  (response) => response, // Passa a resposta normalmente
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 e a requisição não foi marcada como "retry"
    if (axios.isAxiosError(error) && error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marca a requisição como "retry"

      try {
        // Renova o access token
        const newToken = await refreshAccessToken();

        // Atualiza o cabeçalho da requisição original
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Reenvia a requisição original
        return api(originalRequest);
      } catch (refreshError) {
        if (axios.isAxiosError(refreshError)) {
          console.error("Falha ao renovar o token:", refreshError.response?.data || refreshError.message);
        } else {
          console.error("Erro inesperado ao renovar o token:", refreshError);
        }

        // Limpa os dados do usuário e redireciona para o login
        setStorageItem("token", "");
        store.dispatch(setUserLogin(""));
        //window.location.href = APP_ROUTES.public.login;

        return Promise.reject(refreshError); // Propaga o erro
      }
    }

    // Para outros erros, apenas rejeita a Promise
    return Promise.reject(error);
  }
);

export default api;
