import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { loginUser } from "../../features/auth/authSlice";
import { clearAppError } from "../../features/error/errorSlice";

import TextFieldGroup from "../common/TextFieldGroup";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const appError = useSelector(state => state.error);
  const currentUser = useSelector(state => state.auth.user);

  // Use State Hooks
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});

  // Use Effect Hooks
  useEffect(() => {
    if (appError && typeof appError === "object") {
      setFieldErrors(prev => ({ ...prev, ...appError }));
    }
  }, [appError]);

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser]);

  // Event Handlers
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

    await dispatch(loginUser(formData))
      .unwrap()
      .catch(err => console.log("Login error:", err));
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
                autoComplete="current-password"
              />

              <button type="submit" className="btn btn-primary">
                Log in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
