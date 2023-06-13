import React from "react";
import styles from "../styles/Modal.module.css";
import LoadingIndicator from "./LoadingIndicator";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
  isLoading?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  show,
  children,
  isLoading,
  onClose,
}) => {
  if (!show) {
    return null;
  }

  return (
    <div className={show ? styles.modal : styles.hidden}>
      <div
        className={`${styles.modalContent} ${isLoading ? styles.loading : ""}`}
      >
        {isLoading ? (
          <LoadingIndicator text="GenieForm is working its magic..." />
        ) : (
          children
        )}
      </div>
      <div className={styles.modalOverlay} onClick={onClose} />
    </div>
  );
};

export default Modal;
