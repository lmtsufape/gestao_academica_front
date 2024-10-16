// Importação do modal
import style from "./table.module.scss";
import React, { useState } from 'react';

import { IUsuario } from "@/interfaces/IUsuario";
import { deleteUsuario } from "@/api/usuarios/deleteUsuario";

interface TableProps {
  table1: string;
  table2: string;
  table3: string;
  listUsuarios: IUsuario[];
  setUsuarios: (usuario: IUsuario[]) => void; 
  onSelectUsuario: (usuario: IUsuario) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}
const Table: React.FC<TableProps> = ({ 
  listUsuarios: listUsuarios,  
  onSelectUsuario: onSelectUsuario, 
  table1, 
  table2, 
  table3, 
  currentPage, 
  totalPages, 
  setCurrentPage 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<IUsuario | null>(null);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState<string | null>(null);
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);


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
        await deleteUsuario(selectedUsuarioId);  // Adicione a lógica de exclusão
        // Atualize a lista de promoções usando setPromocoes
        setUsuarios(listUsuarios.filter(usuario => usuario.id !== selectedUsuarioId));
      } catch (error) {
        console.error('Erro ao excluir a promoção:', error);
      }
      closeDeleteModal();
    }
  };
  

  return (
    <>
      <div className={style.content}>
        <table className={style.content__table}>
          <thead className={style.content__table__header}>
            <tr>
              <th>{table1}</th>
              <th>{table2}</th>
              <th className={style.content__table__header_name3}>
                <div>
                  {table3}
                  {/*<img src="/assets/icons/informacao.svg" alt="Visualizar" />*/}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className={style.content__table__body}>
            {listUsuarios.map((usuario, index) => (
              <tr key={index}>
                <td>{usuario.nome}</td>
                <td>{usuario.tipoUsuario}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
        <div className={style.content__table__pagination}>
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))} disabled={currentPage === 0}>
            Anterior
          </button>
          <span>Pagina {currentPage + 1} of {totalPages}</span>
          <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))} disabled={currentPage === totalPages - 1}>
            Proximo
          </button>
        </div>
      </div>

      
    </>
  );
};

export default Table;
