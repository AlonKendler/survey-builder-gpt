// pages/survey-session.tsx
import LoadingIndicator from "@/components/LoadingIndicator";
import QuestionComponent from "@/components/QuestionComponent";
import DBClient from "@/server/dbClient";
import styles from "@/styles/SurveyBuilder.module.css";
import { Form, Formik, FormikHelpers } from "formik";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import * as Yup from "yup";

interface SurveyQuestion {
  id: string;
  question: string;
  type: "text" | "multiple_choice" | "end_survey";
  options?: {
    id: string;
    text: string;
  }[];
}

interface ValidationSchema {
  [key: string]: any;
  text: any;
  multiple_choice: any;
}

const validationSchemas: ValidationSchema = {
  text: Yup.object({
    answer: Yup.string().required("Answer is required"),
  }),
  multiple_choice: Yup.object({
    answer: Yup.string().required("Please select an option"),
  }),
};

interface surveySessionProps {
  surveySession: any;
}

const SurveySession = ({ surveySession }: surveySessionProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const router = useRouter();
  const { id: surveyId } = router.query;
  const [currentQuestion, setCurrentQuestion] = useState<SurveyQuestion | null>(
    surveySession.currentQuestion
  );

  const fetchNextQuestion = async (answer: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/survey-questions/next", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surveyId, answer }),
      });
      const data = await res.json();
      if (data && data.message === "Next question not found") {
        setIsFinished(true);
      } else {
        setCurrentQuestion(data);
      }
    } catch (error) {
      console.error("Failed to fetch next question:", error);
      setIsFinished(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (
    values: { answer: string },
    { setSubmitting, resetForm }: FormikHelpers<{ answer: string }>
  ) => {
    await fetchNextQuestion(values.answer);
    resetForm();

    setSubmitting(false);
  };

  if (loading || !currentQuestion) {
    return <LoadingIndicator />;
  }

  if (currentQuestion.type === "end_survey") {
    return (
      <div className={styles.finishedContainer}>
        <h1>Thank you for taking the survey!</h1>
        <p className={styles.finishedText}>
          We appreciate your feedback and will use it to improve our services.
        </p>
      </div>
    );
  }
  return (
    <div className={styles.surveyContainer}>
      <Formik
        initialValues={{ answer: "" }}
        validationSchema={validationSchemas[currentQuestion.type]}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched, getFieldProps, setFieldValue }) => (
          <Form className={styles.surveyForm}>
            <div className={styles.questionContainer}>
              <h3 className={styles.question}>{currentQuestion.question}</h3>
              <QuestionComponent
                question={currentQuestion}
                field={getFieldProps("answer")}
                setFieldValue={setFieldValue}
              />
              {errors.answer && touched.answer && (
                <div className={styles.errorMessage}>{errors.answer}</div>
              )}
            </div>
            <button
              className={styles.nextButton}
              type="submit"
              disabled={isSubmitting}
            >
              Next
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SurveySession;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id: surverySessionId } = context.query;

  if (!surverySessionId) {
    return {
      notFound: true,
    };
  }

  const dbClient = new DBClient();

  // Call the 'fetchSurveyTemplateById' function from the 'dbClient'
  const surveySession = await dbClient.fetchSessionDataBySurveyId(
    surverySessionId as string
  );

  if (!surveySession) {
    return {
      notFound: true,
    };
  }

  surveySession.createdAt = new Date(
    surveySession.createdAt.seconds * 1000
  ).toISOString();
  return {
    props: {
      surveySession,
    },
  };
};
