import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextFieldGroup from "../common/TextFieldGroup";
import { useDispatch, useSelector } from "react-redux";
import { clearAppError } from "../../features/error/errorSlice";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { addEducation } from "../../features/profile/profileSlice";

const AddEducation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const appError = useSelector(state => state.error);

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

  const [fieldErrors, setFieldErrors] = useState({
    school: "",
    degree: "",
    from: "",
    to: "",
  });

  // Use effect hooks
  useEffect(() => {
    if (appError && Object.values(formData).some(v => v !== "")) {
      setFieldErrors(prev => ({ ...prev, ...appError }));
    }
  }, [appError, formData]);

  // Event Handlers
  const onChange = e => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    dispatch(clearAppError());
    setFieldErrors({});

    try {
      await dispatch(addEducation(formData)).unwrap();
      navigate("/dashboard");
    } catch (error) {
      console.log("Add Education error: ", error);
    }
  };

  return (
    <section className="container">
      <h1 className="large text-primary">Add Your Education</h1>
      <p className="lead">
        Add any school, bootcamp, etc that you have attended
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={onSubmit} noValidate>
        {/* School Field */}
        <TextFieldGroup
          name="school"
          value={formData.school}
          placeholder="* School or Bootcamp"
          error={fieldErrors.school}
          onChange={onChange}
          required={true}
        />

        {/* Degree Field */}
        <TextFieldGroup
          name="degree"
          value={formData.degree}
          placeholder="* Degree or Certificate"
          error={fieldErrors.degree}
          onChange={onChange}
          required={true}
        />

        {/* Field of Study Field */}
        <TextFieldGroup
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
            <input
              type="checkbox"
              name="current"
              checked={formData.current}
              onChange={onChange}
            />{" "}
            Current School or Bootcamp
          </p>
        </div>

        {/* To Date */}
        <div className="form-group">
          <h4>To Date</h4>
          <TextFieldGroup
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
            name="description"
            value={formData.description}
            placeholder="Program Description"
            onChange={onChange}
            cols="30"
            rows="5"
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