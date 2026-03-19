export interface StatusPersonalizadoResumo {
  id: number;
  nome: string;
  tipoStatus: "INSCRICAO" | "EDITAL" | "ETAPA";
  concluiEtapa?: boolean;
}

export interface TipoEditalResumo {
  id: number;
  nome: string;
  descricao?: string;
}

export interface EditalAdminResumo {
  id: number;
  titulo: string;
  descricao?: string;
  dataPublicacao?: string;
  inicioInscricao?: string;
  fimIncricao?: string;
  dataInscricao?: string;
  dataFinalizacao?: string;
  statusAtual?: StatusPersonalizadoResumo;
  tipoEdital?: TipoEditalResumo;
}

export interface EtapaAdminResumo {
  id: number;
  nome: string;
  descricao?: string;
  obrigatoria?: boolean;
  ordem?: number;
  editalId?: number;
  statusAtual?: StatusPersonalizadoResumo;
}

export interface DocumentoResumo {
  id?: number;
  nome?: string;
  caminho?: string;
}

export interface AdminEditalDetalhado {
  edital: EditalAdminResumo;
  etapas: EtapaAdminResumo[];
}

export interface InscricaoResumo {
  id: number;
  dataInscricao?: string;
  statusAtual?: StatusPersonalizadoResumo;
  edital?: EditalAdminResumo;
  documentos?: DocumentoResumo[];
}

export interface HistoricoEtapaInscricaoResumo {
  id: number;
  observacao?: string;
  dataAcao?: string;
  etapa?: EtapaAdminResumo;
  status?: StatusPersonalizadoResumo;
}

export interface InscricaoDetalhada {
  inscricao: InscricaoResumo;
  historico: HistoricoEtapaInscricaoResumo[];
}

export interface PageResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
