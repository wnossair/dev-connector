import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { loadCurrentProfile } from "../../features/profile/profileSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.user);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await dispatch(loadCurrentProfile()).unwrap();
      } catch (err) {}
    };

    fetchProfile();
  }, [dispatch]);

  // Component
  return <div>Dashboard</div>;
};

export default Dashboard;
