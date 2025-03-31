import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../../features/auth/authSlice";
import { clearAppError } from "../../features/error/errorSlice";
import { useDispatch, useSelector } from "react-redux";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const appError = useSelector(state => state.error);

  // 1. Single state object for all inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (appError) {
      setFieldErrors(prev => ({ ...prev, ...appError }));
    }
  }, [appError]);

  const onChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    dispatch(clearAppError());
    setFieldErrors({});

    await dispatch(registerUser(formData))
      .unwrap()
      .then(result => {
        console.log("Registration success:", result.payload);
        navigate("/login");
      })
      .catch(err => console.log("Registration error:", err));
  };

  return (
    <div className="register">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <h1 className="display-4 text-center">Sign Up</h1>
            <p className="lead text-center">Create your DevConnector account</p>
            <form onSubmit={onSubmit} noValidate>
              {/* Name Field */}
              <div className="row mb-3">
                <label htmlFor="name" className="col-sm-2 col-form-label">
                  Name
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className={`form-control ${fieldErrors.name && "is-invalid"}`}
                    placeholder="Name"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    autoComplete="name"
                  />
                  {fieldErrors.name && <div className="invalid-feedback">{fieldErrors.name}</div>}
                </div>
              </div>

              {/* Email Field */}
              <div className="row mb-3">
                <label htmlFor="email" className="col-sm-2 col-form-label">
                  Email
                </label>
                <div className="col-sm-10">
                  <input
                    type="email"
                    className={`form-control ${fieldErrors.email && "is-invalid"}`}
                    placeholder="Email Address"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    autoComplete="email"
                  />
                  {fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email}</div>}
                  <small className="form-text text-muted">
                    This site uses Gravatar so if you want a profile image, use a Gravatar email
                  </small>
                </div>
              </div>

              {/* Password Field */}
              <div className="row mb-3">
                <label htmlFor="password" className="col-sm-2 col-form-label">
                  Password
                </label>
                <div className="col-sm-10">
                  <input
                    type="password"
                    className={`form-control ${fieldErrors.password && "is-invalid"}`}
                    placeholder="Password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={onChange}
                    autoComplete="new-password"
                  />
                  {fieldErrors.password && (
                    <div className="invalid-feedback">{fieldErrors.password}</div>
                  )}
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="row mb-3">
                <label htmlFor="confirmPassword" className="col-sm-2 col-form-label">
                  Confirm
                </label>
                <div className="col-sm-10">
                  <input
                    type="password"
                    className={`form-control ${fieldErrors.confirmPassword && "is-invalid"}`}
                    placeholder="Confirm Password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={onChange}
                    autoComplete="new-password"
                  />
                  {fieldErrors.confirmPassword && (
                    <div className="invalid-feedback">{fieldErrors.confirmPassword}</div>
                  )}
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
