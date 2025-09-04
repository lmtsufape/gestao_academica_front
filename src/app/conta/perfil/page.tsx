"use client";

import withAuthorization from '@/components/AuthProvider/withAuthorization';
import Cabecalho from '@/components/Layout/Interno/Cabecalho';
import Cadastro from '@/components/Cadastro/Estrutura';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { generica } from '@/utils/api';
import Swal from 'sweetalert2';
import { useAuthService } from "@/app/authentication/auth.hook";

const PagePerfil = () => {
  const { id } = useParams();
  const router = useRouter();
  const isEditMode = id && id !== "criar";
  const [cursos, setCursos] = useState<any[]>([]);
  const [dadosPreenchidos, setDadosPreenchidos] = useState<any>({});
  const [editando, setEditando] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const auth = useAuthService();

  const getOptions = (lista: any[], selecionado: any) => {
    if (!Array.isArray(lista) || lista.length === 0) return [];
    const options = lista.map((item) => ({
      chave: item.id,
      valor: item.nome,
    }));
    if (isEditMode && selecionado) {
      const selectedId = Number(selecionado);
      const selectedOption = options.find((opt) => opt.chave === selectedId);
      if (selectedOption) {
        return [selectedOption, ...options.filter((opt) => opt.chave !== selectedId)];
      }
    }
    return options;
  };

  const currentUser = async () => {
    try {
      setCarregando(true);

      const baseResponse = await generica({
        metodo: "get",
        uri: "/auth/usuario/current",
        data: {}
      });

      if (baseResponse?.data?.errors) {
        toast.error("Erro ao carregar dados do usuário!", { position: "top-left" });
        return;
      }

      const base = baseResponse.data || {};

      let merged = base;
      if (!auth.isAdmin())
        merged = await pesquisarUsuario(merged);

      setDadosPreenchidos(merged);
    } catch (error) {
      toast.error("Erro ao carregar dados do usuário!", { position: "top-left" });
    } finally {
      setCarregando(false);
    }
  };





  // Buscar cursos (se necessário)
  const fetchCursos = async () => {
    try {
      const response = await generica({
        metodo: 'get',
        uri: 'gestao-acesso/cursos', // Ajuste a URI conforme sua API
        data: {}
      });
      if (response?.data) {
        setCursos(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
    }
  };

  const getAcoes = () => {
    if (editando) {
      return [
        {
          nome: "Cancelar",
          chave: "cancelar",
          tipo: "botao",
        },
        {
          nome: "Salvar",
          chave: "salvar",
          tipo: "submit",
        },
      ];
    }

    return [
      {
        nome: "Voltar",
        chave: "voltar",
        tipo: "botao",
      },
      {
        nome: "Editar",
        chave: "editar",
        tipo: "submit",
      },
    ];
  };


  const estrutura: any = {
    uri: "perfil",
    cabecalho: {
      titulo: "Perfil",
      migalha: [
        { nome: 'Home', link: '/home' },
        { nome: 'Perfil', link: '/conta/perfil' },
      ]
    },
    cadastro: {
      campos: [
        {
          line: 1,
          colSpan: "md:col-span-1",
          nome: "Foto Perfil",
          chave: "perfil.fotoPerfil",
          tipo: "foto",
          mensagem: "Anexe a foto",
          obrigatorio: false,
          bloqueado: !editando,
        },
        {
          line: 2,
          colSpan: "md:col-span-1",
          nome: "Nome",
          chave: "nome",
          tipo: "text",
          bloqueado: !editando
        },
        {
          line: 2,
          colSpan: "md:col-span-1",
          nome: "Nome Social",
          chave: "nomeSocial",
          tipo: "text",
          bloqueado: !editando
        },
        {
          line: 3,
          colSpan: "md:col-span-1",
          nome: "E-mail",
          chave: "email",
          tipo: "text",
          bloqueado: true,
          somenteLeitura: true,
        },
        {
          line: 3,
          colSpan: "md:col-span-1",
          nome: "CPF",
          chave: "cpf",
          tipo: "text",
          bloqueado: true,
          somenteLeitura: true,
          mascara: "cpf"
        },
        {
          line: 3,
          colSpan: "md:col-span-1",
          nome: "Telefone",
          chave: "telefone",
          tipo: "text",
          bloqueado: !editando,
          mascara: "celular"
        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "Matrícula",
          chave: "matricula",
          tipo: "text",
          exibirPara: ["ALUNO"],
          bloqueado: true
        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "Curso",
          chave: "curso.nome",
          tipo: "text",
          bloqueado: true,
          exibirPara: ["ALUNO"],
        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "Cursos",
          chave: "perfil.cursos",
          tipo: "multi-select",
          bloqueado: true,
          exibirPara: ["PROFESSOR"],
          multiple: true,
        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "SIAPE",
          chave: "perfil.siape",
          tipo: "text",
          bloqueado: true,
          exibirPara: ["GESTOR", "TECNICO", "PROFESSOR"],
        },

      ],
      acoes: getAcoes(),
    },
  };

  const chamarFuncao = async (nomeFuncao = "", valor: any = null) => {
    switch (nomeFuncao) {
      case "salvar":
        await salvarRegistro(valor);
        break;
      case "voltar":
        router.push("/home");
        break;
      case "editar":
        setEditando(true);
        break;
      case "cancelar":
        setEditando(false);
        currentUser();
        break;
      default:
        break;
    }
  };

  const pesquisarUsuario = async (base: any) => {
    let merged = base;
    let tipo = "";
    let userId = base.id;
    if (auth.isProfessor()) tipo = "professor";
    else if (auth.isTecnico()) tipo = "tecnico";
    else if (auth.isGestor()) tipo = "gestor";
    else if (auth.isAluno()) { tipo = "aluno"; userId = "current"; };
    const response = await generica({
      metodo: "get",
      uri: `/auth/${tipo}/${userId}`,
      data: {}
    });
    console.log("aqui", tipo, userId);
    if (response?.data && !response.data.errors) {
      merged = {
        ...base,
        ...response.data,
        perfil: {
          ...(base.perfil || {}),
          ...(response.data.perfil || {}),
        },
      };
    }
    return merged;
  }

  const salvarRegistro = async (item: any) => {
    try {
      setCarregando(true);

      const payload = {
        nome: item.nome,
        nomeSocial: item.nomeSocial,
        telefone: item.telefone,
        perfil: {
          ...item.perfil,
          fotoPerfil: item.perfil?.fotoPerfil,
          matricula: item.perfil?.matricula,
          siape: item.perfil?.siape,
          curso: item.perfil?.curso?.id ? { id: item.perfil.curso.id } : null,
          cursos: item.perfil?.cursos?.map((curso: any) => ({ id: curso.id })) || []
        }
      };

      const response = await generica({
        metodo: "patch",
        uri: `/auth/usuario`,
        data: payload,
      });

      if (response?.data?.errors) {
        Object.values(response.data.errors).forEach((erro: any) =>
          toast.error(erro, { position: "top-left" })
        );
      } else {
        Swal.fire({
          title: "Perfil atualizado com sucesso!",
          icon: "success"
        }).then(async () => {
          setEditando(false);
          let merged = response.data || item;
          if (!auth.isAdmin())
            merged = await pesquisarUsuario(merged);

          setDadosPreenchidos(merged);

        });
      }
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      toast.error(
        error.response?.data?.message || "Erro ao salvar registro!",
        { position: "top-left" }
      );
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    currentUser();
    fetchCursos(); // Busca cursos se necessário
  }, []);

  if (carregando && !dadosPreenchidos.id) {
    return (
      <main className="flex flex-wrap justify-center mx-auto">
        <div className="w-full sm:w-11/12 2xl:w-10/12 p-4 sm:p-6 md:p-8 lg:p-12 2xl:p-20 pt-7 md:pt-8 md:pb-8">
          <div className="flex justify-center items-center h-64">
            <p>Carregando...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-wrap justify-center mx-auto">
      <div className="w-full sm:w-11/12 2xl:w-10/12 p-4 sm:p-6 md:p-8 lg:p-12 2xl:p-20 pt-7 md:pt-8 md:pb-8 ">
        <Cabecalho dados={estrutura.cabecalho} />
        <Cadastro
          estrutura={estrutura}
          dadosPreenchidos={dadosPreenchidos}
          setDadosPreenchidos={setDadosPreenchidos}
          chamarFuncao={chamarFuncao}
          carregando={carregando}
        />
      </div>
    </main>
  );
}

export default withAuthorization(PagePerfil);