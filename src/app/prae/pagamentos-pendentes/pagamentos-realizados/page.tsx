"use client"
import withAuthorization from '@/components/AuthProvider/withAuthorization';
import Cabecalho from '@/components/Layout/Interno/Cabecalho';
import Tabela from '@/components/Tabela/Estrutura';
import { generica } from '@/utils/api';
import { NoMeals } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const estrutura: any = {

    uri: "/prae/pagamento",

    cabecalho: {
        titulo: "Pagamentos Realizados",
        migalha: [
            { nome: 'Home', link: '/home' },
            { nome: 'Prae', link: '/prae' },
            { nome: 'Pagamentos Realizados', link: '/prae/pagamentos-realizados' },
        ]
    },
    tabela: {
        configuracoes: {
            pesquisar: true,
            cabecalho: true,
            rodape: true,
        },
        botoes: [
        ],
        colunas: [
            { nome: "CPF", chave: "beneficio.estudantes.aluno.cpf", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
            { nome: "Tipo Pagamento", chave: "beneficio.tipoBeneficio.tipo", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
            { nome: "Valor Pago", chave: "valor", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
            { nome: "Data Pagamento ", chave: "data", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
            { nome: "ações", chave: "acoes", tipo: "button", selectOptions: null, sort: false, pesquisar: false },
        ],
        acoes_dropdown: [
            { nome: 'Editar', chave: 'editar' },
            { nome: 'Deletar', chave: 'deletar' },
        ]
    }

}

const PageLista = () => {
    const router = useRouter();
    const [dados, setDados] = useState<any>({ content: [] });

    const chamarFuncao = (nomeFuncao = "", valor: any = null) => {
        switch (nomeFuncao) {
            case 'pesquisar':
                pesquisarRegistro(valor);
                break;
            case 'adicionar':
                adicionarRegistro();
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
    }

    const formatarDataBR = (dataISO: string | null) => {
        if (!dataISO || typeof dataISO !== 'string') return dataISO;

        const partes = dataISO.split("-");
        if (partes.length !== 3) return dataISO;

        const [ano, mes, dia] = partes;
        return `${dia}/${mes}/${ano}`;
    };

    const pesquisarRegistro = async (params = null) => {
        try {
            let body = {
                metodo: 'get',
                uri: estrutura.uri,
                params: params != null ? params : { size: 10, page: 0 },
                data: {}
            };

            const response = await generica(body);

            if (response?.data?.errors !== undefined) {
                toast("Erro. Tente novamente!", { position: "bottom-left" });
            } else if (response?.data?.error !== undefined) {
                toast(response.data.error.message, { position: "bottom-left" });
            } else if (Array.isArray(response?.data)) {
                const dadosFormatados = {
                    content: response.data.map((item: any) => ({
                        ...item,
                        data: formatarDataBR(item?.data ?? null),
                        estudante: {
                            ...item.estudante,
                            cpf: item.beneficio?.estudantes?.aluno?.cpf || "CPF não disponível"
                        }
                    })),
                    totalElements: response.data.length,
                    totalPages: 1,
                    size: response.data.length,
                    number: 0,
                    first: true,
                    last: true,
                    numberOfElements: response.data.length,
                    empty: response.data.length === 0
                };

                setDados(dadosFormatados);
            } else {
                toast.error("Resposta inesperada da API (esperado um array).", { position: "top-left" });
            }
        } catch (error) {
            toast.error("Erro ao carregar registros", { position: "top-left" });
        }
    };



    const adicionarRegistro = () => {
        router.push('');
    };

    const editarRegistro = (item: any) => {
        router.push('/prae/pagamentos/' + item.id);
    };

    const deletarRegistro = async (item: any) => {
        const confirmacao = await Swal.fire({
            title: `Você deseja deletar o pagameto ${item.id}?`,
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
                    uri: estrutura.uri + '/' + item.id,
                    params: {},
                    data: {}
                };

                const response = await generica(body);

                if (response && response.data && response.data.errors) {
                    toast.error("Erro. Tente novamente!", { position: "top-left" });
                } else if (response && response.data && response.data.error) {
                    toast.error(response.data.error.message, { position: "top-left" });
                } else {
                    pesquisarRegistro();
                    Swal.fire({
                        title: "Pagamento deletado com sucesso!",
                        icon: "success"
                    });
                }
            } catch (error) {
                console.error('Erro ao deletar registro:', error);
                toast.error("Erro ao deletar registro. Tente novamente!", { position: "top-left" });
            }
        }
    };

    useEffect(() => {
        chamarFuncao('pesquisar', null);
    }, []);

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

export default withAuthorization(PageLista);