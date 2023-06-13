import React from "react";
import styles from "../styles/HomePage.module.css";
import { HomePageProps } from "./HomepageTypes";

interface TemplateHeaderProps {
  template: HomePageProps["templates"][0];
}

const TemplateHeader: React.FC<TemplateHeaderProps> = ({ template }) => {
  return (
    <div className={styles.templateHeader}>
      <h2 className={styles.template}>{template.projectName}</h2>
      <p className={styles.projectDescription}>{template.projectDescription}</p>
      <p className={styles.targetAudience}>
        <strong>Target audience:</strong> {template.targetAudience}
      </p>
      <p className={styles.sessionsCount}>
        <strong> Sessions:</strong> {template.sessions.length}
      </p>
    </div>
  );
};

export default TemplateHeader;
