import { Link } from "react-router-dom";
import { useProfileStore } from "../../stores/useProfileStore";
import { getDateRange } from "../../utils/date";
import type { Experience as ExperienceType } from "../../types";

interface ExperienceProps {
  experience?: ExperienceType[];
}

const Experience = ({ experience }: ExperienceProps) => {
  const deleteExperience = useProfileStore(state => state.deleteExperience);

  // Event Handlers
  const onDeleteClick = (id: string) => {
    if (window.confirm("Are you sure you want to delete this experience?")) {
      deleteExperience(id);
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
                  <button
                    onClick={() => exp._id && onDeleteClick(exp._id)}
                    className="btn btn-danger btn-sm"
                  >
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
