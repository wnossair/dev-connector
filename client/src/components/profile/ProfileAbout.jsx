import React from "react";

const ProfileAbout = ({ profile }) => {
  const firstName = profile.user.name.trim().split(" ")[0];
  const { bio, skills } = profile;

  return (
    // Profile About
    <div className="row mt-3">
      <div className="col-md-12">
        <div className="card card-body bg-light mb-3">
          {bio && (
            <>
              <h3 className="text-center text-info mb-1">{`${firstName}'s Bio`}</h3>
              <p className="lead">{bio}</p>
              <hr />
            </>
          )}
          <h3 className="text-center text-info mb-1">Skill Set</h3>
          <div className="row">
            <div className="d-flex flex-wrap justify-content-center align-items-center">
              {Array.isArray(skills) &&
                skills.map((skill, index) => (
                  <li className="list-group-item p-3" key={`${skill}-${index}`}>
                    <span className="bi bi-check-circle-fill text-success me-2"></span>
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
