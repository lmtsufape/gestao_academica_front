"use client"
import { useState } from "react";
import style from "./page.module.scss";
import Cadastrar from "@/components/Cadastrar";
import { IUsuario } from "@/interfaces/IUsuario";
const Page = () => {
    const [newUser, setNewUser] = useState<IUsuario | null>(null);

    return(
        <div className={style.containerList}>
            <Cadastrar 
            
                usuario={newUser}
                backDetalhamento={() => {}}
                titulo={""}
                hrefAnterior={""}
                diretorioAnterior={""}
                diretorioAtual={""}
                firstbutton={""}
                routefirstbutton={""}
                lastbutton={""}
                routelastbutton={""}
            />
        </div>
    )
}

export default Page;