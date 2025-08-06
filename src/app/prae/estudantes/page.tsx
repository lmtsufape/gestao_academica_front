"use client"
import { useAuthService } from '@/app/authentication/auth.hook';
import withAuthorization from '@/components/AuthProvider/withAuthorization';
import Cabecalho from '@/components/Layout/Interno/Cabecalho';
import Tabela from '@/components/Tabela/Estrutura';
import TabelaEstudantes from '@/components/Tabela/Estudantes/TabelaEstudante';
import { generica } from '@/utils/api';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const cabecalho: any = {
    titulo: "Estudantes",
    migalha: [
      { nome: 'Home', link: '/home' },
      { nome: 'Prae', link: '/prae' },
      { nome: 'Estudantes', link: '/prae/estudantes' },
    ]
  }
  const acoes: Array<Object> = [ { nome: 'Visualizar', chave: 'editar' }]

const PageLista = () => {
  const router = useRouter();
  const auth = useAuthService(); // Add auth service
  const [dados, setDados] = useState<any>({ content: [] });

  const chamarFuncao = (nomeFuncao = "", valor: any = null) => {
    switch (nomeFuncao) {
      case 'pesquisar':
        pesquisarRegistro(valor);
        break;
      case 'editar':
        editarRegistro(valor);
        break;
      default:
        break;
    }
  }
  // Função para carregar os dados
  const pesquisarRegistro = async (params = null) => {
    try {
      let body = {
        metodo: 'get',
        uri: '/prae/estudantes',
        //+ '/page',
        params: params != null ? params : { size: 10, page: 0 },
        data: {}
      }
      const response = await generica(body);
      console.log(response?.data)
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

  // Função que redireciona para a tela editar
  const editarRegistro = (item: any) => {
    router.push('/prae/estudantes/' + item.id);
  };

  useEffect(() => {
    // Wait for auth to load
    if (auth.isLoading) return;
    
    if (auth.isAluno()) {
      editarRegistro({ id: "atual" });
      return;
    }
    chamarFuncao('pesquisar', null);
  }, [auth.isLoading, auth.isAluno]);

  return (
    <main className="flex flex-wrap justify-center mx-auto">
      <div className="w-full sm:w-11/12 2xl:w-10/12 p-4 sm:p-6 md:p-8 lg:p-12 :p-16 2xl:p-20 pt-7 md:pt-8 md:pb-8 ">
        <TabelaEstudantes
          botoes={[]}
          acoes={acoes}
          dados={dados.content}
          chamarFuncao={chamarFuncao}
          cabecalho={cabecalho}
        />
      </div>
    </main>
  );
};

export default withAuthorization(PageLista);