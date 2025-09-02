import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import ProfileActions from "./ProfileActions";
import { logoutUser } from "../../features/auth/authSlice";
import { clearAppError, setAppError } from "../../features/error/errorSlice";
import { deleteAccount, loadCurrentProfile } from "../../features/profile/profileSlice";

import Experience from "./Experience";
import Education from "./Education";
import { Spinner } from "../common/Feedback";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { user } = useSelector(state => state.auth);
  const { current, loading } = useSelector(state => state.profile);

  // Use Effect Hooks
  useEffect(() => {
    // Clear all errors on mount
    dispatch(clearAppError());
  }, [dispatch]);

  useEffect(() => {
    if (user && !current && !loading) {
      dispatch(loadCurrentProfile());
    }
  }, [current, loading, user, dispatch]);

  // Event handlers
  const onDeleteAccountClick = async () => {
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
  ) : !current || Object.keys(current).length === 0 ? (
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
        Welcome,{" "}
        <Link to={`/profile/user/${user.id}`} className="text-dark">
          {user?.name}
        </Link>
      </h2>
      <ProfileActions />
      <Experience experience={current.experience} />
      <div className="py-1 mb-4" />
      <Education education={current.education} />

      <button onClick={onDeleteAccountClick} className="btn btn-danger mt-5 mb-4">
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
