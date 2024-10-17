import { IUsuario } from "@/interfaces/IUsuario";
import { getStorageItem } from "@/utils/localStore";

export async function postUsuario(usuario: IUsuario, profilePhoto: File, route: string) {
  // Obtém o token do armazenamento local
  const token = getStorageItem("token"); 

  // Cria um objeto FormData para enviar o objeto JSON e a imagem
  const formData = new FormData();

  // Converte o objeto `usuario` para uma string JSON e adiciona ao FormData
  const usuarioJson = JSON.stringify(usuario);
  formData.append("usuario", usuarioJson);

  // Adiciona a imagem ao FormData
  formData.append("profilePhoto", profilePhoto, profilePhoto.name);

  try {
    // Faz a requisição usando fetch para a rota específica
    const response = await fetch(`https://lmtsteste24.ufape.edu.br/${route}`, {
      method: "POST",
      body: formData,
      headers: {
        "Accept": "*/*",
        // Adiciona o token de autenticação, se disponível
        "Authorization": `Bearer ${token}`,
      },
    });

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
