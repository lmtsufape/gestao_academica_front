import api from "@/api/http-common";

export async function patchUnidadeId(id: string | number | string[] | undefined) {
    return await api.patch(`/unidade-administrativa/${id}`);
}