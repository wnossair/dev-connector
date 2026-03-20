import { InputChangeHandler } from "../../types";

export interface TextFieldGroupProps {
  name: string;
  value: string;
  placeholder?: string;
  label?: string;
  id: string;
  error?: string | null;
  info?: string | null;
  type?: string;
  onChange: InputChangeHandler;
  disabled?: boolean;
  autoComplete?: string;
  required?: boolean;
}

const TextFieldGroup = ({
  name,
  value,
  placeholder = "",
  label,
  id,
  error = null,
  info = null,
  type = "text",
  onChange,
  disabled = false,
  autoComplete = "off",
  required = false,
}: TextFieldGroupProps) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {required && <span className="text-danger">*</span>}
          {label}
        </label>
      )}
      <input
        type={type}
        className={`form-control ${error ? "is-invalid" : ""}`}
        placeholder={placeholder}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
        required={required}
      />
      {error && <div className="form-error">{error}</div>}
      {info && <div className="form-hint">{info}</div>}
    </div>
  );
};

export default TextFieldGroup;
