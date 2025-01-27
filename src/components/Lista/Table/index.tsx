"use client";

import React, { useState } from "react";
import style from "./table.module.scss";

import { IUsuario } from "@/interfaces/IUsuario";
import { ISolicitacao } from "@/interfaces/ISolicitacao";
import { deleteUsuario } from "@/api/usuarios/deleteUsuario";
import ConfirmationUsuarioModal from "../Excluir";
import { ICurso } from "@/interfaces/ICurso";
import { IUnidade } from "@/interfaces/IUnidade";

interface TableProps {
  // Identificação da tabela
  titulo: string;

  // Labels das colunas (ex: "Nome", "CPF", etc.)
  table1: string;
  table2: string;
  table3: string;
  table4: string;
  table5: string;

  // Lista de usuários (caso seja a tabela de usuários)
  listUsuarios?: IUsuario[];
  setUsuarios?: React.Dispatch<React.SetStateAction<IUsuario[]>>;
  onSelectUsuario?: (usuario: IUsuario) => void; // exibe detalhes

  // Lista de solicitações (caso seja a tabela de solicitações)
  listSolicitacoes?: ISolicitacao[];
  setSolicitacaoes?: React.Dispatch<React.SetStateAction<ISolicitacao[]>>;
  onSelectSolicitacao?: (sol: ISolicitacao) => void; // exibe detalhes
  // Lista de cursos
  listCursos?: ICurso[];
  setCursos?: React.Dispatch<React.SetStateAction<ICurso[]>>;
  onSelectCurso?: (curso: ICurso) => void; // exibe detalhes
  // Lista de cursos
  listUnidades?: IUnidade[];
  setUnidades?: React.Dispatch<React.SetStateAction<IUnidade[]>>;
  onSelectUnidade?: (unidade: IUnidade) => void; // exibe detalhes
  // Paginação
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Exibe colunas dinâmicas baseado em table1..table5 e no tipo da lista (usuarios ou solicitacoes).
 * Se for tabela de usuários, exibe listUsuarios; se for de solicitações, listSolicitacoes.
 */
const Table: React.FC<TableProps> = (props) => {
  const {
    titulo,
    table1,
    table2,
    table3,
    table4,
    table5,
    listUsuarios,
    setUsuarios,
    onSelectUsuario,
    listSolicitacoes,
    setSolicitacaoes,
    onSelectSolicitacao,
    listCursos,
    setCursos,
    onSelectCurso,
    listUnidades,
    setUnidades,
    onSelectUnidade,
    currentPage,
    totalPages,
    setCurrentPage,
  } = props;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState<string | null>(null);

  // --------------------------------------------------------------------------
  // Funções auxiliares: convertendo 'header' -> valor do objeto
  // --------------------------------------------------------------------------

  // Exibe valor da coluna para "Usuários"
  const getUsuarioValueByHeader = (usuario: IUsuario, header: string) => {
    switch (header) {
      case "Nome": return usuario?.nome || "";
      case "Nome Social": return usuario?.nomeSocial || "";
      case "CPF": return usuario?.cpf || "";
      case "Telefone": return usuario?.telefone || "";
      case "Tipo Perfil": return usuario?.tipoUsuario || "";
      // Caso precise de outros campos, vá adicionando
      default: return "";
    }
  };

  // Exibe valor da coluna para "Solicitações"
  const getSolicitacaoValueByHeader = (sol: ISolicitacao, header: string) => {
    switch (header) {
      case "Solicitante": return sol?.solicitante?.nome || "";
      case "CPF": return sol?.solicitante?.cpf || "";
      case "Perfil": return sol?.perfil?.tipo || "";
      case "Status": return sol?.status || "";
      case "Parecer": return sol?.parecer || "";
      // Ajuste conforme suas colunas reais
      default: return "";
    }
  };
  // Exibe valor da coluna para "Cursos"
  const getCursoValueByHeader = (curso: ICurso, header: string) => {
    switch (header) {
      case "Nome": return curso?.nome || "";
      //case "Ativo": return curso?.ativo || "";
      // Ajuste conforme suas colunas reais
    }
  };
    // Exibe valor da coluna para "Unidades"
    const getUnidadesValueByHeader = (unidade: IUnidade, header: string) => {
      switch (header) {
        case "Nome": return unidade?.nome || "";
        case "Codigo": return unidade?.codigo || "";
        // Ajuste conforme suas colunas reais
      }
    };
  // --------------------------------------------------------------------------
  // Excluir usuário (exemplo de exclusão, se for tabela de usuários)
  // --------------------------------------------------------------------------
  const openDeleteModal = (id: string) => {
    setSelectedUsuarioId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedUsuarioId(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (selectedUsuarioId && setUsuarios && listUsuarios) {
      try {
        await deleteUsuario(selectedUsuarioId);
        // remove da lista local
        const newArray = listUsuarios.filter((u) => u.id !== selectedUsuarioId);
        setUsuarios(newArray);
      } catch (error) {
        console.error("Erro ao excluir o usuário:", error);
      }
      closeDeleteModal();
    }
  };

  // --------------------------------------------------------------------------
  // Renderiza cabeçalho
  // --------------------------------------------------------------------------
  const renderHeader = (title: string) => (
    <th key={title}>
      {title}
      {title === "Ações" && (
        <span>
          <img src="/assets/icons/informacao.svg" alt="Informação" />
        </span>
      )}
    </th>
  );

  // --------------------------------------------------------------------------
  // Renderiza tabela de usuários
  // --------------------------------------------------------------------------
  const renderUsuarioRows = () => {
    if (!listUsuarios) return null;

    return listUsuarios.map((usuario, index) => (
      <tr key={usuario.id || index}>
        <td>{getUsuarioValueByHeader(usuario, table1)}</td>
        <td>{getUsuarioValueByHeader(usuario, table2)}</td>
        <td>{getUsuarioValueByHeader(usuario, table3)}</td>
        <td>{getUsuarioValueByHeader(usuario, table4)}</td>
        <td>
          <button
            onClick={() => onSelectUsuario?.(usuario)}
            className={style.content__table__body_click}
          >
            <img
              src="/assets/icons/visualizar.svg"
              alt="Visualizar"
            />
          </button>
          {titulo === "Solicitações " ? (
            <button
              onClick={() => openDeleteModal(usuario.id)}
              className={style.content__table__body_click}
            >
              <img
                src="/assets/icons/excluir.svg"
                alt="Excluir"
              />
            </button>
          ) : ""}
        </td>
      </tr>
    ));
  };

  // --------------------------------------------------------------------------
  // Renderiza tabela de solicitações
  // --------------------------------------------------------------------------
  const renderSolicitacaoRows = () => {
    if (!listSolicitacoes) return null;

    return listSolicitacoes.map((sol, index) => (
      <tr key={sol.id || index}>
        <td>{getSolicitacaoValueByHeader(sol, table1)}</td>
        <td>{getSolicitacaoValueByHeader(sol, table2)}</td>
        <td>{getSolicitacaoValueByHeader(sol, table3)}</td>
        <td>{getSolicitacaoValueByHeader(sol, table4)}</td>
        <td>
          {/* Botão de Visualizar Detalhes */}
          <button
            onClick={() => onSelectSolicitacao?.(sol)}
            className={style.content__table__body_click}
          >
            <img src="/assets/icons/visualizar.svg" alt="Visualizar" />
          </button>
          {/* Se quiser permitir excluir Solicitação, crie o modal análogo */}
        </td>
      </tr>
    ));
  };

  // --------------------------------------------------------------------------
  // Renderiza tabela de cursos
  // --------------------------------------------------------------------------

  const renderCursosRows = () => {
    if (!listCursos) return null;

    return listCursos.map((curso, index) => (
      <tr key={curso.id || index}>
        <td>{getCursoValueByHeader(curso, table1)}</td>
        {/*<td>{getCursoValueByHeader(curso, table2)}</td>
      
       Coluna de Ação (botão Excluir) */}
        <td>
          <button
            onClick={() => openDeleteModal(curso.id)}
            className={style.content__table__body_click}
          >
            <img
              src="/assets/icons/excluir.svg"
              alt="Excluir"
            />
          </button>
        </td>
      </tr>
    ));
  };
  const renderUnidadesRows = () => {
    if (!listUnidades) return null;

    return listUnidades.map((unidade, index) => (
      <tr key={unidade.id || index}>
        <td>{getUnidadesValueByHeader(unidade, table1)}</td>
        <td>{getUnidadesValueByHeader(unidade, table2)}</td>
      
       {/*Coluna de Ação (botão Excluir) */}
        <td>
          <button
            onClick={() => openDeleteModal(unidade.id)}
            className={style.content__table__body_click}
          >
            <img
              src="/assets/icons/excluir.svg"
              alt="Excluir"
            />
          </button>
        </td>
      </tr>
    ));
  };
  // --------------------------------------------------------------------------
  // Retorno principal
  // --------------------------------------------------------------------------
  return (
    <>
      <div className={style.content}>
        <table className={style.content__table}>
          <thead className={style.content__table__header}>
            <tr>
              {table1 && renderHeader(table1)}
              {table2 && renderHeader(table2)}
              {table3 && renderHeader(table3)}
              {table4 && renderHeader(table4)}
              {table5 && renderHeader(table5)}
            </tr>
          </thead>

          <tbody className={style.content__table__body}>
            {listUsuarios && listUsuarios.length > 0 ? (
              renderUsuarioRows()
            ) : listSolicitacoes && listSolicitacoes.length > 0 ? (
              renderSolicitacaoRows()
            ) : listCursos && listCursos.length > 0 ? (
              renderCursosRows()
            ): listUnidades && listUnidades.length > 0 ? (
              renderUnidadesRows()
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginação */}
        <div className={style.content__table__pagination}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
          >
            Anterior
          </button>
          <span>
            Página {currentPage + 1} de {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={currentPage === totalPages - 1 || totalPages === 0}
          >
            Próximo
          </button>
        </div>
      </div>

      {/* Modal de confirmação de exclusão (para usuários) */}
      {selectedUsuarioId && (
        <ConfirmationUsuarioModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          usuarioNome={
            listUsuarios?.find((u) => u.id === selectedUsuarioId)?.nome || ""
          }
          usuarioId={selectedUsuarioId}
        />
      )}
    </>
  );
};

export default Table;