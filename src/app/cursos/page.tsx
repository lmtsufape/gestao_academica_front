import Lista from "@/components/Lista";
import style from "./page.module.scss";
import { APP_ROUTES } from "@/constants/app-routes";
const Page = () => {

    return (
        <div className={style.containerList}>
            <Lista
                titulo="Cursos"
                hrefAnterior={APP_ROUTES.private.home.name}
                diretorioAnterior="Home /"
                diretorioAtual="Cursos"
                firstbutton="Cadastrar Curso"
                routefirstbutton={APP_ROUTES.private.cadastrarCurso.name}
                lastbutton=""
                routelastbutton={""}
                table1="Nome"
                table2=""
                table3=""
                table4=""
                table5="Ações"
            />

        </div>
    )
}

export default Page;