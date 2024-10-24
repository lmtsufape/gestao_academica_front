import style from "./page.module.scss";
import Cadastrar from "@/components/Cadastrar";
const Page = () => {

    return(
        <div className={style.containerList}>
            <Cadastrar />
        </div>
    )
}

export default Page;