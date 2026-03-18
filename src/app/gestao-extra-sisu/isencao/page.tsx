"use client";
import withAuthorization from "@/components/AuthProvider/withAuthorization";
import Cadastro from "@/components/Cadastro/Estrutura";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { generica } from "@/utils/api";

const InscricaoIsencao = () => {
    const router = useRouter();
    const { editalId } = useParams(); // Supondo que a rota passe o ID do edital
    const [dadosPreenchidos, setDadosPreenchidos] = useState<any>({});
    const [motivosIsencao, setMotivosIsencao] = useState([]);

    const getOptions = (lista: any[]) => {
        if (!Array.isArray(lista)) return [];
        return lista.map((item) => ({
            chave: item.id,
            valor: item.nome || item.descricao
        }));
    };

    const estrutura: any = {
        uri: "inscricao-isencao", 
        cabecalho: {
            titulo: "Solicitar Isenção de Taxa",
            migalha: [
                { nome: 'Início', link: '/home' },
                { nome: 'Meus Editais', link: '/meus-editais' },
                { nome: "Solicitação de Isenção", link: "#" },
            ],
        },
        cadastro: {
            campos: [
                {
                    line: 1,
                    colSpan: "md:col-span-2",
                    nome: "NIS (Número de Identificação Social)",
                    chave: "nis",
                    tipo: "text",
                    mensagem: "Informe o seu NIS com 11 dígitos",
                    obrigatorio: true,
                },
                {
                    line: 2,
                    colSpan: "md:col-span-1",
                    nome: "Motivo da Isenção",
                    chave: "motivoIsencaoId",
                    tipo: "select",
                    mensagem: "Selecione a justificativa",
                    obrigatorio: true,
                    selectOptions: getOptions(motivosIsencao),
                },
                {
                    line: 2,
                    colSpan: "md:col-span-1",
                    nome: "Data da Solicitação",
                    chave: "dataSolicitacao",
                    tipo: "date",
                    mensagem: "Data de hoje",
                    obrigatorio: true,
                    desabilitado: true, // Geralmente preenchido pelo sistema
                },
                {
                    line: 3,
                    colSpan: "md:col-span-2",
                    nome: "Justificativa Adicional",
                    chave: "justificativa",
                    tipo: "textarea",
                    mensagem: "Caso necessário, descreva detalhes da sua situação",
                    obrigatorio: false,
                    redimensionavel: true,
                },
                {
                    line: 4,
                    colSpan: "md:col-span-2",
                    nome: "Declaro que as informações acima são verdadeiras sob as penas da lei.",
                    chave: "termoAceite",
                    tipo: "checkbox",
                    obrigatorio: true,
                }
            ],
            acoes: [
                { nome: "Cancelar", chave: "voltar", tipo: "botao" },
                { nome: "Enviar Solicitação", chave: "salvar", tipo: "submit" },
            ],
        },
    };

    const chamarFuncao = async (nomeFuncao = "", valor: any = null) => {
        switch (nomeFuncao) {
            case "salvar":
                await salvarInscricao(valor);
                break;
            case "voltar":
                router.back();
                break;
            default:
                break;
        }
    };

    const salvarInscricao = async (item: any) => {
        try {
            const dadosParaEnviar = { 
                ...item,
                editalId: editalId
            };

            const body = {
                metodo: "post",
                uri: "/isencoes", // Endpoint específico para nova inscrição
                params: {},
                data: dadosParaEnviar,
            };

            const response = await generica(body);
            if (response) {
                alert("Solicitação enviada com sucesso!");
                router.push("/minhas-inscricoes");
            }
        } catch (error) {
            console.error("Erro ao enviar pedido de isenção:", error);
        }
    };

    // Carregar opções de motivos (ex: Baixa Renda, Doador de Sangue, etc.)
    const buscarMotivos = async () => {
        try {
            const body = {
                metodo: 'get',
                uri: '/isencoes/motivos',
                params: { size: 50, page: 0 },
                data: {}
            };
            const response = await generica(body);
            if (response && response.data) {
                setMotivosIsencao(response.data.content || response.data);
            }
        } catch (error) {
            console.error("Erro ao carregar motivos de isenção:", error);
        }
    };

    useEffect(() => {
        buscarMotivos();
        // Setar data atual por padrão
        setDadosPreenchidos({
            dataSolicitacao: new Date().toISOString().split('T')[0]
        });
    }, []);

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

export default withAuthorization(InscricaoIsencao);