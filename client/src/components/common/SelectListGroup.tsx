import { InputChangeHandler, SelectOption } from "../../types";

export interface SelectListGroupProps {
  name: string;
  value: string;
  label?: string;
  id: string;
  error?: string | null;
  info?: string | null;
  onChange: InputChangeHandler;
  options: SelectOption[];
  disabled?: boolean;
  autoComplete?: string;
}

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
}: SelectListGroupProps) => {
  const selectOptions = options.map(item => (
    <option key={item.label} value={item.value}>
      {item.label}
    </option>
  ));

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <select
        className={`form-control ${error ? "is-invalid" : ""}`}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
      >
        {selectOptions}
      </select>
      {error && <div className="form-error">{error}</div>}
      {info && <div className="form-hint">{info}</div>}
    </div>
  );
};

export default SelectListGroup;
