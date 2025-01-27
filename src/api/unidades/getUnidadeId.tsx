import api from "@/api/http-common";

export async function getUnidadeId(id: string | number | string[] | undefined) {
    return await api.get(`/unidade-administrativa/${id}`);
}