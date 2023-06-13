import React from "react";
import styles from "../styles/LoadingIndicator.module.css";

interface LoadingIndicatorProps {
  text?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ text }) => {
  return (
    <div className={styles.loadingContainer}>
      <p>{text || "Preparing next question..."}</p>
      <div className={styles.loadingIndicator}></div>
    </div>
  );
};

export default LoadingIndicator;
