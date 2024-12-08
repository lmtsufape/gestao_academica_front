import axios, { AxiosError } from "axios";
import { APP_ROUTES } from "@/constants/app-routes";
import { getStorageItem, setStorageItem } from "@/utils/localStore";
import { setUserLogin } from "@/redux/userLogin/userLoginSlice";
import store from "@/redux/store";

// Obtém o token de acesso diretamente do localStorage
const token = getStorageItem("token");
const refreshToken = getStorageItem("refresh_token");

const api = axios.create({
  baseURL: "https://lmtsteste24.ufape.edu.br/",
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }), // Adiciona o cabeçalho Authorization somente se o token existir
  },
  withCredentials: true, // Envia cookies HTTP-only
});

// Função para renovar o token de acesso usando o refresh token
async function refreshAccessToken() {
  try {
    const response = await axios.post(
      "https://lmtsteste24.ufape.edu.br/auth/refresh",
      null, // Corpo vazio
      {
        params: {
          refresh_token: refreshToken, // O refresh token é passado como parâmetro na query string
        },
        withCredentials: true, // Garante que cookies sejam enviados
      }
    );

    const { access_token, refresh_token } = response.data;

    // Atualiza o token de acesso e refresh no localStorage
    setStorageItem("token", access_token);
    setStorageItem("refresh_token", refresh_token);

    // Atualiza o cabeçalho Authorization do Axios
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

// Interceptor para lidar com respostas e renovar tokens em caso de erro 401
api.interceptors.response.use(
  (response) => response, // Passa as respostas normalmente
  async (error) => {
    const originalRequest = error.config;

    // Verifica se o erro é 401 e se a requisição já foi tentada novamente
    if (axios.isAxiosError(error) && error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marca a requisição como "retry"

      try {
        // Renova o token de acesso
        const newToken = await refreshAccessToken();

        // Atualiza o cabeçalho da requisição original
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Reenvia a requisição original
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Erro ao renovar o token:", refreshError);

        // Limpa os dados do usuário e redireciona para o login
        setStorageItem("token", "");
        setStorageItem("refresh_token", "");
        store.dispatch(setUserLogin(""));

        //window.location.href = APP_ROUTES.public.login; // Redireciona para a página de login

        return Promise.reject(refreshError); // Propaga o erro
      }
    }

    return Promise.reject(error); // Propaga outros erros normalmente
  }
);

export default api;
