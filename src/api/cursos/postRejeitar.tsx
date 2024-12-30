import api from "@/api/http-common";

export async function postRejeitar(id: string, parecer: string) {

  return await api.post(`/solicitacao/${id}/rejeitar`, { parecer });
}
