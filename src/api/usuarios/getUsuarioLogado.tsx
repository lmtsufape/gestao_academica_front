import api from "@/api/http-common";


export const getUsuarioLogado = () => {

    return api.get("/usuario/current");
  };