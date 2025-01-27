"use client"
import { useState } from "react";
import style from "./page.module.scss";
import Cadastrar from "@/components/Cadastrar";
import { IUnidade } from "@/interfaces/IUnidade";
const Page = () => {
    const [unidade, setUnidade] = useState<IUnidade | null>(null);

    return(
        <div className={style.containerList}>
            <Cadastrar 
            
                unidade={unidade}
                backDetalhamento={() => {}}
                titulo={"Cadastrar Unidade Administrativa"}
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