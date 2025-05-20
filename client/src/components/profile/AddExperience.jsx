import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextFieldGroup from "../common/TextFieldGroup";
import { useDispatch, useSelector } from "react-redux";
import { clearAppError } from "../../features/error/errorSlice";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { addExperience } from "../../features/profile/profileSlice";

const AddExperience = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const appError = useSelector(state => state.error);

  // Local States
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    from: "",
    to: "",
    current: false,
    description: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    title: "",
    company: "",
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
      await dispatch(addExperience(formData)).unwrap();
      navigate("/dashboard");
    } catch (error) {
      console.log("Add Experience error: ", error);
    }
  };

  return (
    <section className="container">
      <h1 className="large text-primary">Add An Experience</h1>
      <p className="lead">
        Add any developer/programming positions that you have had in the past
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={onSubmit} noValidate>
        {/* Title Field */}
        <TextFieldGroup
          name="title"
          value={formData.title}
          placeholder="* Job Title"
          error={fieldErrors.title}
          onChange={onChange}
          required={true}
        />

        {/* Company Field */}
        <TextFieldGroup
          name="company"
          value={formData.company}
          placeholder="* Company"
          error={fieldErrors.company}
          onChange={onChange}
          required={true}
        />

        {/* Location Field */}
        <TextFieldGroup
          name="location"
          value={formData.location}
          placeholder="Location"
          error={fieldErrors.location}
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

        {/* Current Job Checkbox */}
        <div className="form-group">
          <p>
            <input
              type="checkbox"
              name="current"
              checked={formData.current}
              onChange={onChange}
            />{" "}
            Current Job
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
            placeholder="Job Description"
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

export default AddExperience;