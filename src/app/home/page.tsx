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
    // try {
    //   const body = {
    //     metodo: "get",
    //     uri: "/prae/estudantes/current",
    //     params: {},
    //   };
    //   const response = await generica(body);
    //   if (!response) throw new Error("Resposta inválida do servidor.");
    //   if (response.status === 404) {
    //     handleNoitify();
    //     return;
    //   }
    // } catch (error) {
    //   console.error("DEBUG: Erro ao localizar registro:", error);
    // }
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
      route: "/gestao-editais",
      description: "Acesse o módulo de Editais",
      image: "/assets/brasaoUfapeCol.png",
    },
    {
      id: "pdi",
      name: "PDI",
      route: "/pdi",
      description: "Acesse o módulo de PDI",
      image: "/assets/brasaoUfapeCol.png",
    },
    // Adicione mais módulos...
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
    <div className="container mx-auto px-4 py-8">
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={notification.title}
        content={notification.content}
        level={notification.level}
      />
      <p className="text-[20px] font-semibold text-primary-500">
        Escolha um módulo para acessar:
      </p>

      {/* Barra de busca (100% de largura) */}
      <div className="mt-4">
        <input
          type="text"
          className="border border-neutrals-300 rounded-md p-2 w-full focus:ring-2 focus:ring-primary-500 outline-none"
          placeholder="Buscar módulo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Seção de Favoritos */}
      {favoriteModules.length > 0 && (
        <section className="mt-8">
          <h2 className="text-[24px] font-semibold text-secondary-500">
            Módulos Favoritos
          </h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteModules.map((module) => {
              const isPinned = pinnedModules.includes(module.id);
              return (
                <div
                  key={module.id}
                  className="bg-white border border-neutrals-300 rounded-lg shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex flex-col h-full"
                >
                  {/* Topo do Card: Imagem centralizada com estrela no canto superior direito */}
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
                        <Star className="text-secondary-500" />
                      ) : (
                        <StarBorder className="text-secondary-500" />
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

                  {/* Conteúdo do Card: Título, Descrição e Botão */}
                  <div className="px-4 pb-4 flex flex-col flex-1">
                    <h3
                      className="text-[20px] font-semibold text-primary-700 cursor-pointer"
                      onClick={() => router.push(module.route)}
                    >
                      {module.name}
                    </h3>
                    <p
                      className="mt-2 text-[14px] text-neutrals-500 cursor-pointer"
                      onClick={() => router.push(module.route)}
                    >
                      {module.description}
                    </p>
                    <button
                      onClick={() => router.push(module.route)}
                      className="mt-auto w-full px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-700 transition"
                    >
                      Acessar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Seção de Outros Módulos */}
      <section className="mt-8">
        <h2 className="text-[24px] font-semibold text-secondary-500">
          Outros Módulos
        </h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {otherModules.map((module) => {
            const isPinned = pinnedModules.includes(module.id);
            return (
              <div
                key={module.id}
                className="bg-white border border-neutrals-300 rounded-lg shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex flex-col h-full"
              >
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
                      <Star className="text-secondary-500" />
                    ) : (
                      <StarBorder className="text-secondary-500" />
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
                <div className="px-4 pb-4 flex flex-col flex-1">
                  <h3
                    className="text-[20px] font-semibold text-primary-700 cursor-pointer"
                    onClick={() => router.push(module.route)}
                  >
                    {module.name}
                  </h3>
                  <p
                    className="mt-2 text-[14px] text-neutrals-500 cursor-pointer"
                    onClick={() => router.push(module.route)}
                  >
                    {module.description}
                  </p>
                  <button
                    onClick={() => router.push(module.route)}
                    className="mt-auto w-full px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-700 transition"
                  >
                    Acessar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
