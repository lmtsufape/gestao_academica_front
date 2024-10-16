import style from "./page.module.scss";
import ListaUsuarios from "@/components/Usuarios/ListaUsuarios";
const Page = () => {

    return(
        <div className={style.containerList}>
            <ListaUsuarios />

        </div>
    )
}

export default Page;