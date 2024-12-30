import { IUsuario } from "./IUsuario";

export interface ISolicitacao {
  id: string;
  dataSolicitacao: string;
  status: string;
  dataAvaliacao: string;
  parecer: string;
  perfil: {
    id: string;
    matricula: string;
    curso: {
      id: string;
      nome: string;
      ativo: boolean;
    };
    tipo: string;
  };
  solicitante: IUsuario;
  responsavel: IUsuario;
}
