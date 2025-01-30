import { IUsuario } from "./IUsuario";

export interface ISolicitacao {
  id: string;
  dataSolicitacao: string;
  status: string;
  dataAvaliacao: string;
  parecer: string;
  perfil: {
    id: string;
    siape: string;
    matricula: string;
    curso: {};
    cursos: {[key: string]: string};
    tipo: string;
  };
  solicitante: IUsuario;
  responsavel: IUsuario;
}
