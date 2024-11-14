import api from "@/api/http-common";


export const getAllSolicitacoes = () => {

    return api.get("/solicitacoes");
  };