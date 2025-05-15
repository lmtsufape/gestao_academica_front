"use client"
import withAuthorization from '@/components/AuthProvider/withAuthorization';
import Cabecalho from '@/components/Layout/Interno/Cabecalho';
import Tabela from '@/app/prae/agendamentos/cronograma/tabela/tabela';
import { generica } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const estrutura: any = {

  uri: "cronograma", //caminho base

  cabecalho: { //cabecalho da pagina
    titulo: "Cronogramas",
    migalha: [
      { nome: 'Home', link: '/home' },
      { nome: 'Prae', link: '/prae' },
      { nome: 'Cronogramas', link: '/prae/agendamentos/cronograma' },
    ]
  },

  tabela: {
    configuracoes: {
      pesquisar: true,//campo pesquisar nas colunas (booleano)
      cabecalho: true,//cabecalho da tabela (booleano)
      rodape: true,//rodape da tabela (booleano)
    },
    botoes: [ //links
      { nome: 'Adicionar', chave: 'adicionar', bloqueado: false }, //nome(string),chave(string),bloqueado(booleano)
    ],
    colunas: [ //colunas da tabela
      { nome: "Tipo de Atendimento", chave: "tipoAtendimento.nome", tipo: "texto", selectOptions: null, sort: false, pesquisar: true }, //nome(string),chave(string),tipo(text,select),selectOpcoes([{chave:string, valor:string}]),pesquisar(booleano)
      { nome: "Dia de Atendimento", chave: "data", tipo: "texto", selectOptions: null, sort: false, pesquisar: true }, //nome(string),chave(string),tipo(text,select),selectOpcoes([{chave:string, valor:string}]),pesquisar(booleano)
      { nome: "Quantidade de Vagas", chave: "vagas", tipo: "quantidade", selectOptions: null, sort: false, pesquisar: false },
       { nome: "Horários", chave: "vagas", tipo: "array", selectOptions: null, sort: false, pesquisar: false },
      { nome: "ações", chave: "acoes", tipo: "button", selectOptions: null, sort: false, pesquisar: false },
    ],
    acoes_dropdown: [ //botão de acoes de cada registro
      { nome: 'Editar', chave: 'editar' }, //nome(string),chave(string),bloqueado(booleano)
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
  // Função para carregar os dados
  const pesquisarRegistro = async (params = null) => {
     {console.log('Dados enviados para a tabela:', dados)}
    try {
      let body = {
        metodo: 'get',
        uri: '/prae/' + estrutura.uri,
        //+ '/page',
        params: params != null ? params : { size: 25, page: 0 },
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
    router.push('/prae/agendamentos/cronograma/criar');
  };
  // Função que redireciona para a tela editar
  const editarRegistro = (item: any) => {
    router.push('/prae/agendamentos/cronograma/' + item.id);
  };

const formatarDataBR = (data: string) => {
  if (!data) return '';
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
};

const deletarRegistro = async (item: any) => {
  const confirmacao = await Swal.fire({
    title: `Você deseja deletar o cronograma do dia ${formatarDataBR(item.data)}?`,
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
        uri: '/prae/' + estrutura.uri + '/' + item.id,
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
          title: "Cronograma deletado com sucesso!",
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