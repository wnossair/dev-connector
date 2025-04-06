import React from "react";

const InputGroup = ({
  name,
  value,
  placeholder,
  label,
  id,
  icon,
  type = "text",
  error = null,
  onChange,
  disabled = false,
  autoComplete = "off",
}) => {
  return (
    <div className="input-group mb-3">
      <div className="input-group-prepend">
        <span className="input-group-text">
          <i className={icon} />
        </span>
      </div>
      {label && (
        <label htmlFor={id} className="col-sm-2 col-form-label">
          {label}
        </label>
      )}
      <div className="col-sm-10">
        <input
          className={`form-control ${error && "is-invalid"}`}
          placeholder={placeholder}
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete={autoComplete}
        />
        {error && <div className="invalid-feedback d-block">{error}</div>}
      </div>
    </div>
  );
};

export default InputGroup;
