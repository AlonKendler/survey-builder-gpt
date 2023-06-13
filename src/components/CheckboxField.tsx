import { Field } from "formik";
import styles from "../styles/CreateForm.module.css";

interface CheckboxProps {
  fieldName: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxField = ({ fieldName, label, onChange }: CheckboxProps) => {
  return (
    <div className={styles.checkbox}>
      <Field
        id={fieldName}
        name={`${fieldName}`}
        type="checkbox"
        onChange={onChange}
      />
      <label htmlFor={fieldName} className={styles.checkboxLabel}>
        {label}
      </label>
    </div>
  );
};

export default CheckboxField;
