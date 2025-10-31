import React from "react";
import { Link } from "react-router-dom";

const ProfileActions = () => {
  return (
    <div className="btn-group mb-4" role="group">
      <Link to="/edit-profile" className="btn btn-light bi bi-person">
        {" "}
        Edit Profile
      </Link>
      <Link to="/add-experience" className="btn btn-light bi bi-building">
        {" "}
        Add Experience
      </Link>
      <Link to="/add-education" className="btn btn-light bi bi-book">
        {" "}
        Add Education
      </Link>
    </div>
  );
};

export default ProfileActions;
