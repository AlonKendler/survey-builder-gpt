// Path: src/components/GenereicFieldForm.tsx

import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import { ErrorMessage, Field, FieldArray } from "formik";
import React, { useState } from "react";
import styles from "../styles/FormComponent.module.css";

interface GeneraicFieldFormProps {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setHasChanged: (hasChanged: boolean) => void;
  name: string;
  label: string;
  fieldProps: any;
  placeholder?: string;
  type?: string;
  isArrayInput?: boolean;
}

const MyArrayField: React.FC<GeneraicFieldFormProps> = ({
  handleChange,
  setHasChanged,
}) => {
  const [objectives, setObjectives] = useState([""]);

  const addObjective = () => {
    setObjectives([...objectives, ""]);
  };

  const removeObjective = (index: number) => {
    setObjectives(objectives.filter((_, idx) => idx !== index));
  };
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>Research Objectives</label>
      <div className={styles.fieldGroup}>
        <FieldArray
          name="researchObjectives"
          render={(arrayHelpers) => (
            <div>
              {objectives.map((_, index) => (
                <div key={index} className={styles.researchObjectiesContainer}>
                  <Field
                    as="textarea"
                    id={`researchObjectives.${index}`}
                    name={`researchObjectives.${index}`}
                    className={styles.input}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e);
                      setHasChanged(true);
                    }}
                    placeholder={`Objective ${
                      index + 1
                    } (e.g., Identify target audience preferences)`}
                  />
                  <button
                    type="button"
                    onClick={() => removeObjective(index)}
                    className={styles.iconButton}
                  >
                    <Remove />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addObjective}
                className={styles.iconButton}
              >
                <Add />
              </button>
            </div>
          )}
        />

        <ErrorMessage
          name={`researchObjectives`}
          component="div"
          className={styles.errorMessage}
        />
      </div>
    </div>
  );
};

const GenericFieldForm: React.FC<GeneraicFieldFormProps> = ({
  handleChange,
  setHasChanged,
  name,
  label,
  fieldProps,
  placeholder,
  type,
  isArrayInput,
}) => {
  if (isArrayInput) {
    return (
      <MyArrayField
        name={name}
        label={label}
        fieldProps={fieldProps}
        handleChange={handleChange}
        setHasChanged={setHasChanged}
      />
    );
  }
  return (
    <div className={styles.fieldGroup}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <Field
        id={name}
        name={name}
        as={type}
        placeholder={placeholder}
        className={styles.input}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleChange(e);
          setHasChanged(true);
        }}
        {...fieldProps}
      />
      <ErrorMessage
        name={name}
        component="div"
        className={styles.errorMessage}
      />
    </div>
  );
};

export default GenericFieldForm;
