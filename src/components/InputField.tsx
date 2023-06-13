// components/InputField.tsx

import { ErrorMessage, Field } from "formik";
import React from "react";

const InputField: React.FC<{ name: string; label: string }> = ({
  name,
  label,
}) => (
  <div>
    <label htmlFor={name}>{label}</label>
    <Field name={name} />
    <ErrorMessage name={name} component="div" />
  </div>
);

export default InputField;
