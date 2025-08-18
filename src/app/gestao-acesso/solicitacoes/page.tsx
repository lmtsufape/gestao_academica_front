"use client";
import withAuthorization from '@/components/AuthProvider/withAuthorization';
import Cabecalho from '@/components/Layout/Interno/Cabecalho';
import Tabela from '@/components/Tabela/Estrutura';
import { generica } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { AccountCircleOutlined } from '@mui/icons-material';
import { useRole } from '@/context/roleContext';

const PageLista = () => {
  const router = useRouter();
  const [dados, setDados] = useState({ content: [] });
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Obtenha activeRole e userRoles do contexto
  const { activeRole, userRoles } = useRole();

  // Verifique se o usuário é privilegiado com base na role ativa
  const isPrivileged = activeRole === "administrador";

  const estrutura = {
    uri: "solicitacao", // Caminho base
    cabecalho: {
      titulo: isPrivileged ? "Gerenciar Solicitações" : "Minhas Solicitações",
      migalha: [
        { nome: 'Início', link: '/home' },
        { nome: 'Gestão Acesso', link: '/gestao-acesso' },
        { nome: 'Solicitações', link: '/gestao-acesso/solicitacoes' },
      ],
    },
    tabela: {
      configuracoes: {
        pesquisar: true,
        cabecalho: true,
        rodape: true,
      },
      botoes: [
        { nome: 'Solicitar Novo Perfil', chave: 'adicionar', bloqueado: false },
      ],
      colunas: [
        { nome: "Nome do Solicitante", chave: "solicitante.nome", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
        { nome: "CPF", chave: "solicitante.cpf", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
        { nome: "Perfil", chave: "perfilSolicitado", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
        {
          nome: "Status",
          chave: "status",
          tipo: "boolean",
          selectOptions: [
            { chave: "APROVADA", valor: "Aprovada" },
            { chave: "PENDENTE", valor: "Pendente" },
            { chave: "REJEITADA", valor: "Rejeitada" },
          ],
          sort: false,
          pesquisar: true,
        },
        { nome: "ações", chave: "acoes", tipo: "button", selectOptions: null, sort: false, pesquisar: false },
      ],
      acoes_dropdown: [
        { nome: 'Visualizar', chave: 'editar' },
      ],
    },
  };

  const chamarFuncao = (nomeFuncao = "", valor: any = null) => {
    switch (nomeFuncao) {
      case 'pesquisar':
        pesquisarRegistro(valor);
        break;
      case 'adicionar':
        adicionarRegistro();
        break;
      case 'editar':
        editarRegistro(valor);
        break;
      case 'deletar':
        deletarRegistro(valor);
        break;
      default:
        break;
    }
  };

  const pesquisarRegistro = async (params?: any, routeOverride?: string) => {
    try {
      const respUser = await generica({
        metodo: 'get',
        uri: '/auth/usuario/current',
        params: {},
        data: {},
      });

      if (!respUser?.data?.id) {
        toast.error('Usuário não encontrado.', { position: 'top-left' });
        return;
      }

      const userId = respUser.data.id;

      const routeToFetch =
        routeOverride ??
        (isPrivileged ? 'pendentes' : `${userId}/usuario`);

      // garante paginação correta
      const queryParams = {
        size: params?.size ?? 10,
        page: params?.page ?? 0,
      };

      const respRegs = await generica({
        metodo: 'get',
        uri: `/auth/${estrutura.uri}/${routeToFetch}`,
        params: queryParams,
        data: {},
      });

      if (respRegs?.data) {
        setDados(respRegs.data);
      }
    } catch (err) {
      console.error('Erro ao carregar registros:', err);
      toast.error('Erro inesperado ao carregar registros.', { position: 'bottom-left' });
    }
  };



  const adicionarRegistro = () => {
    router.push('/gestao-acesso/solicitacoes/criar');
  };

  const editarRegistro = (item: any) => {
    router.push('/gestao-acesso/solicitacoes/' + item.id);
  };

  const deletarRegistro = async (item: any) => {
    const confirmacao = await Swal.fire({
      title: `Você deseja deletar a solicitação ${item.solicitante.nome}?`,
      text: "Essa ação não poderá ser desfeita",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A759F",
      cancelButtonColor: "#9F2A1A",
      confirmButtonText: "Sim, quero deletar!",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "my-swal-popup",
        title: "my-swal-title",
        htmlContainer: "my-swal-html",
      },
    });

    if (confirmacao.isConfirmed) {
      try {
        const body = {
          metodo: 'delete',
          uri: `/auth/${estrutura.uri}/${item.id}`,
          params: {},
          data: {},
        };

        const response = await generica(body);
        if (response && response.data && response.data.errors) {
          toast.error("Erro. Tente novamente!", { position: "top-left" });
        } else if (response && response.data && response.data.error) {
          toast.error(response.data.error.message, { position: "top-left" });
        } else {
          pesquisarRegistro();
          Swal.fire({
            title: "Solicitação deletada com sucesso!",
            icon: "success",
            customClass: {
              popup: "my-swal-popup",
              title: "my-swal-title",
              htmlContainer: "my-swal-html",
            },
          });
        }
      } catch (error) {
        console.error('Erro ao deletar registro:', error);
        toast.error("Erro ao deletar registro. Tente novamente!", { position: "top-left" });
      }
    }
  };

  // Refazer a pesquisa sempre que activeRole ou userRoles mudarem
  useEffect(() => {
    if (activeRole && userRoles.length > 0) {
      const routeToFetch = isPrivileged ? "pendentes" : "usuario";
      pesquisarRegistro(null, routeToFetch);
    }
  }, [activeRole, userRoles, isPrivileged]);

  // Crie uma versão atualizada da estrutura removendo o botão "Adicionar" se a role ativa for "administrador"
  const updatedEstrutura = {
    ...estrutura,
    tabela: {
      ...estrutura.tabela,
      botoes: activeRole === "administrador" ? [] : estrutura.tabela.botoes,
    },
  };

  return (
    <main className="flex flex-wrap justify-center mx-auto">
      <div className="w-full sm:w-11/12 2xl:w-10/12 p-4 sm:p-6 md:p-8 lg:p-12 :p-16 2xl:p-20 pt-7 md:pt-8 md:pb-8 ">
        <Cabecalho dados={estrutura.cabecalho} />
        <Tabela
          dados={dados}
          estrutura={estrutura}
          chamarFuncao={chamarFuncao}
        />
      </div>
    </main>
  );
};

export default withAuthorization(PageLista);
