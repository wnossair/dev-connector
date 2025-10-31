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
    <div className="card card-body bg-light mb-3" key={_id}>
      <div className="row">
        <div className="col-2">
          <img className="rounded-circle" src={avatar} alt={name} />
        </div>
        <div className="col-lg-6 col-md-4 col-8">
          <h3>{name}</h3>
          <p>
            {role} {company && `at ${company}`} {location && `in ${location}`}
          </p>
          <Link to={`/profile/user/${_id}`} className="btn btn-success">
            View Profile
          </Link>
        </div>
        <div className="col-md-4 d-none d-md-block ms-auto">
          <h4>Skill Set</h4>
          <ul className="list-group">
            {Array.isArray(skills) &&
              skills.slice(0, 4).map((skill, index) => (
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
