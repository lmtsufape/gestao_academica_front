"use client"
import withAuthorization from '@/components/AuthProvider/withAuthorization';
import Cabecalho from '@/components/Layout/Interno/Cabecalho';
import Tabela from './tabela/tabela';
import { generica } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import AuthService, { useAuthService } from "../../../../authentication/auth.hook";

const PageLista = () => {
  const isProfissional = useAuthService().isProfissional();
  const isAluno = useAuthService().isAluno();
  const router = useRouter();
  const [dados, setDados] = useState<any>({ content: [] });

  const estrutura: any = {

    uri: "agendamento", //caminho base

    cabecalho: { //cabecalho da pagina
      titulo: "Meus Agendamentos",
      migalha: [
        { nome: 'Home', link: '/home' },
        { nome: 'Prae', link: '/prae' },
        { nome: 'Meus Agendamentos', link: '/prae/agendamentos/calendario/meus-agendamentos' },
      ]
    },

    tabela: {
      configuracoes: {
        pesquisar: true,//campo pesquisar nas colunas (booleano)
        cabecalho: true,//cabecalho da tabela (booleano)
        rodape: true,//rodape da tabela (booleano)
      },
      botoes: isAluno ?
        [
          { nome: 'Agendar', chave: 'adicionar', bloqueado: false } //nome(string),chave(string),bloqueado(booleano)
        ] : [],
      colunas: [ //colunas da tabela
        { nome: "Tipo de Atendimento", chave: "tipoAtendimento", tipo: "texto", selectOptions: null, sort: false, pesquisar: true }, //nome(string),chave(string),tipo(text,select),selectOpcoes([{chave:string, valor:string}]),pesquisar(booleano)
        { nome: "Dia de Atendimento", chave: "data", tipo: "texto", selectOptions: null, sort: false, pesquisar: true }, //nome(string),chave(string),tipo(text,select),selectOpcoes([{chave:string, valor:string}]),pesquisar(booleano)
        { nome: "Horário", chave: "vaga.horaInicio", tipo: "texto", selectOptions: null, sort: false, pesquisar: false },
        { nome: "ações", chave: "acoes", tipo: "button", selectOptions: null, sort: false, pesquisar: false },
      ],
      acoes_dropdown: [ //botão de acoes de cada registro
        { nome: 'Deletar', chave: 'deletar' },
      ]
    }

  }

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
  // Função para carregar os dados
  const pesquisarRegistro = async (params = null) => {
    { console.log('Dados enviados para a tabela:', dados) }
    try {
      let body = {
        metodo: 'get',
        uri: '/prae/' + estrutura.uri +
          (isProfissional ? '/profissional' : '/estudante'),
        params: params != null ? params : { size: 10, page: 0 },
        data: {}
      }
      const response = await generica(body);
      //tratamento dos erros
      if (response && response.data.errors != undefined) {
        toast("Erro. Tente novamente!", { position: "bottom-left" });
      } else if (response && response.data.error != undefined) {
        toast(response.data.error.message, { position: "bottom-left" });
      } else {
        if (response && response.data) {
          setDados(response.data);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    }
  };
  // Função que redireciona para a tela adicionar
  const adicionarRegistro = () => {
    router.push('/prae/agendamentos/calendario');
  };
  // Função que redireciona para a tela editar
  const editarRegistro = (item: any) => {
    router.push('/prae/agendamentos/cronograma/' + item.id);
  };

  const formatarDataHoraBR = (data: string, hora: string) => {
    if (!data || !hora) return '';

    // Formata a data (assumindo formato YYYY-MM-DD)
    const [ano, mes, dia] = data.split('-');
    const dataFormatada = `${dia}/${mes}/${ano}`;

    // Ajusta o horário para o fuso local (remove segundos/milissegundos se existirem)
    const horaParts = hora.split(':');
    const horaLocal = `${horaParts[0]}:${horaParts[1]}`; // Pega apenas horas e minutos

    return `${dataFormatada}, às ${horaLocal}`;
  };

  const deletarRegistro = async (item: any) => {
    // Motivos de cancelamento
    const motivosCancelamento = [
      "Tive um imprevisto",
      "Não preciso mais do atendimento",
      "Vou preferir outro horário",
      "Outro"
    ];

    // Estilo personalizado para os alerts
    const swalDesign = {
      background: '#f8fafc',
      confirmButtonColor: '#1A759F',
      cancelButtonColor: '#9F2A1A',
      customClass: {
        container: 'swal-container',
        popup: 'rounded-xl shadow-2xl border border-gray-100',
        title: 'text-2xl font-bold text-gray-800',
        htmlContainer: 'text-gray-600',
        confirmButton: 'px-6 py-2 rounded-lg font-medium',
        cancelButton: 'px-6 py-2 rounded-lg font-medium mr-2',
        input: 'mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
      }
    };

    // 1. Confirmação inicial
    const confirmacaoInicial = await Swal.fire({
      title: 'Confirmar cancelamento?',
      html: `
      <div class="text-left">
        <p class="mb-2">Você está prestes a cancelar:</p>
        <div class="bg-blue-50 p-4 rounded-lg mb-3">
          <p class="font-semibold text-blue-800">${item.tipoAtendimento}</p>
          <p class="text-blue-600">${formatarDataHoraBR(item.data, item.vaga.horaInicio)}</p>
        </div>
        <p class="text-red-500 font-medium">Esta ação não pode ser desfeita.</p>
      </div>
    `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Manter agendamento',
      ...swalDesign
    });

    if (!confirmacaoInicial.isConfirmed) return;

    // 2. Seleção do motivo
    const { value: motivoIndex } = await Swal.fire({
      title: 'Motivo do cancelamento',
      html: `
      <div class="text-left">
        <p class="mb-3">Ajude-nos a melhorar selecionando o motivo:</p>
      </div>
    `,
      input: 'select',
      inputOptions: motivosCancelamento.reduce((acc, motivo, index) => {
        acc[index] = motivo;
        return acc;
      }, {} as Record<number, string>),
      inputPlaceholder: 'Selecione...',
      showCancelButton: true,
      confirmButtonText: 'Próximo',
      cancelButtonText: 'Voltar',
      inputValidator: (value) => !value && 'Por favor, selecione um motivo',
      ...swalDesign
    });

    if (motivoIndex === undefined) return;

    const motivoSelecionado = motivosCancelamento[Number(motivoIndex)];
    let motivoFinal = motivoSelecionado;

    // 3. Se for "Outro", pedir detalhes
    if (motivoSelecionado === 'Outro') {
      const { value: motivoCustomizado } = await Swal.fire({
        title: 'Especifique o motivo',
        html: `
        <div class="text-left">
          <p class="mb-2">Por favor, descreva brevemente o motivo do cancelamento:</p>
        </div>
      `,
        input: 'textarea',
        inputPlaceholder: 'Digite aqui...',
        inputAttributes: {
          'aria-label': 'Digite o motivo do cancelamento'
        },
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Voltar',
        inputValidator: (value) => {
          if (!value) return 'Por favor, informe o motivo';
          if (value.length < 10) return 'Descreva com mais detalhes (mínimo 10 caracteres)';
          return null;
        },
        ...swalDesign
      });

      if (!motivoCustomizado) return;
      motivoFinal = motivoCustomizado;
    }

    // 4. Confirmação final
    const confirmacaoFinal = await Swal.fire({
      title: 'Confirmar cancelamento?',
      html: `
      <div class="text-left">
        <div class="bg-blue-50 p-4 rounded-lg mb-3">
          <p class="font-semibold text-blue-800">${item.tipoAtendimento}</p>
          <p class="text-blue-600">${formatarDataHoraBR(item.data, item.vaga.horaInicio)}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="font-medium text-gray-700">Motivo:</p>
          <p class="text-gray-600 mt-1">${motivoFinal}</p>
        </div>
        <p class="text-red-500 font-medium mt-3">Esta ação não pode ser desfeita.</p>
      </div>
    `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar cancelamento',
      cancelButtonText: 'Voltar',
      ...swalDesign
    });

    if (!confirmacaoFinal.isConfirmed) return;

    // Envio para o backend
    try {
      const body = {
        metodo: 'post',
        uri: '/prae/' + estrutura.uri + '/' + item.id + '/cancelar',
        params: {},
        data: {
          id: item.id,
          motivo: motivoFinal,
          tipoAtendimento: item.tipoAtendimento,
          agendamento: {
            id: item.id,
            data: item.data,
            vaga: item.vaga,
            estudante: item.estudante
          }
        }
      };

      const response = await generica(body);

      if (response?.data?.errors) {
        throw new Error('Erro ao processar');
      } else if (response?.data?.error) {
        throw new Error(response.data.error.message);
      }

      await pesquisarRegistro();

      // Feedback de sucesso
      await Swal.fire({
        title: 'Cancelamento realizado!',
        html: `
        <div class="text-center">
          <svg class="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <p class="mt-4 text-gray-700">Seu agendamento foi cancelado com sucesso.</p>
        </div>
      `,
        confirmButtonText: 'Fechar',
        ...swalDesign
      });

    } catch (error) {
      let errorMessage = 'Ocorreu um erro ao cancelar o agendamento.';

      // Verifica se é uma instância de Error
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      // Verifica se é um objeto com propriedade message (erro de API, por exemplo)
      else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String(error.message);
      }
      // Caso seja uma string simples
      else if (typeof error === 'string') {
        errorMessage = error;
      }

      await Swal.fire({
        title: 'Erro!',
        html: `
      <div class="text-center">
        <svg class="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
        <p class="mt-4 text-gray-700">${errorMessage}</p>
      </div>
    `,
        ...swalDesign
      });
    }
  };

  useEffect(() => {
    chamarFuncao('pesquisar', null);
  }, []);

  return (
    <main className="flex flex-wrap justify-center mx-auto">
      {/* 
      Em telas muito pequenas: w-full, p-4
      A partir de sm (>=640px): p-6
      A partir de md (>=768px): p-8
      A partir de lg (>=1024px): p-12
      A partir de xl (>=1280px): p-16
      A partir de 2xl (>=1536px): p-20 e w-10/12
    */}
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