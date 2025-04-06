import React from "react";

const SelectListGroup = ({
  name,
  value,
  label,
  id,
  error = null,
  info = null,
  onChange,
  options,
  disabled = false,
  autoComplete = "off",
}) => {
  const selectOptions = options.map(item => (
    <option key={item.label} value={item.value}>
      {item.label}
    </option>
  ));

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
          <select
            className={`form-control form-control-lg ${error && "is-invalid"}`}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            autoComplete={autoComplete}
          >
            {selectOptions}
          </select>
        </div>
      </div>
      {error && <div className="invalid-feedback">{error}</div>}
      {info && <small className="form-text text-muted">{info}</small>}
    </div>
  );
};

export default SelectListGroup;
