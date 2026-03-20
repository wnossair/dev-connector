import { InputChangeHandler } from "../../types";

export interface TextAreaFieldGroupProps {
  name: string;
  value: string;
  placeholder: string;
  label?: string;
  id: string;
  error?: string | null;
  info?: string | null;
  onChange: InputChangeHandler;
  disabled?: boolean;
  autoComplete?: string;
}

const TextAreaFieldGroup = ({
  name,
  value,
  placeholder,
  label,
  id,
  error = null,
  info = null,
  onChange,
  disabled = false,
  autoComplete = "off",
}: TextAreaFieldGroupProps) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <textarea
        className={`form-control ${error ? "is-invalid" : ""}`}
        placeholder={placeholder}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
      />
      {error && <div className="form-error">{error}</div>}
      {info && <div className="form-hint">{info}</div>}
    </div>
  );
};

export default TextAreaFieldGroup;
