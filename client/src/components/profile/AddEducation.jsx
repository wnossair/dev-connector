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
    school: "", // Empty
    degree: "", // Empty
    from: "", // After to
    to: "", // Not set and not current
  });

  // Use effect hooks
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
      await dispatch(addEducation(formData)).unwrap();
      navigate("/dashboard");
    } catch (error) {
      console.log("Add Education error: ", error);
    }
  };

  return (
    <div className="section add-education">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <Link to="/dashboard" className="btn btn-light">
              Go Back
            </Link>
            <h1 className="display-4 text-center">Add Your Education</h1>
            <p className="lead text-center">Add any school, bootcamp, etc that you have attended</p>
            <small className="d-block pb-3">* = required field</small>
            <form onSubmit={onSubmit} noValidate>
              {/* School Field */}
              <TextFieldGroup
                name="school"
                value={formData.school}
                placeholder="* School Or Bootcamp"
                id="school"
                error={fieldErrors.school}
                onChange={onChange}
                required={true}
              />

              {/* Degree Field */}
              <TextFieldGroup
                name="degree"
                value={formData.degree}
                placeholder="* Degree Or Certificate"
                id="degree"
                error={fieldErrors.degree}
                onChange={onChange}
                required={true}
              />

              {/* Field of Study Field */}
              <TextFieldGroup
                name="fieldOfStudy"
                value={formData.fieldOfStudy}
                placeholder="* Field Of Study"
                id="fieldOfStudy"
                error={fieldErrors.fieldOfStudy}
                onChange={onChange}
                required={true}
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
                  Currently Student
                </label>
              </div>

              {/* Description Field */}
              <TextAreaFieldGroup
                name="description"
                value={formData.description}
                placeholder="Program Description"
                id="description"
                onChange={onChange}
                info="Tell us about your experience and what you learned"
              />

              <input type="submit" className="btn btn-info form-control mt-4" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEducation;
