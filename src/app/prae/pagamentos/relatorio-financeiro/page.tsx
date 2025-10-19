"use client"
import withAuthorization from '@/components/AuthProvider/withAuthorization';
import Cabecalho from '@/components/Layout/Interno/Cabecalho';
import Tabela from './tabela/tabela';
import { generica } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

type StatusBadge = {
    texto: string;
    classe: string;
};

type FinanceiroItem = {
    id: string;
    periodo: string;
    receitas: number;
    despesas: number;
    saldo: number;
    tipoComum: string;
    quantidade: number;
    status: StatusBadge;
};

type FiltrosRelatorio = {
    periodoInicio: string;
    periodoFim: string;
    tipo: string;
};

interface AgrupadoItem {
    periodo: string;
    receitas: number;
    despesas: number;
    saldo: number;
    quantidade: number;
    tipos: { [key: string]: number };
    tipoComum?: string;
}

type DadosRelatorio = {
    content: FinanceiroItem[];
    totalElements?: number;
    totalPages?: number;
    size?: number;
    number?: number;
};

const estrutura = {
    uri: "pagamento",
    cabecalho: {
        titulo: "Relatório Financeiro de Benefícios",
        migalha: [
            { nome: 'Home', link: '/home' },
            { nome: 'Financeiro', link: '/financeiro' },
            { nome: 'Relatório de Benefícios', link: '/financeiro/relatorio' },
        ]
    },
    tabela: {
        configuracoes: {
            pesquisar: true,
            cabecalho: true,
            rodape: true,
            exportar: false,
        },
        botoes: [
        ],
        colunas: [
            { nome: "Mês/Ano", chave: "periodo", tipo: "texto", selectOptions: null, sort: true, pesquisar: true },
            { nome: "Total de Benefícios", chave: "despesas", tipo: "moeda", selectOptions: null, sort: true, pesquisar: false },
            { nome: "Quantidade", chave: "quantidade", tipo: "numero", selectOptions: null, sort: true, pesquisar: false },
            { nome: "Tipo Mais Comum", chave: "tipoComum", tipo: "texto", selectOptions: null, sort: true, pesquisar: false },
        ],
        acoes_dropdown: []
    }
};

const PageLista = () => {
    const router = useRouter();
    const [dados, setDados] = useState<DadosRelatorio>({
        content: [],
        totalElements: 0,
        totalPages: 1,
        size: 10,
        number: 0
    });
    const [filtros, setFiltros] = useState<FiltrosRelatorio>({
        periodoInicio: '',
        periodoFim: '',
        tipo: 'todos'
    });
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const chamarFuncao = (nomeFuncao = "", valor: any = null) => {
        switch (nomeFuncao) {
            case 'pesquisar':
                // Extrai parâmetros de ordenação se existirem
                const sortParams = valor?.sort?.split(',');
                if (sortParams?.length === 2) {
                    pesquisarRegistro(valor, sortParams[0], sortParams[1]);
                } else {
                    pesquisarRegistro(valor);
                }
                break;
            case 'gerar':
                gerarRelatorio();
                break;
            default:
                break;
        }
    };

    const ordenarDados = (dados: any[], campo: string, direcao: string) => {
        return [...dados].sort((a, b) => {
            // Tratamento especial para campos de data (periodo no formato MM/AAAA)
            if (campo === 'periodo') {
                const [mesA, anoA] = a.periodo.split('/').map(Number);
                const [mesB, anoB] = b.periodo.split('/').map(Number);
                const dateA = new Date(anoA, mesA - 1);
                const dateB = new Date(anoB, mesB - 1);

                return direcao === 'asc'
                    ? dateA.getTime() - dateB.getTime()
                    : dateB.getTime() - dateA.getTime();
            }

            // Campos numéricos
            if (campo === 'receitas' || campo === 'despesas' || campo === 'saldo' || campo === 'quantidade') {
                return direcao === 'asc'
                    ? (a[campo] || 0) - (b[campo] || 0)
                    : (b[campo] || 0) - (a[campo] || 0);
            }

            // Campos de texto
            const valorA = String(a[campo] || '').toLowerCase();
            const valorB = String(b[campo] || '').toLowerCase();

            if (valorA < valorB) return direcao === 'asc' ? -1 : 1;
            if (valorA > valorB) return direcao === 'asc' ? 1 : -1;
            return 0;
        });
    };

    const agruparPorPeriodo = (dados: any[]) => {
        const agrupados: { [key: string]: any } = {};

        dados.forEach((item: any) => {
            const data = new Date(item.data);
            const periodo = `${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
            const tipo = item.beneficio?.tipoBeneficio?.tipo || 'Desconhecido';
            const valor = item.valor || 0;

            if (!agrupados[periodo]) {
                agrupados[periodo] = {
                    periodo,
                    receitas: 0,
                    despesas: 0,
                    saldo: 0,
                    quantidade: 0,
                    tipos: {} as { [key: string]: number }
                };
            }

            if (tipo.toLowerCase().includes('receita')) {
                agrupados[periodo].receitas += valor;
                agrupados[periodo].saldo += valor;
            } else {
                agrupados[periodo].despesas += valor;
                agrupados[periodo].saldo -= valor;
            }

            agrupados[periodo].quantidade += 1;
            agrupados[periodo].tipos[tipo] = (agrupados[periodo].tipos[tipo] || 0) + 1;
        });

        // Define o tipo mais comum
        Object.values(agrupados).forEach((item: AgrupadoItem) => {
            const tipoMaisComum = Object.entries(item.tipos).reduce((a, b) => a[1] > b[1] ? a : b)[0];
            item.tipoComum = tipoMaisComum;
        });

        return Object.values(agrupados);
    };

    const pesquisarRegistro = async (params = null, sortField = null, sortDirection = 'asc') => {
        try {
            const body = {
                metodo: 'get',
                uri: '/prae/' + estrutura.uri,
                params: params || {
                    size: 10,
                    page: 0,
                    ...filtros
                },
                data: {}
            };

            const response = await generica(body);

            if (response?.data?.errors || response?.data?.error) {
                toast.error("Erro ao carregar relatório. Tente novamente!", { position: "bottom-left" });
            } else if (response?.data) {
                let dadosAgrupados = agruparPorPeriodo(response.data);

                // Aplica ordenação se especificado
                if (sortField) {
                    dadosAgrupados = ordenarDados(dadosAgrupados, sortField, sortDirection);
                }

                const dadosFormatados = dadosAgrupados.map((item: any) => ({
                    id: item.periodo,
                    periodo: item.periodo,
                    receitas: item.receitas,
                    despesas: item.despesas,
                    saldo: item.saldo,
                    tipoComum: item.tipoComum,
                    quantidade: item.quantidade,
                    status: getStatusBadge(item.saldo)
                }));

                setDados({
                    content: dadosFormatados,
                    totalElements: dadosFormatados.length,
                    totalPages: 1,
                    size: 10,
                    number: 0
                });
            }
        } catch (error) {
            console.error('Erro ao carregar relatório:', error);
            toast.error("Erro ao carregar relatório financeiro", { position: "bottom-left" });
        }
    };

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const getStatusBadge = (saldo: number): StatusBadge => {
        return saldo >= 0
            ? { texto: 'Positivo', classe: 'bg-green-100 text-green-800' }
            : { texto: 'Negativo', classe: 'bg-red-100 text-red-800' };
    };

    const gerarRelatorio = async () => {
        try {
            const { value: formValues } = await Swal.fire({
                title: 'Gerar Novo Relatório',
                html: `
                <div class="swal2-form-group">
                    <label for="periodoInicio">Período Início (MM/AAAA)</label>
                    <input id="periodoInicio" type="text" placeholder="MM/AAAA" class="swal2-input" />
                </div>
                <div class="swal2-form-group">
                    <label for="periodoFim">Período Fim (MM/AAAA)</label>
                    <input id="periodoFim" type="text" placeholder="MM/AAAA" class="swal2-input" />
                </div>
                <div class="swal2-form-group">
                    <label for="tipo">Tipo</label>
                    <select id="tipo" class="swal2-select">
                        <option value="todos">Todos</option>
                        <option value="receita">Receita</option>
                        <option value="despesa">Despesa</option>
                    </select>
                </div>
            `,
                showCancelButton: true,
                confirmButtonText: 'Gerar',
                cancelButtonText: 'Cancelar',
                focusConfirm: false,
                preConfirm: () => {
                    const periodoInicio = (Swal.getPopup()?.querySelector('#periodoInicio') as HTMLInputElement)?.value.trim();
                    const periodoFim = (Swal.getPopup()?.querySelector('#periodoFim') as HTMLInputElement)?.value.trim();
                    const tipo = (Swal.getPopup()?.querySelector('#tipo') as HTMLSelectElement)?.value;

                    if (!periodoInicio || !periodoFim) {
                        Swal.showValidationMessage('Preencha o período inicial e final');
                        return;
                    }

                    const formatoValido = /^\d{2}\/\d{4}$/;
                    if (!formatoValido.test(periodoInicio) || !formatoValido.test(periodoFim)) {
                        Swal.showValidationMessage('Use o formato MM/AAAA nos campos de período');
                        return;
                    }

                    return { periodoInicio, periodoFim, tipo };
                }
            });

            if (formValues) {
                setFiltros(formValues);
                toast.success("Relatório gerado com sucesso!", { position: "bottom-left" });
            }
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            toast.error("Erro ao gerar relatório", { position: "bottom-left" });
        }
    };

    useEffect(() => {
        pesquisarRegistro();
    }, [filtros, sortConfig]);

    return (
        <main className="flex flex-wrap justify-center mx-auto">
            <div className="w-full sm:w-11/12 2xl:w-10/12 p-4 sm:p-6 md:p-8 lg:p-12 2xl:p-20 pt-7 md:pt-8 md:pb-8">
                <Cabecalho dados={estrutura.cabecalho} />
                <Tabela
                    dados={{
                        ...dados,
                        content: dados.content.map((item: FinanceiroItem) => ({
                            ...item,
                            receitas: formatarMoeda(item.receitas),
                            despesas: formatarMoeda(item.despesas),
                            saldo: formatarMoeda(item.saldo)
                        }))
                    }}
                    estrutura={estrutura}
                    chamarFuncao={chamarFuncao}
                    sortConfig={sortConfig}
                />
            </div>
        </main>
    );
};

export default withAuthorization(PageLista);