// Importação do modal
import style from "./table.module.scss";
import React, { useState } from 'react';

import { IUsuario } from "@/interfaces/IUsuario";
import { deleteUsuario } from "@/api/usuarios/deleteUsuario";
import ConfirmationPromocaoModal from "../ExcluirUsuario";
import ConfirmationUsuarioModal from "../ExcluirUsuario";

interface TableProps {
  table1?: string;
  table2?: string;
  table3?: string;
  table4?: string;
  table5?: string;
  listUsuarios: IUsuario[];
  setUsuarios: (usuario: IUsuario[]) => void;
  onSelectUsuario: (usuario: IUsuario) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Table: React.FC<TableProps> = ({
  listUsuarios,
  onSelectUsuario,
  table1,
  table2,
  table3,
  table4,
  table5,
  currentPage,
  totalPages,
  setCurrentPage,
  setUsuarios
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<IUsuario | null>(null);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState<string | null>(null);

  const handleClose = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const handleOpenModal = (usuario: IUsuario) => {
    setSelectedUsuario(usuario);
    setIsModalOpen(true);
  };

  const openDeleteModal = (id: string) => {
    setSelectedUsuarioId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedUsuarioId(null);
    handleClose();
  };

  const handleConfirmDelete = async () => {
    if (selectedUsuarioId) {
      try {
        await deleteUsuario(selectedUsuarioId);
        setUsuarios(listUsuarios.filter(usuario => usuario.id !== selectedUsuarioId));
      } catch (error) {
        console.error('Erro ao excluir o usuário:', error);
      }
      closeDeleteModal();
    }
  };

  const renderAcoes = (usuario: IUsuario) => (
    <td>
      <button
        onClick={() => onSelectUsuario(usuario)}
        className={style.content__table__body_click}
      >
        <img
          src="/assets/icons/visualizar.svg"
          alt="Visualizar"
        />
      </button>
      <button
        onClick={() => openDeleteModal(usuario.id)}
        className={style.content__table__body_click}
      >
        <img
          src="/assets/icons/excluir.svg"
          alt="Excluir"
        />
      </button>
    </td>
  );

  const renderHeader = (title?: string) => (
    <th>
      {title}
      {title === "Ações" && <span><img src="/assets/icons/informacao.svg" alt="Informação" /></span>}
    </th>
  );

  const renderCell = (usuario: IUsuario, title?: string) => {
    if (title === "Ações") {
      return renderAcoes(usuario);
    }
  
    // Obtenha o valor associado à chave no objeto usuario
    const cellValue = usuario[title?.toLowerCase() as keyof IUsuario] as unknown;
  
    // Verifique o tipo do valor para garantir que é renderizável
    if (typeof cellValue === "string" || typeof cellValue === "number") {
      return (
        <td>
          <div className={style.content__table__cell}>{cellValue}</div>
        </td>
      );
    } else if (cellValue instanceof File) {
      return (
        <td>
          <div className={style.content__table__cell}>{cellValue.name}</div>
        </td>
      );
    } else {
      return (
        <td>
          <div className={style.content__table__cell}>{cellValue ? String(cellValue) : ""}</div>
        </td>
      );
    }
  };
  

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
            {listUsuarios.map((usuario, index) => (
              <tr key={index}
              >
                {table1 && renderCell(usuario, table1)}
                {table2 && renderCell(usuario, table2)}
                {table3 && renderCell(usuario, table3)}
                {table4 && renderCell(usuario, table4)}
                {table5 && renderCell(usuario, table5)}
              </tr>
            ))}
          </tbody>
        </table>
        <div className={style.content__table__pagination}>
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))} disabled={currentPage === 0}>
            Anterior
          </button>
          <span>Página {currentPage + 1} de {totalPages}</span>
          <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))} disabled={currentPage === totalPages - 1}>
            Próximo
          </button>
        </div>
      </div>
      {selectedUsuarioId && (
        <ConfirmationUsuarioModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          usuarioNome={selectedUsuario?.nome}
          usuarioId={selectedUsuarioId}  // Para a exclusão
        />
      )}
    </>
  );
};

export default Table;
