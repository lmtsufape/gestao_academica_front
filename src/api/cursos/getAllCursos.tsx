import api from "@/api/http-common";


export const getAllCursos = () => {

    return api.get("/curso");
  };