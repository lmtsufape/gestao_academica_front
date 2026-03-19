'use client';
import withAuthorization from '@/components/AuthProvider/withAuthorization';
import Cabecalho from '@/components/Layout/Interno/Cabecalho';
import Tabela from '@/components/Tabela/Estrutura';
import { generica } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const estrutura: any = {
    uri: "",

    cabecalho: {
        titulo: "Editais Extra Sisu",
        migalha: [
            { nome: 'Início', link: '/home' },
            { nome: 'Extra Sisu', link: '/gestao-extra-sisu' },
            { nome: 'Editais', link: '/gestao-extra-sisu/editais' },
        ]
    },

    tabela: {
        configuracoes: {
            pesquisar: true,
            cabecalho: true,
            rodape: true,
        },
        botoes: [
            { nome: 'Adicionar', chave: 'adicionar', bloqueado: false },
        ],
        colunas: [
            { nome: "Título", chave: "titulo", tipo: "texto", sort: false, pesquisar: true },
            { nome: "Descrição", chave: "descricao", tipo: "texto", sort: false, pesquisar: true },
            { nome: "Início Inscrição", chave: "dataInscricao", tipo: "texto", sort: false, pesquisar: false },
            { nome: "Fim Inscrição", chave: "dataFinalizacao", tipo: "texto", sort: false, pesquisar: false },
            { nome: "Ações", chave: "acoes", tipo: "button", sort: false, pesquisar: false },
        ],
        acoes_dropdown: [
            {   nome: 'LandingPage', 
                chave: 'landingPage', 
                icon: 'Monitor',
                cor: 'text-blue-600'
            },
            { nome: 'Visualizar', chave: 'visualizar' },
            { nome: 'Editar', chave: 'editar' },
            { nome: 'Deletar', chave: 'deletar' },
            
        ]
    }
}

const PageListaExtraSisu = () => {
    const router = useRouter();
    const [dados, setDados] = useState<any>({ content: [] });

    const formatarData = (dataISO: string) => {
        if (!dataISO) return dataISO;
        const regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/;
        if (regex.test(dataISO)) {
            const [ano, mes, dia] = dataISO.split('T')[0].split('-');
            return `${dia}/${mes}/${ano}`;
        }
        return dataISO;
    };


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
            case 'visualizar':
                visualizarRegistro(valor);
                break;
            case 'deletar':
                deletarRegistro(valor);
                break;
            case 'landingPage': 
                LandingPage(valor);
                break;
            default:
                break;
        }
    }

    const pesquisarRegistro = async (params = null) => {
        try {
            let body = {
                metodo: 'get',
                uri: '/extra-sisu/editais',
                params: params != null ? params : { size: 10, page: 0 },
                data: {}
            }
            const response = await generica(body);
            if (response && response.data) {
                // Formata as datas antes de setar os dados
                const dadosFormatados = {
                    ...response.data,
                    content: response.data.content?.map((item: any) => ({
                        ...item,
                        dataInscricao: formatarData(item.dataInscricao),
                        dataFinalizacao: formatarData(item.dataFinalizacao)
                    }))
                };
                setDados(dadosFormatados);
            }
        } catch (error) {
            console.error("Erro ao carregar os registros:", error);
        }
    };

    const adicionarRegistro = () => {
        router.push('/gestao-extra-sisu/editais/criar');
    };

    
    const editarRegistro = (item: any) => {
        router.push('/gestao-extra-sisu/editais/' + item.id);
    };

        const deletarRegistro = async (item: any) => {
        try {
            const body = {
                metodo: 'delete',
                uri: '/extra-sisu/editais/' + item.id,
                params: {},
            };
            const response = await generica(body);
            if (!response) throw new Error('Resposta inválida do servidor.');
            pesquisarRegistro();

            } catch (error) {
                console.error('Erro ao deletar registro:', error);
            }
    };

    const LandingPage = (item: any) => {
    router.push(`/gestao-extra-sisu/landingPage/${item.id}`);
};
        

    const visualizarRegistro = (item: any) => {
        router.push('/gestao-extra-sisu/editais/' + item.id + '/visualizar');
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

export default withAuthorization(PageListaExtraSisu);
