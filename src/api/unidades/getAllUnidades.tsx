import api from "@/api/http-common";


export const getAllUnidades = () => {

    return api.get("/unidade-administrativa");
  };