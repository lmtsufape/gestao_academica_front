'use client';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://lmtsteste23.ufape.edu.br";

export class AuthService {
    async authenticate({ email, password }: { email: string; password: string }) {
        try {
            
            // Monta os parâmetros no formato URL encoded conforme esperado pelo backend
            const params = new URLSearchParams();
            params.append("email", email);
            params.append("senha", password);

            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString(),
            });

            // Trata erros HTTP com mensagens customizadas
            if (!response.ok) {
                await this.handleLoginError(response);
            }

            // Lê a resposta em JSON
            const contentType = response.headers.get("content-type");
            let authResponse = null;
            if (contentType && contentType.includes("application/json")) {
                authResponse = await response.json();
            } else {
                console.error('Tipo de conteúdo inesperado. Não foi possível analisar o JSON.');
            }

            // Valida se o access_token foi recebido
            if (!authResponse || !authResponse.access_token) {
                throw new Error("Token inválido.");
            }

            // Decodifica o token JWT para extrair informações (como o timestamp de expiração)
            const tokenParts = authResponse.access_token.split('.');
            if (tokenParts.length !== 3) {
                throw new Error("Formato de token inválido.");
            }
            const [header, payload, signature] = tokenParts;
            const decodedPayload = JSON.parse(atob(payload));

            // Monta o objeto authData com os dados recebidos e informações extraídas do token
            const authData = {
                token: authResponse.access_token,
                refreshToken: authResponse.refresh_token,
                tokenType: authResponse.token_type,
                expiresIn: authResponse.expires_in,
                roles: authResponse.roles,
                scope: authResponse.scope,
                authTokenExpiresIn: decodedPayload.exp, // Timestamp de expiração extraído do token
                decodedPayload,
            };

            // Armazena os dados no Local Storage
            localStorage.setItem("sgu_authenticated_user", JSON.stringify(authData));

            return authData;
        } catch (error: any) {
            console.error('Erro na autenticação:', error);
            return error.message || "Erro ao autenticar.";
        }
    }

    /**
     * 
     * @param error Erro retornado pelo servidor ou pela requisição
     * @returns 
     */
    async handleLoginError(response: Response) {
        const defaultError = {
          message: (()=>{
            switch (response.status) {
                case 400:
                    return "Requisição inválida. Verifique os dados informados.";
                case 401:
                    return "E-mail ou senha incorretos.";
                case 403:
                    return "Acesso negado.";
                case 404:
                    return "Recurso não encontrado.";
                case 500:
                    return "Erro interno do servidor. Tente novamente mais tarde.";
                default:
                    return "Erro desconhecido.";
            }            
          })(),
          status: response.status,
        };
        try {
            const error = await response.json();
            if (error.hasOwnProperty('mensagem')) {
                defaultError.message = error.mensagem;
            }
        } catch (error) {
            console.error('Erro ao obter JSON', error);
        }
        console.error("Erro HTTP:", response.status, defaultError.message);
        throw new Error(defaultError.message);
    }
}

export default new AuthService();
