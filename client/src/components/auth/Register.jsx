import { useState } from "react";

const Register = () => {
  // 1. Single state object for all inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    <div className="register">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <h1 className="display-4 text-center">Sign Up</h1>
            <p className="lead text-center">Create your DevConnector account</p>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <label for="name" className="col-sm-2 col-form-label">
                  Name
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>
              </div>
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
                  <small className="form-text text-muted">
                    This site uses Gravatar so if you want a profile image, use
                    a Gravatar email
                  </small>
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
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label
                  for="confirmPassword"
                  className="col-sm-2 col-form-label"
                >
                  Confirm
                </label>
                <div className="col-sm-10">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm Password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
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
