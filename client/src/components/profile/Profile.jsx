import React, { useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileAbout from "./ProfileAbout";
import ProfileCredentials from "./ProfileCredentials";
import ProfileGithub from "./ProfileGithub";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadProfileByHandle } from "../../features/profile/profileSlice";
import { Spinner } from "../common/Feedback";

const Profile = () => {
  const { handle } = useParams();
  const dispatch = useDispatch();
  const { display: profile, loading, error } = useSelector(state => state.profile);

  useEffect(() => {
    if (handle) {
      dispatch(loadProfileByHandle(handle));
    }
  }, [handle, dispatch]);

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
              {profile.githubusername && <ProfileGithub username={profile.githubusername} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
