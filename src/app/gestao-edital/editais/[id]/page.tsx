"use client";
import withAuthorization from "@/components/AuthProvider/withAuthorization";
import Cadastro from "@/components/Cadastro/Estrutura";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { generica } from "@/utils/api";

const cadastroEdital = () => {
    const router = useRouter();
    const { id } = useParams();

    const [dadosPreenchidos, setDadosPreenchidos] = useState<any>({});
    const [tiposEdital, setTiposEdital] = useState([]);
    const [status, setStatus] = useState([]);
    const isEditMode = id && id !== "criar";

    const getOptions = (lista: any[], selecionado: any) => {
        if (!Array.isArray(lista)) return [];
            const options = lista.map((item) => ({
            chave: item.id,       
            valor: item.nome || item.tipo     
        }));

        return options;
    };

    const estrutura: any = {
        uri: "edital",
        cabecalho: {
            titulo: isEditMode ? "Editar Edital" : "Cadastrar Edital",
            migalha: [
                { nome: 'Início', link: '/home' },
                { nome: 'Gestão de Editais', link: '/gestao-edital/' },
                { nome: "Editais", link: "/gestao-edital/editais" },
                { nome: isEditMode ? "Editar" : "Criar", link: `/gestao-edital/editais/${isEditMode ? id : "criar"}` },
            ],
        },
        cadastro: {
            campos: [
                {
                    line: 1,
                    colSpan: "md:col-span-2",
                    nome: "Título",
                    chave: "titulo",
                    tipo: "text",
                    mensagem: "Digite o título do edital",
                    obrigatorio: true,
                },
                {
                    line: 2,
                    colSpan: "md:col-span-1",
                    nome: "Tipo de Edital",
                    chave: "tipoEditalId",
                    tipo: "select",
                    mensagem: "Selecione o tipo",
                    obrigatorio: isEditMode ? false : true,
                    selectOptions: isEditMode ? null :getOptions(tiposEdital, dadosPreenchidos?.tipoEditalId),
                },
                {
                    line: 2,
                    colSpan: "md:col-span-1",
                    nome: "Status",
                    chave: "statusAtualId",
                    tipo: "select",
                    mensagem: "Selecione o status",
                    obrigatorio: isEditMode ? false : true,
                    selectOptions: isEditMode ? null :getOptions(status, dadosPreenchidos?.statusAtualId),
                },
                {
                    line: 4,
                    colSpan: "md:col-span-1",
                    nome: "Data de Publicação",
                    chave: "dataPublicacao",
                    tipo: "date",
                    mensagem: "Selecione a data de publicação",
                    obrigatorio: true,
                },
                {
                    line: 5,
                    colSpan: "md:col-span-1",
                    nome: "Início das Inscrições",
                    chave: "inicioInscricao",
                    tipo: "date",
                    mensagem: "Digite",
                    obrigatorio: true,
                },
                {
                    line: 5,
                    colSpan: "md:col-span-1",
                    nome: "Fim das Inscrições",
                    chave: "fimIncricao",
                    tipo: "date",
                    mensagem: "Digite",
                    obrigatorio: true,
                }, 
                {
                    line: 3,
                    colSpan: "md:col-span-2",
                    nome: "Descrição",
                    chave: "descricao",
                    tipo: "textarea",
                    mensagem: "Digite a descrição do edital",
                    obrigatorio: false,
                    redimensionavel: true,
                }, 
            ],
            acoes: [
                { nome: "Cancelar", chave: "voltar", tipo: "botao" },
                { nome: isEditMode ? "Salvar" : "Cadastrar", chave: "salvar", tipo: "submit" },
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
        router.push("/gestao-edital/editais");
    };

    const salvarRegistro = async (item: any) => {
        try {
            const dadosParaEnviar = { ...item };

            //converte dadas para o formato esperado pela API ( date para local date time )
            if (dadosParaEnviar.dataPublicacao) {
                dadosParaEnviar.dataPublicacao += "T00:00:00";
            }
            if (dadosParaEnviar.inicioInscricao) {
                dadosParaEnviar.inicioInscricao += "T00:00:00";
            }
            if (dadosParaEnviar.fimIncricao) {
                dadosParaEnviar.fimIncricao += "T00:00:00";
            }   
            const body = {
                metodo: `${isEditMode ? "patch" : "post"}`,
                uri: "/editais/" + `${isEditMode ? estrutura.uri + "/" + item.id : estrutura.uri}`,
                params: {},
                data: dadosParaEnviar, 
            };
            const response = await generica(body);
            if (!response) throw new Error("Resposta inválida do servidor.");
            chamarFuncao("voltar");
        } catch (error) {
            console.error("DEBUG: Erro ao salvar registro:", error);
        }
    };

    const editarRegistro = async (item: any) => {
        try {
            const body = {
                metodo: "get",
                uri: "/editais/" + estrutura.uri + "/" + item,
                params: {},
                data: item,
            };
            const response = await generica(body);
            if (!response) throw new Error("Resposta inválida do servidor.");
            setDadosPreenchidos(response.data);
        } catch (error) {
            console.error("DEBUG: Erro ao localizar registro:", error);
        }
    };

    const pesquisarTipoEdital = async (params = null) => {
    try{
        let body = {
            metodo: 'get',
            uri: '/editais/'+'tipo-edital',
            params: params != null ? params : { size: 25, page: 0 },
            data: {}
        }
        const response = await generica(body);
        
        if (response && response.data) {
            setTiposEdital(response.data.content); 
        } 
        } catch (error) {
            console.error("DEBUG: Erro ao pesquisar tipo de edital:", error);
        }
    }

    const pesquisarStatusPersonalizado = async (params = null) => {
        try{
            let body = {
                metodo: 'get',
                uri: '/editais/'+'status-personalizado',
                params: params != null ? params : { size: 25, page: 0 },
                data: {}
            }
            const response = await generica(body);

            if (response && response.data) {
                setStatus(response.data);
            }
        } catch (error) {
            console.error("DEBUG: Erro ao pesquisar o status personalizado:", error);
        }
    }

    useEffect(() => {
        pesquisarTipoEdital();
        pesquisarStatusPersonalizado();
        if (isEditMode) {
            chamarFuncao("editar", id);
        }
        if (id && id !== "criar") {
            chamarFuncao("editar", id);
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

export default withAuthorization(cadastroEdital);