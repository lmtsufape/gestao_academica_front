import style from "./header-detalhamento.module.scss";
import { useRouter } from "next/navigation";

interface HeaderDetalhamentoProps {
    diretorioAnterior: string;
    diretorioAtual: string;
    titulo: string;
    hrefAnterior: any;
}

const HeaderDetalhamento : React.FC<HeaderDetalhamentoProps> = ({diretorioAnterior, diretorioAtual, hrefAnterior, titulo}) => {

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
          <div className={style.header__navegacao_guia}>
             <span>{diretorioAnterior} </span><h1>{diretorioAtual}</h1>
          </div>
        </div>
        <div className={style.header__title}>
            <h1>{titulo}</h1>
            <div className={style.header__title_line}></div>
        </div>
        
      </div>
    </>

    
  );
};

export default HeaderDetalhamento;