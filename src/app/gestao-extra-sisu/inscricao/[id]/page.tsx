"use client";
import withAuthorization from "@/components/AuthProvider/withAuthorization";
import Cadastro from "@/components/Cadastro/Estrutura";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { generica } from "@/utils/api";

const CadastroInscricao = () => {
    const router = useRouter();
    const { id } = useParams();

    const [dadosPreenchidos, setDadosPreenchidos] = useState<any>({});
    const [editais, setEditais] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const isEditMode = id && id !== "criar";

    const getOptions = (lista: any[], selecionado: any) => {
        if (!Array.isArray(lista)) return [];
        return lista.map((item) => ({
            chave: item.id,
            valor: item.nome || item.titulo || item.descricao || "Item sem nome"
        }));
    };

    const estrutura: any = {
        cabecalho: {
            titulo: isEditMode ? "Avaliar Inscrição" : "Nova Inscrição",
            migalha: [
                { nome: 'Início', link: '/home' },
                { nome: 'Gestão Extra Sisu', link: '/gestao-extra-sisu' },
                { nome: "Inscrições", link: "/gestao-extra-sisu/inscricao" },
                { nome: isEditMode ? "Avaliar" : "Inscrever", link: `/gestao-extra-sisu/inscricao/${isEditMode ? id : "criar"}` },
            ],
        },
        cadastro: {
            // Renderização condicional dos campos baseada no modo (Criar vs Editar)
            campos: [
                ...(!isEditMode ? [
                    {
                        line: 1,
                        colSpan: "md:col-span-2",
                        nome: "Edital",
                        chave: "editalId",
                        tipo: "select",
                        mensagem: "Selecione o edital para se inscrever",
                        obrigatorio: true,
                        selectOptions: getOptions(editais, dadosPreenchidos?.editalId),
                    }
                ] : [
                    {
                        line: 1,
                        colSpan: "md:col-span-2",
                        nome: "Novo Status",
                        chave: "statusId",
                        tipo: "select",
                        mensagem: "Selecione o status da inscrição",
                        obrigatorio: true,
                        selectOptions: getOptions(statusList, dadosPreenchidos?.statusAtual?.id),
                    },
                    {
                        line: 2,
                        colSpan: "md:col-span-2",
                        nome: "Observação",
                        chave: "observacao",
                        tipo: "textarea",
                        mensagem: "Motivo ou observação da mudança de status (opcional)",
                        obrigatorio: false,
                        redimensionavel: true,
                    }
                ])
            ],
            acoes: [
                { nome: "Cancelar", chave: "voltar", tipo: "botao" },
                { nome: isEditMode ? "Atualizar Status" : "Confirmar Inscrição", chave: "salvar", tipo: "submit" },
            ],
        },
    };

    const chamarFuncao = async (nomeFuncao = "", valor: any = null) => {
        switch (nomeFuncao) {
            case "salvar":
                await salvarRegistro(valor);
                break;
            case "voltar":
                voltarRegistro();
                break;
            case "editar":
                editarRegistro(valor);
                break;
            default:
                break;
        }
    };

    const voltarRegistro = () => {
        router.push("/gestao-extra-sisu/inscricao");
    };

    const salvarRegistro = async (item: any) => {
        try {
            let body;

            if (isEditMode) {
                // Modo Edição: Dispara PATCH /inscricoes/{id}/status (Altera status)
                body = {
                    metodo: "patch",
                    uri: `/extra-sisu/inscricoes/${id}/status`,
                    params: {},
                    data: {
                        statusId: item.statusId,
                        observacao: item.observacao
                    },
                };
            } else {
                // Modo Criação: Dispara POST /inscricoes/edital/{editalId} 
                body = {
                    metodo: "post",
                    uri: `/extra-sisu/inscricoes/edital/${item.editalId}`,
                    params: {},
                    data: undefined
                };
            }

            const response = await generica(body);
            if (!response) throw new Error("Resposta inválida do servidor.");
            chamarFuncao("voltar");
        } catch (error) {
            console.error("DEBUG: Erro ao salvar registro:", error);
            alert("Erro ao processar a inscrição.");
        }
    };

    const editarRegistro = async (item: any) => {
        try {
            const body = {
                metodo: "get",
                uri: "/extra-sisu/inscricoes/" + item,
                params: {}
            };
            const response = await generica(body);
            if (!response) throw new Error("Resposta inválida do servidor.");
            
            setDadosPreenchidos({
                ...response.data,
                statusId: response.data.statusAtual?.id
            });
        } catch (error) {
            console.error("DEBUG: Erro ao localizar registro:", error);
        }
    };

    const pesquisarEditais = async () => {
        try {
            const body = {
                metodo: 'get',
                uri: '/extra-sisu/editais',
                params: { size: 100, page: 0 }
            };
            const response = await generica(body);
            if (response?.data?.content) {
                setEditais(response.data.content);
            }
        } catch (error) {
            console.error("DEBUG: Erro ao pesquisar editais:", error);
        }
    };

    const pesquisarStatus = async () => {
        try {
            const body = {
                metodo: 'get',
                uri: '/extra-sisu/status-personalizado',
                params: {}
            };
            const response = await generica(body);
            if (response?.data) {
                setStatusList(response.data);
            }
        } catch (error) {
            console.error("DEBUG: Erro ao pesquisar status:", error);
        }
    };

    useEffect(() => {
        if (isEditMode) {
            pesquisarStatus();
            chamarFuncao("editar", id);
        } else {
            pesquisarEditais();
        }
    }, [id]);

    return (
        <main className="flex flex-wrap justify-center mx-auto">
            <div className="w-full md:w-11/12 lg:w-10/12 2xl:w-3/4 max-w-6xl p-4 pt-10 md:pt-12 md:pb-12">
                <Cabecalho dados={estrutura.cabecalho} />
                <Cadastro
                    estrutura={estrutura}
                    dadosPreenchidos={dadosPreenchidos}
                    setDadosPreenchidos={setDadosPreenchidos}
                    chamarFuncao={chamarFuncao}
                />
            </div>
        </main>
    );
};

export default withAuthorization(CadastroInscricao);