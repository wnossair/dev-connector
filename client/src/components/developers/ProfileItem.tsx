import { Link } from "react-router-dom";
import type { Profile } from "../../types";

interface ProfileItemProps {
  profile: Profile;
}

const ProfileItem = ({ profile }: ProfileItemProps) => {
  const user = typeof profile.user === "object" ? profile.user : null;
  const { avatar, name, _id } = user || {};
  const { role, company, location, skills } = profile;

  return (
    <div className="card card-body mb-3" key={_id}>
      <div className="row">
        <div className="col-md-2 d-flex align-items-center justify-content-center mb-3 mb-md-0">
          <img className="avatar avatar-lg" src={avatar} alt={name} />
        </div>
        <div className="col-md-5">
          <h4 className="mb-2">{name}</h4>
          <p className="text-muted mb-2">
            <strong>{role}</strong>
            {company && ` at ${company}`}
            {location && ` in ${location}`}
          </p>
          <Link to={`/profile/user/${_id}`} className="btn btn-sm btn-primary">
            View Profile
          </Link>
        </div>
        <div className="col-md-5 d-none d-md-block">
          <h5 className="mb-3">Skill Set</h5>
          <ul className="list-group">
            {Array.isArray(skills) &&
              skills.slice(0, 4).map((skill, index) => (
                <li className="list-group-item py-2" key={`skill-${index}`}>
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
