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
  nome: z.string().min(1, 'O nome do campo é obrigatório.'),
  rotulo: z.string().min(1, 'O rótulo é obrigatório.'),
  obrigatorio: z.boolean(),
  tipoCampo: tipoCampoEnum,
  opcoes: z.string().optional(),
});

export type CampoPersonalizado = z.infer<typeof campoPersonalizadoSchema>;

export const etapaSchema = z.object({
  nome: z.string().min(1, 'O nome da etapa é obrigatório.'),
  descricao: z.string().optional(),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
  obrigatoria: z.boolean(),
  ordem: z.number().int(),
  campos: z.array(campoPersonalizadoSchema),
});

export type Etapa = z.infer<typeof etapaSchema>;

export const tipoEditalSchema = z.object({
  nome: z.string().min(1, 'O nome do modelo é obrigatório.'),
  descricao: z.string().min(1, 'A descrição é obrigatória.'),
  idUnidadeAdministrativa: z.preprocess((val) => Number(val), z.number().min(1, 'A unidade administrativa é obrigatória.')),
  etapas: z.array(etapaSchema),
  campos: z.array(campoPersonalizadoSchema),
});

export type TipoEditalFormData = z.infer<typeof tipoEditalSchema>;
