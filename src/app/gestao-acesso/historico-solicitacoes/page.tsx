"use client";
import withAuthorization from '@/components/AuthProvider/withAuthorization';
import Cabecalho from '@/components/Layout/Interno/Cabecalho';
import Tabela from '@/components/Tabela/Estrutura';
import { generica } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useRole } from '@/context/roleContext';

const PageHistoricoSolicitacoes = () => {
    const router = useRouter();
    const [dados, setDados] = useState({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 10 });
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    // Obtenha activeRole e userRoles do contexto
    const { activeRole, userRoles } = useRole();

    // Verifique se o usuário é privilegiado com base na role ativa
    const isPrivileged = activeRole === "administrador";

    const estrutura = {
        uri: "solicitacao",
        cabecalho: {
            titulo: "Histórico de Solicitações",
            migalha: [
                { nome: 'Início', link: '/home' },
                { nome: 'Gestão Acesso', link: '/gestao-acesso' },
                { nome: 'Solicitações', link: '/gestao-acesso/solicitacoes' },
                { nome: 'Histórico', link: '/gestao-acesso/unidades-administrativas/historico-solicitacoes' },
            ],
        },
        tabela: {
            configuracoes: {
                pesquisar: true,
                cabecalho: true,
                rodape: true,
            },
            botoes: [
                { nome: 'Voltar para Solicitações', chave: 'voltar', bloqueado: false },
            ],
            colunas: [
                { nome: "ID", chave: "id", tipo: "texto", sort: true },
                { nome: "Perfil Solicitado", chave: "perfilSolicitado", tipo: "texto" },
                { nome: "Status", chave: "status", tipo: "texto" },
                { nome: "Data da Solicitação", chave: "dataSolicitacao", tipo: "data" },
                { nome: "Data de Avaliação", chave: "dataAvaliacao", tipo: "data" },
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
            case 'voltar':
                voltarParaSolicitacoes();
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

    const voltarParaSolicitacoes = () => {
        router.push('/gestao-acesso/solicitacoes');
    };

    const pesquisarRegistro = async (params?: any) => {
        try {
            const queryParams = {
                size: params?.size ?? 10,
                page: params?.page ?? 0,
            };

            const respRegs = await generica({
                metodo: 'get',
                uri: `/auth/${estrutura.uri}`,
                params: queryParams,
                data: {},
            });

            if (respRegs?.data) {
                console.log('Resposta da API:', respRegs);
                //calcular totalElements com base no tamanho do array content
                let totalElements = 0;
                if (respRegs.data.content && Array.isArray(respRegs.data.content)) {
                    totalElements = respRegs.data.content.length;
                }
                
                respRegs.data = {
                    content: respRegs.data.content || [],
                    totalElements: totalElements,
                    totalPages: respRegs.data.totalPages || 0,
                    number: respRegs.data.number || 0,
                    size: respRegs.data.size || 10,
                };
                setDados(respRegs.data);
            }
        } catch (err) {
            console.error('Erro ao carregar histórico de registros:', err);
            toast.error('Erro inesperado ao carregar histórico de registros.', { position: 'bottom-left' });
        }
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

    useEffect(() => {
        if (activeRole && userRoles.length > 0) {
            pesquisarRegistro();
        }
    }, [activeRole, userRoles]);

    if (!isPrivileged) {
        return (
            <main className="flex flex-wrap justify-center mx-auto">
                <div className="w-full sm:w-11/12 2xl:w-10/12 p-4 sm:p-6 md:p-8 lg:p-12 :p-16 2xl:p-20 pt-7 md:pt-8 md:pb-8">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">
                            Acesso não autorizado
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Você não tem permissão para acessar o histórico completo de solicitações.
                        </p>
                        <button
                            onClick={voltarParaSolicitacoes}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                        >
                            Voltar para Solicitações
                        </button>
                    </div>
                </div>
            </main>
        );
    }

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

export default withAuthorization(PageHistoricoSolicitacoes);