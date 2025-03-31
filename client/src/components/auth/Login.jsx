import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../features/auth/authSlice";
import { clearAppError } from "../../features/error/errorSlice";
import { useDispatch, useSelector } from "react-redux";

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
