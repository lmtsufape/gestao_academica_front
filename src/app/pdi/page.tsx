"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Flag,
  TrackChanges,
  Assessment,
  Analytics,
  Timeline,
  Add,
  Speed,
  Info,
  Article,
  Description,
} from "@mui/icons-material";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import ModuloCard from "@/components/Layout/Interno/ModuloCard";
import { useAuth } from "@/components/AuthProvider/AuthProvider";

export default function PdiHome() {
  const router = useRouter();
  const { session } = useAuth();

  useEffect(() => {
    // Se já houver efrotas_authenticated_user no localStorage, redireciona para dashboard
  }, [router]);

  const cabecalho = {
    titulo: "PDI - Plano de Desenvolvimento Institucional",
    migalha: [
      { nome: "Início", link: "/home" },
      { nome: "PDI", link: "/pdi" },
    ],
  };

  const todosModulos = [
    {
      id: "metas",
      titulo: "Metas",
      descricao: "Gerencie e acompanhe as metas do PDI",
      icone: <Flag className="w-8 h-8" />,
      rota: "/pdi/metas",
      cor: "bg-blue-500",
      corHover: "hover:bg-blue-600",
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

  const handleModuloClick = (modulo: any) => {
    if (modulo.disponivel) {
      router.push(modulo.rota);
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

        {/* RODAPÉ SOBRE O PDI */}
        <div className="mt-12 bg-primary-50 rounded-lg p-6 border border-primary-200">
          <div className="flex items-center mb-3">
            <Info className="w-5 h-5 text-primary-700 mr-2" />
            <h3 className="text-lg font-semibold text-primary-700">
              Sobre o PDI
            </h3>
          </div>
          <p className="text-primary-700 text-sm leading-relaxed">
            Aqui você pode acessar e gerenciar todos os módulos relacionados ao
            acompanhamento e execução do PDI.
          </p>
        </div>
      </div>
    </main>
  );
}