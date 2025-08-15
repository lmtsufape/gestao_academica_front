"use client";
import withAuthorization from "@/components/AuthProvider/withAuthorization";
import Cadastro from "@/components/Cadastro/Estrutura";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import Tabela from "@/components/Tabela/Estrutura";
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
import { generica } from "@/utils/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

<<<<<<< Updated upstream
<<<<<<< Updated upstream
const cadastro = () => {
  const router = useRouter();
  const { id } = useParams() as { id: string }; // garante que é string
  const [user, setUser] = useState<any>(null);
  const [colaboradores, setColaboradores] = useState<any>({});


  interface DadosFormulario {
    unidadePaiId?: number;
    usuarioId?: number;
    // Adicione aqui outros campos do seu formulário conforme necessário
  }
  const estrutura: any = {
    uri: "alocar-funcionario",
=======
=======
>>>>>>> Stashed changes
const AlocarColaborador = () => {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const [dadosPreenchidos, setDadosPreenchidos] = useState<any>();
  const [colaboradores, setColaboradores] = useState<any[]>([]);

  const isEditMode = id && id !== "criar";

  const getOptions = (lista: any[], selecionado: any) => {
    if (!Array.isArray(lista)) return [];

    const options = lista.map((colaborador) => ({
      chave: colaborador.id,
      valor: colaborador.nome || colaborador.email
    }));

    if (isEditMode && selecionado) {
      const selectedOption = options.find((opt) => opt.chave === selecionado);
      if (selectedOption) {
        return [selectedOption, ...options.filter((opt) => opt.chave !== selectedId)];
      }
    }
    return options;
  };

  const estrutura = {
    uri: "alocar-colaborador",
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    cabecalho: {
      titulo: "Alocar Colaborador",
      migalha: [
        { nome: 'Início', link: '/home' },
        { nome: 'Gestão Acesso', link: '/gestao-acesso' },
        { nome: "Unidades Administrativas", link: "/gestao-acesso/unidades-administrativas" },
        {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
          nome: "Criar",
          link: `/gestao-acesso/alocar-colaborador`,
        },
      ],
    },
    tabela: {
      configuracoes: {
        pesquisar: true,
        cabecalho: true,
        rodape: true,
      },
      botoes: [{ nome: "Cancelar", chave: "voltar", tipo: "botao" }],
      //Ajustar coluna com as colunas de gestores
      colunas: [ // <-- já define as colunas aqui!
        { nome: "CPF", chave: "gestor.cpf", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
        { nome: "Nome", chave: "gestor.nome", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
        { nome: "E-mail", chave: "gestor.email", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
        { nome: "Siape", chave: "gestor.siape", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
        { nome: "Telefone", chave: "gestor.telefone", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
      ],
      acoes_dropdown: [
        { nome: 'Selecionar', chave: 'selecionar' },
      ],
    }
  };

  /**
   * Chama funções de acordo com o botão clicado
   */
=======
=======
>>>>>>> Stashed changes
          nome: "Alocar Colaborador",
          link: `/gestao-acesso/alocar-colaborador/${isEditMode ? id : "criar"}`,
        },
      ],
    },
    cadastro: {
      campos: [
        {
          line: 1,
          colSpan: "md:col-span-1",
          nome: "Colaborador",
          chave: "usuarioId",
          tipo: "select",
          mensagem: "Selecione o Colaborador",
          obrigatorio: true,
          selectOptions: getOptions(colaboradores, dadosPreenchidos?.usuarioId),
        },
      ],
      acoes: [
        { nome: "Cancelar", chave: "voltar", tipo: "botao" },
        { nome: "Alocar Colaborador", chave: "salvar", tipo: "submit" },
      ],
    },
  };

<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  const chamarFuncao = async (nomeFuncao = "", valor: any = null) => {
    switch (nomeFuncao) {
      case "salvar":
        await salvarRegistro(valor);
        break;
      case "voltar":
        voltarRegistro();
        break;
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
      case "editar":
        editarRegistro(valor);
        break;
>>>>>>> Stashed changes
=======
      case "editar":
        editarRegistro(valor);
        break;
>>>>>>> Stashed changes
      default:
        break;
    }
  };

  const voltarRegistro = () => {
    router.push("/gestao-acesso/unidades-administrativas");
  };

<<<<<<< Updated upstream
<<<<<<< Updated upstream
  /**
   * Salva o registro via POST, transformando os dados para que os itens de endereço
   * fiquem agrupados em um objeto 'endereco'.
   */
  interface DadosSalvamento {
    unidadeAdministrativaId?: number;
    usuarioId?: string;
  }

  const salvarRegistro = async (item: DadosSalvamento) => {
    try {
      // Verifica se estamos no modo de edição e pega o ID da URL
      const unidadeId = id;

      if (!unidadeId) {
=======
  const salvarRegistro = async (item: any) => {
    try {
      if (!id) {
>>>>>>> Stashed changes
=======
  const salvarRegistro = async (item: any) => {
    try {
      if (!id) {
>>>>>>> Stashed changes
        toast.error("Nenhuma unidade administrativa selecionada", {
          position: "top-left"
        });
        return;
      }

      if (!item.usuarioId) {
        toast.error("Selecione um colaborador para alocar", {
          position: "top-left"
        });
        return;
      }

<<<<<<< Updated upstream
<<<<<<< Updated upstream
      // Converte o ID para número (caso seja string)
      const unidadeIdNumber = Number(unidadeId);
      if (isNaN(unidadeIdNumber)) {
        toast.error("ID da unidade administrativa inválido", {
          position: "top-left"
        });
        return;
      }

      // Payload no formato EXATO que a API espera
      const payload = {
        unidadeAdministrativaId: unidadeIdNumber,
        usuarioId: item.usuarioId
      };

      console.log("Payload sendo enviado:", payload); // Para debug

      const body = {
        metodo: "post",
        uri: "/auth/unidade-administrativa/" + id + "/gestores", // Endpoint correto
=======
=======
>>>>>>> Stashed changes
      const payload = {
        unidadeAdministrativaId: Number(id),
        usuarioId: item.usuarioId
      };

      const body = {
        metodo: "post",
        uri: `/auth/unidade-administrativa/${id}/colaboradores`,
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
        params: {},
        data: payload,
      };

      const response = await generica(body);

<<<<<<< Updated upstream
<<<<<<< Updated upstream
      // Tratamento da resposta
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      if (!response) {
        throw new Error("Sem resposta da API");
      }

      if (response.data?.error) {
        throw new Error(response.data.error.message || "Erro na API");
      }

<<<<<<< Updated upstream
<<<<<<< Updated upstream
      // Sucesso
      await Swal.fire({
        title: "Gestor alocado com sucesso!",
=======
      await Swal.fire({
        title: "Colaborador alocado com sucesso!",
>>>>>>> Stashed changes
=======
      await Swal.fire({
        title: "Colaborador alocado com sucesso!",
>>>>>>> Stashed changes
        icon: "success",
        confirmButtonText: "OK",
      });

      chamarFuncao("voltar");

    } catch (error: any) {
      console.error("Erro completo:", error);
<<<<<<< Updated upstream
<<<<<<< Updated upstream

      const errorMessage = error.response?.data?.message ||
        error.message ||
        "Erro desconhecido ao alocar gestor";
=======
      const errorMessage = error.response?.data?.message ||
        error.message ||
        "Erro ao alocar colaborador";
>>>>>>> Stashed changes
=======
      const errorMessage = error.response?.data?.message ||
        error.message ||
        "Erro ao alocar colaborador";
>>>>>>> Stashed changes

      toast.error(errorMessage, {
        position: "top-left",
        autoClose: 5000
      });
    }
  };
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  


  const pesquisarColaboradores = async () => {
    try {
      let tecnicos: any[] = [];
      let professores: any[] = [];

      // Buscar técnicos
      const responseTecnicos = await generica({
        metodo: "get",
        uri: "/auth/tecnico",
        params: { size: 10, page: 0 },
        data: {},
      });

      if (responseTecnicos?.data && !responseTecnicos.data.errors) {
        tecnicos = responseTecnicos.data.content.map((item: any) => ({
          ...item,
          tipo: "Técnico",
        }));
      }

      // Buscar professores
      const responseProfessores = await generica({
        metodo: "get",
        uri: "/auth/professor",
        params: { size: 10, page: 0 },
        data: {},
      });

      if (responseProfessores?.data && !responseProfessores.data.errors) {
        professores = responseProfessores.data.content.map((item: any) => ({
          ...item,
          tipo: "Professor",
        }));
      }

      const uniao = [...tecnicos, ...professores];

      // Adaptando para o formato esperado pela Tabela
      const dadosAdaptados = {
        content: uniao,
        pageable: {
          pageNumber: 0,
          pageSize: 20,
        },
        totalElements: uniao.length,
        totalPages: 1,
        number: 0,
        size: 50,
        sort: { sorted: false, unsorted: true, empty: true },
        numberOfElements: uniao.length,
        first: true,
        last: true,
        empty: false,
      };

      setColaboradores(dadosAdaptados);
    } catch (error) {
      console.error("Erro ao carregar colaboradores:", error);
      toast.error("Erro ao carregar colaboradores!", { position: "top-left" });
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
    pesquisarColaboradores(); // Nova função para buscar todos os gestores
  }, [id]);


=======
=======
>>>>>>> Stashed changes

  const editarRegistro = async (item: string | number) => {
    try {
      const response = await generica({
        metodo: "get",
        uri: `/auth/unidade-administrativa/${item}/colaboradores`,
        params: {},
        data: {},
      });

      if (!response) throw new Error("Resposta inválida do servidor.");

      if (response.data?.errors) {
        Object.keys(response.data.errors).forEach((campoErro) => {
          toast(`Erro em ${campoErro}: ${response.data.errors[campoErro]}`, {
            position: "top-left",
          });
        });
      } else if (response.data?.error) {
        toast.error(response.data.error.message, { position: "top-left" });
      } else {
        setDadosPreenchidos(response.data);
      }
    } catch (error) {
      console.error("Erro ao localizar registro:", error);
      toast.error("Erro ao localizar registro. Tente novamente!", {
        position: "top-left",
        autoClose: 5000
      });
    }
  };

  const pesquisarColaboradores = async () => {
    try {
      const response = await generica({
        metodo: 'get',
        uri: '/auth/colaborador',
        params: {
          size: 50,
          page: 0,
          tipo: 'PROFESSOR,TECNICO' // Filtra apenas professores e técnicos
        },
        data: {}
      });

      if (response?.data?.errors) {
        toast.error("Erro ao carregar colaboradores", { position: "bottom-left" });
      } else {
        setColaboradores(response?.data?.content || []);
      }
    } catch (error) {
      console.error('Erro ao carregar colaboradores:', error);
      toast.error("Falha ao buscar colaboradores", { position: "bottom-left" });
    }
  };

  useEffect(() => {
    pesquisarColaboradores();
    if (isEditMode) {
      editarRegistro(id);
    }
  }, [id]);

<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  return (
    <main className="flex flex-wrap justify-center mx-auto">
      <div className="w-full md:w-11/12 lg:w-10/12 2xl:w-3/4 max-w-6xl p-4 pt-10 md:pt-12 md:pb-12">
        <Cabecalho dados={estrutura.cabecalho} />
<<<<<<< Updated upstream
<<<<<<< Updated upstream
        <div className="rounded-lg shadow-sm p-4 md:p-6 mt-6">
            <Tabela
              dados={colaboradores}
              estrutura={estrutura}
              chamarFuncao={chamarFuncao}
            />
          </div>
=======
=======
>>>>>>> Stashed changes
        <Cadastro
          estrutura={estrutura}
          dadosPreenchidos={dadosPreenchidos}
          setDadosPreenchidos={setDadosPreenchidos}
          chamarFuncao={chamarFuncao}
        />
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      </div>
    </main>
  );
};

<<<<<<< Updated upstream
<<<<<<< Updated upstream
export default withAuthorization(cadastro);
=======
export default withAuthorization(AlocarColaborador);
>>>>>>> Stashed changes
=======
export default withAuthorization(AlocarColaborador);
>>>>>>> Stashed changes
