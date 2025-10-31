import type { Profile } from "../../types";

interface ProfileHeaderProps {
  profile: Profile;
}

const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const user = typeof profile.user === "object" ? profile.user : null;
  const { avatar = "https://www.gravatar.com/avatar/default?s=200", name = "Unknown User" } =
    user || {};

  const { role, company, location, website, social = {} } = profile;

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card card-body bg-dark text-white mb-3">
          <div className="row">
            <div className="col-4 col-md-3 m-auto">
              <img
                className="rounded-circle"
                src={avatar}
                alt={name}
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://www.gravatar.com/avatar/default?s=200";
                }}
              />
            </div>
          </div>
          <div className="text-center">
            <h1 className="display-4 text-center">{name}</h1>
            <p className="lead text-center">
              {role}
              {company && ` at ${company}`}
              {location && ` in ${location}`}
              <span className="d-block">
                {website && (
                  <a
                    className="text-white p-2"
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-globe fs-3"></i>
                  </a>
                )}
                {social.twitter && (
                  <a
                    className="text-white p-2"
                    href={social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-twitter fs-3"></i>
                  </a>
                )}
                {social.facebook && (
                  <a
                    className="text-white p-2"
                    href={social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-facebook fs-3"></i>
                  </a>
                )}
                {social.linkedin && (
                  <a
                    className="text-white p-2"
                    href={social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-linkedin fs-3"></i>
                  </a>
                )}
                {social.instagram && (
                  <a
                    className="text-white p-2"
                    href={social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-instagram fs-3"></i>
                  </a>
                )}
                {social.youtube && (
                  <a
                    className="text-white p-2"
                    href={social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-youtube fs-3"></i>
                  </a>
                )}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
