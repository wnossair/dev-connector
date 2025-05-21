import React from "react";

const ProfileHeader = ({ profile }) => {
  const {
    user: { avatar = "https://www.gravatar.com/avatar/default?s=200", name },
    role,
    company,
    location,
    website,
    social = {},
  } = profile;

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
                  e.target.src = "https://www.gravatar.com/avatar/default?s=200";
                }}
              />
            </div>
          </div>
          <div className="text-center">
            <h1 className="display-4 text-center">{name}</h1>
            <p className="lead text-center">
              {role}
              {company && ` at ${company}`}
            </p>
            {location && <p>{location}</p>}
            <p>
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
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
