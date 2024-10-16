import api from "@/api/http-common";

export async function postLogin(email: string, senha: string) {
  // Logs para depuração
  console.log('Email:', email);
  console.log('Senha:', senha);

  return await api.post("/auth/login", undefined, {
    params: {
      email: email,
      senha: senha,
    },
  });
}
