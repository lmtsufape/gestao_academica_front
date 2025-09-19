"use client";
import withAuthorization from "@/components/AuthProvider/withAuthorization";
import Cadastro from "@/components/Cadastro/Estrutura";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { generica } from "@/utils/api";

const cadastro = () => {
    const router = useRouter();
    const { id } = useParams();

    const [dadosPreenchidos, setDadosPreenchidos] = useState<any>({ endereco: {} });
    const isEditMode = id && id !== "criar";

    const getOptions = (lista: any[], selecionado: any) => {
        if (!Array.isArray(lista) || lista.length === 0) return [];
        const options = lista.map((item) => ({
            chave: item.id,
            valor: item.nome,
        }));
        if (isEditMode && selecionado) {
            const selectedId = Number(selecionado);
            const selectedOption = options.find((opt) => opt.chave === selectedId);
            if (selectedOption) {
                return [selectedOption, ...options.filter((opt) => opt.chave !== selectedId)];
            }
        }
        return options;
    };

    const estrutura: any = {
        uri: "tipo-unidade-administrativa",
        cabecalho: {
            titulo: isEditMode ? "Editar o Tipo de Unidade Administrativa" : "Cadastrar o Tipo de Unidade Administrativa",
            migalha: [
                { nome: 'Início', link: '/home' },
                { nome: 'Gestão Acesso', link: '/gestao-acesso' },
                { nome: "Tipos de Unidades Administrativas", link: "/gestao-acesso/tipo-unidade-administrativa" },
                { nome: isEditMode ? "Editar" : "Criar", link: `/gestao-acesso/tipo-unidade-administrativa/${isEditMode ? id : "criar"}` },
            ],
        },
        cadastro: {
            campos: [
                {
                    line: 1,
                    colSpan: "md:col-span-1",
                    nome: "Tipo de Unidade Administrativa",
                    chave: "nome",
                    tipo: "text",
                    mensagem: "Digite",
                    obrigatorio: true,
                    maxlength: 50,
                    validacao: {
                        tamanhoMaximo: 50,
                        mensagem: "O nome deve ter no máximo 50 caracteres.",
                    },
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
        router.push("/gestao-acesso/tipo-unidade-administrativa");
    };

    const salvarRegistro = async (item: any) => {
        try {
            // normalizar e validar localmente
            const nome = String(item.nome ?? "").trim();
            const MAX = 50; // ou 50 se você alterar o backend
            if (nome.length < 1 || nome.length > MAX) {
                toast.error(`O tipo deve ter entre 1 e ${MAX} caracteres (atual: ${nome.length}).`, { position: "top-left" });
                return;
            }

            const body = {
                metodo: `${isEditMode ? "patch" : "post"}`,
                uri: "/auth/" + `${isEditMode ? estrutura.uri + "/" + item.id : estrutura.uri}`,
                params: {},
                data: { ...item, nome }, // envia a versão "trimmed"
            };

            const response = await generica(body);
            if (!response || response.status < 200 || response.status >= 300) {
                console.error("DEBUG: Status de erro:", response?.status, response?.statusText);
                toast.error(`Erro na requisição (HTTP ${response?.status || "desconhecido"})`, { position: "top-left" });
                return;
            }
            if (response.data?.errors) {
                Object.keys(response.data.errors).forEach((campoErro) => {
                    toast.error(`Erro em ${campoErro}: ${response.data.errors[campoErro]}`, { position: "top-left" });
                });
            } else if (response.data?.error) {
                toast(response.data.error.message, { position: "top-left" });
            } else {
                Swal.fire({
                    title: "Tipo de UA salvo com sucesso!",
                    icon: "success",
                    customClass: {
                        popup: "my-swal-popup",
                        title: "my-swal-title",
                        htmlContainer: "my-swal-html",
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        chamarFuncao("voltar");
                    }
                });
            }
        } catch (error) {
            console.error("DEBUG: Erro ao salvar registro:", error);
            toast.error("Erro ao salvar registro. Tente novamente!", { position: "top-left" });
        }
    };


    const editarRegistro = async (item: any) => {
        try {
            const body = {
                metodo: "get",
                uri: "/auth/" + estrutura.uri + "/" + item,
                params: {},
                data: item,
            };
            const response = await generica(body);
            if (!response) throw new Error("Resposta inválida do servidor.");
            if (response.data?.errors) {
                Object.keys(response.data.errors).forEach((campoErro) => {
                    toast(`Erro em ${campoErro}: ${response.data.errors[campoErro]}`, {
                        position: "top-left",
                    });
                });
            } else if (response.data?.error) {
                toast.error(response.data.error.message, { position: "top-left" });
            } else {
                setDadosPreenchidos(response.data);
            }
        } catch (error) {
            console.error("DEBUG: Erro ao localizar registro:", error);
            toast.error("Erro ao localizar registro. Tente novamente!", { position: "top-left" });
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