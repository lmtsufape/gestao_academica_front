"use client"
import withAuthorization from '@/components/AuthProvider/withAuthorization';
import Cabecalho from '@/components/Layout/Interno/Cabecalho';
import Tabela from '@/app/prae/pagamentos-pendentes/tabela/tabela';
import { generica } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

interface Pagamento {
  id: string;
  estudantes: {
    aluno: {
      nome: string;
    };
  };
  tipoBeneficio: {
    tipo: string;
  };
  valorPagamento: number;
  inicioBeneficio: string;
  fimBeneficio: string;
}

interface PagamentoSelecionado {
  id: string;
  nome: string;
  valor: number;
  tipo: string;
}

const estrutura = {
  uri: "beneficio/pendentes",
  cabecalho: {
    titulo: "Pagamentos Pendentes",
    migalha: [
      { nome: 'Home', link: '/home' },
      { nome: 'Prae', link: '/prae' },
      { nome: 'Pagamentos Pendentes', link: '/prae/pagamentos-pendentes' },
    ]
  },
  tabela: {
    configuracoes: {
      pesquisar: true,
      cabecalho: true,
      rodape: true,
    },
    botoes: [
      { nome: 'Fazer Pagamento', chave: 'pagarLote', bloqueado: false },
    ],
    colunas: [
      { nome: "Nome", chave: "estudantes.aluno.nome", tipo: "texto", pesquisar: true },
      { nome: "Tipo de Benefício", chave: "tipoBeneficio.tipo", tipo: "texto", pesquisar: true },
      { nome: "Valor", chave: "valorPagamento", tipo: "texto", pesquisar: true },
      { nome: "Período", chave: "periodo", tipo: "texto", pesquisar: false },
      { nome: "ações", chave: "acoes", tipo: "checkbox", pesquisar: false },
    ],
    acoes_dropdown: [
      { nome: 'Editar', chave: 'editar' },
      { nome: 'Deletar', chave: 'deletar' },
    ]
  }
};

const PageLista = () => {
  const router = useRouter();
  const [dados, setDados] = useState<{ content: Pagamento[]; totalElements?: number }>({ content: [], totalElements: 0 });
  const [itensSelecionados, setItensSelecionados] = useState<Set<string>>(new Set());
  const [modalAberto, setModalAberto] = useState(false);
  const [pagamentosSelecionados, setPagamentosSelecionados] = useState<PagamentoSelecionado[]>([]);


  const chamarFuncao = (nomeFuncao: string, valor: any = null) => {
    switch (nomeFuncao) {
      case 'pesquisar':
        pesquisarRegistro(valor);
        break;
      case 'pagarLote':
        prepararPagamentoLote();
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
  };

  const pesquisarRegistro = async (params: any = null) => {
    try {
      const body = {
        metodo: 'get',
        uri: '/prae/' + estrutura.uri,
        params: params || {},
        data: {}
      };

      const response = await generica(body);

      if (response?.data?.errors) {
        throw new Error("Erro ao carregar registros");
      }

      if (response?.data?.error) {
        throw new Error(response.data.error.message);
      }

      // response.data já é um array
      const formatarData = (dataISO: string) => {
        if (!dataISO) return '';
        const data = new Date(dataISO);
        return data.toLocaleDateString('pt-BR');
      };

      const processado = (response?.data || []).map((item: Pagamento) => ({
        ...item,
        periodo: `${formatarData(item.inicioBeneficio)} até ${formatarData(item.fimBeneficio)}`
      }));

      // agora setamos corretamente o estado no formato esperado pela Tabela
      setDados({
        content: processado,
        totalElements: processado.length // adiciona total para ser usado no rodapé da tabela
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao carregar registros");
    }
  };


  const prepararPagamentoLote = () => {
    if (itensSelecionados.size === 0) {
      toast.error("Selecione pelo menos um pagamento");
      return;
    }

    const hoje = new Date();

    const selecionados = dados.content
      .filter(item => itensSelecionados.has(item.id))
      .map(item => {
        const fim = item.fimBeneficio ? new Date(item.fimBeneficio) : null;
        return {
          id: item.id,
          nome: item.estudantes?.aluno?.nome || 'Nome não disponível',
          valor: item.valorPagamento || 0,
          tipo: item.tipoBeneficio?.tipo || 'Tipo não disponível',
          fimBeneficio: fim
        };
      });

    // Bloquear pagamentos vencidos
    const vencidos = selecionados.filter(p => p.fimBeneficio && p.fimBeneficio < hoje);
    if (vencidos.length > 0) {
      toast.error("Não é possível pagar benefícios vencidos.");
      return;
    }

    setPagamentosSelecionados(selecionados);
    setModalAberto(true);
  };


  const confirmarPagamentos = async () => {
    try {
      const body = {
        metodo: 'post',
        uri: '/prae/pagamento',
        data: pagamentosSelecionados.map(p => ({
          beneficioId: p.id, // ou Number(p.id) se precisar ser numérico
          valor: p.valor,
          data: new Date().toISOString().split('T')[0] // Data atual no formato YYYY-MM-DD
        }))
      };

      const response = await generica(body);

      if (response?.data?.error) {
        throw new Error(response.data.error.message);
      }

      const mensagemSucesso = pagamentosSelecionados.length === 1
        ? "Pagamento processado!"
        : `${pagamentosSelecionados.length} pagamentos processados!`;

      toast.success(mensagemSucesso);
      setModalAberto(false);
      setItensSelecionados(new Set());
      pesquisarRegistro();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao processar pagamentos");
    }
  };

  const editarRegistro = (item: Pagamento) => {
    router.push(`/prae/pagamentos/${item.id}`);
  };

  const deletarRegistro = async (item: Pagamento) => {
    const result = await Swal.fire({
      title: `Deletar pagamento ${item.id}?`,
      text: "Esta ação não pode ser desfeita",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A759F",
      cancelButtonColor: "#9F2A1A",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        const response = await generica({
          metodo: 'delete',
          uri: `/prae/${estrutura.uri}/${item.id}`,
          params: {},
          data: {}
        });

        if (response?.data?.error) {
          throw new Error(response.data.error.message);
        }

        toast.success("Pagamento deletado com sucesso!");
        pesquisarRegistro();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao deletar pagamento");
      }
    }
  };

  useEffect(() => {
    pesquisarRegistro();
  }, []);

  return (
    <main className="flex flex-wrap justify-center mx-auto">
      <div className="w-full sm:w-11/12 2xl:w-10/12 p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 2xl:p-20 pt-7 md:pt-8 md:pb-8">
        <Cabecalho dados={estrutura.cabecalho} />
        <Tabela
          dados={dados}
          estrutura={estrutura}
          chamarFuncao={chamarFuncao}
          itensSelecionados={itensSelecionados}
          onSelecionarItens={setItensSelecionados}
        />

        {/* Modal de Confirmação */}
        {modalAberto && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Confirmar Pagamentos</h3>
              <p className="mb-4">Data: {new Date().toLocaleDateString('pt-BR')}</p>

              <div className="max-h-60 overflow-y-auto mb-4 border rounded">
                {pagamentosSelecionados.map((item) => (
                  <div key={item.id} className="p-3 border-b">
                    <p><strong>Nome:</strong> {item.nome}</p>
                    <p><strong>Valor:</strong> R$ {item.valor.toFixed(2)}</p>
                    <p><strong>Tipo:</strong> {item.tipo}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setModalAberto(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarPagamentos}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Confirmar ({pagamentosSelecionados.length})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default withAuthorization(PageLista);