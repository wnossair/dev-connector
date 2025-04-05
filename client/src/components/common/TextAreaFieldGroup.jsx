import React from "react";

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
  autoComplete = off,
}) => {
  return (
    <div className="row mb-3">
      <label htmlFor={id} className="col-sm-2 col-form-label">
        {label}
      </label>
      <div className="col-sm-10">
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
        {error && <div className="invalid-feedback">{error}</div>}
        {info && <small className="form-text text-muted">{info}</small>}
      </div>
    </div>
  );
};

export default TextAreaFieldGroup;
