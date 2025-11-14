import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import ProfileActions from "./ProfileActions";
import { useAuthStore } from "../../stores/useAuthStore";
import { useErrorStore } from "../../stores/useErrorStore";
import { useProfileStore } from "../../stores/useProfileStore";

import Experience from "./Experience";
import Education from "./Education";
import { Spinner } from "../common/Feedback";

const Dashboard = () => {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const current = useProfileStore(state => state.current);
  const loading = useProfileStore(state => state.loading);
  const loadCurrentProfile = useProfileStore(state => state.loadCurrentProfile);
  const deleteAccount = useProfileStore(state => state.deleteAccount);
  const clearError = useErrorStore(state => state.clearError);
  const setError = useErrorStore(state => state.setError);

  // Track if we've already tried to load the profile
  const hasAttemptedLoad = useRef(false);

  // Use Effect Hooks
  useEffect(() => {
    // Clear all errors on mount
    clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - clearError is stable in Zustand

  useEffect(() => {
    // Only attempt to load profile once when component mounts with a user
    if (user && !current && !loading && !hasAttemptedLoad.current) {
      hasAttemptedLoad.current = true;
      loadCurrentProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Only depend on user, not current or loading

  // Event handlers
  const onDeleteAccountClick = async () => {
    if (window.confirm("Are you sure? This can NOT be undone!")) {
      try {
        await deleteAccount();
        logout();
      } catch (error) {
        setError(error as string);
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
        <Link to={`/profile/user/${user?._id}`} className="text-dark">
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
