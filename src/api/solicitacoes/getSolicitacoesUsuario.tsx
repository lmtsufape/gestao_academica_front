import api from "@/api/http-common";


export const getSolicitacoesUsuario = () => {

    return api.get("/solicitacoes/usuario");
  };