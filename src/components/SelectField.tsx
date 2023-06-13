// components/SelectField.tsx

import { ErrorMessage, Field } from "formik";
import React from "react";

const SelectField: React.FC<{
  name: string;
  label: string;
  options: string[];
}> = ({ name, label, options }) => (
  <div>
    <label htmlFor={name}>{label}</label>
    <Field as="select" name={name}>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </Field>
    <ErrorMessage name={name} component="div" />
  </div>
);

export default SelectField;
