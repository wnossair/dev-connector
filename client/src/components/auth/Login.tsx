import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../stores/useAuthStore";
import { useErrorStore } from "../../stores/useErrorStore";

import TextFieldGroup from "../common/TextFieldGroup";
import type { FieldErrors, InputChangeHandler } from "../../types";
import { logger } from "../../utils/logger";

const Login = () => {
  const navigate = useNavigate();

  const loginUser = useAuthStore(state => state.loginUser);
  const currentUser = useAuthStore(state => state.user);
  const appError = useErrorStore(state => state.error);
  const clearError = useErrorStore(state => state.clearError);

  // Use State Hooks
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Use Effect Hooks
  useEffect(() => {
    if (appError && typeof appError === "object") {
      setFieldErrors(prev => ({ ...prev, ...appError }));
    }
  }, [appError]);

  // Redirect if already logged in (on component mount only)
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run on mount

  // Event Handlers
  const onChange: InputChangeHandler = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    setFieldErrors({});

    try {
      await loginUser(formData);
      navigate("/dashboard");
    } catch (err) {
      logger.warn("User login failed", err);
    }
  };

  // Component
  return (
    <div className="login">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <h1 className="display-4 text-center">Log In</h1>
            <p className="lead text-center">Sign in to your DevConnector account</p>
            <form onSubmit={onSubmit} noValidate>
              {/* General error (e.g. invalid credentials) */}
              {fieldErrors.message && (
                <div className="alert alert-danger" role="alert">
                  {fieldErrors.message}
                </div>
              )}

              {/* Email Field */}
              <TextFieldGroup
                name="email"
                value={formData.email}
                type="email"
                placeholder="Email Address"
                id="email"
                error={fieldErrors.email}
                onChange={onChange}
                autoComplete="email"
              />

              {/* Password Field */}
              <TextFieldGroup
                name="password"
                value={formData.password}
                type="password"
                placeholder="Password"
                id="password"
                error={fieldErrors.password}
                onChange={onChange}
                autoComplete="current-password"
              />

              {/* Submit Button - Fixed Alignment */}
              <div className="col-sm-12">
                <button type="submit" className="btn btn-primary w-100">
                  Log in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
