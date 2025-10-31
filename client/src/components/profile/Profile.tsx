import { useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileAbout from "./ProfileAbout";
import ProfileCredentials from "./ProfileCredentials";
import ProfileGithub from "./ProfileGithub";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { loadProfileById, loadGithubRepos } from "../../features/profile/profileSlice";
import { Spinner } from "../common/Feedback";
import { unwrapResult } from "@reduxjs/toolkit";

const Profile = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams();
  const auth = useAppSelector(state => state.auth);
  const { current, loading, repos } = useAppSelector(state => state.profile);

  useEffect(() => {
    if (id) {
      dispatch(loadProfileById(id))
        .then(unwrapResult)
        .then(profile => {
          if (profile?.githubusername) {
            dispatch(loadGithubRepos(profile.githubusername));
          }
        })
        .catch(err => {
          console.error("Failed to fetch profile or repos:", err);
        });
    }
  }, [id, dispatch]);

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
