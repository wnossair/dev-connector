import React from "react";
import { InputChangeHandler } from "../../types";

interface TextAreaFieldGroupProps {
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

const TextAreaFieldGroup: React.FC<TextAreaFieldGroupProps> = ({
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
}) => {
  return (
    <div className="row mb-3">
      {label && (
        <label
          htmlFor={id}
          className="col-sm-2 col-form-label fw-medium d-flex align-items-center mb-0"
        >
          {label}
        </label>
      )}
      <div className={`${label ? "col-sm-10" : "col-sm-12"}`}>
        <div className="d-flex align-items-center">
          <textarea
            className={`form-control ${error && "is-invalid"}`}
            placeholder={placeholder}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            autoComplete={autoComplete}
          />
        </div>
      </div>
      {error && <div className="invalid-feedback d-block">{error}</div>}
      {info && <small className="form-text text-muted">{info}</small>}
    </div>
  );
};

export default TextAreaFieldGroup;
