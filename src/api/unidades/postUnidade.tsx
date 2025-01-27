import api from "@/api/http-common";
import { IUnidade } from "@/interfaces/IUnidade";

export async function postUnidade(data: IUnidade) {

  return await api.post("/unidade-administrativa", data);
}
