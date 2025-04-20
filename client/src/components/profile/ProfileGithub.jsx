import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfileGithub = ({ username, numRepos = 5 }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);
      setError(null);

      try {
        const githubToken = import.meta.env.VITE_GITHUB_TOKEN;
        const headers = githubToken ? { Authorization: `token ${githubToken}` } : {};

        const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
          headers,
          params: {
            sort: "stars",
            per_page: numRepos,
          },
        });

        const repoData = response.data.map(repo => ({
          id: repo.id,
          name: repo.name,
          url: repo.html_url,
          stars: repo.stargazers_count,
          watchers: repo.watchers_count,
          forks: repo.forks_count,
          language: repo.language,
          description: repo.description || "No description provided",
        }));

        setRepos(repoData);
      } catch (err) {
        if (err.response) {
          if (err.response.status === 404) {
            setError(`User [${username}] not found`);
          } else if (err.response.status === 403) {
            setError("API rate limit exceeded. Please try again later.");
          } else {
            setError("An error occurred while fetching repositories");
          }
        } else {
          setError("Network error. Please check your connection.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchRepos();
    }
  }, [username, numRepos]);

  return (
    <div className="container py-3 mt-3">
      <h2 className="h4 text-info mb-3">Top GitHub Repositories</h2>
      {loading && <p>Loading repositories...</p>}
      {error && <p className="text-danger fw-bold">{error}</p>}
      {!loading && !error && repos.length === 0 && <p>No public repositories found.</p>}
      {!loading && !error && repos.length > 0 && (
        <ul className="list-group">
          {repos.map(repo => (
            <li key={repo.id} className="list-group-item">
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-decoration-none fw-bold"
              >
                {repo.name}
              </a>
              <p className="text-muted mb-1">{repo.description}</p>
              <div className="d-flex gap-3 flex-wrap">
                <span>
                  <i className="bi bi-star-fill text-warning me-1"></i>
                  Stars: {repo.stars}
                </span>
                <span>
                  <i className="bi bi-eye-fill text-secondary me-1"></i>
                  Watchers: {repo.watchers}
                </span>
                <span>
                  <i className="bi bi-diagram-2-fill text-success me-1"></i>
                  Forks: {repo.forks}
                </span>
                <span>
                  <i className="bi bi-code-square text-info me-1"></i>
                  Language: {repo.language || "N/A"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProfileGithub;
