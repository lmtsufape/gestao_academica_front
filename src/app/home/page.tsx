"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, StarBorder } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Modal from "@/components/Modal/Modal";
import { useAuthService } from "../authentication/auth.hook";
import { generica } from "@/utils/api";

export default function HomePage() {
  const router = useRouter();
  const auth = useAuthService();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAluno, setisAluno] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    title: string;
    content: string;
    level: "success" | "error" | "warning" | "info";
  }>({ title: "", content: "", level: "warning" });
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");

  useEffect(() => {
    // Update isAluno when auth state changes
    if (!auth.isLoading) {
      setisAluno(auth.isAluno());
    }
  }, [auth.isAuthenticated, auth.isLoading]);

  useEffect(() => {
    if (isAluno) {
      buscarEstudanteAtual();
      console.log();
    }
  }, [isAluno]);

  /**
   * TODO: Verificar se o estudante está cadastrado no PRAE.
   * Se não estiver, exibir modal de notificação.
   * Se estiver, não fazer nada.
   * @summary Desativado temporariamente para evitar chamadas desnecessárias.
   */
  const buscarEstudanteAtual = async () => {
    return; // Desativado temporariamente
  };

  // Inicializa o estado lendo do localStorage (se disponível)
  const [pinnedModules, setPinnedModules] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("pinnedModules");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  // Estado para a busca
  const [searchTerm, setSearchTerm] = useState("");

  // Atualiza localStorage sempre que os favoritos mudarem
  useEffect(() => {
    localStorage.setItem("pinnedModules", JSON.stringify(pinnedModules));
  }, [pinnedModules]);

  // Lista de módulos (pode vir de uma API)
  const allModules = [
    {
      id: "gestao-acesso",
      name: "Gestão de Acesso",
      route: "/gestao-acesso",
      description: "Acesse o módulo de Gestão de Acesso",
      image: "/assets/brasaoUfapeCol.png",
    },
    {
      id: "prae",
      name: "Prae",
      route: "/prae",
      description: "Acesse o módulo Prae",
      image: "/assets/brasaoUfapeCol.png",
    },
    {
      id: "gestao-editais",
      name: "Editais",
      route: "/gestao-edital",
      description: "Acesse o módulo de Editais",
      image: "/assets/brasaoUfapeCol.png",
    },
  ];

  // Favoritar/Desfavoritar
  const togglePin = (moduleId: string) => {
    if (pinnedModules.includes(moduleId)) {
      setPinnedModules((prev) => prev.filter((id) => id !== moduleId));
    } else {
      setPinnedModules((prev) => [...prev, moduleId]);
    }
  };

  // Filtra os módulos pela busca
  const filteredModules = allModules.filter((mod) => {
    const term = searchTerm.toLowerCase();
    return (
      mod.name.toLowerCase().includes(term) ||
      mod.description.toLowerCase().includes(term)
    );
  });

  // Separa favoritos x outros
  const favoriteModules = filteredModules.filter((mod) =>
    pinnedModules.includes(mod.id)
  );
  const otherModules = filteredModules.filter(
    (mod) => !pinnedModules.includes(mod.id)
  );

  // Módulos a serem exibidos baseado na aba ativa
  const displayedModules =
    activeTab === "favorites" ? favoriteModules : filteredModules;

  const handleCloseModal = () => setIsModalOpen(false);

  const handleNoitify = () => {
    const notificationContent = {
      title: "Atenção",
      content: "Efetue o seu cadastro no módulo PRAE!",
      level: "warning" as "success" | "error" | "warning" | "info",
    };
    setNotification(notificationContent);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-8">
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={notification.title}
        content={notification.content}
        level={notification.level}
      />

      {/* Cabeçalho com título e abas */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <p className="text-[30px] font-bold text-extra-50 mb-4 md:mb-0">
          Inicio
        </p>

        {/* Abas "Todos os módulos" e "Favoritos" */}
        <div className="flex border-b border-neutrals-300">
          <button
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === "all"
                ? "text-extra-50 border-b-2 border-extra-50"
                : "text-neutrals-500 hover:text-extra-50"
            }`}
            onClick={() => setActiveTab("all")}
          >
            Todos os módulos
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === "favorites"
                ? "text-extra-50 border-b-2 border-extra-50"
                : "text-neutrals-500 hover:text-extra-50"
            }`}
            onClick={() => setActiveTab("favorites")}
          >
            Favoritos
          </button>
        </div>
      </div>

      {/* Seção de Módulos - Exibe apenas os módulos da aba ativa */}
      <section className="mt-4">
        {displayedModules.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedModules.map((module) => {
              const isPinned = pinnedModules.includes(module.id);
              return (
                <div
                  key={module.id}
                  className="bg-white border border-neutrals-300 rounded-lg shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex flex-col h-full"
                >
                  {/* Topo do Card */}
                  <div className="relative p-1">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePin(module.id);
                      }}
                      className="absolute top-1 right-1"
                      size="small"
                    >
                      {isPinned ? (
                        <Star className="text-extra-50" />
                      ) : (
                        <StarBorder className="text-extra-50" />
                      )}
                    </IconButton>

                    {module.image && (
                      <img
                        src={module.image}
                        alt={module.name}
                        onClick={() => router.push(module.route)}
                        className="w-20 h-20 object-contain mx-auto cursor-pointer"
                      />
                    )}
                  </div>

                  {/* Conteúdo do Card */}
                  <div className="px-4 pb-4 flex flex-col justify-between flex-1">
                    {/* Texto (titulo + descrição) */}
                    <div
                      onClick={() => router.push(module.route)}
                      className="cursor-pointer"
                    >
                      <h3 className="text-[20px] font-semibold text-extra-50">
                        {module.name}
                      </h3>
                      <p className="mt-2 text-[14px] text-extra-100">
                        {module.description}
                      </p>
                    </div>

                    {/* Botão sempre no fim */}
                    <button
                      onClick={() => router.push(module.route)}
                      className="mt-4 w-full px-4 py-2 bg-extra-50 text-white rounded hover:bg-extra-150 transition"
                    >
                      Acessar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-neutrals-500">
            {activeTab === "favorites"
              ? "Nenhum módulo favoritado encontrado."
              : "Nenhum módulo encontrado."}
          </div>
        )}
      </section>
    </div>
  );
}
