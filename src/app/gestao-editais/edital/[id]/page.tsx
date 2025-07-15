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
    const [unidadesAdministrativas, setUnidadesAdministrativas] = useState([]);
    const [tiposEdital, setTiposEdital] = useState([]);
    const isEditMode = id && id !== "criar";

    const estrutura: any = {
        uri: "edital",
        cabecalho: {
            titulo: isEditMode ? "Editar Edital" : "Cadastrar Edital",
            migalha: [
                { nome: 'Início', link: '/home' },
                { nome: 'Gestão de Editais', link: '/gestao-editais' },
                { nome: "Editais", link: "/gestao-editais/edital" },
                { nome: isEditMode ? "Editar" : "Criar", link: `/gestao-editais/edital/${isEditMode ? id : "criar"}` },
            ],
        },
        cadastro: {
            campos: [
                {
                    line: 1,
                    colSpan: "md:col-span-1",
                    nome: "Título",
                    chave: "titulo",
                    tipo: "text",
                    mensagem: "Digite",
                    obrigatorio: true,
                },
                {
                    line: 1, 
                    colSpan: "md:col-span-1",
                    nome: "Unidade Administrativa",
                    chave: "idUnidadeAdministrativa", 
                    tipo: "select", 
                    mensagem: "Selecione a unidade responsável",
                    obrigatorio: true,
                    selectOptions: unidadesAdministrativas, 
                },
                {
                    line: 2,
                    colSpan: "md:col-span-2",
                    nome: "Descrição",
                    chave: "descricao",
                    tipo: "text",
                    mensagem: "Digite a descrição do edital",
                    obrigatorio: true,
                    redimensionavel: false,
                },
                {
                    line: 3,
                    colSpan: "md:col-span-1",
                    nome: "Tipo de Edital",
                    chave: "tipoEdital", 
                    tipo: "select",
                    mensagem: "Selecione o tipo do edital",
                    obrigatorio: true,
                    selectOptions: tiposEdital, 
                },
                {
                    line: 3,
                    colSpan: "md:col-span-1",
                    nome: "Data de publicação",
                    chave: "dataPublicacao",
                    tipo: "date",
                    obrigatorio: true,
                    redimensionavel: false,
                },
                {
                    line: 4,
                    colSpan: "md:col-span-2",
                    nome: "Início das inscrições",
                    chave: "inicioInscricao",
                    tipo: "date",
                    obrigatorio: true,
                    redimensionavel: false,
                },
                {
                    line: 4,
                    colSpan: "md:col-span-2",
                    nome: "Término das inscrições",
                    chave: "fimInscricao",
                    tipo: "date",
                    obrigatorio: true,
                    redimensionavel: false,
                },
            ],
            acoes: [
                { nome: "Cancelar", chave: "voltar", tipo: "botao" },
                { nome: isEditMode ? "Salvar" : "Cadastrar", chave: "salvar", tipo: "submit" },
            ],
        },
    };

    useEffect(() => {
        const fetchUnidadesAdministrativas = async () => {
            try {
                const response = await generica({ metodo: 'get', uri: '/unidade-administrativa' });

                if (response && response.data) {
                    const options = response.data.map((unidade: any) => ({
                        valor: unidade.id,      
                        rotulo: unidade.nome,   
                    }));
                    setUnidadesAdministrativas(options);
                }
            } catch (error) {
                console.error("Erro ao buscar unidades administrativas:", error);
                toast.error("Não foi possível carregar as unidades administrativas.");
            }
        };

        fetchUnidadesAdministrativas();
    }, []);

        useEffect(() => {
        const fetchTiposEdital = async () => {
            try {
                const response = await generica({ metodo: 'get', uri: '/tipo-edital' });
                if (response && response.data) {
                    const options = response.data.content.map((tipo: any) => ({
                        valor: tipo.id,
                        rotulo: tipo.nome,
                    }));
                    setTiposEdital(options);
                }
            } catch (error) {
                toast.error("Não foi possível carregar os tipos de edital.");
            }
        };
        fetchTiposEdital();
    }, []); 

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
        router.push("/gestao-editais/edital");
    };

    const salvarRegistro = async (item: any) => {
        try {
            const body = {
                metodo: `${isEditMode ? "patch" : "post"}`,
                uri: "/" + `${isEditMode ? estrutura.uri + "/" + item.id : estrutura.uri}`,
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
                    title: "Edital salvo com sucesso!",
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
                uri: "/" + estrutura.uri + "/" + item,
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