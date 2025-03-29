import { useState } from "react";

const Login = () => {
  // 1. Single state object for all inputs
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // 2. Universal change handler
  const handleChange = e => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev, // Copy previous state
      [name]: type === "checkbox" ? checked : value, // Handle checkboxes too
    }));
  };

  // 3. Submit handler
  const handleSubmit = e => {
    e.preventDefault();
    console.log("Submitted:", formData);
    // Add API call here
  };

  return (
    <div className="login">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <h1 className="display-4 text-center">Log In</h1>
            <p className="lead text-center">
              Sign in to your DevConnector account
            </p>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <label for="email" className="col-sm-2 col-form-label">
                  Email
                </label>
                <div className="col-sm-10">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email Address"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="row mb-3">
                <label for="password" className="col-sm-2 col-form-label">
                  Password
                </label>
                <div className="col-sm-10">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
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
