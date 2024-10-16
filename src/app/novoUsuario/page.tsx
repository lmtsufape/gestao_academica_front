import style from "./page.module.scss";
import CadastrarUsuario from "@/components/Usuarios/CadastrarUsuario";
const Page = () => {

    return(
        <div className={style.containerNovoUsuario}>
            <CadastrarUsuario />

        </div>
    )
}

export default Page;