import type { GithubRepo } from "../../types";

interface ProfileGithubProps {
  repos?: GithubRepo[];
}

const ProfileGithub = ({ repos }: ProfileGithubProps) => {
  return (
    <div className="container py-3 mt-3">
      <h2 className="h4 text-info mb-3">Top GitHub Repositories</h2>
      {repos && repos.length > 0 ? (
        <ul className="list-group">
          {repos.map(repo => (
            <li key={repo.id} className="list-group-item">
              <div className="d-flex align-items-center gap-2 mb-1">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-decoration-none fw-bold"
                >
                  {repo.name}
                </a>
                {repo.language && <span className="badge bg-primary">{repo.language}</span>}
              </div>
              <p className="text-muted mb-1">{repo.description || "No description provided"}</p>
              <div className="d-flex gap-3 flex-wrap">
                <span>
                  <i className="bi bi-star-fill text-warning me-1"></i>
                  Stars: {repo.stargazers_count}
                </span>
                <span>
                  <i className="bi bi-eye-fill text-secondary me-1"></i>
                  Watchers: {repo.watchers_count}
                </span>
                <span>
                  <i className="bi bi-diagram-2-fill text-success me-1"></i>
                  Forks: {repo.forks_count}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No public repositories found.</p>
      )}
    </div>
  );
};

export default ProfileGithub;
