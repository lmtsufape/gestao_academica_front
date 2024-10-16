// ConfirmationModal.tsx
import React from 'react';
import style from './confirmationModal.module.scss';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  promocaoId?: string;  // Propriedade opcional para exclusão
  promocaoName?: string; // Propriedade opcional para envio
}

const ConfirmationPromocaoModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, promocaoId, promocaoName }) => {
  if (!isOpen) return null;

  return (
    <div className={style.modalOverlay}>
      <div className={style.modalContent}>
      <h1 className={style.warningText}>Tem certeza que deseja excluir este produto?</h1>
        <p className={style.warningText}>Após a confirmação, não será possível reverter esta operação.</p>
        <div className={style.modalActions}>
          <button className={style.confirmButton} onClick={onConfirm}>Confirmar</button>
          <button className={style.cancelButton} onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPromocaoModal;
