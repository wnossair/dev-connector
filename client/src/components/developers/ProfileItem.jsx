import React from "react";
import { Link } from "react-router-dom";

const ProfileItem = ({ profile }) => {
  const { avatar, name, _id } = profile.user;
  const { role, company, location, skills, handle } = profile;

  return (
    <div className="card card-body bg-light mb-3" key={_id}>
      <div className="row">
        <div className="col-2">
          <img className="rounded-circle" src={avatar} alt={name} />
        </div>
        <div className="col-lg-6 col-md-4 col-8">
          <h3>{name}</h3>
          <p>
            {role} at {company ?? ""}
          </p>
          <p>{location ?? ""}</p>
          <Link to={`/profile/user/${handle}`} className="btn btn-success">
            View Profile
          </Link>
        </div>
        <div className="col-md-4 d-none d-lg-block">
          <h4>Skill Set</h4>
          <ul className="list-group">
            {Array.isArray(skills) && skills.slice(0, 4).map((skill, index) => (
              <li className="list-group-item" key={`skill-${index}`}>
                <span className="bi bi-check-circle-fill text-success me-2"></span>
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileItem;
