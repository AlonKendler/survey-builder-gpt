// QuestionComponent.tsx
import React from "react";
import styles from "../styles/QuestionComponent.module.css"; // Make sure to create a corresponding CSS module

interface SurveyQuestion {
  id: string;
  type: string;
  options?: { id: string; text: string }[];
}

interface QuestionComponentProps {
  question: SurveyQuestion;
  field: any;
  setFieldValue: any;
}

const QuestionComponent: React.FC<QuestionComponentProps> = ({
  question,
  field,
  setFieldValue,
}) => {
  switch (question.type) {
    case "text":
      return (
        <input
          className={styles.textInput}
          type="text"
          value={field.value}
          onChange={(e) => {
            setFieldValue("answer", e.target.value);
          }}
          name={field.name}
          placeholder="Type your answer here"
        />
      );
    case "multiple_choice":
      return (
        <div className={styles.multipleChoiceOptions}>
          {question.options?.map((option) => (
            <div
              key={option.id}
              className={styles.optionWrapper}
              onClick={() => setFieldValue("answer", option.id)}
            >
              <input
                type="radio"
                id={option.id}
                {...field}
                value={option.id}
                checked={field.value === option.id}
                onChange={() => {}}
              />
              <label htmlFor={option.id}>{option.text}</label>
              <span className={styles.checkmark}></span>
            </div>
          ))}
        </div>
      );

    default:
      return (
        <input
          className={styles.textInput}
          type="text"
          value={field.value}
          onChange={(e) => {
            setFieldValue("answer", e.target.value);
          }}
          name={field.name}
          placeholder="Type your answer here"
        />
      );
  }
};

export default QuestionComponent;
