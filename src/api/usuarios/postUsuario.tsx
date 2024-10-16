import { IUsuario } from "@/interfaces/IUsuario";
import { getStorageItem } from "@/utils/localStore";

export async function postUsuario(usuario: IUsuario, profilePhoto:File) {
  //export async function postUsuario(secretaria: IUsuario, profilePhoto:File) {


  //const token = getStorageItem("token"); 
  // Cria um objeto FormData para enviar o objeto JSON e a imagem
  const formData = new FormData();

  // Converte o objeto `barber` para uma string JSON
  const usuarioJson = JSON.stringify(usuario);

  // Adiciona o JSON e a imagem ao FormData
  formData.append("secretary", usuarioJson);
  formData.append("profilePhoto", profilePhoto, profilePhoto.name);

  try {
    // Faz a requisição usando fetch
    const response = await fetch("https://lmtsteste24.ufape.edu.br/usuario/registrar", {
      method: "POST",
      body: formData,
     // headers: {
     //   "Accept": "*/*",
        // Note que não definimos o "Content-Type" porque o navegador faz isso automaticamente com multipart/form-data
      //  "Authorization": `${token}`,

     // },
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao enviar a requisição:", error);
  }
}
