import React from "react";
import { getDateRange } from "../../utils/date";

const ProfileCredentials = ({ profile }) => {
  const { experience = {}, education = {} } = profile;
  const hasItems = array => array && Array.isArray(array) && array.length > 0;

  return (
    <div className="row mt-3">
      {/* Experience */}
      {hasItems(experience) && (
        <div className="col-md-6">
          <h3 className="text-center text-info mb-3">Experience</h3>
          <ul className="list-group">
            {experience.map(exp => (
              <li className="list-group-item credential-item" key={exp._id}>
                <h4 className="mb-1">{exp.company}</h4>
                <p>{getDateRange(exp.from, exp.to, exp.current)}</p>
                <p>
                  <strong>Position:</strong> {exp.title}
                </p>
                {exp.location && (
                  <p>
                    <strong>Location:</strong> {exp.location}
                  </p>
                )}
                {exp.description && (
                  <p>
                    <strong>Description:</strong> {exp.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Education */}
      {hasItems(education) && (
        <div className="col-md-6">
          <h3 className="text-center text-info mb-3">Education</h3>
          <ul className="list-group">
            {education.map(edu => (
              <li className="list-group-item credential-item" key={edu._id}>
                <h4 className="mb-1">{edu.school}</h4>
                <p>{getDateRange(edu.from, edu.to, edu.current)}</p>
                <p>
                  <strong>Degree:</strong> {edu.degree}
                </p>
                <p>
                  <strong>Field Of Study: </strong>
                  {edu.fieldofstudy}
                </p>
                {edu.description && (
                  <p>
                    <strong>Description:</strong> {edu.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileCredentials;
