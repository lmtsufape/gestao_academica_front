import api from "@/api/http-common";

export async function postCurso(data: string) {

  return await api.post("/curso/registrar", data);
}
