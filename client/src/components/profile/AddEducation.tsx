import { useEffect, useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextFieldGroup from "../common/TextFieldGroup";
import { useErrorStore } from "../../stores/useErrorStore";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { useProfileStore } from "../../stores/useProfileStore";
import type { FieldErrors, InputChangeHandler } from "../../types";

const AddEducation = () => {
  const navigate = useNavigate();

  const appError = useErrorStore(state => state.error);
  const clearError = useErrorStore(state => state.clearError);
  const addEducation = useProfileStore(state => state.addEducation);

  // Local States
  const [formData, setFormData] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
    from: "",
    to: "",
    current: false,
    description: "",
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Use effect hooks
  useEffect(() => {
    if (appError && typeof appError === "object" && Object.values(formData).some(v => v !== "")) {
      setFieldErrors(prev => ({ ...prev, ...appError }));
    }
  }, [appError, formData]);

  // Event Handlers
  const onChange: InputChangeHandler = e => {
    const target = e.target;
    const { name, value, type } = target;
    const checked = "checked" in target ? target.checked : false;

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    setFieldErrors({});

    try {
      await addEducation(formData);
      navigate("/dashboard");
    } catch (error) {
      console.log("Add Education error: ", error);
    }
  };

  return (
    <section className="container">
      <h1 className="large text-primary">Add Your Education</h1>
      <p className="lead">Add any school, bootcamp, etc that you have attended</p>
      <small>* = required field</small>
      <form className="form" onSubmit={onSubmit} noValidate>
        {/* School Field */}
        <TextFieldGroup
          id="school"
          name="school"
          value={formData.school}
          placeholder="* School or Bootcamp"
          error={fieldErrors.school}
          onChange={onChange}
          required={true}
        />

        {/* Degree Field */}
        <TextFieldGroup
          id="degree"
          name="degree"
          value={formData.degree}
          placeholder="* Degree or Certificate"
          error={fieldErrors.degree}
          onChange={onChange}
          required={true}
        />

        {/* Field of Study Field */}
        <TextFieldGroup
          id="fieldOfStudy"
          name="fieldOfStudy"
          value={formData.fieldOfStudy}
          placeholder="Field Of Study"
          error={fieldErrors.fieldOfStudy}
          onChange={onChange}
        />

        {/* From Date */}
        <div className="form-group">
          <h4>From Date</h4>
          <TextFieldGroup
            id="from"
            name="from"
            value={formData.from}
            error={fieldErrors.from}
            onChange={onChange}
            type="date"
            required={true}
          />
        </div>

        {/* Current School Checkbox */}
        <div className="form-group">
          <p>
            <input type="checkbox" name="current" checked={formData.current} onChange={onChange} />{" "}
            Current School or Bootcamp
          </p>
        </div>

        {/* To Date */}
        <div className="form-group">
          <h4>To Date</h4>
          <TextFieldGroup
            id="to"
            name="to"
            value={formData.to}
            error={fieldErrors.to}
            onChange={onChange}
            type="date"
            disabled={formData.current}
          />
        </div>

        {/* Description Field */}
        <div className="form-group">
          <TextAreaFieldGroup
            id="description"
            name="description"
            value={formData.description}
            placeholder="Program Description"
            onChange={onChange}
          />
        </div>

        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </section>
  );
};

export default AddEducation;
