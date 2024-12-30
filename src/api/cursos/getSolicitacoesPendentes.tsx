import api from "@/api/http-common";


export const getSolicitacoesPendentes = () => {

    return api.get("/solicitacoes/pendentes");
  };