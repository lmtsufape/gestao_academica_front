"use client"
import { useState } from "react";
import style from "./page.module.scss";
import Cadastrar from "@/components/Cadastrar";
import { ICurso } from "@/interfaces/ICurso";
const Page = () => {
    const [curso, setCurso] = useState<ICurso | null>(null);

    return(
        <div className={style.containerList}>
            <Cadastrar 
                curso={curso}
                backDetalhamento={() => {}}
                titulo={"Cadastrar Curso"}
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