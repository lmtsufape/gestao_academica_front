import { IUsuario } from "@/interfaces/IUsuario";
import { getStorageItem } from "@/utils/localStore";

export async function postSolicitacoes(perfil: string, usuario: IUsuario) {
  const token = getStorageItem("token");
  const url = `https://lmtsteste24.ufape.edu.br/solicitacao/${perfil}`;
  
  console.log("Debug: Chamando postSolicitacoes");
  console.log("Debug: perfil =", perfil);
  console.log("Debug: token =", token);
  console.log("Debug: url =", url);

  const formData = new FormData();

  if (perfil === "aluno") {
    if (usuario.matricula) {
      formData.append("matricula", usuario.matricula);
    } else {
      console.error("Matrícula não está definida!");
    }
  
    if (usuario.curso !== undefined && usuario.curso !== null) {
      formData.append("cursoId", usuario.curso.toString());
    } else {
      console.error("Curso não está definido ou é nulo!");
    }
  
  
  } else if (perfil === "professor") {
    if (usuario.siape) {
      console.log("Debug: Adicionando siape:", usuario.siape);
      formData.append("siape", usuario.siape);
    }

    if (usuario.cursoIds && Array.isArray(usuario.cursoIds)) {
      console.log("Debug: Adicionando cursoIds:", usuario.cursoIds);
      usuario.cursoIds.forEach((id) => {
        formData.append("cursoIds", id.toString());
      });
    }
  } else if (perfil === "tecnico") {
    if (usuario.siape) {
      console.log("Debug: Adicionando siape:", usuario.siape);
      formData.append("siape", usuario.siape);
    }
  }

  // Documentos (comuns a todos os perfis, se existirem)
  if (usuario.documentos && Array.isArray(usuario.documentos)) {
    console.log("Debug: Adicionando documentos:", usuario.documentos);
    usuario.documentos.forEach((file, index) => {
      if (file instanceof File) {
        console.log(`Debug: Adicionando documento[${index}]:`, file.name);
        formData.append("documentos", file, file.name);
      } else {
        console.warn(`Aviso: documento[${index}] não é um File válido`, file);
      }
    });
  } else {
    console.log("Debug: Nenhum documento a adicionar");
  }

  // Logar todos os pares chave-valor do FormData
  console.log("Debug: Conteúdo do FormData:");
  for (const pair of formData.entries()) {
    console.log("  ", pair[0], ":", pair[1]);
  }

  const options: RequestInit = {
    method: "POST",
    body: formData,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  console.log("Debug: Opções da requisição:", options);

  try {
    const response = await fetch(url, options);
    console.log("Debug: Resposta recebida. status:", response.status);

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("Debug: Erro ao enviar a requisição. Detalhes:", errorDetails);
      throw new Error(`Erro na requisição: ${response.statusText} - ${errorDetails}`);
    }
    
    const data = await response.json();
    console.log("Debug: Resposta JSON:", data);
    return data;
  } catch (error) {
    console.error("Erro ao enviar a requisição:", error);
    throw error;
  }
}
