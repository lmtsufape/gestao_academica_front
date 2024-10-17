// ConfirmationModal.tsx
import React from 'react';
import style from './confirmationModal.module.scss';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  usuarioId?: string;  // Propriedade opcional para exclusão
  usuarioNome?: string; // Propriedade opcional para envio
}

const ConfirmationUsuarioModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, usuarioId, usuarioNome }) => {
  if (!isOpen) return null;
{console.log(usuarioNome)}
  return (
    <div className={style.modalOverlay}>
      <div className={style.modalContent}>
      <h1 className={style.warningText}>Tem certeza que deseja desativar este usuario? <span>{usuarioNome}</span></h1>
        <div className={style.modalActions}>
          <button className={style.cancelButton} onClick={onClose}>Cancelar</button>
          <button className={style.confirmButton} onClick={onConfirm}>Excluir</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationUsuarioModal;
