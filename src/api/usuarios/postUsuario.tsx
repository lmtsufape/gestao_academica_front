import { IUsuario } from "@/interfaces/IUsuario";
import { getStorageItem } from "@/utils/localStore";

export async function postUsuario(usuario: IUsuario, profilePhoto: File | undefined, route: string) {
  // Obtém o token do armazenamento local
  const token = getStorageItem("token");

  // Verifica se o token é válido (não está vazio, nulo ou indefinido)
  const hasValidToken = token && token.trim().length > 0;

  let options: RequestInit;

  // Verifica se há uma foto de perfil para decidir entre FormData e JSON
  if (profilePhoto) {
    const formData = new FormData();
    formData.append("usuario", JSON.stringify(usuario));
    formData.append("profilePhoto", profilePhoto, profilePhoto.name);

    options = {
      method: "POST",
      body: formData,
      headers: {
        "Accept": "*/*",
        ...(hasValidToken && { "Authorization": `Bearer ${token}` }), // Adiciona o token apenas se for válido
      },
    };
  } else {
    options = {
      method: "POST",
      body: JSON.stringify(usuario),
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/json",
        ...(hasValidToken && { "Authorization": `Bearer ${token}` }), // Adiciona o token apenas se for válido
      },
    };
  }

  try {
    // Faz a requisição usando fetch para a rota específica
    const response = await fetch(`https://lmtsteste24.ufape.edu.br/${route}`, options);

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao enviar a requisição:", error);
    throw error; // Lança o erro para ser tratado pelo chamador da função
  }
}
