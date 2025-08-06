"use client";
import withAuthorization from "@/components/AuthProvider/withAuthorization";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useEnderecoByCep } from "@/utils/brasilianStates";
import { generica, genericaMultiForm } from "@/utils/api";
import Cadastro from "@/components/Cadastro/Estrutura";
import AplicarMascara from "@/utils/mascaras";
import { useRole } from "@/context/roleContext";

const cadastro = () => {
  const router = useRouter();
  const { id } = useParams();

  // Obtenha activeRole e userRoles do contexto
  const { activeRole, userRoles } = useRole();

  // Verifique se o usuário é privilegiado com base na role ativa
  const isPrivileged = activeRole === "administrador" || activeRole === "gestor";

  // Inicializamos com um objeto contendo 'endereco' para evitar problemas
  const [dadosPreenchidos, setDadosPreenchidos] = useState<any>({
    solicitante: {
      nome: '',
      nomeSocial: '',
      email: '',
      cpf: '',
      telefone: '',
    },
    perfil: {
      fotoPerfil: null,
      tipo: '',
      matricula: '',
      curso: { id: '', nome: '' },
      cursos: [],      // para multi-select de professor
      siape: '',

    },
    perfilSolicitado: '',    // ← adiciona aqui
    // campos “soltos” que você usa quando não está em modo edit:
    tipoUsuario: '',
    matricula: '',
    cursoId: '',
    cursoIds: [],
    siape: '',
    documentos: [],
  });
  const [cursos, setCursos] = useState<any[]>([]);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const isEditMode = id && id !== "criar";
  const isUserSolic = useState<any>([]);
  const getOptions = (lista: any[], selecionado: any) => {
    if (!Array.isArray(lista) || lista.length === 0) return [];
    const options = lista.map((item) => ({
      chave: item.id, // ID do item (numérico, por exemplo)
      valor: item.nome, // Texto exibido no <option>
    }));
    if (isEditMode && selecionado) {
      const selectedId = Number(selecionado); // Converte para número, se necessário
      const selectedOption = options.find((opt) => opt.chave === selectedId);
      if (selectedOption) {
        // Coloca a opção selecionada na frente do array
        return [selectedOption, ...options.filter((opt) => opt.chave !== selectedId)];
      }
    }
    return options;
  };

  const validateFileSize = (files: File[], maxSize: number) => {
    for (const file of files) {
      if (file.size > maxSize) {
        return false;
      }
    }
    return true;
  };

  const estrutura: any = {
    uri: "solicitacao",
    cabecalho: {
      titulo: isEditMode ? "Visualizar Solicitação" : "Solicitar Perfil",
      migalha: [
        { nome: 'Início', link: '/home' },
        { nome: 'Gestão Acesso', link: '/gestao-acesso' },
        { nome: "Solicitações", link: "/gestao-acesso/solicitacoes" },
        {
          nome: isEditMode ? "visualizar" : "Criar",
          link: `/gestao-acesso/solicitacoes/${isEditMode ? id : "criar"}`,
        },
      ],
    },
    cadastro: {
      campos: [
        {
          line: 2,
          colSpan: "md:col-span-1",
          nome: "Tipo de Perfil",
          chave: isEditMode ? "perfilSolicitado" : "tipoUsuario",
          tipo: isEditMode ? "text" : "select",
          mensagem: "Selecione o tipo de usuário",
          selectOptions: isEditMode ? null : [
            { chave: "GESTOR", valor: "GESTOR" },
            { chave: "TECNICO", valor: "TECNICO" },
            { chave: "PROFESSOR", valor: "PROFESSOR" },
            { chave: "ALUNO", valor: "ALUNO" },

          ],
          obrigatorio: true,
          bloqueado: isEditMode,
        },
        {
          line: 2,
          colSpan: "md:col-span-1",
          nome: "Nome Social",
          chave: "solicitante.nomeSocial",
          tipo: "text",
          mensagem: "Digite o nome social",
          obrigatorio: false,
          bloqueado: true,
        },
        {
          line: 3,
          colSpan: "md:col-span-1",
          nome: "Nome do Solicitante",
          chave: "solicitante.nome",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
          bloqueado: true,
          pesquisar: true,
        },
        {
          line: 3,
          colSpan: "md:col-span-1",
          nome: "E-mail",
          chave: "solicitante.email",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
          bloqueado: true,

        },
        {
          line: 3,
          colSpan: "md:col-span-1",
          nome: "CPF",
          chave: "solicitante.cpf",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
          bloqueado: true,
          mascara: "cpf",

        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "Telefone",
          chave: "solicitante.telefone",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
          bloqueado: true,
          mascara: "celular",

        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "Matrícula",
          chave: isEditMode ? "perfil.matricula" : "matricula",
          tipo: "text",
          mensagem: "Digite a matrícula",
          obrigatorio: false,
          exibirPara: ["ALUNO"],
          bloqueado: isEditMode,

        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "Curso",
          chave: isEditMode ? "perfil.curso.nome" : "cursoId",
          tipo: isEditMode ? "text" : "select",
          mensagem: "Selecione o curso",
          obrigatorio: true,
          selectOptions: isEditMode ? null : getOptions(cursos, dadosPreenchidos[0]?.cursoId),
          exibirPara: ["ALUNO"],
          bloqueado: isEditMode,

          // selectOptions: [{ chave: "1", valor: "Engenharia" }, ...]
        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "Cursos",
          chave: isEditMode ? "perfil.cursos" : "cursoIds",
          tipo: "multi-select",
          mensagem: "Selecione cursos",
          obrigatorio: false,
          exibirPara: ["PROFESSOR"],
          selectOptions: isEditMode ? null : getOptions(cursos, Array.isArray(dadosPreenchidos) && dadosPreenchidos[0]?.cursoIds),
          multiple: true, // Permite selecionar múltiplos cursos
          bloqueado: isEditMode,

        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "SIAPE",
          chave: isEditMode ? "perfil.siape" : "siape",
          tipo: "text",
          mensagem: "Digite o SIAPE",
          obrigatorio: true,
          exibirPara: ["ADMINISTRADOR", "GESTOR", "TECNICO", "PROFESSOR"],
          bloqueado: isEditMode,

        },
        ...(id !== "criar" ? [{
          line: 5,
          colSpan: "md:col-span-1",
          nome: "Parecer",
          chave: "parecer",
          tipo: "text", // ou outro tipo apropriado
          mensagem: "Parecer da avaliação da solicitação",
          obrigatorio: isPrivileged ? true : false,
          bloqueado: isEditMode && isPrivileged ? false : true,
        }] : []),

        {
          line: 6,
          colSpan: "md:col-span-1",
          nome: "Documentos (tamanho máximo 2MB)",
          chave: "documentos",
          tipo: "documento",
          mensagem: "Anexe os documentos",
          obrigatorio: true,
          bloqueado: isEditMode,
          maxFileSize: 2 * 1024 * 1024, // 2MB em bytes
          maxFileSizeMessage: "O tamanho máximo permitido por arquivo é 2MB",
        }

      ],
      acoes: isEditMode
        ? isPrivileged && !dadosPreenchidos?.solicitadoPorProprioUsuario // Adicione esta verificação
          ? [
            { nome: "Rejeitar", chave: "rejeitar", tipo: "submit" },
            { nome: "Aprovar", chave: "aprovar", tipo: "submit" },
          ]
          : [
            { nome: "Voltar", chave: "voltar", tipo: "botao" },
          ]
        : [
          { nome: "Cancelar", chave: "voltar", tipo: "botao" },
          { nome: "Solicitar", chave: "salvar", tipo: "submit" },
        ],
    },
  };


  /**
   * Chama funções de acordo com o botão clicado
   */
  const chamarFuncao = async (nomeFuncao = "", valor: any = null) => {
    switch (nomeFuncao) {
      case "salvar":
        await salvarRegistro(valor);
        break;
      case "voltar":
        voltarRegistro();
        break;
      case "visualizar":
        editarRegistro(valor);
        break;
      case "aprovar":
        aprovarRegistro(valor);
        break;
      case "rejeitar":
        rejeitarRegistro(valor);
        break;
      default:
        break;
    }
  };
  const voltarRegistro = () => {
    router.push("/gestao-acesso/solicitacoes");
  };
  const pesquisarRegistroCursos = async (params = null) => {
    try {
      let body = {
        metodo: 'get',
        uri: '/auth/curso',
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
          setCursos(response.data.content);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    }
  };
  /**
   * Salva o registro via POST, transformando os dados para que os itens de endereço
   * fiquem agrupados em um objeto 'endereco'.
   */
  const rejeitarRegistro = async (item: any) => {
    try {
      const formData = {
        parecer: item.parecer,
      }
      const body = {
        metodo: "post",
        uri: "/auth/" + estrutura.uri + "/" + item.id + "/rejeitar",
        params: {},
        data: formData,
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
          title: "Solicitação rejeitada!",
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
  const aprovarRegistro = async (item: any) => {
    try {
      const formData = {
        parecer: item.parecer,
      }
      const body = {
        metodo: "post",
        uri: "/auth/" + estrutura.uri + "/" + item.id + "/aprovar",
        params: {},
        data: formData,
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
          title: "Solicitação aprovada!",
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

  /**
 * Monta um FormData de acordo com item.tipoUsuario:
 * - ALUNO    → matricula + cursoId
 * - PROFESSOR → siape + vários cursoIds
 * - TECNICO  → siape
 * - GESTOR   → siape
 * E em todos os casos anexa os arquivos em documentos[]
 */
  function buildSolicitacaoFormData(item: {
    tipoUsuario: 'ALUNO' | 'PROFESSOR' | 'TECNICO' | 'GESTOR';
    matricula?: string;
    cursoId?: number;
    cursoIds?: number[];
    siape?: string;
    documentos?: File[];
  }): FormData {

    const fd = new FormData();

    switch (item.tipoUsuario) {
      case 'ALUNO':
        if (item.matricula) {
          fd.append('matricula', item.matricula);
        }
        if (item.cursoId != null) {
          fd.append('cursoId', String(item.cursoId));
        }
        break;

      case 'PROFESSOR':
        if (item.siape) {
          fd.append('siape', item.siape);
        }
        if (Array.isArray(item.cursoIds)) {
          item.cursoIds.forEach(id =>
            fd.append('cursoIds', String(id))
          );
        }
        break;

      case 'TECNICO':
      case 'GESTOR':
        if (item.siape) {
          fd.append('siape', item.siape);
        }
        break;
    }

    // Arquivos (sempre chave "documentos")
    if (Array.isArray(item.documentos)) {
      item.documentos.forEach(file =>
        fd.append('documentos', file)
      );
    }

    return fd;
  }
  const salvarRegistro = async (item: any) => {
    try {

      if (item.documentos && item.documentos.length > 0) {
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (!validateFileSize(item.documentos, maxSize)) {
          toast.error("Um ou mais arquivos excedem o tamanho máximo de 2MB");
          return;
        }
      }
      const formData = buildSolicitacaoFormData(item);

      // 2) dispara a chamada multipart
      const response = await genericaMultiForm({
        metodo: 'post',
        uri: `/auth/solicitacao/${item.tipoUsuario.toLowerCase()}`,
        params: {},
        data: formData,
      });

      // 3) tratamento de resposta…
      if (!response) {
        toast.error('Sem conexão: tente novamente.');
        return;
      }
      if (response.status < 200 || response.status >= 300) {
        toast.error(`Erro HTTP ${response.status}`);
        return;
      }
      if (response.data?.errors) {
        Object.entries(response.data.errors).forEach(([campo, msg]: any) =>
          toast.error(`Erro em ${campo}: ${msg}`)
        );
        return;
      }
      if (response.data?.error) {
        toast.error(response.data.error.message);
        return;
      }

      await Swal.fire({
        title: "Solicitação enviada com sucesso!",
        icon: "success",
        customClass: {
          popup: "my-swal-popup",
          title: "my-swal-title",
          htmlContainer: "my-swal-html",
        },
      });
      router.push('/gestao-acesso/solicitacoes');

    } catch (err) {
      console.error('Erro ao salvar registro:', err);
      toast.error('Erro ao enviar solicitação. Tente novamente.');
    }
  };




  /**
   * Localiza o registro para edição e preenche os dados
   */
  // Exemplo assumindo que "campo.chave" === "documentos"
  const editarRegistro = async (item: any) => {
    try {
      // 1) Carrega a solicitação principal
      const responseSolicitacao = await generica({
        metodo: "get",
        uri: `/auth/${estrutura.uri}/${item}`,
        params: {},
        data: {},
      });
      const dto = responseSolicitacao?.data;

      // 2) Carrega o usuário atual para verificar se é o solicitante
      const responseUsuario = await generica({
        metodo: "get",
        uri: "/auth/usuario/current",
        params: {},
        data: {},
      });
      const usuarioAtual = responseUsuario?.data;

      // Verifica se o usuário atual é o solicitante
      const solicitadoPorProprioUsuario = usuarioAtual?.id === dto.solicitante?.id;

      // Clareza: perfilSolicitado pode vir de dto.perfilSolicitado ou dto.tipoUsuario
      const perfilReq = (dto.perfilSolicitado ?? dto.tipoUsuario ?? "").toUpperCase();

      // 3) Atualiza o estado com tudo que veio do servidor
      setDadosPreenchidos({
        id: dto.id,
        solicitante: {
          nome: dto.solicitante.nome,
          nomeSocial: dto.solicitante.nomeSocial,
          email: dto.solicitante.email,
          cpf: dto.solicitante.cpf,
          telefone: dto.solicitante.telefone,
        },
        perfil: {
          fotoPerfil: dto.perfil?.fotoPerfil ?? null,
          tipo: perfilReq,
          matricula: dto.perfil?.matricula ?? "",
          curso: dto.perfil?.curso
            ? { id: dto.perfil.curso.id, nome: dto.perfil.curso.nome }
            : { id: "", nome: "" },
          cursos: Array.isArray(dto.perfil?.cursos)
            ? dto.perfil.cursos.map((c: any) => ({ id: c.id, nome: c.nome }))
            : [],
          siape: dto.perfil?.siape ?? "",
        },
        parecer: dto.parecer ?? "",
        perfilSolicitado: perfilReq,
        tipoUsuario: perfilReq,
        matricula: dto.perfil?.matricula ?? "",
        cursoId: dto.perfil?.curso?.id ?? "",
        cursoIds: Array.isArray(dto.perfil?.cursos)
          ? dto.perfil.cursos.map((c: any) => c.id)
          : [],
        siape: dto.perfil?.siape ?? "",
        documentos: [],
        solicitadoPorProprioUsuario, // Flag indicando se o usuário atual é o solicitante
      });

      // 4) Busca e converte documentos (se houver)
      const responseDocumentos = await generica({
        metodo: "get",
        uri: `/auth/${estrutura.uri}/${item}/documentos`,
        params: {},
        data: {},
      });

      const docList = responseDocumentos && Array.isArray(responseDocumentos.data)
        ? responseDocumentos.data
        : responseDocumentos?.data
          ? [responseDocumentos.data]
          : [];

      const arquivosConvertidos = docList
        .map((doc: any): File | null => {
          if (doc.base64) {
            const bytes = atob(doc.base64);
            const arr = new Uint8Array(bytes.length);
            for (let i = 0; i < bytes.length; i++) {
              arr[i] = bytes.charCodeAt(i);
            }
            const blob = new Blob([arr], {
              type:
                doc.tipo ??
                (doc.nome?.toLowerCase().endsWith(".pdf")
                  ? "application/pdf"
                  : "application/octet-stream"),
            });
            return new File([blob], doc.nome ?? "documento", { type: blob.type });
          }
          return null;
        })
        .filter((f: File | null): f is File => f !== null);

      // 5) Finaliza preenchendo os docs
      setDadosPreenchidos((prev: any) => ({
        ...prev,
        documentos: arquivosConvertidos,
      }));

    } catch (error) {
      console.error("DEBUG: Erro ao localizar registro:", error);
      toast.error("Erro ao localizar registro. Tente novamente!", {
        position: "top-left",
      });
    }
  };

  // 2) Refatore currentUser para mapear o response.data nesse shape:
  const currentUser = async () => {
    try {
      const response = await generica({
        metodo: 'get',
        uri: '/auth/usuario/current',
        data: {}
      });

      if (!response) {
        toast.error('Erro de conexão. Tente novamente.');
        return;
      }

      const user = response.data;
      const upperProfile = (user.tipoUsuario ?? '').toUpperCase();

      const mappedData = {
        solicitante: {
          nome: user.nome || '',
          nomeSocial: user.nomeSocial || '',
          email: user.email || '',
          cpf: user.cpf || '',
          telefone: user.telefone || '',
        },
        perfil: {
          fotoPerfil: user.fotoPerfil || null,
          tipo: user.tipoUsuario || user.perfil?.tipo || '',
          matricula: user.perfil?.matricula || '',
          curso: user.perfil?.curso || {
            id: user.cursoId || '',
            nome: user.perfil?.curso?.nome || ''
          },
          cursos: user.perfil?.cursos || [],  // array de { id, nome }
          siape: user.perfil?.siape || '',

        },
        perfilSolicitado: upperProfile,  // ← aqui
        // para os campos que não estão dentro de “perfil”
        tipoUsuario: user.tipoUsuario || '',
        matricula: user.perfil?.matricula || '',
        cursoId: user.perfil?.curso?.id || '',
        cursoIds: user.perfil?.cursos?.map((c: any) => c.id) || [],
        siape: user.perfil?.siape || '',
        documentos: [],  // continua vazio aqui, você carrega depois em editarRegistro
      };

      setDadosPreenchidos(mappedData);
    } catch (error) {
      console.error('Erro ao carregar usuário atual:', error);
      toast.error('Não foi possível carregar o usuário atual.');
    }
  };

  // Efeito exclusivo para o modo de edição
  useEffect(() => {
    pesquisarRegistroCursos();
    if (id === "criar") {
      currentUser();
    }
    if (id && id !== "criar") {
      chamarFuncao("visualizar", id);
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