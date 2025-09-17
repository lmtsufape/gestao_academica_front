"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Assignment,
  Description,
  Visibility,
  Add,
  Speed,
  Info,
  Edit,
} from "@mui/icons-material";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import ModuloCard from "@/components/Layout/Interno/ModuloCard";
import { useAuth } from "@/components/AuthProvider/AuthProvider";

export default function GestaoEditalHome() {
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
    titulo: "Gestão de Editais",
    migalha: [
      { nome: "Início", link: "/home" },
      { nome: "Gestão de Editais", link: "/gestao-edital" },
    ],
  };
  const todosModulos = [
    {
      id: "editais",
      titulo: "Editais",
      descricao: "Gerencie os editais do sistema",
      icone: <Description className="w-8 h-8" />,
      rota: "/gestao-edital/editais",
      cor: "bg-blue-500",
      corHover: "hover:bg-blue-600",
      disponivel: true,
      roles: ["administrador", "gestor", "tecnico"],
    },
    {
      id: "tipo-edital",
      titulo: "Tipos de Edital",
      descricao: "Gerencie os tipos de edital",
      icone: <Assignment className="w-8 h-8" />,
      rota: "/gestao-edital/editais/tipo-edital",
      cor: "bg-green-500",
      corHover: "hover:bg-green-600",
      disponivel: true,
      roles: ["administrador", "gestor"],
    },
    {
      id: "status-personalizado",
      titulo: "Status Personalizado",
      descricao: "Gerencie status personalizados dos editais",
      icone: <Edit className="w-8 h-8" />,
      rota: "/gestao-edital/editais/status-personalizado",
      cor: "bg-purple-500",
      corHover: "hover:bg-purple-600",
      disponivel: true,
      roles: ["administrador", "gestor"],
    },
  ];
  const todasAcoesRapidas = [
    {
      id: "novo-tipo-edital",
      titulo: "Novo Tipo de Edital",
      descricao: "Criar um novo tipo de edital",
      icone: <Add className="w-8 h-8" />,
      rota: "/gestao-edital/editais/tipo-edital/criar",
      cor: "bg-teal-500",
      corHover: "hover:bg-teal-600",
      disponivel: true,
      roles: ["administrador", "gestor"],
    },
    {
      id: "novo-status",
      titulo: "Novo Status Personalizado",
      descricao: "Criar um novo status personalizado",
      icone: <Edit className="w-8 h-8" />,
      rota: "/gestao-edital/editais/status-personalizado/criar",
      cor: "bg-emerald-500",
      corHover: "hover:bg-emerald-600",
      disponivel: true,
      roles: ["administrador", "gestor"],
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
              editais.
            </p>
          </div>
        )}

        {/* RODAPÉ SOBRE GESTÃO DE EDITAIS */}
        <div className="mt-12 bg-primary-50 rounded-lg p-6 border border-primary-200">
          <div className="flex items-center mb-3">
            <Info className="w-5 h-5 text-primary-700 mr-2" />
            <h3 className="text-lg font-semibold text-primary-700">
              Sobre a Gestão de Editais
            </h3>
          </div>
          <p className="text-primary-700 text-sm leading-relaxed">
            O módulo de Gestão de Editais permite criar, gerenciar e publicar
            editais institucionais. Aqui você pode controlar cronogramas,
            inscrições, relatórios e consultas públicas, garantindo
            transparência e organização nos processos seletivos da instituição.
          </p>
        </div>
      </div>
    </main>
  );
}