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
    // Inicializamos com um objeto contendo 'endereco' para evitar problemas
    const [dadosPreenchidos, setDadosPreenchidos] = useState<any>({ endereco: {} });
    const [unidadesGestoras, setUnidadesGestoras] = useState<any[]>([]);
    const [lastMunicipioQuery, setLastMunicipioQuery] = useState("");
    const isEditMode = id && id !== "criar";

    const getOptions = (lista: any[], selecionado: any) => {
        if (!Array.isArray(lista) || lista.length === 0) return [];
        const options = lista.map((item) => ({
            chave: item.id, // ID do item (numérico, por exemplo)
            valor: item.nome, // Texto exibido no <option>
        }));
        if (isEditMode && selecionado) {
            const selectedId = Number(selecionado); // Converte para número, se necessário
            const selectedOption = options.find((opt) => opt.chave === selectedId);
            if (selectedOption) {
                // Coloca a opção selecionada na frente do array
                return [selectedOption, ...options.filter((opt) => opt.chave !== selectedId)];
            }
        }
        return options;
    };

    const estrutura: any = {
        uri: "pagamento",
        cabecalho: {
            titulo: isEditMode ? "Editar Pagamentos" : "Cadastrar Pagamento",
            migalha: [
                { nome: 'Home', link: '/home' },
                { nome: 'Prae', link: '/prae' },
                { nome: 'Pagamentos', link: '/prae/pagamentos' },
                {
                    nome: isEditMode ? "Editar" : "Criar",
                    link: `/prae/pagamentos/${isEditMode ? id : "criar"}`,
                },
            ],
        },
        cadastro: {
            campos: [
                {
                    line: 1,
                    colSpan: "md:col-span-1",
                    nome: "Beneficiario",
                    chave: "auxilioId",
                    tipo: "text",
                    mensagem: "Digite",
                    obrigatorio: true,
                },
                {
                    line: 1,
                    colSpan: "md:col-span-1",
                    nome: "Valor do Pagamento",
                    chave: "valor",
                    tipo: "text",
                    mensagem: "Digite",
                    obrigatorio: true,
                },
                {
                    line: 1,
                    colSpan: "md:col-span-1",
                    nome: "Data de Pagamento",
                    chave: "data",
                    tipo: "date",
                    mensagem: "Digite",
                    obrigatorio: true,
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
        router.push("/prae/pagamentos/pagamentos-realizados");
    };

    const salvarRegistro = async (item: any) => {
        try {

            if (!item.auxilioId || String(item.auxilioId).trim() === "") {
                toast.error("O nome do beneficiário é obrigatório!", { position: "top-left" });
                return;
            }

            const valorNumerico = parseFloat(
                String(item.valor).replace(/\./g, '').replace(',', '.')
            );

            if (isNaN(valorNumerico)) {
                toast.error("O valor do pagamento é inválido!", { position: "top-left" });
                return;
            }

            const itemCorrigido = {
                ...item,
                valor: valorNumerico,
                auxilioId: Number(item.auxilioId),
            };

            const body = {
                metodo: `${isEditMode ? "patch" : "post"}`,
                uri: "/prae/" + `${isEditMode ? estrutura.uri + "/" + item.id : estrutura.uri}`,
                params: {},
                data: itemCorrigido,
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
                    title: "Pagamento registrado com sucesso!",
                    icon: "success",
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
                uri: "/prae/" + estrutura.uri + "/" + item,
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
        const atualizarValorDoAuxilio = async () => {
            if (dadosPreenchidos.auxilioId) {
                try {
                    const body = {
                        metodo: "get",
                        uri: `/prae/auxilio/${dadosPreenchidos.auxilioId}`,
                        params: {},
                    };
                    const response = await generica(body);

                    if (response?.data) {
                        setDadosPreenchidos((prev: any) => ({
                            ...prev,
                            valor: response.data.valorPadrao ?? prev.valor,
                        }));
                    }
                } catch (err) {
                    console.error("Erro ao buscar valor do auxílio:", err);
                }
            }
        };

        atualizarValorDoAuxilio();
    }, [dadosPreenchidos.auxilioId]);


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