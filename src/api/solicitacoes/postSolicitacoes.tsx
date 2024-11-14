import { IUsuario } from "@/interfaces/IUsuario";
import { getStorageItem } from "@/utils/localStore";

export async function postSolicitacoes(perfil: string, usuario: IUsuario) {
  const token = getStorageItem("token");
  const url = `https://lmtsteste24.ufape.edu.br/solicitacao/${perfil}`;

  const formData = new FormData();

  // Adiciona os campos necessários ao FormData com base no perfil
  if (perfil === "aluno") {
    formData.append("matricula", usuario.matricula);
      formData.append("cursoId", usuario.curso); // Assumindo que cursoId é o primeiro da lista
    
  } else if (perfil === "professor") {
    formData.append("siape", usuario.siape);
    if (usuario.cursoIds) {
      usuario.cursoIds.forEach((id, index) => {
        formData.append(`cursoIds[${index}]`, id.toString());
      });
    }
  } else if (perfil === "tecnico") {
    formData.append("siape", usuario.siape);
  }

  // Adiciona os documentos ao FormData
  if (usuario.documentos && Array.isArray(usuario.documentos)) {
    usuario.documentos.forEach((file) => {
      if (file instanceof File) {
        formData.append("documentos", file, file.name);
      }
    });
  }

  const options: RequestInit = {
    method: "POST",
    body: formData,
    headers: {
      "Accept": "*/*",
      ...(token && { "Authorization": `Bearer ${token}` }),
    },
  };

  // Realiza a requisição
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao enviar a requisição:", error);
    throw error;
  }
}
