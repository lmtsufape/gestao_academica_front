export interface IUsuario {
  id: string;
  nome: string;
  cpf: string;
  senha: string;
  confirmarSenha: string;
  email: string;
  matricula: string;
  telefone: string;
  siape: string; // Número SIAPE servidores públicos
  cursoId: string; // Curso acadêmico professores e alunos
  cursoIds: number[]; // ID do curso acadêmico professores e alunos
  nomeSocial: string;
  instituicao: string; // Instituição de ensino ou trabalho para professores, alunos e externos
  tipoUsuario: string; // Tipo de usuário: interno | externo
  profilePhoto?: File; // Foto de perfil
  documentos: File[];
}
