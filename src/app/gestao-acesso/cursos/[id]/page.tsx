"use client";
import withAuthorization from "@/components/AuthProvider/withAuthorization";
import Cadastro from "@/components/Cadastro/Estrutura";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useEnderecoByCep } from "@/utils/brasilianStates";
import { generica } from "@/utils/api";

const cadastro = () => {
  const router = useRouter();
  const { id } = useParams();

  const [dadosPreenchidos, setDadosPreenchidos] = useState<any>({ endereco: {} });
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
    uri: "curso",
    cabecalho: {
      titulo: isEditMode ? "Editar Curso" : "Cadastrar Curso",
      migalha: [
        { nome: 'Início', link: '/home' },
        { nome: 'Gestão Acesso', link: '/gestao-acesso' },
        { nome: "Curso", link: "/gestao-acesso/cursos" },
        {
          nome: isEditMode ? "Editar" : "Criar",
          link: `/gestao-acesso/cursos/${isEditMode ? id : "criar"}`,
        },
      ],
    },
    cadastro: {
      campos: [
        // Linha 1
        {
          line: 1,
          colSpan: "md:col-span-1",
          nome: "Nome",
          chave: "nome",
          tipo: "text",
          mensagem: "Digite o nome do curso",
          obrigatorio: true,
          minLength: 1,
          maxLength: 100,
          validacao: (valor: string) => {
            if (!valor || valor.trim().length === 0) {
              return "O nome do curso é obrigatório";
            }
            if (valor.length > 100) {
              return "O nome do curso deve ter no máximo 100 caracteres";
            }
            if (valor.length < 1) {
              return "O nome do curso deve ter pelo menos 1 caractere";
            }
            return null;
          }
        },
        {
          line: 1,
          colSpan: "md:col-span-1",
          nome: "Quantidade de Períodos",
          chave: "numeroPeriodos",
          tipo: "number",
          mensagem: "Digite a quantidade de períodos",
          obrigatorio: true,
          min: 1,
          step: 1,
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
    router.push("/gestao-acesso/cursos");
  };

  /**
   * Salva o registro via POST, transformando os dados para que os itens de endereço
   * fiquem agrupados em um objeto 'endereco'.
   */
  const salvarRegistro = async (item: any) => {
    // Validação do nome
    if (!item.nome || item.nome.trim().length === 0) {
      toast.error("O nome do curso é obrigatório", {
        position: "top-left",
      });
      return;
    }

    if (item.nome.length > 100) {
      toast.error("O nome do curso deve ter no máximo 100 caracteres", {
        position: "top-left",
      });
      return;
    }

    if (item.nome.length < 1) {
      toast.error("O nome do curso deve ter pelo menos 1 caractere", {
        position: "top-left",
      });
      return;
    }

    const numero = Number(item.numeroPeriodos);
    if (!Number.isFinite(numero) || numero <= 0) {
      toast.error("A quantidade de períodos deve ser um número maior que zero!", {
        position: "top-left",
      });
      return;
    }

    try {
      const body = {
        metodo: `${isEditMode ? "patch" : "post"}`,
        uri: "/auth/" + `${isEditMode ? estrutura.uri + "/" + item.id : estrutura.uri}`,
        params: {},
        data: item,
      };
      const response = await generica(body);

      if (!response || response.status < 200 || response.status >= 300) {
        if (response) {
          console.error("DEBUG: Status de erro:", response.status, 'statusText' in response ? response.statusText : "Sem texto de status");
        }
        return;
      }

      if (response.data?.errors) {
        Object.keys(response.data.errors).forEach((campoErro) => {
          const mensagemErro = Array.isArray(response.data.errors[campoErro])
            ? response.data.errors[campoErro].join(', ')
            : response.data.errors[campoErro];

          toast.error(`Erro em ${campoErro}: ${mensagemErro}`, {
            position: "top-left",
          });
        });
      } else if (response.data?.error) {
        // Captura mensagens de erro específicas do servidor
        const mensagemErro = response.data.error.message || response.data.error;
        toast.error(mensagemErro, { position: "top-left" });
      } else if (response.data?.message) {
        // Se o servidor retornar uma mensagem específica
        toast.error(response.data.message, { position: "top-left" });
      } else {
        Swal.fire({
          title: "Curso salvo com sucesso!",
          icon: "success",
          customClass: {
            popup: "my-swal-popup",
            title: "my-swal-title",
            htmlContainer: "my-swal-html",
          },
          confirmButtonColor: "#125371", // Cor de fundo do botão
          confirmButtonText: "OK", // Texto do botão
        }).then((result) => {
          if (result.isConfirmed) {
            chamarFuncao("voltar");
          }
        });
      }
    } catch (error: any) {
      console.error("DEBUG: Erro ao salvar registro:", error);

      if (error.response?.data) {
        const errorData = error.response.data;

        if (errorData.errors) {
          Object.keys(errorData.errors).forEach((campoErro) => {
            const mensagemErro = Array.isArray(errorData.errors[campoErro])
              ? errorData.errors[campoErro].join(', ')
              : errorData.errors[campoErro];

            toast.error(`Erro em ${campoErro}: ${mensagemErro}`, {
              position: "top-left",
            });
          });
        } else if (errorData.error) {
          toast.error(errorData.error.message || errorData.error, {
            position: "top-left"
          });
        } else if (errorData.message) {
          toast.error(errorData.message, { position: "top-left" });
        }
      } else {
        toast.error("Erro ao salvar registro. Tente novamente!", {
          position: "top-left"
        });
      }
    }
  };

  const editarRegistro = async (item: any) => {
    try {
      const body = {
        metodo: "get",
        uri: "/auth/" + estrutura.uri + "/" + item,
        params: {},
        data: item,
      };
      const response = await generica(body);
      if (!response) throw new Error("Resposta inválida do servidor.");

      if (response.data?.errors) {
        Object.keys(response.data.errors).forEach((campoErro) => {
          const mensagemErro = Array.isArray(response.data.errors[campoErro])
            ? response.data.errors[campoErro].join(', ')
            : response.data.errors[campoErro];

          toast.error(`Erro em ${campoErro}: ${mensagemErro}`, {
            position: "top-left",
          });
        });
      } else if (response.data?.error) {
        toast.error(response.data.error.message || response.data.error, {
          position: "top-left"
        });
      } else {
        setDadosPreenchidos(response.data);
      }
    } catch (error: any) {
      console.error("DEBUG: Erro ao localizar registro:", error);

      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.error) {
          toast.error(errorData.error.message || errorData.error, {
            position: "top-left"
          });
        } else if (errorData.message) {
          toast.error(errorData.message, { position: "top-left" });
        }
      } else {
        toast.error("Erro ao localizar registro. Tente novamente!", {
          position: "top-left"
        });
      }
    }
  };

  useEffect(() => {
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