"use client";
import withAuthorization from "@/components/AuthProvider/withAuthorization";
import Cadastro from "@/components/Cadastro/Estrutura";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import { generica } from "@/utils/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

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
    cabecalho: {
      titulo: "Alocar Colaborador",
      migalha: [
        { nome: 'Início', link: '/home' },
        { nome: 'Gestão Acesso', link: '/gestao-acesso' },
        { nome: "Unidades Administrativas", link: "/gestao-acesso/unidades-administrativas" },
        {
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
    router.push("/gestao-acesso/unidades-administrativas");
  };

  const salvarRegistro = async (item: any) => {
    try {
      if (!id) {
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

      const payload = {
        unidadeAdministrativaId: Number(id),
        usuarioId: item.usuarioId
      };

      const body = {
        metodo: "post",
        uri: `/auth/unidade-administrativa/${id}/colaboradores`,
        params: {},
        data: payload,
      };

      const response = await generica(body);

      if (!response) {
        throw new Error("Sem resposta da API");
      }

      if (response.data?.error) {
        throw new Error(response.data.error.message || "Erro na API");
      }

      await Swal.fire({
        title: "Colaborador alocado com sucesso!",
        icon: "success",
        confirmButtonText: "OK",
      });

      chamarFuncao("voltar");

    } catch (error: any) {
      console.error("Erro completo:", error);
      const errorMessage = error.response?.data?.message ||
        error.message ||
        "Erro ao alocar colaborador";

      toast.error(errorMessage, {
        position: "top-left",
        autoClose: 5000
      });
    }
  };

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

export default withAuthorization(AlocarColaborador);