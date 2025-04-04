import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { loadProfile } from "../../features/profile/profileSlice";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { user } = useSelector(state => state.auth);
  const { current: currentProfile, loading } = useSelector(state => state.profile);

  // Use Effect Hooks
  useEffect(() => {
    if (!currentProfile && !loading) {
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

  // Dashboard Content
  const dashboardContent = loading ? (
    <Spinner />
  ) : currentProfile ? (
    <div>
      <h1>Welcome, {user?.name || "User"}!</h1>
      <p className="lead">Email: {user.email || "Not provided"}</p>
      {Object.keys(currentProfile).length === 0 && (
        <>
          <h3>You need to setup your profile</h3>
          <Link to="/create-profile" className="btn btn-primary">
            Create Profile
          </Link>
        </>
      )}
      {/* Add other profile fields here */}
    </div>
  ) : (
    <div className="alert alert-warning">No profile found.</div>
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
