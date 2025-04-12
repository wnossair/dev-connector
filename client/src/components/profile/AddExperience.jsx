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
    title: "", // Empty
    company: "", // Empty
    from: "", // After to
    to: "", // Not set and not current
  });

  // Use effect hooks
  useEffect(() => {
    // Clear all errors on mount
    dispatch(clearAppError());
    setFieldErrors({
      title: "",
      company: "",
      from: "",
      to: "",
    });
  }, [dispatch]);

  useEffect(() => {
    // Only show errors after user interaction
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
    <div className="section add-experience">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <Link to="/dashboard" className="btn btn-light">
              Go Back
            </Link>
            <h1 className="display-4 text-center">Add Your Experience</h1>
            <p className="lead text-center">(Software Engineering Experience)</p>
            <small className="d-block pb-3">* = required field</small>
            <form onSubmit={onSubmit} noValidate>
              {/* Title Field */}
              <TextFieldGroup
                name="title"
                value={formData.title}
                placeholder="* Job Title"
                id="title"
                error={fieldErrors.title}
                onChange={onChange}
                required={true}
              />

              {/* Company Field */}
              <TextFieldGroup
                name="company"
                value={formData.company}
                placeholder="* Company"
                id="company"
                error={fieldErrors.company}
                onChange={onChange}
                required={true}
              />

              {/* Location Field */}
              <TextFieldGroup
                name="location"
                value={formData.location}
                placeholder="Location"
                id="location"
                error={fieldErrors.location}
                onChange={onChange}
              />

              {/* From Field */}
              <TextFieldGroup
                name="from"
                value={formData.from}
                id="from"
                error={fieldErrors.from}
                onChange={onChange}
                label="* From Date"
                type="date"
                required={true}
              />

              {/* To Field */}
              <TextFieldGroup
                name="to"
                value={formData.to}
                id="to"
                error={fieldErrors.to}
                onChange={onChange}
                disabled={formData.current}
                label="To Date"
                type="date"
              />

              {/* Current Field */}
              <div className="form-check mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="current"
                  checked={formData.current}
                  onChange={onChange}
                  id="current"
                />
                <label className="form-check-label" htmlFor="current">
                  Current Job
                </label>
              </div>

              {/* Description Field */}
              <TextAreaFieldGroup
                name="description"
                value={formData.description}
                placeholder="Job Description"
                id="description"
                onChange={onChange}
                info="Some of your responsabilities, etc"
              />

              <input type="submit" className="btn btn-info btn-block mt-4" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExperience;
