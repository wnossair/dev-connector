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
  autoComplete = off,
}) => {
  const selectOptions = options.map(item => (
    <option key={item.label} value={item.value}>
      {item.label}
    </option>
  ));

  return (
    <div className="row mb-3">
      <label htmlFor={id} className="col-sm-2 col-form-label">
        {label}
      </label>
      <div className="col-sm-10">
        <select
          className={`form-control ${error && "is-invalid"}`}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete={autoComplete}
        >
          {selectOptions}
        </select>
        {error && <div className="invalid-feedback">{error}</div>}
        {info && <small className="form-text text-muted">{info}</small>}
      </div>
    </div>
  );
};

export default SelectListGroup;
