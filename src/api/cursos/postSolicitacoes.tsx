import { IUsuario } from "@/interfaces/IUsuario";
import { getStorageItem } from "@/utils/localStore";

export async function postSolicitacoes(perfil: string, usuario: IUsuario) {
  const token = getStorageItem("token");
  const url = `https://lmtsteste24.ufape.edu.br/solicitacao/${perfil}`;
  

  const formData = new FormData();

  if (perfil === "aluno") {
    if (usuario.matricula) {
      formData.append("matricula", usuario.matricula);
    } else {
      
      console.error("Matrícula não está definida!");
    }
  
    if (usuario.cursoId !== undefined && usuario.cursoId !== null) {
      formData.append("cursoId", usuario.cursoId.toString());
    } else {
      console.error("Curso não está definido ou é nulo!");
    }
  
  
  } else if (perfil === "professor") {
    if (usuario.siape) {
      formData.append("siape", usuario.siape);
    }

    if (usuario.cursoIds && Array.isArray(usuario.cursoIds)) {
      usuario.cursoIds.forEach((id) => {
        formData.append("cursoIds", id.toString());
      });
    }
  } else if (perfil === "tecnico") {
    if (usuario.siape) {
      formData.append("siape", usuario.siape);
    }
  }

  // Documentos (comuns a todos os perfis, se existirem)
  if (usuario.documentos && Array.isArray(usuario.documentos)) {
    usuario.documentos.forEach((file, index) => {
      if (file instanceof File) {
        formData.append("documentos", file, file.name);
      } else {
        console.warn(`Aviso: documento[${index}] não é um File válido`, file);
      }
    });
  } else {
    console.log("Debug: Nenhum documento a adicionar");
  }

  

  const options: RequestInit = {
    method: "POST",
    body: formData,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };


  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("Debug: Erro ao enviar a requisição. Detalhes:", errorDetails);
      throw new Error(`Erro na requisição: ${response.statusText} - ${errorDetails}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao enviar a requisição:", error);
    throw error;
  }
}
