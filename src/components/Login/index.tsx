"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setStorageItem } from "@/utils/localStore";
import { useMutation } from "react-query";
import style from "./login.module.scss";
import Link from "next/link";
import api from "@/api/http-common";
import { setUserLogin } from "@/redux/userLogin/userLoginSlice";
import { postLogin } from "@/api/auth/postLogin";
import { APP_ROUTES } from "@/constants/app-routes";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { push } = useRouter();

  const dispatch = useDispatch();

  const { status, mutate } = useMutation(
    async () => {
      return postLogin(email, senha);
    },
    {
      onSuccess: (res: any) => {

        // Extrair os tokens e o tipo de token da resposta
        const accessToken = res.data.access_token;
        const refreshToken = res.data.refresh_token;
        const tokenType = res.data.token_type; // Geralmente 'Bearer'
        const roles = res.data.roles || []; // Supondo que as roles estejam em 'res.data.roles'
        // Configurar o header Authorization com o tipo de token
        api.defaults.headers.authorization = `${tokenType} ${accessToken}`;

        // Armazenar os tokens no localStorage
        setStorageItem("token", accessToken);
        setStorageItem("refresh_token", refreshToken);

        // Armazenar informações do usuário
        dispatch(setUserLogin(email));
        setStorageItem("userLogin", email);

        // Armazenar as roles do usuário no localStorage
        setStorageItem("userRoles", JSON.stringify(roles));

        // Redirecionar para a página inicial
        push(APP_ROUTES.private.home.name);
      },
      onError: (error) => {
        console.log("Erro ao fazer o login de usuário", error);
      },
    }
  );

  const getEnter = (e: any) => {
    if (e.key === "Enter") {
      mutate();
    }
  };

  return (
    <div className={style.login}>
      <div className={style.login__login}>
        <form onSubmit={(e) => { e.preventDefault(); mutate(); }}>
          <h1 className={style.login__login_title}>Entrar</h1>
          
          <label htmlFor="email" className={style.login__login_label}>
            <p>E-mail</p>
            <input
              type="email"
              name="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            />
          </label>

          <Link className={style.login__login_link} href="/recuperarSenha">
            <h2 className={style.login__login_subtitle}>Esqueceu a senha?</h2>
          </Link>

          {status === "error" ? (
            <p className={style.login__login_errorLogin}>E-mail ou senha incorretos</p>
          ) : null}

          <button
            className={`${style.login__login_button} ${
              status === "loading" || status === "success" ? style.active : ""
            }`}
            onClick={() => mutate()}
          >
            Entrar
          </button>

          <h2 className={style.login__login_subtitle1}>
            Não possui conta? &nbsp;
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
