import React from "react";
import styles from "../styles/SurveyPreview.module.css";

interface SurveyPreviewProps {
  previewData: any;
}

const SurveyPreview: React.FC<SurveyPreviewProps> = ({ previewData }) => {
  return (
    <div className={styles.previewContainer}>
      <h2 className={styles.previewTitle}>Survey Preview</h2>
      <p>
        <strong>Project Name: </strong>
        {previewData.projectName}
      </p>
      <p>
        <strong>Project Description: </strong>
        {previewData.projectDescription}
      </p>
      <p>
        <strong>Research Objectives: </strong>
        {previewData.researchObjectives.map(
          (objective: string, index: number) => (
            <div key={index}>{objective}</div>
          )
        )}
      </p>
      <p>
        <strong>Target Audience Age Range: </strong>
        {previewData.targetAudience.ageRange}
      </p>
      <p>
        <strong>Target Audience Location: </strong>
        {previewData.targetAudience.location}
      </p>
      <p>
        <strong>Other Demographics: </strong>
        {previewData.targetAudience.otherDemographics}
      </p>
      <p>
        <strong>Input name of user: </strong>
        {`${previewData.includeName}`}
      </p>
      <p>
        <strong>Input email of user: </strong>
        {`${previewData.includeEmail}`}
      </p>
      <p>
        <strong>Show Generated title: </strong>
        {`${previewData.includeGeneratedText}`}
      </p>
      <p>
        <strong>Show Generated description: </strong>
        {`${previewData.includeGeneratedDescription}`}
      </p>
      <p>
        <strong>should ask for age when starting survey </strong>
        {`${previewData.askForAge}`}
      </p>
      <p>
        <strong>should ask for gender when starting survey </strong>
        {`${previewData.askForGender}`}
      </p>
      <p>
        <strong>should ask for Location when starting survey </strong>
        {`${previewData.askForLocation}`}
      </p>
      <p>
        <strong>should ask for job when starting survey </strong>
        {`${previewData.askForJob}`}
      </p>

    </div>
  );
};

export default SurveyPreview;
