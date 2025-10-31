import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../../features/auth/authSlice";
import { clearAppError } from "../../features/error/errorSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";

import TextFieldGroup from "../common/TextFieldGroup";
import type { FieldErrors, InputChangeHandler } from "../../types";

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const appError = useAppSelector(state => state.error);

  // Local states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Use effect hooks
  useEffect(() => {
    // Clear all errors on mount
    dispatch(clearAppError());
    setFieldErrors({});
  }, [dispatch]);

  useEffect(() => {
    // Only show errors after user interaction
    if (appError && typeof appError === "object" && Object.values(formData).some(v => v !== "")) {
      setFieldErrors(prev => ({ ...prev, ...appError }));
    }
  }, [appError, formData]);

  // Event handlers
  const onChange: InputChangeHandler = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(clearAppError());
    setFieldErrors({});

    // Transform formData to match RegisterData type
    const registerData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      password2: formData.confirmPassword,
    };

    await dispatch(registerUser(registerData))
      .unwrap()
      .then(result => {
        console.log("Registration success:", result);
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
