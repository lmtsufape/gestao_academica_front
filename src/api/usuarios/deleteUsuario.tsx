import api from "@/api/http-common";

export async function deleteUsuario(id: string | string[] | undefined) {
    return await api.delete(`/usuario/${id}`);
}