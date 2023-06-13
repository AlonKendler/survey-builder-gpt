// pages/create-form.tsx

import CheckboxField from "@/components/CheckboxField";
import GenericFieldForm from "@/components/GenereicFieldForm";
import Modal from "@/components/Modal";
import SurveyPreview from "@/components/SurveyPreview";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { TEMPLATE_PLACEHOLDER } from "../constants/surveryTemplates";
import styles from "../styles/CreateForm.module.css";

const surveySchema = Yup.object().shape({
  projectName: Yup.string().required("Required"),
  projectDescription: Yup.string().required("Required"),
  researchObjectives: Yup.array().of(Yup.string()),
  targetAudience: Yup.object().shape({
    ageRange: Yup.string().required("Required"),
    location: Yup.string().required("Required"),
    includeName: Yup.boolean().required().default(true),
    includeEmail: Yup.boolean().required().default(true),
    includeGeneratedText: Yup.boolean().required().default(true),
    includeGeneratedDescription: Yup.boolean().required().default(true),
    askForAge: Yup.boolean().required().default(false),
    askForGender: Yup.boolean().required().default(false),
    askForLocation: Yup.boolean().required().default(false),
    askForJob: Yup.boolean().required().default(false),
  }),
});

const CreateFormPage: React.FC = () => {
  const router = useRouter();

  const [selectedTemplate, setSelectedTemplate] = useState<any>("0");
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [templates, setTemplates] = useState<any>([TEMPLATE_PLACEHOLDER]);
  const [hasChanged, setHasChanged] = useState(false);
  const [formType, setFormType] = useState("survey"); // default form type

  const handleFormTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormType(e.target.value);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTemplate(e.target.value);
    setHasChanged(false);
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/templates");
      if (response.ok) {
        const templates = (await response.json()) || [];
        setTemplates([TEMPLATE_PLACEHOLDER, ...templates]);
      } else {
        console.error("Failed to fetch templates");
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const handleCancel = () => {
    setShowPreview(false);
    ``;
  };

  const handleConfirm = () => {
    createSurvey(previewData);
  };

  const handleSubmit = async (
    values: any,
    { setSubmitting }: FormikHelpers<any>
  ) => {
    try {
      const previewData = generatePreviewData(values);

      setPreviewData(previewData);
      setShowPreview(true);
    } catch (error) {
      console.error("Error generating preview:", error);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const generatePreviewData = (values: any) => {
    const previewData = {
      projectName: values.projectName,
      projectDescription: values.projectDescription,
      researchObjectives: values.researchObjectives,
      targetAudience: {
        ageRange: values.targetAudience.ageRange,
        location: values.targetAudience.location,
        otherDemographics: values.targetAudience.otherDemographics,
      },
      includeName: values.includeName,
      includeEmail: values.includeEmail,
      includeGeneratedText: values.includeGeneratedText,
      includeGeneratedDescription: values.includeGeneratedDescription,
      askForAge: values.askForAge,
      askForGender: values.askForGender,
      askForLocation: values.askForLocation,
      askForJob: values.askForJob,
    };

    return previewData;
  };

  const createSurvey = async (values: any) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/create-survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        const templateId = data.id;
        // Redirect to the Survey Builder page with the survey ID
        router.push(`/survey-starter?id=${templateId}`);
      } else {
        console.error("Failed to create survey");
      }
    } catch (error) {
      console.error("Error creating survey:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const redirectToSurveyTemplate = async () => {
    router.push(`/survey-starter?id=${templates[selectedTemplate].id}`);
  };

  const renderForm = (formProps: any) => {
    const { isSubmitting, handleChange } = formProps;
    const fields = [
      {
        fieldName: "projectName",
        label: "Project Name",
        placeholder: "e.g., My App Launch",
        fieldProps: {},
      },
      {
        fieldName: "projectDescription",
        label: "Project Description",
        placeholder: "e.g., My App Launch",
        fieldProps: { as: "textarea" },
      },
      {
        fieldName: "researchObjectives",
        label: "Research Objectives",
        placeholder: "e.g., My App Launch",
        fieldProps: {},
        isArrayInput: true,
      },
      {
        fieldName: "targetAudience.ageRange",
        label: "Target Audience Age Range",
        placeholder: "e.g., My App Launch",
        fieldProps: {},
      },
      {
        fieldName: "targetAudience.location",
        label: "Target Audience Location",
        placeholder: "e.g., My App Launch",
        fieldProps: {},
      },
      {
        fieldName: "targetAudience.otherDemographics",
        label: "Target Audience Other Demographics",
        placeholder: "e.g., My App Launch",
        fieldProps: {},
      },
    ];
    const checkboxes = [
      {
        fieldName: "includeName",
        label: "Ask for name",
      },
      {
        fieldName: "includeEmail",
        label: "Ask for email",
      },
      {
        fieldName: "askForAge",
        label: "Ask for age",
      },
      {
        fieldName: "askForGender",
        label: "Ask for gender",
      },
      {
        fieldName: "askForLocation",
        label: "Ask for Location",
      },
      {
        fieldName: "askForJob",
        label: "Ask for job",
      },
    ];
    const renderCheckboxes = (checkboxes: any, handleChange: any) => {
      return (
        <div className={styles.checkboxes}>
          {checkboxes.map((checkbox: any) => {
            return (
              <CheckboxField
                key={checkbox.fieldName}
                fieldName={checkbox.fieldName}
                label={checkbox.label}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e);
                  setHasChanged(true);
                }}
              />
            );
          })}
        </div>
      );
    };
    return (
      <Form>
        {renderCheckboxes(checkboxes, handleChange)}
        {fields.map((field: any) => {
          return (
            <GenericFieldForm
              handleChange={handleChange}
              setHasChanged={setHasChanged}
              key={field.fieldName}
              name={field.fieldName}
              label={field.label}
              placeholder={field.placeholder}
              type={field.type}
              fieldProps={field.fieldProps}
              isArrayInput={field.isArrayInput}
            />
          );
        })}
        {hasChanged || selectedTemplate === "0" ? (
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.generateButton}
          >
            Create Your Survey
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              redirectToSurveyTemplate();
            }}
            disabled={!templates[selectedTemplate]?.id}
            className={styles.generateButton}
          >
            Run Your Survey
          </button>
        )}
      </Form>
    );
  };

  return (
    <div className={styles.container}>
      <Modal show={showPreview} onClose={handleCancel} isLoading={isLoading}>
        {!isLoading && (
          <>
            <SurveyPreview previewData={previewData} />
            <div className={styles.previewButtons}>
              <button onClick={handleCancel} className={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={handleConfirm} className={styles.confirmButton}>
                Confirm
              </button>
            </div>
          </>
        )}
      </Modal>
      <h1 className={styles.title}>GenieForm - AI Form Builder</h1>
      <p className={styles.description}>
        Welcome to GenieForm! Our goal is to help you create tailored forms,
        such as surveys and onboarding powered by AI to gather valuable insights
        for your research. Please provide some details about your project to
        help us generate a customized survey for your specific needs.
      </p>
      <div className={styles.fieldGroup}>
        <label htmlFor="formType" className={styles.label}>
          Form Type
        </label>
        <select
          id="formType"
          name="formType"
          className={styles.select}
          value={formType}
          onChange={handleFormTypeChange}
        >
          <option value="survey">Survey</option>
        </select>
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="template" className={styles.label}>
          Template
        </label>
        <select
          id="template"
          name="template"
          className={styles.select}
          value={selectedTemplate}
          onChange={handleTemplateChange}
        >
          {templates.map((template: any, index: any) => (
            <option key={index} value={index}>
              {template.label}
            </option>
          ))}
        </select>
      </div>
      <Formik
        enableReinitialize
        initialValues={templates[selectedTemplate].values}
        validationSchema={formType === "survey" && surveySchema}
        onSubmit={handleSubmit}
      >
        {renderForm}
      </Formik>
    </div>
  );
};

export default CreateFormPage;
