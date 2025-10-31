import { Link } from "react-router-dom";
import { useProfileStore } from "../../stores/useProfileStore";
import { getDateRange } from "../../utils/date";
import type { Education as EducationType } from "../../types";

interface EducationProps {
  education?: EducationType[];
}

const Education = ({ education }: EducationProps) => {
  const deleteEducation = useProfileStore(state => state.deleteEducation);

  // Event Handlers
  const onDeleteClick = (id: string) => {
    if (window.confirm("Are you sure you want to delete this education?")) {
      deleteEducation(id);
    }
  };

  return (
    <div className="mb-4">
      <h4 className="mb-2">Education Credentials</h4>
      {education && education.length > 0 ? (
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
            {education.map(edu => (
              <tr key={edu._id}>
                <td>{edu.school}</td>
                <td>{edu.degree}</td>
                <td>{getDateRange(edu.from, edu.to, edu.current)}</td>
                <td>
                  <button
                    onClick={() => edu._id && onDeleteClick(edu._id)}
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

export default Education;
