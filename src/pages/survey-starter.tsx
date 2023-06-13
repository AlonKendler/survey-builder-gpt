// pages/survey-starter.tsx
import FormComponent from "@/components/FormComponent";
import LoadingIndicator from "@/components/LoadingIndicator";
import DBClient from "@/server/dbClient";
import styles from "@/styles/SurveyBuilder.module.css";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

interface SurveyStarterProps {
  template: any;
}

const SurveyStarter = ({ template }: SurveyStarterProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  console.log("[survey-starter] template", template);

  const handleFormSubmit = async (values: any) => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/survey-questions/first?id=${template.id}&name=${values.name}&email=${values.email}`
      );
      const { sessionId } = await res.json();

      router.push(`/survey-session?id=${sessionId}`);
      setLoading(false);
    } catch (e) {
      console.error("Failed to create survey session question:", e);
      setLoading(false);
    }
  };
  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className={styles.container}>
      {template.includeGeneratedText && (
        <h1 className={styles.title}>{template.generatedTitle}</h1>
      )}
      {template.includeGeneratedDescription && (
        <p className={styles.description}>{template.generatedDescription}</p>
      )}

      <p className={styles.description}>
        Your feedback is important to us. Lets get started!
      </p>
      <FormComponent
        onSubmit={handleFormSubmit}
        includeName={template.includeName}
        includeEmail={template.includeEmail}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id: templateId } = context.query;

  if (!templateId) {
    return {
      notFound: true,
    };
  }

  const dbClient = new DBClient();

  // Call the 'fetchSurveyTemplateById' function from the 'dbClient'
  const template = await dbClient.fetchSurveyTemplateById(templateId as string);

  if (!template) {
    return {
      notFound: true,
    };
  }

  template.createdAt = new Date(
    template.createdAt.seconds * 1000
  ).toISOString();

  return {
    props: {
      template: { id: templateId, ...template },
    },
  };
};
export default SurveyStarter;
