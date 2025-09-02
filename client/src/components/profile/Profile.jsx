import React, { useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileAbout from "./ProfileAbout";
import ProfileCredentials from "./ProfileCredentials";
import ProfileGithub from "./ProfileGithub";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadProfileById, loadGithubRepos } from "../../features/profile/profileSlice";
import { Spinner } from "../common/Feedback";

const Profile = () => {
  const dispatch = useDispatch();

  const { id } = useParams();
  const auth = useSelector(state => state.auth);
  const { display: profile, loading, error, repos } = useSelector(state => state.profile);

  useEffect(() => {
    if (id) {
      dispatch(loadProfileById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (profile?.githubusername) {
      dispatch(loadGithubRepos(profile.githubusername));
    }
  }, [profile, dispatch]);

  if (loading) {
    return <Spinner />;
  }

  if (error || !profile) {
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
              <ProfileHeader profile={profile} />
              <ProfileAbout profile={profile} />
              <ProfileCredentials profile={profile} />
              {profile.githubusername && <ProfileGithub repos={repos} />}
              {auth.isAuthenticated && auth.user.id === profile.user._id && (
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
