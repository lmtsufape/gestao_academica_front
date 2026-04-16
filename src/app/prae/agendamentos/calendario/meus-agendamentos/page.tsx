"use client";
import withAuthorization from "@/components/AuthProvider/withAuthorization";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import Tabela from "../meus-agendamentos/tabela/tabela";
import { generica } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import AuthService, {
  useAuthService,
} from "../../../../authentication/auth.hook";

const PageLista = () => {
  const isProfissional = useAuthService().isProfissional();
  const isAluno = useAuthService().isAluno();
  const router = useRouter();
  const [dados, setDados] = useState<any>({ content: [] });

  const estrutura: any = {
    uri: "agendamento", //caminho base

    cabecalho: {
      //cabecalho da pagina
      titulo: "Meus Agendamentos",
      migalha: [
        { nome: "Home", link: "/home" },
        { nome: "Prae", link: "/prae" },
        {
          nome: "Meus Agendamentos",
          link: "/prae/agendamentos/calendario/meus-agendamentos",
        },
      ],
    },

    tabela: {
      configuracoes: {
        pesquisar: true, //campo pesquisar nas colunas (booleano)
        cabecalho: true, //cabecalho da tabela (booleano)
        rodape: true, //rodape da tabela (booleano)
      },
      botoes: isAluno
        ? [
            { nome: "Agendar", chave: "adicionar", bloqueado: false }, //nome(string),chave(string),bloqueado(booleano)
          ]
        : [],
      colunas: [
        //colunas da tabela
        {
          nome: "Tipo de Atendimento",
          chave: "tipoAtendimento",
          tipo: "texto",
          selectOptions: null,
          sort: false,
          pesquisar: true,
        }, //nome(string),chave(string),tipo(text,select),selectOpcoes([{chave:string, valor:string}]),pesquisar(booleano)
        {
          nome: "Dia de Atendimento",
          chave: "data",
          tipo: "texto",
          selectOptions: null,
          sort: false,
          pesquisar: true,
        }, //nome(string),chave(string),tipo(text,select),selectOpcoes([{chave:string, valor:string}]),pesquisar(booleano)
        {
          nome: "Horário",
          chave: "vaga.horaInicio",
          tipo: "texto",
          selectOptions: null,
          sort: false,
          pesquisar: false,
        },
        {
          nome: "Modalidade",
          chave: "modalidade",
          tipo: "texto",
          selectOptions: null,
          sort: false,
          pesquisar: true,
        },
        {
          nome: "ações",
          chave: "acoes",
          tipo: "button",
          selectOptions: null,
          sort: false,
          pesquisar: false,
        },
      ],
      acoes_dropdown: [
        //botão de acoes de cada registro
        { nome: "Deletar", chave: "deletar" },
      ],
    },
  };

  const chamarFuncao = (nomeFuncao = "", valor: any = null) => {
    switch (nomeFuncao) {
      case "pesquisar":
        pesquisarRegistro(valor);
        break;
      case "adicionar":
        adicionarRegistro();
        break;
      case "editar":
        editarRegistro(valor);
        break;
      case "deletar":
        deletarRegistro(valor);
        break;
      default:
        break;
    }
  };
  // Função para carregar os dados

  const pesquisarRegistro = async (params = null) => {
    {
      console.log("Dados enviados para a tabela:", dados);
    }
    try {
      let body = {
        metodo: "get",
        uri:
          "/prae/" +
          estrutura.uri +
          (isProfissional ? "/profissional" : "/estudante"),
        params: params != null ? params : { size: 10, page: 0 },
        data: {},
      };
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
      console.error("Erro ao carregar registros:", error);
    }
  };
  // Função que redireciona para a tela adicionar
  const adicionarRegistro = () => {
    router.push("/prae/agendamentos/calendario");
  };

  const formatarDataHoraBR = (data: string, hora: string) => {
    if (!data || !hora) return "";

    // Formata a data (assumindo formato YYYY-MM-DD)
    const [ano, mes, dia] = data.split("-");
    const dataFormatada = `${dia}/${mes}/${ano}`;

    // Ajusta o horário para o fuso local (remove segundos/milissegundos se existirem)
    const horaParts = hora.split(":");
    const horaLocal = `${horaParts[0]}:${horaParts[1]}`; // Pega apenas horas e minutos

    return `${dataFormatada}, às ${horaLocal}`;
  };

  // NOVA FUNÇÃO: Editar modalidade do agendamento
  const editarRegistro = async (item: any) => {
    const swalDesign = {
      background: "#f8fafc",
      confirmButtonColor: "#972E3F",
      cancelButtonColor: "#393C47",
      customClass: {
        container: "swal-container",
        popup: "rounded-xl shadow-2xl border border-gray-100 px-6 pb-6 pt-4",
        title: "text-2xl font-bold text-gray-800",
        icon: "swal-question-red",
        htmlContainer: "text-gray-800",
        confirmButton: "px-6 py-2 rounded-lg font-medium",
        cancelButton: "px-6 py-2 rounded-lg font-medium mr-2",
      },
    };

    // 1. Mostrar informações do agendamento e perguntar a nova modalidade
    const result = await Swal.fire({
      title: "Editar Modalidade",
      html: `
        <div style="text-align:left; font-size:14px;">
          <p style="margin-bottom:10px; color:#6b7280;">
            Você está editando a modalidade deste atendimento:
          </p>

          <div style="
            background:#eff6ff;
            padding:14px;
            border-radius:10px;
            border:1px solid #dbeafe;
            margin-bottom:16px;
          ">
            <p style="margin:0; font-weight:600; color:#1e3a8a;">
              ${item.tipoAtendimento}
            </p>
            <p style="margin:4px 0 0 0; color:#2563eb; font-size:13px;">
              ${formatarDataHoraBR(item.data, item.vaga.horaInicio)}
            </p>
            <p style="margin:4px 0 0 0; color:#2563eb; font-size:13px;">
              Modalidade atual: <strong>${item.modalidade || "Não definida"}</strong>
            </p>
          </div>

          <p style="margin-bottom:8px; font-weight:500; color:#374151;">
            Escolha a nova modalidade:
          </p>

          <div style="display:flex; gap:12px; justify-content:center; margin-top:12px;">
            <button id="btnPresencial" class="swal-presencial" style="
              background: #972E3F;
              color: white;
              padding: 10px 24px;
              border-radius: 8px;
              border: none;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s;
            " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
              Presencial
            </button>
            <button id="btnRemoto" class="swal-remoto" style="
              background: #393C47;
              color: white;
              padding: 10px 24px;
              border-radius: 8px;
              border: none;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s;
            " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
              Remoto
            </button>
          </div>
        </div>
      `,
      icon: "question",
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      ...swalDesign,
      didRender: () => {
        // Adicionar eventos aos botões customizados
        const presencialBtn = document.getElementById("btnPresencial");
        const remotoBtn = document.getElementById("btnRemoto");

        if (presencialBtn) {
          presencialBtn.onclick = () => {
            Swal.clickConfirm();
            // @ts-ignore
            window.novaModalidade = "PRESENCIAL";
          };
        }

        if (remotoBtn) {
          remotoBtn.onclick = () => {
            Swal.clickConfirm();
            // @ts-ignore
            window.novaModalidade = "REMOTO";
          };
        }
      },
    });

    if (!result.isConfirmed) return;

    // @ts-ignore
    const novaModalidade = window.novaModalidade;

    if (!novaModalidade) {
      toast.error("Selecione uma modalidade!", { position: "bottom-left" });
      return;
    }

    // 2. Confirmar a alteração
    const confirmacao = await Swal.fire({
      title: "Confirmar alteração?",
      html: `
        <div style="text-align:left;">
          <div style="background:#eff6ff; padding:12px; border-radius:10px; margin-bottom:10px;">
            <p style="font-weight:600; color:#1e3a8a;">${item.tipoAtendimento}</p>
            <p style="color:#2563eb; font-size:13px;">
              ${formatarDataHoraBR(item.data, item.vaga.horaInicio)}
            </p>
          </div>

          <div style="background:#f9fafb; padding:12px; border-radius:10px;">
            <p style="font-weight:500;">Alteração:</p>
            <p style="font-size:13px; color:#4b5563;">
              Modalidade: <strong>${item.modalidade || "Não definida"}</strong> → <strong>${novaModalidade}</strong>
            </p>
          </div>

          <p style="margin-top:10px; font-size:13px; color:#ef4444;">
            ⚠️ Esta ação atualizará a modalidade do seu agendamento
          </p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, confirmar alteração",
      cancelButtonText: "Cancelar",
      ...swalDesign,
    });

    if (!confirmacao.isConfirmed) return;

    try {
      const body = {
        metodo: "patch",
        uri: `/prae/${estrutura.uri}/${item.id}/modalidade`,
        params: {},
        data: {
          id: item.id,
          modalidade: novaModalidade,
        },
      };

      const response = await generica(body);

      if (response?.data?.errors) {
        throw new Error("Erro ao processar");
      } else if (response?.data?.error) {
        throw new Error(response.data.error.message);
      }

      // Recarregar a lista
      await pesquisarRegistro();

      await Swal.fire({
        title: "Modalidade atualizada!",
        html: `
          <div style="text-align:center;">
            <p style="margin-top:10px; color:#374151;">
              A modalidade do seu agendamento foi alterada para <strong>${novaModalidade}</strong> com sucesso.
            </p>
          </div>
        `,
        confirmButtonText: "Fechar",
        ...swalDesign,
      });
    } catch (error: any) {
      const errorMessage =
        error?.message || "Ocorreu um erro ao alterar a modalidade.";

      await Swal.fire({
        title: "Erro!",
        html: `
          <div style="text-align:center;">
            <p style="margin-top:10px; color:#374151;">
              ${errorMessage}
            </p>
          </div>
        `,
        confirmButtonText: "Fechar",
        ...swalDesign,
      });
    }
  };

  const deletarRegistro = async (item: any) => {
    const motivosCancelamento: string[] = [
      "Tive um imprevisto",
      "Não preciso mais do atendimento",
      "Vou preferir outro horário",
      "Outro",
    ];

    const swalDesign = {
      background: "#f8fafc",
      confirmButtonColor: "#972E3F",
      cancelButtonColor: "#393C47",
      customClass: {
        container: "swal-container",
        popup: "rounded-xl shadow-2xl border border-gray-100 px-6 pb-6 pt-4",
        title: "text-2xl font-bold text-gray-800",
        icon: "swal-question-red",
        htmlContainer: "text-gray-800",
        confirmButton: "px-6 py-2 rounded-lg font-medium",
        cancelButton: "px-6 py-2 rounded-lg font-medium mr-2",
      },
    };

    // 1. CONFIRMAÇÃO INICIAL
    const confirmacaoInicial = await Swal.fire({
      title: "Cancelar agendamento",
      html: `
    <div style="font-size:14px; color:#374151;">
      
      <p style="margin-bottom:12px;">
        Tem certeza que deseja cancelar este atendimento?
      </p>

      <div style="
        background:#f8fafc;
        border:1px solid #e5e7eb;
        border-radius:12px;
        padding:14px;
        margin-bottom:14px;
      ">
        <div style="font-weight:600; color:#111827; margin-bottom:4px;">
          ${item.tipoAtendimento}
        </div>
        <div style="font-size:13px; color:#6b7280;">
          ${formatarDataHoraBR(item.data, item.vaga.horaInicio)}
        </div>
      </div>

      <div style="
        background:#fef2f2;
        border:1px solid #fecaca;
        border-radius:8px;
        padding:10px;
        font-size:13px;
        color:#b91c1c;
      ">
        Essa ação não pode ser desfeita.
      </div>

    </div>
  `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Cancelar agendamento",
      cancelButtonText: "Voltar",
      reverseButtons: true,
      focusCancel: true,
      ...swalDesign,
    });

    if (!confirmacaoInicial.isConfirmed) return;

    // 2. SELEÇÃO DO MOTIVO
    const { value: motivoIndex } = await Swal.fire({
      title: "Motivo do cancelamento",
      html: `
    <div class="text-left space-y-2 mt-3">
      ${motivosCancelamento
        .map(
          (motivo, index) => `
        <label class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
          <input type="radio" name="motivo" value="${index}" class="w-4 h-4 text-blue-600">
          <span class="text-gray-700">${motivo}</span>
        </label>
      `,
        )
        .join("")}
    </div>
  `,
      showCancelButton: true,
      confirmButtonText: "Próximo",
      cancelButtonText: "Voltar",

      preConfirm: () => {
        const selected = document.querySelector(
          'input[name="motivo"]:checked',
        ) as HTMLInputElement;

        if (!selected) {
          Swal.showValidationMessage("Selecione um motivo");
          return;
        }

        return selected.value;
      },

      ...swalDesign,
    });

    if (motivoIndex === undefined) return;

    const motivoSelecionado = motivosCancelamento[Number(motivoIndex)];
    let motivoFinal = motivoSelecionado;

    // 3. "OUTRO"
    if (motivoSelecionado === "Outro") {
      const { value: motivoCustomizado } = await Swal.fire({
        title: "Especifique o motivo",
        input: "textarea",
        inputPlaceholder: "Digite aqui...",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Voltar",
        inputValidator: (value) => {
          if (!value) return "Por favor, informe o motivo";
          if (value.length < 10)
            return "Descreva com mais detalhes (mínimo 10 caracteres)";
          return null;
        },
        ...swalDesign,
      });

      if (!motivoCustomizado) return;
      motivoFinal = motivoCustomizado;
    }

    // 4. CONFIRMAÇÃO FINAL
    const confirmacaoFinal = await Swal.fire({
      title: "Confirmar cancelamento",
      html: `
    <div style="font-size:14px; color:#374151;">

      <p style="margin-bottom:12px;">
        Confira os dados antes de confirmar:
      </p>

      <div style="
        background:#f8fafc;
        border:1px solid #e5e7eb;
        border-radius:12px;
        padding:14px;
        margin-bottom:12px;
      ">
        <div style="font-weight:600; color:#111827; margin-bottom:4px;">
          ${item.tipoAtendimento}
        </div>
        <div style="font-size:13px; color:#6b7280;">
          ${formatarDataHoraBR(item.data, item.vaga.horaInicio)}
        </div>
      </div>

      <div style="
        background:#f9fafb;
        border:1px solid #e5e7eb;
        border-radius:12px;
        padding:12px;
        margin-bottom:14px;
      ">
        <div style="font-weight:500; color:#374151; margin-bottom:4px;">
          Motivo
        </div>
        <div style="font-size:13px; color:#6b7280;">
          ${motivoFinal}
        </div>
      </div>

      <div style="
        background:#fef2f2;
        border:1px solid #fecaca;
        border-radius:8px;
        padding:10px;
        font-size:13px;
        color:#b91c1c;
      ">
        Essa ação não pode ser desfeita.
      </div>

    </div>
  `,
      icon: "warning",
      iconColor: "#972E3F",
      showCancelButton: true,
      confirmButtonText: "Confirmar cancelamento",
      cancelButtonText: "Voltar",
      reverseButtons: true,
      focusCancel: true,
      ...swalDesign,
    });

    if (!confirmacaoFinal.isConfirmed) return;

    // 5. ENVIO
    try {
      const body = {
        metodo: "post",
        uri: `/prae/${estrutura.uri}/${item.id}/cancelar`,
        params: {},
        data: {
          id: item.id,
          motivo: motivoFinal,
          tipoAtendimento: item.tipoAtendimento,
          agendamento: {
            id: item.id,
            data: item.data,
            vaga: item.vaga,
            estudante: item.estudante,
          },
        },
      };

      const response = await generica(body);

      if (response?.data?.errors) {
        throw new Error("Erro ao processar");
      } else if (response?.data?.error) {
        throw new Error(response.data.error.message);
      }

      await pesquisarRegistro();

      await Swal.fire({
        title: "Cancelamento realizado!",
        html: `
        <div style="text-align:center;">
          <p style="margin-top:10px; color:#374151;">
            Seu agendamento foi cancelado com sucesso.
          </p>
        </div>
      `,
        confirmButtonText: "Fechar",
        ...swalDesign,
      });
    } catch (error: any) {
      const errorMessage =
        error?.message || "Ocorreu um erro ao cancelar o agendamento.";

      await Swal.fire({
        title: "Erro!",
        html: `
        <div style="text-align:center;">
          <p style="margin-top:10px; color:#374151;">
            ${errorMessage}
          </p>
        </div>
      `,
        ...swalDesign,
      });
    }
  };

  useEffect(() => {
    chamarFuncao("pesquisar", null);
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
