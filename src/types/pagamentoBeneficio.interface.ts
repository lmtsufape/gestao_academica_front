export interface PagamentosBeneficio {
  id: number;
  valor: number;
  data: string;
  beneficio: Beneficio;
}

interface Beneficio {
  id: number;
  tipoBeneficio: TipoBeneficio;
  horasBeneficio: number;
  inicioBeneficio: string;
  fimBeneficio: string;
  parecerTermino: any;
  valorPagamento: number;
  status: boolean;
  estudantes: Estudantes;
}

interface TipoBeneficio {
  id: number;
  tipo: string;
  naturezaBeneficio: string;
  descricao: string;
  valorBeneficio: number | string;
}

interface Estudantes {
  id: number;
  aluno: Aluno;
  rendaPercapta: number;
  contatoFamilia: string;
  deficiente: boolean;
  tipoDeficiencia: any;
  endereco: Endereco;
  dadosBancarios: any;
}

interface Aluno {
  id: string;
  nome: string;
  nomeSocial: string;
  cpf: string;
  email: string;
  telefone: string;
  matricula: string;
  curso: Curso;
  tipoEtnia: TipoEtnia;
}

interface Curso {
  id: number;
  nome: string;
}

interface TipoEtnia {
  id: number;
  tipo: string;
}

interface Endereco {
  id: number;
  rua: string;
  cep: string;
  bairro: string;
  cidade: string;
  estado: string;
  numero: string;
  complemento: string;
}
