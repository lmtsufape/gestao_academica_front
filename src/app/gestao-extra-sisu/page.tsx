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
  Person,
  CheckCircle,
} from "@mui/icons-material";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import ModuloCard from "@/components/Layout/Interno/ModuloCard";
import { useAuth } from "@/components/AuthProvider/AuthProvider";

export default function GestaoExtraSisuHome() {
  const router = useRouter();
  const { session } = useAuth();

  useEffect(() => {
    const authDataStr = localStorage.getItem("efrotas_authenticated_user");
    if (authDataStr) {
      try {
        const authData = JSON.parse(authDataStr);
        if (authData.usuarioRole) {
          return;
        }
      } catch (error) {
        console.error("Erro ao parsear authData:", error);
      }
    }
  }, [router]);

  const cabecalho = {
    titulo: "Gestão Extra Sisu",
    migalha: [
      { nome: "Início", link: "/home" },
      { nome: "Extra Sisu", link: "/gestao-extra-sisu" },
    ],
  };

  const todosModulos = [
    {
      id: "editais",
      titulo: "Editais",
      descricao: "Gerencie os editais do Extra Sisu",
      icone: <Description className="w-8 h-8" />,
      rota: "/gestao-extra-sisu/editais",
      cor: "bg-blue-500",
      corHover: "hover:bg-blue-600",
      disponivel: true,
      roles: ["administrador", "gestor"],
    },
    {
      id: "inscricoes",
      titulo: "Inscrições",
      descricao: "Gerencie as inscrições dos candidatos",
      icone: <Assignment className="w-8 h-8" />,
      rota: "/gestao-extra-sisu/inscricoes",
      cor: "bg-green-500",
      corHover: "hover:bg-green-600",
      disponivel: true,
      roles: ["administrador", "gestor"],
    },
    {
      id: "candidatos",
      titulo: "Candidatos",
      descricao: "Visualize e gerencie candidatos",
      icone: <Person className="w-8 h-8" />,
      rota: "/gestao-extra-sisu/candidatos",
      cor: "bg-purple-500",
      corHover: "hover:bg-purple-600",
      disponivel: true,
      roles: ["administrador", "gestor"],
    },
    {
      id: "resultado",
      titulo: "Resultados",
      descricao: "Visualize os resultados e classificações",
      icone: <CheckCircle className="w-8 h-8" />,
      rota: "/gestao-extra-sisu/resultado",
      cor: "bg-orange-500",
      corHover: "hover:bg-orange-600",
      disponivel: true,
      roles: ["administrador", "gestor"],
    },
  ];

  const todasAcoesRapidas = [
    {
      id: "novo-tipo-edital-extra-sisu",
      titulo: "Novo Tipo de Edital Extra Sisu",
      descricao: "Criar um novo tipo de edital Extra Sisu",
      icone: <Add className="w-8 h-8" />,
      rota: "/gestao-extra-sisu/editais/criar",
      cor: "bg-teal-500",
      corHover: "hover:bg-teal-600",
      disponivel: true,
      roles: ["administrador", "gestor"],
    },
  ];

  const hasRole = (requiredRoles: string[]) => {
    if (!session?.roles || session.roles.length === 0) return false;
    return requiredRoles.some((role) =>
      session.roles.some(
        (userRole) => userRole.toLowerCase() === role.toLowerCase()
      )
    );
  };

  const modulos = useMemo(() => {
    return todosModulos.filter((modulo) => hasRole(modulo.roles));
  }, [session?.roles]);

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
              Você não possui permissões para acessar os módulos de Extra Sisu.
            </p>
          </div>
        )}

        {/* RODAPÉ SOBRE EXTRA SISU */}
        <div className="mt-12 bg-primary-50 rounded-lg p-6 border border-primary-200">
          <div className="flex items-center mb-3">
            <Info className="w-5 h-5 text-primary-700 mr-2" />
            <h3 className="text-lg font-semibold text-primary-700">
              Sobre Extra Sisu
            </h3>
          </div>
          <p className="text-primary-700 text-sm leading-relaxed">
            O módulo Extra Sisu permite gerenciar ofertas complementares fora do
            SISU. Aqui você pode criar editais, gerenciar inscrições, avaliar
            candidatos e publicar resultados de forma transparente e organizada.
          </p>
        </div>
      </div>
    </main>
  );
}