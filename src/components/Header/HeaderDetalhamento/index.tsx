import { APP_ROUTES } from "@/constants/app-routes";
import style from "./header-detalhamento.module.scss";
import { useRouter } from "next/navigation";

interface HeaderDetalhamentoProps {
    diretorioAnterior: string;
    diretorioAtual: string;
    titulo: string;
    hrefAnterior: any;
    fistbutton: string;
    lastbutton: string;
    routefirstbutton: any;
    routelastbutton: any;
}

const HeaderDetalhamento : React.FC<HeaderDetalhamentoProps> = ({diretorioAnterior, diretorioAtual, hrefAnterior, titulo, fistbutton, lastbutton, routefirstbutton, routelastbutton}) => {

  const { push } = useRouter();

  return (
    <>

    <div className={style.header}>
        
        <div className={style.header__navegacao}>
          <div className={style.header__navegacao_voltar} onClick={() => 
              typeof hrefAnterior === 'function' 
                ? hrefAnterior() 
                : typeof hrefAnterior === 'string' 
                  ? push(hrefAnterior) 
                  : null
            }
>
            <img src="/assets/icons/menor_que.svg" alt="Voltar" />
            <h1>Voltar</h1>
          </div>
          <div className={style.header__container}>
         <div className={style.header__container_botoes}>
         <button onClick={() => (
              push(APP_ROUTES.private.cadastrarUsuario.name)
              )}>
              <h1>
                {fistbutton}              
              </h1>
            </button>
            {lastbutton ? (<button onClick={() => (
              push(APP_ROUTES.private.usuarios.name)
              )}>
              <h1>
                {lastbutton}             
              </h1>
            </button>) : ""}
            
          </div>
        </div>
        </div>
        <div className={style.header__title}>
            <h1>{titulo}</h1>
        </div>
        
      </div>
    </>

    
  );
};

export default HeaderDetalhamento;