"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Person,
  Group,
  Payment,
  CalendarMonth,
  CardGiftcard,
  Assessment,
  Add,
  Speed,
  Info,
  Schedule,
  AccountBalance,
  Assignment,
} from "@mui/icons-material";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import ModuloCard from "@/components/Layout/Interno/ModuloCard";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { useAuthService } from "../authentication/auth.hook";
import { generica } from "@/utils/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function PraeHome() {
  const router = useRouter();
  const { session } = useAuth();
  const auth = useAuthService();
  const [isAluno, setisAluno] = useState<boolean>(false);
  const [isProfessor, setisProfessor] = useState<boolean>(false);
  const [isTecnico, setisTecnico] = useState<boolean>(false);
  const [isPraeAccess, setisPraeAccess] = useState<boolean>(false);
  const [isProfissional, setisProfissional] = useState<boolean>(false);
  const [isGestor, setisGestor] = useState<boolean>(false);

  useEffect(() => {
    if (!auth.isLoading) {
      setisAluno(auth.isAluno());
      setisProfissional(auth.isProfissional());
      setisProfessor(auth.isProfessor());
      setisTecnico(auth.isTecnico());
      setisPraeAccess(auth.isPraeAccess());
      setisGestor(auth.isGestor());
    }
  }, [auth.isAuthenticated, auth.isLoading]);

  useEffect(() => {
    if (isAluno) {
      buscarEstudanteAtual();
      console.log("DEBUG: Verificando estudante atual");
    }

    if ((isProfessor || isTecnico || isGestor) && !isPraeAccess) {
      redirectNoPraeAccess();
    }

    if ((isProfessor || isTecnico) && !isProfissional && isPraeAccess) {
      criarProfissional();
    }
  }, [isAluno, isProfessor, isTecnico, isProfissional, isPraeAccess, isGestor]);

  const buscarEstudanteAtual = async () => {
    try {
      const body = {
        metodo: "get",
        uri: "/prae/estudantes/current",
        params: {},
      };
      const response = await generica(body);
      if (!response) throw new Error("Resposta inválida do servidor.");
      if (response.status === 404) {
        criarEstudante();
        return;
      }
    } catch (error) {
      console.error("DEBUG: Erro ao localizar registro:", error);
      alert("Erro ao localizar registro. Tente novamente!");
      toast.error("Erro ao localizar registro. Tente novamente!", {
        position: "top-left",
      });
    }
  };

  const redirectNoPraeAccess = () => {
    Swal.fire({
      title: "Acesso não autorizado",
      text:
        "Você não tem permissão para acessar todas as funcionalidades da PRAE. " +
        "Por favor, entre em contato com o administrador do sistema.",
      icon: "error",
      confirmButtonText: "OK",
    }).then(() => {});
  };

  const criarEstudante = async () => {
    Swal.fire({
      title: "Para usar o módulo da Prae conclua seu cadastro!",
      icon: "warning",
      customClass: {
        popup: "my-swal-popup",
        title: "my-swal-title",
        htmlContainer: "my-swal-html",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/prae/estudantes/criar");
      }
    });
  };
  const criarProfissional = async () => {
    Swal.fire({
      title: "Para usar o módulo da Prae conclua seu cadastro!",
      icon: "warning",
      customClass: {
        popup: "my-swal-popup",
        title: "my-swal-title",
        htmlContainer: "my-swal-html",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/prae/profissionais/criar");
      }
    });
  };

  const cabecalho = {
    titulo: "PRAE - Pró-Reitoria de Assuntos Estudantis",
    migalha: [
      { nome: "Início", link: "/home" },
      { nome: "PRAE", link: "/prae" },
    ],
  };

  const todosModulos = [
    {
      id: "estudantes",
      titulo: "Estudantes",
      descricao: "Gerencie os estudantes do sistema",
      icone: <Person className="w-8 h-8" />,
      rota: "/prae/estudantes",
      cor: "bg-blue-500",
      corHover: "hover:bg-blue-600",
      disponivel: true,
      roles: ["administrador", "gestor", "tecnico"],
    },
    {
      id: "profissionais",
      titulo: "Profissionais",
      descricao: "Gerencie os profissionais da PRAE",
      icone: <Group className="w-8 h-8" />,
      rota: "/prae/profissionais",
      cor: "bg-green-500",
      corHover: "hover:bg-green-600",
      disponivel: true,
      roles: ["administrador", "gestor", "tecnico"],
    },
    {
      id: "beneficios",
      titulo: "Benefícios",
      descricao: "Gerencie benefícios e tipos",
      icone: <CardGiftcard className="w-8 h-8" />,
      rota: "/prae/beneficios/beneficios",
      cor: "bg-purple-500",
      corHover: "hover:bg-purple-600",
      disponivel: true,
      roles: ["administrador", "gestor", "tecnico"],
    },
    {
      id: "tipos-beneficios",
      titulo: "Tipos de Benefícios",
      descricao: "Gerencie os tipos de benefícios",
      icone: <Assignment className="w-8 h-8" />,
      rota: "/prae/beneficios/tipos",
      cor: "bg-orange-500",
      corHover: "hover:bg-orange-600",
      disponivel: true,
      roles: ["administrador", "gestor"],
    },
    {
      id: "pagamentos",
      titulo: "Pagamentos",
      descricao: "Gerencie pagamentos e credores",
      icone: <Payment className="w-8 h-8" />,
      rota: "/prae/pagamentos",
      cor: "bg-teal-500",
      corHover: "hover:bg-teal-600",
      disponivel: true,
      roles: ["administrador", "gestor", "tecnico"],
    },
    {
      id: "agendamentos-cronograma",
      titulo: "Cronograma de Agendamentos",
      descricao: "Gerencie cronogramas de agendamento",
      icone: <Schedule className="w-8 h-8" />,
      rota: "/prae/agendamentos/cronograma",
      cor: "bg-indigo-500",
      corHover: "hover:bg-indigo-600",
      disponivel: true,
      roles: ["administrador", "gestor", "tecnico"],
    },
    {
      id: "agendamentos-tipo",
      titulo: "Tipos de Agendamento",
      descricao: "Gerencie tipos de agendamento",
      icone: <CalendarMonth className="w-8 h-8" />,
      rota: "/prae/agendamentos/tipo",
      cor: "bg-red-500",
      corHover: "hover:bg-red-600",
      disponivel: true,
      roles: ["administrador", "gestor"],
    },
  ];

  const todasAcoesRapidas = [
    {
      id: "meus-recebimentos",
      titulo: "Meus Recebimentos",
      descricao: "Visualizar meus recebimentos",
      icone: <AccountBalance className="w-8 h-8" />,
      rota: "/prae/pagamentos/meus-recebimentos",
      cor: "bg-teal-500",
      corHover: "hover:bg-teal-600",
      disponivel: true,
      roles: ["aluno"],
    },
    {
      id: "pagamentos-pendentes",
      titulo: "Pagamentos Pendentes",
      descricao: "Visualizar pagamentos pendentes",
      icone: <Payment className="w-8 h-8" />,
      rota: "/prae/pagamentos/pagamentos-pendentes",
      cor: "bg-yellow-500",
      corHover: "hover:bg-yellow-600",
      disponivel: true,
      roles: ["administrador", "gestor", "tecnico"],
    },
    {
      id: "relatorio-financeiro",
      titulo: "Relatório Financeiro",
      descricao: "Gerar relatório financeiro",
      icone: <Assessment className="w-8 h-8" />,
      rota: "/prae/pagamentos/relatorio-financeiro",
      cor: "bg-emerald-500",
      corHover: "hover:bg-emerald-600",
      disponivel: true,
      roles: ["administrador", "gestor"],
    },
    {
      id: "credores",
      titulo: "Credores",
      descricao: "Gerenciar credores",
      icone: <Group className="w-8 h-8" />,
      rota: "/prae/pagamentos/credores",
      cor: "bg-blue-600",
      corHover: "hover:bg-blue-700",
      disponivel: true,
      roles: ["administrador", "gestor", "tecnico"],
    },
  ];

  // Helper para verificar se o usuário tem uma role específica
  const hasRole = (requiredRoles: string[]) => {
    if (!session?.roles || session.roles.length === 0) return false;
    return requiredRoles.some((role) =>
      session.roles.some(
        (userRole) => userRole.toLowerCase() === role.toLowerCase()
      )
    );
  };

  // Filtrar módulos baseado nas roles do usuário
  const modulos = useMemo(() => {
    return todosModulos.filter((modulo) => hasRole(modulo.roles));
  }, [session?.roles]);

  // Filtrar ações rápidas baseado nas roles do usuário
  const acoesRapidas = useMemo(() => {
    return todasAcoesRapidas.filter((acao) => hasRole(acao.roles));
  }, [session?.roles]);

  const handleModuloClick = (modulo: any) => {
    if (modulo.disponivel) {
      router.push(modulo.rota);
    }
  };

  const handleAcaoRapidaClick = (acao: any) => {
    if (acao.disponivel) {
      router.push(acao.rota);
    }
  };
  useEffect(() => {
    // Se já houver efrotas_authenticated_user no localStorage, redireciona para dashboard
    const authDataStr = localStorage.getItem("efrotas_authenticated_user");
    if (authDataStr) {
      try {
        const authData = JSON.parse(authDataStr);
        if (authData.usuarioRole) {
          //router.push("/");
          return;
        }
      } catch (error) {
        console.error("Erro ao parsear authData:", error);
      }
    }
  }, [router]);

  return (
    <main className="flex flex-wrap justify-center mx-auto">
      <div className="w-full sm:w-11/12 2xl:w-10/12 p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 2xl:p-20 pt-7 md:pt-8 md:pb-8">
        <Cabecalho dados={cabecalho} />

        {/* SEÇÃO DE MÓDULOS */}
        {modulos.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Módulos Disponíveis
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {modulos.map((modulo) => (
                <ModuloCard
                  key={modulo.id}
                  modulo={modulo}
                  onClick={() => handleModuloClick(modulo)}
                />
              ))}
            </div>
          </div>
        )}

        {/* SEÇÃO DE AÇÕES RÁPIDAS */}
        {acoesRapidas.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center mb-6">
              <Speed className="w-6 h-6 text-primary-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Ações Rápidas
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {acoesRapidas.map((acao) => (
                <ModuloCard
                  key={acao.id}
                  modulo={acao}
                  onClick={() => handleAcaoRapidaClick(acao)}
                />
              ))}
            </div>
          </div>
        )}

        {/* MENSAGEM QUANDO NÃO HÁ MÓDULOS DISPONÍVEIS */}
        {modulos.length === 0 && acoesRapidas.length === 0 && (
          <div className="mt-8 text-center py-12">
            <Info className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum módulo disponível
            </h3>
            <p className="text-gray-500">
              Você não possui permissões para acessar os módulos da PRAE.
            </p>
          </div>
        )}

        {/* RODAPÉ SOBRE PRAE */}
        <div className="mt-12 bg-primary-50 rounded-lg p-6 border border-primary-200">
          <div className="flex items-center mb-3">
            <Info className="w-5 h-5 text-primary-700 mr-2" />
            <h3 className="text-lg font-semibold text-primary-700">
              Sobre a PRAE
            </h3>
          </div>
          <p className="text-primary-700 text-sm leading-relaxed">
            A Pró-Reitoria de Assuntos Estudantis (PRAE) tem como objetivo
            promover a permanência estudantil através de políticas de
            assistência estudantil, gerenciando benefícios, pagamentos,
            agendamentos e o acompanhamento dos estudantes em sua jornada
            acadêmica.{" "}
          </p>
        </div>
      </div>
    </main>
  );
}
