"use client";

import style from "./page.module.scss";
import { useMutation } from "react-query";
import { IUsuario } from "@/interfaces/IUsuario";
import { APP_ROUTES } from "@/constants/app-routes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cadastrar from "@/components/Cadastrar";
import { getUsuarioLogado } from "@/api/usuarios/getUsuarioLogado";

const Page = () => {

    const { push } = useRouter();
    const [usuarioLogado, setUsuarioLogado] = useState<IUsuario | null>(null);

    const { mutate } = useMutation(
        async () => {

            return getUsuarioLogado();
        }, {
        onSuccess: (res) => {
            setUsuarioLogado(res.data);
        },
        onError: (error) => {
            console.log("Erro ao carregar usuario logado.", error);
        },
    }
    );
    useEffect(() => {
        if (!usuarioLogado) {
            mutate();
        }
    }, []);
    return (
        <div className={style.containerNovoUsuario}>
            <Cadastrar 
                usuario={usuarioLogado}
                backDetalhamento={() => { push(APP_ROUTES.private.home.name) }}
                titulo={"Solicitar Perfil de Acesso"}
                hrefAnterior={APP_ROUTES.private.home.name}
                diretorioAnterior={"Home / "}
                diretorioAtual={"Solicitar Perfil"}
                firstbutton={""}
                routefirstbutton={""}
                lastbutton={""}
                routelastbutton={""}/>
        </div>
    )
}

export default Page;