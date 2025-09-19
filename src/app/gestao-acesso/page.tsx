"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Security,
  Person,
  Business,
  Group,
  School,
  Assignment,
  Add,
  Speed,
  Info,
} from "@mui/icons-material";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import ModuloCard from "@/components/Layout/Interno/ModuloCard";
import { useAuth } from "@/components/AuthProvider/AuthProvider";

export default function GestaoAcessoHome() {
  const router = useRouter();
  const { session } = useAuth();

  useEffect(() => {
    // Se já houver efrotas_authenticated_user no localStorage, redireciona para dashboard
    const authDataStr = localStorage.getItem("efrotas_authenticated_user");
    if (authDataStr) {
      try {
        const authData = JSON.parse(authDataStr);
        if (authData.usuarioRole) {
          //router.push("/e-Frotas/dashboard");
          return;
        }
      } catch (error) {
        console.error("Erro ao parsear authData:", error);
      }
    }
  }, [router]);

  const cabecalho = {
    titulo: "Gestão de Acesso",
    migalha: [
      { nome: "Início", link: "/home" },
      { nome: "Gestão de Acesso", link: "/gestao-acesso" },
    ],
  };

  const todosModulos = [
    {
      id: "usuarios",
      titulo: "Usuários",
      descricao: "Gerencie os usuários do sistema",
      icone: <Person className="w-8 h-8" />,
      rota: "/gestao-acesso/usuarios",
      cor: "bg-blue-500",
      corHover: "hover:bg-blue-600",
      disponivel: true,
      roles: ["administrador"],
    },
    {
      id: "unidades-administrativas",
      titulo: "Unidades Administrativas",
      descricao: "Gerencie as unidades administrativas",
      icone: <Business className="w-8 h-8" />,
      rota: "/gestao-acesso/unidades-administrativas",
      cor: "bg-green-500",
      corHover: "hover:bg-green-600",
      disponivel: true,
      roles: ["administrador"],
    },
    {
      id: "minhas-unidades",
      titulo: "Minhas Unidades Administrativas",
      descricao: "Visualize suas unidades administrativas",
      icone: <Business className="w-8 h-8" />,
      rota: "/gestao-acesso/minhas-unidades",
      cor: "bg-teal-500",
      corHover: "hover:bg-teal-600",
      disponivel: true,
      roles: ["gestor"],
    },
    {
      id: "cursos",
      titulo: "Cursos",
      descricao: "Gerencie os cursos do sistema",
      icone: <School className="w-8 h-8" />,
      rota: "/gestao-acesso/cursos",
      cor: "bg-purple-500",
      corHover: "hover:bg-purple-600",
      disponivel: true,
      roles: ["administrador"],
    },
    {
      id: "etnia",
      titulo: "Etnias",
      descricao: "Gerencie as etnias do sistema",
      icone: <Group className="w-8 h-8" />,
      rota: "/gestao-acesso/etnia",
      cor: "bg-orange-500",
      corHover: "hover:bg-orange-600",
      disponivel: true,
      roles: ["administrador", "gestor", "tecnico"],
    },
    {
      id: "tipo-unidade",
      titulo: "Tipos de Unidade",
      descricao: "Gerencie os tipos de unidade administrativa",
      icone: <Assignment className="w-8 h-8" />,
      rota: "/gestao-acesso/tipo-unidade-administrativa",
      cor: "bg-red-500",
      corHover: "hover:bg-red-600",
      disponivel: true,
      roles: ["administrador"],
    },
    {
      id: "gerenciar-solicitacoes",
      titulo: "Gerenciar Solicitações",
      descricao: "Gerencie as solicitações de acesso",
      icone: <Security className="w-8 h-8" />,
      rota: "/gestao-acesso/solicitacoes",
      cor: "bg-purple-600",
      corHover: "hover:bg-purple-700",
      disponivel: true,
      roles: ["administrador"],
    },
  ];

  const todasAcoesRapidas = [
    {
      id: "nova-unidade",
      titulo: "Nova Unidade Administrativa",
      descricao: "Criar uma nova unidade administrativa",
      icone: <Add className="w-8 h-8" />,
      rota: "/gestao-acesso/unidades-administrativas/criar",
      cor: "bg-teal-500",
      corHover: "hover:bg-teal-600",
      disponivel: true,
      roles: ["administrador"],
    },
    {
      id: "novo-usuario",
      titulo: "Novo Usuário",
      descricao: "Criar um novo usuário no sistema",
      icone: <Add className="w-8 h-8" />,
      rota: "/gestao-acesso/usuarios/criar",
      cor: "bg-emerald-500",
      corHover: "hover:bg-emerald-600",
      disponivel: true,
      roles: ["administrador"],
    },
    {
      id: "novo-curso",
      titulo: "Novo Curso",
      descricao: "Criar um novo curso",
      icone: <Add className="w-8 h-8" />,
      rota: "/gestao-acesso/cursos/criar",
      cor: "bg-cyan-500",
      corHover: "hover:bg-cyan-600",
      disponivel: true,
      roles: ["administrador"],
    },
    {
      id: "nova-solicitacao",
      titulo: "Nova Solicitação",
      descricao: "Criar uma nova solicitação de acesso",
      icone: <Add className="w-8 h-8" />,
      rota: "/gestao-acesso/solicitacoes/criar",
      cor: "bg-blue-600",
      corHover: "hover:bg-blue-700",
      disponivel: true,
      roles: ["aluno", "professor", "visitante", "tecnico", "gestor"],
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
              Você não possui permissões para acessar os módulos de gestão de
              acesso.
            </p>
          </div>
        )}

        {/* RODAPÉ SOBRE GESTÃO DE ACESSO */}
        <div className="mt-12 bg-primary-50 rounded-lg p-6 border border-primary-200">
          <div className="flex items-center mb-3">
            <Info className="w-5 h-5 text-primary-700 mr-2" />
            <h3 className="text-lg font-semibold text-primary-700">
              Sobre a Gestão de Acesso
            </h3>
          </div>
          <p className="text-primary-700 text-sm leading-relaxed">
            O módulo de Gestão de Acesso permite controlar quem tem acesso ao
            sistema e seus recursos. Aqui você pode gerenciar usuários, unidades
            administrativas, cursos e permissões, garantindo a segurança e
            organização do ambiente acadêmico.
          </p>
        </div>
      </div>
    </main>
  );
}
