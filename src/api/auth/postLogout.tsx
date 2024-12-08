import api from "@/api/http-common";
import { getStorageItem, setStorageItem } from "@/utils/localStore";
import { APP_ROUTES } from "@/constants/app-routes";
import store from "@/redux/store";
import { setUserLogin } from "@/redux/userLogin/userLoginSlice";

export async function postLogout() {
    try {
        // Obtém o token de atualização do armazenamento local
        const refreshToken = getStorageItem("refresh_token");
        const accessToken = getStorageItem("token");

        if (!refreshToken || !accessToken) {
            console.error("Tokens não encontrados no localStorage. Redirecionando para o login.");
            handleLogout();
            return;
        }

        // Faz a requisição de logout para a API
        const response = await api.post(
            "/auth/logout",
            null, // Nenhum corpo é necessário
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Cabeçalho Authorization com o access_token
                },
                params: {
                    refresh_token: refreshToken, // Parâmetro de consulta com o refresh_token
                },
            }
        );

        console.log("Logout realizado com sucesso:", response.data);

        // Limpa os dados do localStorage e redireciona para o login
        handleLogout();
    } catch (error) {
        console.error("Erro ao realizar logout:", error);
        // Em caso de erro, ainda assim limpa os dados do usuário
        handleLogout();
    }
}

// Função auxiliar para limpar os dados e redirecionar
function handleLogout() {
    setStorageItem("token", "");
    setStorageItem("refresh_token", "");
    setStorageItem("userLogin", "");
    store.dispatch(setUserLogin("")); // Limpa o estado do Redux

    // Redireciona para a página de login
    window.location.href = APP_ROUTES.public.login;
}
