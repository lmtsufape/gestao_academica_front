import Id from '@/app/conta/sair/[id]';
import * as z from 'zod';

// Enum e labels para tipos de campo
export const tipoCampoEnum = z.enum([
  'TEXTO_CURTO',
  'TEXTO_LONGO',
  'NUMERO_INTEIRO',
  'NUMERO_DECIMAL',
  'DATA',
  'EMAIL',
  'CPF',
  'CNPJ',
  'TELEFONE',
]);

export type TipoCampo = z.infer<typeof tipoCampoEnum>;

export const tipoCampoDisplay: Record<TipoCampo, string> = {
  TEXTO_CURTO: 'Texto Curto',
  TEXTO_LONGO: 'Texto Longo',
  NUMERO_INTEIRO: 'Número Inteiro',
  NUMERO_DECIMAL: 'Número Decimal',
  DATA: 'Data',
  EMAIL: 'E-mail',
  CPF: 'CPF',
  CNPJ: 'CNPJ',
  TELEFONE: 'Telefone',
};

// Schemas do formulário
export const campoPersonalizadoSchema = z.object({
  campoId: z.number().int().optional(),
  nome: z.string().min(1, 'O nome do campo é obrigatório.'),
  rotulo: z.string().min(1, 'O rótulo é obrigatório.'),
  obrigatorio: z.boolean(),
  tipoCampo: tipoCampoEnum,
  opcoes: z.string().optional().nullable(),
});

export type CampoPersonalizado = z.infer<typeof campoPersonalizadoSchema>;

// schema Documento
export const documentoSchema = z.object({
  documentoId: z.number().int().optional(),
  nome: z.string().min(1, 'O nome do documento é obrigatório.'),
  caminho: z.string().min(1, 'O caminho do documento é obrigatório.'),
});

export type Documento = z.infer<typeof documentoSchema>;

export const etapaSchema = z.object({
  etapaId: z.number().int().optional(),
  nome: z.string().min(1, 'O nome da etapa é obrigatório.'),
  descricao: z.string().optional(),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
  obrigatoria: z.boolean(),
  ordem: z.number().int(),
  campos: z.array(campoPersonalizadoSchema),
  documentos: z.array(documentoSchema).optional(),
});

export type Etapa = z.infer<typeof etapaSchema>;

export const tipoEditalSchema = z.object({
  id: z.number().int().optional(),
  nome: z.string().min(1, 'O nome do modelo é obrigatório.'),
  descricao: z.string().min(1, 'A descrição é obrigatória.'),
  etapas: z.array(etapaSchema),
  campos: z.array(campoPersonalizadoSchema),
});

export type TipoEditalFormData = z.infer<typeof tipoEditalSchema>;

export const statusSchema = z.object({
  id: z.number().int().optional(),
  nome: z.string(),
  tipoStatus: z.enum(['INSCRICAO', 'EDITAL', 'ETAPA']),
});

export type EditalStatus = z.infer<typeof statusSchema>;


// Respostas da API
export interface EtapaResponse {
  id: number;
  nome: string;
  descricao?: string;
  dataInicio?: string;
  dataFim?: string;
  obrigatoria: boolean;
  ordem: number;
  camposPersonalizados?: CampoPersonalizadoResponse[];
  documentos?: Documento[];
  tipoEditalModeloId?: number;
  editalId?: number | null;
  statusAtualId?: EditalStatus;
}

export interface CampoPersonalizadoResponse {
  id: number;
  nome: string;
  rotulo: string;
  obrigatorio: boolean;
  tipoCampo: TipoCampo;
  opcoes?: string;
  tipoEditalModeloId?: number | null;
  etapaModeloId?: number | null;
}
