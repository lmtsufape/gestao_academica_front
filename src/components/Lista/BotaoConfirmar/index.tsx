"use client";

import React, { useState } from 'react';
import styles from './confirmationModal.module.scss';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  promocaoName: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, promocaoName }) => {
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>X</button>
        <h1>Confirmação de segurança!</h1>
        <p>
          Para podermos divulgar a promoção, precisamos que faça a confirmação de segurança digitando o nome da promoção.
        </p>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={styles.inputField}
          placeholder={`EX: ${promocaoName}`}
        />
        <div className={styles.modalActions}>
          <button
            onClick={() => {
              if (inputValue === promocaoName) {
                onConfirm();
                onClose();
              } else {
                alert("O nome da promoção não confere.");
              }
            }}
            className={styles.confirmButton}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
