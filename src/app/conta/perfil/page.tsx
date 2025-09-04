"use client";

import withAuthorization from '@/components/AuthProvider/withAuthorization';
import Cabecalho from '@/components/Layout/Interno/Cabecalho';
import Cadastro from '@/components/Cadastro/Estrutura';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { generica } from '@/utils/api';
import Swal from 'sweetalert2';

const PagePerfil = () => {
  const { id } = useParams();
  const router = useRouter();
  const isEditMode = id && id !== "criar";
  const [cursos, setCursos] = useState<any[]>([]);
  const [dadosPreenchidos, setDadosPreenchidos] = useState<any>({});
  const [editando, setEditando] = useState(false);

  const getOptions = (lista: any[], selecionado: any) => {
    if (!Array.isArray(lista) || lista.length === 0) return [];
    const options = lista.map((item) => ({
      chave: item.id,
      valor: item.nome,
    }));
    if (isEditMode && selecionado) {
      const selectedId = Number(selecionado);
      const selectedOption = options.find((opt) => opt.chave === selectedId);
      if (selectedOption) {
        return [selectedOption, ...options.filter((opt) => opt.chave !== selectedId)];
      }
    }
    return options;
  };

  const currentUser = async () => {
    try {
      const response = await generica(
        {
          metodo: 'get',
          uri: '/auth/usuario/current',
          data: {}
        }
      );
      if (response?.data?.errors) {
        toast.error("Erro ao carregar dados do usuário!", { position: "top-left" });
      } else {
        setDadosPreenchidos(response?.data);
      }
    } catch (error) {
      toast.error('Erro ao carregar dados!', { position: "top-left" });
    }
  };

  const estrutura: any = {
    uri: "perfil",
    cabecalho: {
      titulo: "Perfil",
      migalha: [
        { nome: 'Home', link: '/home' },
        { nome: 'Perfil', link: '/conta/perfil' },
      ]
    },
    cadastro: {
      campos: [
        {
          line: 1, colSpan: "md:col-span-1", nome: "Foto Perfil",
          chave: "perfil.fotoPerfil", tipo: "foto",
          mensagem: "Anexe a foto",
          obrigatorio: false,
          bloqueado: !editando,
        },
        {
          line: 2, colSpan: "md:col-span-1",
          nome: "Nome",
          chave: "nome",
          tipo: "text",
          bloqueado: !editando
        },
        {
          line: 2,
          colSpan: "md:col-span-1",
          nome: "Nome Social",
          chave: "nomeSocial",
          tipo: "text",
          bloqueado: !editando
        },
        {
          line: 3,
          colSpan: "md:col-span-1",
          nome: "E-mail",
          chave: "email",
          tipo: "text",
          bloqueado: true,
          somenteLeitura: true, // se seu componente suporte isso
        },
        {
          line: 3,
          colSpan: "md:col-span-1",
          nome: "CPF",
          chave: "cpf",
          tipo: "text",
          bloqueado: true,
          somenteLeitura: true,
          mascara: "cpf"
        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "Telefone",
          chave: "telefone",
          tipo: "text",
          bloqueado: !editando,
          mascara: "celular"
        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "Matrícula",
          chave: "perfil.matricula",
          tipo: "text",
          exibirPara: ["ALUNO"],
          bloqueado: true
        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "Curso",
          chave: "perfil.curso.id",
          tipo: "select",
          selectOptions: getOptions(cursos, dadosPreenchidos?.perfil?.curso?.id),
          bloqueado: !editando, exibirPara: ["ALUNO"],
        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "Cursos",
          chave: "perfil.cursos",
          tipo: "multi-select",
          selectOptions: getOptions(cursos, dadosPreenchidos?.perfil?.cursos),
          bloqueado: !editando,
          exibirPara: ["PROFESSOR"],
          multiple: true,
        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "SIAPE",
          chave: "perfil.siape",
          tipo: "text",
          bloqueado: !editando,
          exibirPara: ["ADMINISTRADOR", "GESTOR", "TECNICO", "PROFESSOR"],
        },

      ],
      acoes: [
        { nome: "Voltar", chave: "voltar", tipo: "botao" },
        { nome: editando ? "Salvar" : "Editar", chave: editando ? "salvar" : "editar", tipo: "submit" },
      ]
    },
  };

  const chamarFuncao = async (nomeFuncao = "", valor: any = null) => {
    switch (nomeFuncao) {
      case "salvar":
        await salvarRegistro(valor);
        setEditando(false);
        break;
      case "voltar":
        router.push("/home");
        break;
      case "editar":
        setEditando(true);
        break;
      default:
        break;
    }
  };

  const salvarRegistro = async (item: any) => {
    // Remove campos desnecessários do item
    const { id, perfil, ...rest } = item;

    // Monta o payload com apenas os campos esperados pela API
    const payload = {
      ...rest,
      email: dadosPreenchidos?.email,
      cpf: dadosPreenchidos?.cpf,
    };

    try {
      const response = await generica({
        metodo: "patch",
        uri: `/auth/usuario`,
        data: payload,
      });

      console.log("Payload enviado:", payload);

      if (response && response.data?.errors) {
        Object.values(response.data.errors).forEach((erro: any) =>
          toast.error(erro, { position: "top-left" })
        );
      } else {
        Swal.fire({ title: "Perfil atualizado com sucesso!", icon: "success" }).then(() => {
          router.push("/conta/perfil");
        });
      }
    } catch (error) {
      toast.error("Erro ao salvar registro!", { position: "top-left" });
    }
  };




  useEffect(() => {
    currentUser();
  }, []);

  return (
    <main className="flex flex-wrap justify-center mx-auto">
      <div className="w-full sm:w-11/12 2xl:w-10/12 p-4 sm:p-6 md:p-8 lg:p-12 :p-16 2xl:p-20 pt-7 md:pt-8 md:pb-8 ">
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
}

export default withAuthorization(PagePerfil);
