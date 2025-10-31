import { useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileAbout from "./ProfileAbout";
import ProfileCredentials from "./ProfileCredentials";
import ProfileGithub from "./ProfileGithub";
import { Link, useParams } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { useProfileStore } from "../../stores/useProfileStore";
import { Spinner } from "../common/Feedback";

const Profile = () => {
  const { id } = useParams();
  const auth = useAuthStore(state => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
  }));
  const current = useProfileStore(state => state.current);
  const loading = useProfileStore(state => state.loading);
  const repos = useProfileStore(state => state.repos);
  const loadProfileById = useProfileStore(state => state.loadProfileById);
  const loadGithubRepos = useProfileStore(state => state.loadGithubRepos);

  useEffect(() => {
    if (id) {
      loadProfileById(id)
        .then(profile => {
          if (profile?.githubusername) {
            loadGithubRepos(profile.githubusername);
          }
        })
        .catch(err => {
          console.error("Failed to fetch profile or repos:", err);
        });
    }
  }, [id, loadProfileById, loadGithubRepos]);

  if (loading) {
    return <Spinner />;
  }

  if (!current) {
    return (
      <div className="container">
        <h1 className="display-4">Profile not found</h1>
        <p>Sorry, this page does not exist.</p>
        <Link to="/profiles" className="btn btn-dark">
          Back To Profiles
        </Link>
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="row">
              <ProfileHeader profile={current} />
              <ProfileAbout profile={current} />
              <ProfileCredentials profile={current} />
              {current.githubusername && <ProfileGithub repos={repos} />}
              {auth.isAuthenticated &&
                auth.user &&
                typeof current.user !== "string" &&
                auth.user._id === current.user._id && (
                  <div className="mt-3">
                    <Link to="/edit-profile" className="btn btn-outline-danger d-inline-block">
                      Edit Profile
                    </Link>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
