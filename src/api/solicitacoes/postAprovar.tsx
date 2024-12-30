import api from "@/api/http-common";

export async function postAprovar(id: string, parecer: string) {

  return await api.post(`/solicitacao/${id}/aprovar`, { parecer });
}
