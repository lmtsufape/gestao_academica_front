"use client"
import withAuthorization from '@/components/AuthProvider/withAuthorization';
import Cabecalho from '@/components/Layout/Interno/Cabecalho';
import Tabela from '@/components/Tabela/Estrutura';
import { generica } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';



const estrutura: any = {

  uri: "tipo-beneficio", //caminho base

  cabecalho: { //cabecalho da pagina
    titulo: "Tipo de Benefício",
    migalha: [
      { nome: 'Home', link: '/home' },
      { nome: 'PRAE', link: '/prae' },
      { nome: 'Tipo de Benefício', link: '/prae/beneficios/tipos' },
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
      { nome: "Tipo do Benefício", chave: "tipo", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
      { nome: "Descrição", chave: "descricao", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
      { nome: "Natureza do Benefício", chave: "naturezaBeneficio", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
      { nome: "Valor", chave: "valorBeneficio", tipo: "valor", selectOptions: null, sort: false, pesquisar: true },
      { nome: "ações", chave: "acoes", tipo: "button", selectOptions: null, sort: false, pesquisar: false },
    ],
    acoes_dropdown: [ //botão de acoes de cada registro
      { nome: 'Editar', chave: 'editar' }, //nome(string),chave(string),bloq=ueado(booleano)
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

  const naturezasBeneficio = [
    { id: "BOLSA", nome: "Bolsa" },
    { id: "AUXILIO", nome: "Auxílio" },
    { id: "ISENCAO", nome: "Isenção" },
    { id: "OUTROS", nome: "Outros" },
  ];
  // Função para carregar os dados
  const pesquisarRegistro = async (params = null) => {
    try {
      let body = {
        metodo: 'get',
        uri: '/prae/' + estrutura.uri,
        params: params != null ? params : { size: 10, page: 0 },
        data: {}
      };
      const response = await generica(body);

      if (response?.data?.errors) {
        toast("Erro. Tente novamente!", { position: "bottom-left" });
      } else if (response?.data?.error) {
        toast(response.data.error.message, { position: "bottom-left" });
      } else {
        if (response?.data) {
          const content = response.data.content || [];

          const dadosComMascara = content.map((item: any) => ({
            ...item,
            naturezaBeneficio: naturezasBeneficio.find(n => n.id === item.naturezaBeneficio)?.nome || item.naturezaBeneficio,
          }));
          console.log(dadosComMascara);

          setDados({
            content: dadosComMascara,
            totalElements: response.data.totalElements,
            totalPages: response.data.totalPages,
            number: response.data.number,
            size: response.data.size,
          });

        }
      }
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
      toast("Erro ao carregar registros!", { position: "bottom-left" });
    }
  };


  // Função que redireciona para a tela adicionar
  const adicionarRegistro = () => {
    router.push('/prae/beneficios/tipos/criar');
  };
  // Função que redireciona para a tela editar
  const editarRegistro = (item: any) => {
    router.push('/prae/beneficios/tipos/' + item.id);
  };
  // Função que deleta um registro
  const deletarRegistro = async (item: any) => {
    const confirmacao = await Swal.fire({
      title: `Você deseja deletar o tipo do benefício ${item.tipo}?`,
      text: "Essa ação não poderá ser desfeita",
      icon: "warning",
      showCancelButton: true,

      // Ajuste as cores conforme seu tema
      confirmButtonColor: "#1A759F",
      cancelButtonColor: "#9F2A1A",

      confirmButtonText: "Sim, quero deletar!",
      cancelButtonText: "Cancelar",

      // Classes personalizadas
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
            title: "Tipo de benefício deletado com sucesso!",
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