import axios from "axios";
import { getStorageItem } from "@/utils/localStore";
import { IUsuario } from "@/interfaces/IUsuario";

export async function patchUsuarioById(id: string | number | undefined, usuario: IUsuario, profilePhoto: File | any) {
  const token = getStorageItem("token"); 

  const formData = new FormData();
  const usuarioJson = JSON.stringify(usuario);

  // Adiciona a string JSON no campo `barber`
  formData.append("usuario", usuarioJson);

  // Adiciona a imagem no campo `profilePhoto`
  formData.append("profilePhoto", profilePhoto);

  try {
    const response = await axios.put(
      `https://lmtsteste24.ufape.edu.br/usuario/editar${id}`,
      formData,
      {
        headers: {
          "Authorization": `${token}`, 
          "Content-Type": "multipart/form-data", // Mantém o Content-Type adequado para envio de FormData
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao enviar a requisição:", error);
    throw error;
  }
}
