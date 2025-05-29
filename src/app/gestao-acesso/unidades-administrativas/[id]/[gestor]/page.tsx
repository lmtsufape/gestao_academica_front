"use client";
import withAuthorization from "@/components/AuthProvider/withAuthorization";
import Cadastro from "@/components/Cadastro/Estrutura";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import { generica } from "@/utils/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const cadastro = () => {
  const router = useRouter();
  const { id } = useParams();
  // Inicializamos com um objeto contendo 'endereco' para evitar problemas
  const [dadosPreenchidos, setDadosPreenchidos] = useState<any>();
  const [UnidadesPai, setUnidadesPai] = useState<any[]>([]);
  const [colaboradores, setColaboradores] = useState<any[]>([]);
  const [user, setUser] = useState<any[]>([]);	

  const isEditMode = id && id !== "criar";
  const getOptions = (lista: any[], selecionado: any) => {
    if (!Array.isArray(lista) || lista.length === 0) return [];
    const options = lista.map((item) => ({
      chave: item.id, // ID do item (numérico, por exemplo)
      valor: item.nome, // Texto exibido no <option>
    }));
    if (isEditMode && selecionado) {
      const selectedId = Number(selecionado); // Converte para número, se necessário
      const selectedOption = options.find((opt) => opt.chave === selectedId);
      if (selectedOption) {
        // Coloca a opção selecionada na frente do array
        return [selectedOption, ...options.filter((opt) => opt.chave !== selectedId)];
      }
    }
    return options;
  };
  const estrutura: any = {
    uri: "alocar-gestor",
    cabecalho: {
      titulo: isEditMode ? "Alocar Gestor" : "Alocar Gestor",
      migalha: [
        { nome: 'Inicio', link: '/home' },
        { nome: 'Gestão Acesso', link: '/gestao-acesso' },
        { nome: "Unidades Administrativas", link: "/gestao-acesso/unidades-administrativas" },
        {
          nome: isEditMode ? "Visualizar" : "Criar",
          link: `/gestao-acesso/alocar-gestor/${isEditMode ? id : "criar"}`,
        },
      ],
    },
    cadastro: {
      campos: [

        {
          line: 1,
          colSpan: "md:col-span-1",
          nome: "Unidade Administrativa",
          chave: "unidadePaiId",
          tipo: "select",
          mensagem: "Selecione a unidade",
          obrigatorio: false,
          selectOptions: getOptions(UnidadesPai, dadosPreenchidos?.unidadePaiId),
          //exibirPara: ["ALUNO"],
          bloqueado: isEditMode,
        },
        {
          line: 1,
          colSpan: "md:col-span-1",
          nome: "Colaborador",
          chave: "usuarioId",
          tipo: "select",
          mensagem: "Selecione colaborador",
          obrigatorio: false,
          selectOptions: getOptions(colaboradores, dadosPreenchidos?.usuarioId),
          //exibirPara: ["ALUNO"],
          bloqueado: isEditMode,
        },
        

      ],
      acoes: [
        { nome: "Cancelar", chave: "voltar", tipo: "botao" },
        { nome: isEditMode ? "Salvar" : "Cadastrar", chave: "salvar", tipo: "submit" },
      ],
    },
  };

  /**
   * Chama funções de acordo com o botão clicado
   */
  const chamarFuncao = async (nomeFuncao = "", valor: any = null) => {
    switch (nomeFuncao) {
      case "salvar":
        await salvarRegistro(valor);
        break;
      case "voltar":
        voltarRegistro();
        break;
      case "editar":
        editarRegistro(valor);
        break;
      default:
        break;
    }
  };

  const voltarRegistro = () => {
    router.push("/gestao-acesso/alocar-gestor");
  };

  /**
   * Salva o registro via POST, transformando os dados para que os itens de endereço
   * fiquem agrupados em um objeto 'endereco'.
   */
  const salvarRegistro = async (item: any,) => {
    try {

      const dadosParaEnviar = {
        usuarioId: item.usuarioId,
      };

      if (item.usuarioId !== undefined && item.usuarioId !== null) {
        dadosParaEnviar.usuarioId = item.usuarioId;
      }

      const body = {
        metodo: "post",
        uri: "/auth/" + `unidade-administrativa/${item.id}/gestores`,
        params: {},
        data: dadosParaEnviar,
      };

      const response = await generica(body);

      // 1) Checar se deu erro no status da resposta
      //    (isso depende de como 'generica' retorna as informações).
      // Exemplo com Axios:
      if (!response || response.status < 200 || response.status >= 300) {
        // Se cair aqui, é porque o status não foi 2xx
        console.error("Status de erro:", response?.status, (response as any)?.statusText || "Status text não disponível");
        if (response) {
          toast(`Erro na requisição (HTTP ${response.status})`, { position: "top-left" });
        } else {
          toast("Erro na requisição: resposta nula", { position: "top-left" });
        }
        return;
      }

      // 2) Checar se existe 'errors' ou 'error' no body
      if (response.data?.errors) {
        Object.keys(response.data.errors).forEach((campoErro) => {
          toast(`Erro em ${campoErro}: ${response.data.errors[campoErro]}`, {
            position: "top-left",
          });
        });
      } else if (response.data?.error) {
        toast(response.data.error.message, { position: "top-left" });
      } else {
        // 3) Se chegou até aqui, é realmente sucesso
        Swal.fire({
          title: "Unidade gestora salvo com sucesso!",
          icon: "success",
          customClass: {
            popup: "my-swal-popup",
            title: "my-swal-title",
            htmlContainer: "my-swal-html",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            chamarFuncao("voltar");
          }
        });
      }
    } catch (error) {
      console.error("Erro ao salvar registro:", error);
      toast.error("Erro ao salvar registro. Tente novamente!", { position: "top-left" });
    }
  };


  /**
   * Localiza o registro para edição e preenche os dados
   */
  const editarRegistro = async (item: any) => {
    try {
      const body = {
        metodo: "get",
        uri: "/auth/" + estrutura.uri + "/" + item,
        params: {},
        data: item,
      };

      const response = await generica(body);
      if (!response) {
        throw new Error("Resposta inválida do servidor.");
      }

      if (response.data?.errors) {
        Object.keys(response.data.errors).forEach((campoErro) => {
          toast(`Erro em ${campoErro}: ${response.data.errors[campoErro]}`, {
            position: "top-left",
          });
        });
      } else if (response.data?.error) {
        toast(response.data.error.message, { position: "top-left" });
      } else {
        const data = response.data;
        // data.endereco existe e tem { cep, logradouro, ... }.
        // Precisamos jogar cada um deles para o "top-level" do estado,

        setDadosPreenchidos(data);
      }
    } catch (error) {
      console.error("Erro ao localizar registro:", error);
      toast.error("Erro ao localizar registro. Tente novamente!", { position: "top-left" });
    }
  };
  const pesquisarUnidadesAdm = async (params = null) => {
    try {
      let body = {
        metodo: 'get',
        uri: '/auth/' + "unidade-administrativa" + "",
        params: params != null ? params : { size: 25, page: 0 },
        data: {}
      }
      const response = await generica(body);
      // Tratamento de erros
      if (response && response.data.errors != undefined) {
        toast("Erro. Tente novamente!", { position: "bottom-left" });
      } else if (response && response.data.error != undefined) {
        toast(response.data.error.message, { position: "bottom-left" });
      } else if (response && response.data) {
        // Filtra os itens para manter somente aqueles sem unidade pai (unidadePaiId nulo ou indefinido)
        //const unidadesSemPai = response.data.filter((item: any) => item.unidadePaiId == null || item.unidadePaiId == undefined || item.unidadePaiId == "");
        setUnidadesPai(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    }
  };
  const pesquisarColaboradores = async (params = null, id = null) => {
    try {
      let body = {
        metodo: 'get',
        uri: '/auth/unidade-administrativa/' + id + "/funcionarios",
        params: params != null ? params : { size: 25, page: 0 },
        data: {}
      }
      const response = await generica(body);
      // Tratamento de erros
      if (response && response.data.errors != undefined) {
        toast("Erro. Tente novamente!", { position: "bottom-left" });
      } else if (response && response.data.error != undefined) {
        toast(response.data.error.message, { position: "bottom-left" });
      } else if (response && response.data) {
        // Filtra os itens para manter somente aqueles sem unidade pai (unidadePaiId nulo ou indefinido)
        setColaboradores(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    }
  };
  const currentUser = async () => {
    try {
      const response = await generica(
        {
          metodo: 'get',
          uri: '/auth/usuario/current',
          data: {}
        }
      );
      if (response?.data?.errors) {
        toast.error("Erro ao carregar dados do usuário!", { position: "top-left" });
      } else {
        setUser(response?.data);
      }
    } catch (error) {
      toast.error('Erro ao carregar dados!', { position: "top-left" });
    }
  };

  // Se estiver em modo de edição, carrega os dados ao montar
  useEffect(() => {
    pesquisarColaboradores();
    pesquisarUnidadesAdm();
    if (id && id !== "criar") {
      chamarFuncao("editar", id);
    }
  }, [id]);

  return (
    <main className="flex flex-wrap justify-center mx-auto">
      <div className="w-full md:w-11/12 lg:w-10/12 2xl:w-3/4 max-w-6xl p-4 pt-10 md:pt-12 md:pb-12">
        <Cabecalho dados={estrutura.cabecalho} />
        <Cadastro
          estrutura={estrutura}
          dadosPreenchidos={dadosPreenchidos}
          setDadosPreenchidos={setDadosPreenchidos}
          chamarFuncao={chamarFuncao}
        />
      </div>
    </main>
  );
};

export default withAuthorization(cadastro);
