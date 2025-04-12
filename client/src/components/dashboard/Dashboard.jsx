import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import ProfileActions from "./ProfileActions";
import { logoutUser } from "../../features/auth/authSlice";
import { clearAppError, setAppError } from "../../features/error/errorSlice";
import { deleteAccount, loadProfile } from "../../features/profile/profileSlice";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { user } = useSelector(state => state.auth);
  const { current: currentProfile, loading } = useSelector(state => state.profile);

  // Use Effect Hooks
  useEffect(() => {
    // Clear all errors on mount
    dispatch(clearAppError());
  }, [dispatch]);

  useEffect(() => {
    if (user && !currentProfile && !loading) {
      dispatch(loadProfile());
    }
  }, [currentProfile, loading, dispatch]);

  // Loading Spinner (Bootstrap)
  const Spinner = () => (
    <div className="d-flex justify-content-center my-5">
      <div className="spinner-border text-secondary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  // Event handlers
  const onDeleteAccountClick = async e => {
    if (window.confirm("Are you sure? This can NOT be undone!")) {
      try {
        if (await dispatch(deleteAccount()).unwrap()) {
          dispatch(logoutUser());
        }
      } catch (error) {
        dispatch(setAppError(error));
        console.log("Delete account error:", error);
      }
    }
  };

  // Dashboard Content
  const dashboardContent = loading ? (
    <Spinner />
  ) : !currentProfile || Object.keys(currentProfile).length === 0 ? (
    <div>
      <h2>Welcome, {user?.name || "User"}!</h2>
      <p className="lead">Email: {user?.email || "Not provided"}</p>
      <h3>You need to setup your profile</h3>
      <Link to="/create-profile" className="btn btn-primary">
        Create Profile
      </Link>
    </div>
  ) : (
    <div>
      <h2>
        Welcome, <Link to={`/profile/${currentProfile.handle}`}>{user?.name}</Link>
      </h2>
      <ProfileActions />
      {/* Add experience and education */}
      <div style={{ marginBottom: "60px" }} />
      <button onClick={onDeleteAccountClick} className="btn btn-danger">
        Delete My Account
      </button>
    </div>
  );

  // Component
  return (
    <div className="dashboard">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="display-4">Dashboard</h1>
            {dashboardContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
