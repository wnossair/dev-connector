import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../../features/auth/authSlice";
import { clearAppError } from "../../features/error/errorSlice";
import { useDispatch, useSelector } from "react-redux";

import TextFieldGroup from "../common/TextFieldGroup";

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
              <TextFieldGroup
                name="name"
                value={formData.name}
                type="text"
                placeholder="Name"
                label="Name"
                id="name"
                error={fieldErrors.name}
                onChange={onChange}
                autoComplete="name"
              />

              {/* Email Field */}
              <TextFieldGroup
                name="email"
                value={formData.email}
                type="email"
                placeholder="Email Address"
                label="Email"
                id="email"
                error={fieldErrors.email}
                onChange={onChange}
                autoComplete="email"
                info="This site uses Gravatar so if you want a profile image, use a Gravatar email"
              />

              {/* Password Field */}
              <TextFieldGroup
                name="password"
                value={formData.password}
                type="password"
                placeholder="Password"
                label="Password"
                id="password"
                error={fieldErrors.password}
                onChange={onChange}
                autoComplete="new-password"
              />

              {/* Confirm Password Field */}
              <TextFieldGroup
                name="confirmPassword"
                value={formData.confirmPassword}
                type="password"
                placeholder="Confirm Password"
                label="Confirm"
                id="confirmPassword"
                error={fieldErrors.confirmPassword}
                onChange={onChange}
                autoComplete="new-password"
              />

              {/* Submit Button - Fixed Alignment */}
              <div className="col-sm-12">
                <button type="submit" className="btn btn-primary w-100">
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
