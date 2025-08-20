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

    const [dadosPreenchidos, setDadosPreenchidos] = useState<any>({});
    const isEditMode = id && id !== "criar";

    const estrutura: any = {
        uri: "tipo-edital",
        cabecalho: {
            titulo: isEditMode ? "Editar o Tipo de Edital" : "Cadastrar o Tipo de Edital",
            migalha: [
                { nome: 'Início', link: '/home' },
                { nome: 'Gestão de Editais', link: '/gestao-editais' },
                { nome: "Tipos de Editais", link: "/gestao-editais/tipo-edital" },
                { nome: isEditMode ? "Editar" : "Criar", link: `/gestao-editais/tipo-editais/${isEditMode ? id : "criar"}` },
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
        router.push("/gestao-editais/tipo-edital");
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
            if (!response || response.status < 200 || response.status >= 300) {
                if (response) {
                    console.error("DEBUG: Status de erro:", response.status, 'statusText' in response ? response.statusText : "Sem texto de status");
                }
                toast.error(`Erro na requisição (HTTP ${response?.status || "desconhecido"})`, { position: "top-left" });
                return;
            }
            if (response.data?.errors) {
                Object.keys(response.data.errors).forEach((campoErro) => {
                    toast.error(`Erro em ${campoErro}: ${response.data.errors[campoErro]}`, {
                        position: "top-left",
                    });
                });
            } else if (response.data?.error) {
                toast(response.data.error.message, { position: "top-left" });
            } else {
                Swal.fire({
                    title: "Tipo de edital salvo com sucesso!",
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
                uri: "/editais" + estrutura.uri + "/" + item,
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