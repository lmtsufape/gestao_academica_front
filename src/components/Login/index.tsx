"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { getStorageItem, setStorageItem } from "@/utils/localStore";
import { useMutation } from "react-query";
import style from "./login.module.scss";
import Link from "next/link";
import api from "@/api/http-common";
import { setUserLogin } from "@/redux/userLogin/userLoginSlice";
import { postLogin } from "@/api/auth/postLogin";
import { APP_ROUTES } from "@/constants/app-routes";
import { getUsuarioLogado } from "@/api/usuarios/getUsuarioLogado";
import { IUsuario } from "@/interfaces/IUsuario";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { push } = useRouter();
  const dispatch = useDispatch();

  const { mutate: fetchUsuario, data: usuarioData, isError: isUsuarioError } = useMutation(
    getUsuarioLogado,
    {
      onSuccess: (res: any) => {
        setStorageItem("usuario", JSON.stringify(res.data)); // Armazenar usuário no localStorage
         // Redirecionar para a página inicial
         if(getStorageItem("usuario") !== null){
          window.location.href = APP_ROUTES.private.home.name; // Redireciona para a página de login

         }
      },
      onError: () => {
        console.error("Erro ao obter o usuário logado.");
      },
    }
  );

  const { status, mutate: loginMutate } = useMutation(
    async () => postLogin(email, senha),
    {
      onSuccess: (res: any) => {
        // Extrair tokens e dados do login
        const accessToken = res.data.access_token;
        const refreshToken = res.data.refresh_token;
        const tokenType = res.data.token_type;
        const roles = res.data.roles || [];

        // Configurar o cabeçalho Authorization
        api.defaults.headers.authorization = `${tokenType} ${accessToken}`;

        // Armazenar tokens e informações no localStorage
        setStorageItem("token", accessToken);
        setStorageItem("refresh_token", refreshToken);
        setStorageItem("userRoles", JSON.stringify(roles));

        // Atualizar Redux com o e-mail do usuário
        dispatch(setUserLogin(email));
        setStorageItem("userLogin", email);

        // Buscar informações do usuário logado
        fetchUsuario();

       
      },
      onError: (error) => {
        console.error("Erro ao fazer login:", error);
      },
    }
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutate();
  };

  const getEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      loginMutate();
    }
  };

  return (
    <div className={style.login}>
      <div className={style.login__login}>
        <form onSubmit={handleLogin}>
          <h1 className={style.login__login_title}>Entrar</h1>

          <label htmlFor="email" className={style.login__login_label}>
            <p>E-mail</p>
            <input
              type="email"
              name="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={getEnter}
            />
          </label>

          <label htmlFor="senha" className={style.login__login_label}>
            <p>Senha</p>
            <input
              type="password"
              name="senha"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onKeyPress={getEnter}
            />
          </label>

          <Link className={style.login__login_link} href="/recuperarSenha">
            <h2 className={style.login__login_subtitle}>Esqueceu a senha?</h2>
          </Link>

          {status === "error" && (
            <p className={style.login__login_errorLogin}>E-mail ou senha incorretos</p>
          )}

          <button
            type="submit"
            className={`${style.login__login_button} ${
              status === "loading" || status === "success" ? style.active : ""
            }`}
          >
            Entrar
          </button>

          <h2 className={style.login__login_subtitle1}>
            Não possui conta?{" "}
            <Link href="/novo-usuario">
              <span>Crie Agora.</span>
            </Link>
          </h2>
        </form>
      </div>
    </div>
  );
};

export default Login;
