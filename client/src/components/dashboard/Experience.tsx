import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deleteExperience } from "../../features/profile/profileSlice";
import { getDateRange } from "../../utils/date";

const Experience = ({ experience }) => {
  const dispatch = useDispatch();

  // Event Handlers
  const onDeleteClick = id => {
    if (window.confirm("Are you sure you want to delete this experience?")) {
      dispatch(deleteExperience(id));
    }
  };

  return (
    <div className="mb-4">
      <h4 className="mb-2">Experience Credentials</h4>
      {experience && experience.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Title</th>
              <th>Years</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {experience.map(exp => (
              <tr key={exp._id}>
                <td>{exp.company}</td>
                <td>{exp.title}</td>
                <td>{getDateRange(exp.from, exp.to, exp.current)}</td>
                <td>
                  <button onClick={() => onDeleteClick(exp._id)} className="btn btn-danger btn-sm">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <>
          <p className="text-muted">No experience credentials added yet</p>
          <Link to="/add-experience" className="btn btn-success w-100">
            Add Experience
          </Link>
        </>
      )}
    </div>
  );
};

export default Experience;
