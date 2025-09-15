"use client";
import withAuthorization from "@/components/AuthProvider/withAuthorization";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { generica } from "@/utils/api";
import { Edit, ArrowBack, Timeline, Info, Add, InfoOutlined, Flag } from "@mui/icons-material";
import ModalHistoricoStatus from "@/components/Modal/ModalHistoricoStatus";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { HistoricoStatusResponse } from "../types/types";

const VisualizarMeta = () => {
  const { id } = useParams();
  const { session } = useAuth();
  const [dadosMeta, setDadosMeta] = useState<any>(null);
  const [historicoStatus, setHistoricoStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioAtual, setUsuarioAtual] = useState<any>(null);

  const cabecalho = {
    titulo: "Visualizar Meta",
    migalha: [
      { nome: "Início", link: "/home" },
      { nome: "PDI", link: "/pdi" },
      { nome: "Metas", link: "/pdi/metas" },
      { nome: "Visualizar", link: "" },
    ],
  };

  const carregarMeta = async () => {
    if (!id) return;

    try {
      setLoading(true);

      const body = {
        metodo: "get",
        uri: `/pdi/api/v1/meta/${id}`,
        params: {},
      };

      const response = await generica(body);

      if (
        response &&
        response.data &&
        !response.data.errors &&
        !response.data.error
      ) {
        setDadosMeta(response.data);
      } else {
        toast.error("Erro ao carregar os dados da meta!", {
          position: "top-left",
        });
      }
    } catch (error) {
      console.error("Erro ao carregar meta:", error);
      toast.error("Erro ao carregar os dados da meta. Tente novamente!", {
        position: "top-left",
      });
    } finally {
      setLoading(false);
    }
  };
  const carregarHistoricoStatus = async () => {
    if (!id) return;

    try {
      const body = {
        metodo: "get",
        uri: `/pdi/api/v1/historicoStatus?meta.id=${id}&sort=dataAtualizacao,desc`,
        params: {},
      };

      const response = await generica(body);
      const isValidResponse =
        response &&
        response.data &&
        !response.data.errors &&
        !response.data.error;

      if (isValidResponse) {
        setHistoricoStatus(response.data);
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      setHistoricoStatus([]);
    }
    // finally {
    //   setHistoricoStatus([
    //     {
    //       id: 1,
    //       valor: 3,
    //       dataAtualizacao: "2024-01-15T10:30:00",
    //       usuarioAtualizacao: "João Silva",
    //     },
    //     {
    //       id: 2,
    //       valor: 2,
    //       dataAtualizacao: "2024-02-10T14:20:00",
    //       usuarioAtualizacao: "Maria Santos",
    //     },
    //     {
    //       id: 3,
    //       valor: 3,
    //       dataAtualizacao: "2024-03-05T09:15:00",
    //       usuarioAtualizacao: "João Silva",
    //     },
    //   ]);
    // }
  };

  const carregarUsuarioAtual = async () => {
    try {
      const body = {
        metodo: "get",
        uri: "/auth/usuario/current",
        params: {},
      };

      const response = await generica(body);
      if (
        response &&
        response.data &&
        !response.data.errors &&
        !response.data.error
      ) {
        setUsuarioAtual(response.data);
      }
    } catch (error) {
      console.error("Erro ao carregar usuário atual:", error);
    }
  };

  const formatarData = (dataString: string) => {
    if (!dataString) return "-";
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dataString;
    }
  };
  const getValorColor = (valor: number, index: number, total: number) => {
    // o mais recente é destacado
    const isLatest = index === 0;
    if (isLatest) {
      return "bg-blue-100 text-blue-800 border-blue-200";
    } else {
      return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleStatusAdded = (status: HistoricoStatusResponse) => {
    const nomeUsuario = usuarioAtual?.nome || session?.email || "Usuário Atual";

    const novoItem = {
      id: status.id,
      valor: status.valor,
      dataAtualizacao: status.dataAtualizacao || new Date().toISOString(),
      usuarioAtualizacao: status.usuarioAtualizacao || nomeUsuario,
    };

    setHistoricoStatus((prevHistorico) => [novoItem, ...prevHistorico]);
  };

  useEffect(() => {
    if (id && id !== "criar") {
      carregarUsuarioAtual();
      carregarMeta();
      carregarHistoricoStatus();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="flex flex-wrap justify-center mx-auto">
        <div className="w-full md:w-11/12 lg:w-10/12 2xl:w-3/4 max-w-6xl p-4 pt-10 md:pt-12 md:pb-12">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Carregando...</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-wrap justify-center mx-auto">
      <div className="w-full md:w-11/12 lg:w-10/12 2xl:w-3/4 max-w-6xl p-4 pt-10 md:pt-12 md:pb-12">
        <Cabecalho dados={cabecalho} />
        {dadosMeta ? (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Flag className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Informações da Meta
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1">
                    Código
                  </label>
                  <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                    {dadosMeta.codigo || "-"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1">
                    Descrição
                  </label>
                  <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md min-h-[80px]">
                    {dadosMeta.descricao || "-"}
                  </div>
                </div>
              </div>
            </div>
            {/* Objetivos Relacionados */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Objetivos relacionados
                </h2>
              </div>

              <div className="space-y-4">
                {/* Objetivo Específico */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="text-md font-bold text-gray-900 mb-3">
                    Objetivo Específico
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-1">
                        Código
                      </label>
                      <div className="text-sm text-gray-900">
                        {dadosMeta.objetivoEspecifico?.codigo || "-"}
                      </div>
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-sm font-bold text-gray-500 mb-1">
                        Descrição
                      </label>
                      <div className="text-sm text-gray-900">
                        {dadosMeta.objetivoEspecifico?.descricao || "-"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Objetivo Estratégico */}
                <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                  <h3 className="text-md font-bold text-gray-900 mb-3">
                    Objetivo Estratégico
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-1">
                        Código
                      </label>
                      <div className="text-sm text-gray-900">
                        {dadosMeta.objetivoEspecifico?.objetivoEstrategico
                          ?.codigo || "-"}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-1">
                        Eixo
                      </label>
                      <div className="text-sm text-gray-900">
                        {dadosMeta.objetivoEspecifico?.objetivoEstrategico
                          ?.eixo || "-"}
                      </div>
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-sm font-bold text-gray-500 mb-1">
                        Descrição
                      </label>
                      <div className="text-sm text-gray-900">
                        {dadosMeta.objetivoEspecifico?.objetivoEstrategico
                          ?.descricao || "-"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* Histórico de Valores */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Timeline className="w-5 h-5 text-primary-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Histórico de status
                  </h2>
                </div>
                <button
                  onClick={handleOpenModal}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-primary-500 bg-neutrals-100 text-left border border-primary-500 rounded hover:shadow-sm mr-1 hover:bg-primary-700 hover:text-white hover:border-primary-700 transition-colors duration-200"
                >
                  <Add className="w-4 h-4" />
                  Adicionar Valor
                </button>
              </div>

              {historicoStatus.length > 0 ? (
                <div className="space-y-4">
                  {historicoStatus.map((item, index) => (
                    <div key={item.id || index} className="relative">
                      {index < historicoStatus.length - 1 && (
                        <div className="absolute left-4 top-8 w-0.5 h-full bg-gray-200"></div>
                      )}

                      <div className="flex items-start space-x-4">
                        <div
                          className={`
                            flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center ${getValorColor(
                              item.valor,
                              index,
                              historicoStatus.length
                            )}`}
                        >
                          <div className="w-2 h-2 rounded-full bg-current"></div>
                        </div>

                        <div className="flex-1 min-w-0 pb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-bold rounded ${getValorColor(
                                  item.valor,
                                  index,
                                  historicoStatus.length
                                )}`}
                              >
                                Valor: {item.valor}
                              </span>
                              <span className="text-sm text-gray-600">
                                por {item.usuarioAtualizacao}
                              </span>
                            </div>
                            <time className="text-sm text-gray-500">
                              {formatarData(item.dataAtualizacao)}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Timeline className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Nenhum status encontrado</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center py-8 text-gray-500">
              <p>Meta não encontrada</p>
            </div>{" "}
          </div>
        )}
      </div>

      <ModalHistoricoStatus
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        metaId={String(id)}
        onStatusAdded={handleStatusAdded}
        usuarioAtual={usuarioAtual}
      />
    </main>
  );
};

export default withAuthorization(VisualizarMeta);
