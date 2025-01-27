import api from "@/api/http-common";

export async function deleteUnidadeId(id: string | number | string[] | undefined) {
    return await api.delete(`/unidade-administrativa/${id}`);
}