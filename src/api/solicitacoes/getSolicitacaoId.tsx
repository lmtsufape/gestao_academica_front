import api from "@/api/http-common";

export async function getSolicitacaoId(id: string | number | string[] | undefined) {
    return await api.get(`/solicitacao/${id}`);
}