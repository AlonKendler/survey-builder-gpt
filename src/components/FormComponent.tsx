import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "../styles/FormComponent.module.css"

interface FormValues {
  name: string;
  email: string;
}

const initialValues: FormValues = {
  name: "",
  email: "",
};


interface FormComponentProps {
  onSubmit: (values: FormValues) => void;
  includeName: boolean;
  includeEmail: boolean;
}

const FormComponent: React.FC<FormComponentProps> = ({ onSubmit, includeName, includeEmail }) => {
  const validationSchema = Yup.object().shape({
    ...(includeName && {
      name: Yup.string().required("Name is required"),
    }),
    ...(includeEmail && {
      email: Yup.string().email("Invalid email address").required("Email is required"),
    }),
  });
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          {includeName && <div className={styles.fieldGroup}>
            <label htmlFor="name" className={styles.label}>Name:</label>
            <Field id="name" name="name" placeholder="Your name" className={styles.input} />
            <ErrorMessage
              name="name"
              component="div"
              className={styles.errorMessage}
            />
          </div>}

          {includeEmail && <div className={styles.formField}>
            <label htmlFor="email" className={styles.label}>Email:</label>
            <Field id="email" name="email" placeholder="Your email" className={styles.input} />
            <ErrorMessage
              name="email"
              component="div"
              className={styles.errorMessage}
            />
          </div>}

          <button type="submit" className={styles.generateButton}>Start survey</button>
        </Form>
      )}
    </Formik>
  );
};

export default FormComponent;
