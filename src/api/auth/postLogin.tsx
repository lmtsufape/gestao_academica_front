import api from "@/api/http-common";

export async function postLogin(email: string, senha: string) {

  return await api.post("/auth/login", undefined, {
    params: {
      email: email,
      senha: senha,
    },
  });
}
