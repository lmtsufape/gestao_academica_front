import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import Tabela from "@/components/Tabela/Estrutura";
import { generica } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const estrutura: any = {
  uri: "pdi/api/v1/meta",

  cabecalho: {
    titulo: "Metas",
    migalha: [
      { nome: "Início", link: "/home" },
      { nome: "PDI", link: "/pdi" },
      { nome: "Metas", link: "/pdi/metas" },
    ],
  },
  tabela: {
    configuracoes: {
      pesquisar: true,
      cabecalho: true,
      rodape: true,
    },
    botoes: [
      // { nome: "Adicionar Meta", chave: "adicionar", tipo: "submit" },
    ],
    colunas: [
      {
        nome: "Código",
        chave: "codigo",
        tipo: "texto",
        selectOptions: null,
        sort: false,
        pesquisar: true,
      },
      {
        nome: "Descrição",
        chave: "descricao",
        tipo: "texto",
        selectOptions: null,
        sort: false,
        pesquisar: false,
      },
      {
        nome: "Objetivo Específico",
        chave: "objetivoEspecifico.codigo",
        tipo: "texto",
        selectOptions: null,
        sort: false,
        pesquisar: false,
      },
      {
        nome: "Objetivo Estratégico",
        chave: "objetivoEspecifico.objetivoEstrategico.codigo",
        tipo: "texto",
        selectOptions: null,
        sort: false,
        pesquisar: false,
      },
      {
        nome: "Ações",
        chave: "acoes",
        tipo: "button",
        selectOptions: null,
        sort: false,
        pesquisar: false,
      },
    ],
    acoes_dropdown: [
      { nome: "Visualizar", chave: "visualizar" },
      // { nome: "Deletar", chave: "deletar" },
    ],
  },
};

export default function TabelaMeta() {
  const router = useRouter();

  const [dados, setDados] = useState<any>({ content: [] });

  const chamarFuncao = (nomeFuncao = "", valor: any = null) => {
    switch (nomeFuncao) {
      case "pesquisar":
        pesquisarRegistro(valor);
        break;
      case "adicionar":
        adicionarRegistro();
        break;
      case "editar":
        editarRegistro(valor);
        break;
      case "visualizar":
        visualizarRegistro(valor);
        break;
      case "deletar":
        deletarRegistro(valor);
        break;
      default:
        break;
    }
  };

  const pesquisarRegistro = async (params = null) => {
    try {
      let body = {
        metodo: "get",
        uri: "/" + estrutura.uri,
        params: params != null ? params : { size: 10, page: 0 },
        data: {},
      };
      const response = await generica(body);
      if (response && response.data.errors != undefined) {
        toast.error("Erro. Tente novamente!", { position: "top-left" });
      } else if (
        response &&
        response.data &&
        response.data.error != undefined
      ) {
        if (response && response.data && response.data.error) {
          toast(response.data.error.message, { position: "top-left" });
        }
      } else {
        if (response && response.data) {
          setDados(response.data);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar os registros:", error);
    } finally {
      setDados([
        {
          id: 1,
          codigo: "001",
          descricao: "Meta 1",
          objetivoEspecifico: {
            codigo: "OE001",
            descricao: "Objetivo Específico 1",
            objetivoEstrategico: {
              codigo: "OE001",
              descricao: "Objetivo Estratégico 1",
            },
          },
        },
      ]);
    }
  };

  const adicionarRegistro = () => {
    router.push("/pdi/metas/criar");
  };
  const editarRegistro = (item: any) => {
    router.push("/pdi/metas/" + item.id + "/editar");
  };

  const visualizarRegistro = (item: any) => {
    console.log("Visualizar registro:", item);
    router.push("/pdi/metas/" + item.id);
  };

  const deletarRegistro = async (item: any) => {
    const confirmacao = await Swal.fire({
      title: `Você deseja deletar a meta ${item.descricao}?`,
      text: "Essa ação não poderá ser desfeita",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A759F",
      cancelButtonColor: "#9F2A1A",

      confirmButtonText: "Sim, quero deletar!",
      cancelButtonText: "Cancelar",

      // Classes personalizadas
      customClass: {
        popup: "my-swal-popup",
        title: "my-swal-title",
        htmlContainer: "my-swal-html",
      },
    });

    if (confirmacao.isConfirmed) {
      try {
        const body = {
          metodo: "delete",
          uri: "/" + estrutura.uri + "/" + item.id,
          params: {},
        };

        const response = await generica(body);
        if (response && response.data && response.data.error) {
          toast.error("Erro. Tente novamente!", { position: "top-left" });
        } else if (response && response.data && response.data.error) {
          toast(response.data.error.message, { position: "top-left" });
        } else {
          pesquisarRegistro();
          Swal.fire({
            title: "A meta foi deletada com sucesso!",
            icon: "success",
            customClass: {
              popup: "my-swal-popup",
              title: "my-swal-title",
              htmlContainer: "my-swal-html",
            },
          });
        }
      } catch (error) {
        console.error("Erro ao deletar registro:", error);
        toast.error("Erro ao deletar registro. Tente novamente!", {
          position: "top-left",
        });
      }
    }
  };

  useEffect(() => {
    chamarFuncao("pesquisar", null);
  }, []);

  return (
    <>
      <Cabecalho dados={estrutura.cabecalho} />
      <Tabela dados={dados} estrutura={estrutura} chamarFuncao={chamarFuncao} />
    </>
  );
}
