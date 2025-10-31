import React from "react";

const ProfileAbout = ({ profile }) => {
  const { bio, skills } = profile;

  return (
    // Profile About
    <div className="row mt-3">
      <div className="col-md-12">
        <div className="card card-body bg-light mb-3">
          {bio && (
            <>
              <h3 className="text-info mb-1">About</h3>
              <p className="lead">{bio}</p>
            </>
          )}
          <h3 className="text-info mb-1">Skills</h3>
          <div className="row">
            <div className="d-flex flex-wrap align-items-center">
              {Array.isArray(skills) &&
                skills.map((skill, index) => (
                  <li className="list-group-item p-2" key={`${skill}-${index}`}>
                    <span className="bi bi-check-circle-fill text-success me-1"></span>
                    {skill}
                  </li>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAbout;
