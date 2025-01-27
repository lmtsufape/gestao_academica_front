"use client"
import { APP_ROUTES } from "@/constants/app-routes";
import style from "./page.module.scss";
import Lista from "@/components/Lista";
import Detalhar from "@/components/Detalhar";
import { useEffect, useState } from "react";
import { IUsuario } from "@/interfaces/IUsuario";
import { useMutation } from "react-query";
import { getUsuarioLogado } from "@/api/usuarios/getUsuarioLogado";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
const Page = () => {

    const [usuario, setUsuario] = useState<IUsuario[]>([]);
    const { push } = useRouter();

    const { mutate } = useMutation(() => getUsuarioLogado(), {
        onSuccess: (res) => {
            // Ajuste conforme a estrutura da sua resposta
            setUsuario(res.data);
            // setTotalPages(res.data.totalPages);
        },
        onError: (error) => {
            toast.error("Erro ao carregar usuario!");

            console.error("Erro ao recuperar os usuários:", error);
        },
    });
    useEffect(() => {
        mutate();
    }, []);
    const handleBackHome = () => {
        push(APP_ROUTES.private.home.name);

    };
    return (
        <div className={style.containerList}>
            <Detalhar
                usuario={usuario}
                titulo={"Meu Perfil"}
                backDetalhamento={handleBackHome}

                hrefAnterior={APP_ROUTES.private.home.name}
                diretorioAnterior={"Home / "}
                diretorioAtual={"Perfil"}
                firstbutton={""}
                routefirstbutton={""}
                lastbutton={""}
                routelastbutton={""}
            />

        </div>
    )
}

export default Page;