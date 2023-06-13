// components/SurveyTemplate.tsx

import React, { useState } from "react";
import styles from "../styles/HomePage.module.css";
import { HomePageProps } from "./HomepageTypes";
import Session from "./SurveySession";
import TemplateHeader from "./TemplateHeader";

interface SurveyTemplateProps {
  template: HomePageProps["templates"][0];
}

const SurveyTemplate: React.FC<SurveyTemplateProps> = ({ template }) => {
  const [expandedTemplateId, setExpandedTemplateId] = useState<string | null>(
    null
  );

  const handleTemplateClick = (templateId: string) => {
    setExpandedTemplateId(
      expandedTemplateId === templateId ? null : templateId
    );
  };

  const openSurveyInNewTab = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div
      key={template.id}
      className={styles.templateContainer}
      onClick={() => handleTemplateClick(template.id)}
    >
      {/* Template header elements */}
      <TemplateHeader template={template} />
      <div className={styles.actionsContainer}>
        <button
          className={`${styles.copyLinkButton} ${styles.materialButton}`}
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(
              `${window.location.origin}/survey-starter?id=${template.id}`
            );
          }}
        >
          Copy Shareable Link
        </button>
        <button
          className={`${styles.openSurveyButton} ${styles.materialButton}`}
          onClick={(e) => {
            e.stopPropagation();
            openSurveyInNewTab(`/survey-starter?id=${template.id}`);
          }}
        >
          Open Survey
        </button>
        <button
          className={`${styles.openSurveyButton} ${styles.materialButton}`}
          onClick={() => handleTemplateClick(template.id)}
        >
          expand sessions {expandedTemplateId ? "\u25B2" : "\u25BC"}
          {/* removed data dashboard for now, showing only sessions */}
        </button>
      </div>

      {expandedTemplateId === template.id && (
        <>
          <div className={styles.sessionsAccordion}>
            {template.sessions.map((session, index) => (
              <Session key={session.id} session={session} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SurveyTemplate;
