import Lista from "@/components/Lista";
import style from "./page.module.scss";
import { APP_ROUTES } from "@/constants/app-routes";
const Page = () => {

    return (
        <div className={style.containerList}>
            <Lista
                titulo="Unidades Administrativas"
                hrefAnterior={APP_ROUTES.private.home.name}
                diretorioAnterior="Home /"
                diretorioAtual="Unidades Administrativas"
                firstbutton="Cadastrar Unidade"
                routefirstbutton={APP_ROUTES.private.cadastrarUnidade.name}
                lastbutton=""
                routelastbutton={""}
                table1="Nome"
                table2="Codigo"
                table3=""
                table4=""
                table5="Ações"
            />

        </div>
    )
}

export default Page;