import { generica } from "@/utils/api";
import type { EditalExtraSisuResponse } from "@/types/editalTypes";
import type {
  AdminEditalDetalhado,
  InscricaoDetalhada,
  InscricaoResumo,
  PageResponse,
  StatusPersonalizadoResumo,
  TipoEditalResumo,
} from "@/app/gestao-extra-sisu/extra-sisu.types";

type EditalPage = {
  content?: EditalExtraSisuResponse[];
  totalElements?: number;
  totalPages?: number;
  number?: number;
  size?: number;
};

interface AdminEditalPayload {
  titulo: string;
  descricao: string;
  dataPublicacao?: string;
  inicioInscricao?: string;
  fimIncricao?: string;
  statusAtualId?: number;
  tipoEditalId?: number;
}

interface EtapaPayload {
  nome: string;
  descricao: string;
  obrigatoria: boolean;
  ordem: number;
  editalId?: number;
  statusAtualId?: number;
}

function ensureOk(resp: any, errorMessage: string) {
  const ok = resp && typeof resp.status === "number" && resp.status >= 200 && resp.status < 300;
  if (!ok) {
    throw new Error(resp?.data?.message || errorMessage);
  }
  return resp.data;
}

export class ExtraSisuService {
  static async listarEditais(busca?: string): Promise<EditalPage> {
    const params = busca ? { busca } : {};
    const resp = await generica({ metodo: "get", uri: "/extra-sisu/editais", params });
    return ensureOk(resp, "Falha ao listar editais do Extra Sisu") ?? { content: [] };
  }

  static async buscarEditalAdmin(id: number): Promise<AdminEditalDetalhado> {
    const response = await generica({
      metodo: "get",
      uri: `/extra-sisu/admin/editais/${id}`,
    });
    return ensureOk(response, "Falha ao carregar o edital.");
  }

  static async atualizarEditalAdmin(id: number, payload: AdminEditalPayload) {
    const response = await generica({
      metodo: "patch",
      uri: `/extra-sisu/admin/editais/${id}`,
      data: payload,
    });
    return ensureOk(response, "Falha ao atualizar o edital.");
  }

  static async deletarEditalAdmin(id: number) {
    const response = await generica({
      metodo: "delete",
      uri: `/extra-sisu/admin/editais/${id}`,
    });
    ensureOk(response, "Falha ao excluir o edital.");
  }

  static async atualizarEtapaAdmin(id: number, payload: EtapaPayload) {
    const response = await generica({
      metodo: "patch",
      uri: `/extra-sisu/admin/etapas/${id}`,
      data: payload,
    });
    return ensureOk(response, "Falha ao atualizar a etapa.");
  }

  static async revogarEtapa(id: number) {
    const response = await generica({
      metodo: "delete",
      uri: `/extra-sisu/admin/etapas/${id}`,
    });
    ensureOk(response, "Falha ao revogar a etapa.");
  }

  static async listarMinhasInscricoes(): Promise<InscricaoResumo[]> {
    const response = await generica({
      metodo: "get",
      uri: "/extra-sisu/inscricoes",
    });
    return ensureOk(response, "Falha ao listar as inscricoes.");
  }

  static async buscarDetalhesInscricao(id: number): Promise<InscricaoDetalhada> {
    const response = await generica({
      metodo: "get",
      uri: `/extra-sisu/inscricoes/${id}/detalhes`,
    });
    return ensureOk(response, "Falha ao carregar os detalhes da inscricao.");
  }

  static async listarStatusPersonalizados(): Promise<StatusPersonalizadoResumo[]> {
    const response = await generica({
      metodo: "get",
      uri: "/extra-sisu/status-personalizado",
    });
    return ensureOk(response, "Falha ao listar os status personalizados.");
  }

  static async listarTiposEdital(): Promise<TipoEditalResumo[]> {
    const response = await generica({
      metodo: "get",
      uri: "/extra-sisu/tipos-editais",
      params: { page: 0, size: 100 },
    });
    const data = ensureOk(response, "Falha ao listar os tipos de edital.") as PageResponse<TipoEditalResumo>;
    return data.content ?? [];
  }
}
