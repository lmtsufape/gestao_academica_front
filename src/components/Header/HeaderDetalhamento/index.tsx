import { APP_ROUTES } from "@/constants/app-routes";
import style from "./header-detalhamento.module.scss";
import { useRouter } from "next/navigation";

interface HeaderDetalhamentoProps {
  diretorioAnterior: string;
  diretorioAtual: string;
  titulo: string;
  hrefAnterior: any;
  firstbutton: string;
  lastbutton: string;
  routefirstbutton: any;
  routelastbutton: any;
}

const HeaderDetalhamento: React.FC<HeaderDetalhamentoProps> = ({ diretorioAnterior, diretorioAtual, hrefAnterior, titulo, firstbutton, lastbutton, routefirstbutton, routelastbutton }) => {

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

              {firstbutton ? (<button onClick={() => (
                push(routefirstbutton)
              )}>
                <h1>
                  {firstbutton}
                </h1>
              </button>
              ) : (
                <div className={style.header__title_guia}>
                  <h1>{diretorioAnterior} <span>{diretorioAtual}</span></h1>
                </div>
              )}
              {lastbutton ? (<button onClick={() => (
                push(routelastbutton)
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