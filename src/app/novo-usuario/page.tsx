"use client"
import style from "./page.module.scss";
import Cadastrar from "@/components/Cadastrar";
import { useState } from "react";
import { IUsuario } from "@/interfaces/IUsuario";
const Page = () => {
    const [newUser, setNewUser] = useState<IUsuario | null>(null);

    
   
    return(
        <div className={style.containerNovoUsuario}>
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