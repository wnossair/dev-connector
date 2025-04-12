import React from "react";

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
}) => {
  return (
    <div className="row mb-3">
      {label && (
        <div className="col-12 mb-2">
          <label
            htmlFor={id}
            className="fw-medium text-nowrap" // Added text-nowrap to prevent wrapping
          >
            {label}
          </label>
        </div>
      )}
      <div className="col-12">
        <div className="d-flex align-items-center">
          <input
            type={type}
            className={`form-control form-control-lg ${error && "is-invalid"}`}
            placeholder={placeholder}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            autoComplete={autoComplete}
            required={required}
          />
        </div>
      </div>
      {error && <div className="invalid-feedback d-block">{error}</div>}
      {info && <small className="form-text text-muted">{info}</small>}
    </div>
  );
};

export default TextFieldGroup;
