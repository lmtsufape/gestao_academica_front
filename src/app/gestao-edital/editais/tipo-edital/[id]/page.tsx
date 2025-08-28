"use client";
import withAuthorization from "@/components/AuthProvider/withAuthorization";
import Cadastro from "@/components/Cadastro/Estrutura";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { generica } from "@/utils/api";

const cadastro = () => {
    const router = useRouter();
    const { id } = useParams();

    const [dadosPreenchidos, setDadosPreenchidos] = useState<any>({});
    const isEditMode = id && id !== "criar";

    const estrutura: any = {
        uri: "tipo-edital",
        cabecalho: {
            titulo: isEditMode ? "Editar o Tipo de Edital" : "Cadastrar o Tipo de Edital",
            migalha: [
                { nome: 'Início', link: '/home' },
                { nome: 'Gestão de Editais', link: '/gestao-edital/editais' },
                { nome: "Tipos de Editais", link: "/gestao-edital/editais/tipo-edital" },
                { nome: isEditMode ? "Editar" : "Criar", link: `/gestao-edital/editais/tipo-editais/${isEditMode ? id : "criar"}` },
            ],
        },
        cadastro: {
            campos: [
                {
                    line: 1,
                    colSpan: "md:col-span-1",
                    nome: "Tipo de Edital",
                    chave: "nome",
                    tipo: "text",
                    mensagem: "Digite",
                    obrigatorio: true,
                },
                {
                    line: 2,
                    colSpan: "md:col-span-2",
                    nome: "Descrição",
                    chave: "descricao",
                    tipo: "text",
                    mensagem: "Digite a descrição do tipo de edital",
                    obrigatorio: false,
                    redimensionavel: false,
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
        router.push("/gestao-edital/editais/tipo-edital");
    };

    const salvarRegistro = async (item: any) => {
        try {
            
            const body = {
                metodo: `${isEditMode ? "patch" : "post"}`,
                uri: "/editais/" + `${isEditMode ? estrutura.uri + "/" + item.id : estrutura.uri}`,
                params: {},
                data: item,
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

    useEffect(() => {
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

export default withAuthorization(cadastro);