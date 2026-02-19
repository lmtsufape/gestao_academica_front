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
    const isEditMode = id && id !== "criar";

    // const getOptions = (lista: any[], selecionado: any) => {
    //     if (!Array.isArray(lista)) return [];
    //         const options = lista.map((item) => ({
    //         chave: item.id,       
    //         valor: item.nome || item.tipo     
    //     }));

    //     return options;
    // };

    const estrutura: any = {
        cabecalho: {
            titulo: isEditMode ? "Editar Edital" : "Cadastrar Edital",
            migalha: [
                { nome: 'Início', link: '/home' },
                { nome: 'Gestão Extra Sisu', link: '/gestao-extra-sisu' },
                { nome: "Editais", link: "/gestao-extra-sisu/editais" },
                { nome: isEditMode ? "Editar" : "Criar", link: `/gestao-extra-sisu/editais/${isEditMode ? id : "criar"}` },
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
                // {
                //     line: 2,
                //     colSpan: "md:col-span-1",
                //     nome: "Tipo de Edital",
                //     chave: "tipoEditalId",
                //     tipo: "select",
                //     mensagem: "Selecione o tipo",
                //     obrigatorio: isEditMode ? false : true,
                //     selectOptions: isEditMode ? null :getOptions(tiposEdital, dadosPreenchidos?.tipoEditalId),
                // },
                {
                    line: 5,
                    colSpan: "md:col-span-1",
                    nome: "Início das Inscrições",
                    chave: "dataInscricao",
                    tipo: "date",
                    mensagem: "Digite",
                    obrigatorio: true,
                },
                {
                    line: 5,
                    colSpan: "md:col-span-1",
                    nome: "Fim das Inscrições",
                    chave: "dataFinalizacao",
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
                {
                    line: 6,
                    colSpan: "md:col-span-1",
                    nome: "Documentos (PDF - máximo 2MB)",
                    chave: "pdf",
                    tipo: "file",
                    mensagem: "Anexe o arquivo PDF",
                    obrigatorio: true,
                    bloqueado: isEditMode,
                    accept: ".pdf",
                    localMode: true,
                    maxFileSize: 2 * 1024 * 1024, 
                    maxFileSizeMessage: "O tamanho máximo permitido por arquivo é 2MB",
                }
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
        router.push("/gestao-extra-sisu/editais");
    };

    const formatarDataParaInput = (dataISO: string) => {
        if (!dataISO) return '';
        // Converte 2026-02-01T00:00:00 para 2026-02-01
        return dataISO.split('T')[0];
    };

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result as string);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const salvarRegistro = async (item: any) => {
        try {
            const dadosParaEnviar = { ...item };
            
            // Processa e converte os arquivos para base64
            if (dadosParaEnviar.pdf instanceof File) {
                dadosParaEnviar.pdf = await convertFileToBase64(dadosParaEnviar.pdf);
            }

            if (dadosParaEnviar.dataPublicacao) {
                dadosParaEnviar.dataPublicacao += "T00:00:00";
            }
            if (dadosParaEnviar.dataInscricao) {
                dadosParaEnviar.dataInscricao += "T00:00:00";
            }
            if (dadosParaEnviar.dataFinalizacao) {
                dadosParaEnviar.dataFinalizacao += "T00:00:00";
            }   
            console.log("DEBUG: Dados para enviar:", dadosParaEnviar);
            const body = {
                metodo: `${isEditMode ? "put" : "post"}`,
                uri: "/extra-sisu/editais" + `${isEditMode ? "/" + item.id : ""}`,
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
                uri: "/extra-sisu/editais/" + item,
                params: {},
                data: item,
            };
            const response = await generica(body);
            if (!response) throw new Error("Resposta inválida do servidor.");
            
            // Formata as datas para o formato do input date (YYYY-MM-DD)
            const dadosFormatados = {
                ...response.data,
                dataInscricao: formatarDataParaInput(response.data.dataInscricao),
                dataFinalizacao: formatarDataParaInput(response.data.dataFinalizacao),
                dataPublicacao: formatarDataParaInput(response.data.dataPublicacao)
            };
            
            setDadosPreenchidos(dadosFormatados);
        } catch (error) {
            console.error("DEBUG: Erro ao localizar registro:", error);
        }
    };

    const pesquisarTipoEdital = async (params = null) => {
    try{
        let body = {
            metodo: 'get',
            uri: '/extra-sisu/tipos-editais',
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

    useEffect(() => {
        pesquisarTipoEdital();
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