import React, { useEffect, useState } from "react";
import { loadAllProfiles } from "../../features/profile/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../common/Feedback";
import { Link } from "react-router-dom";
import ProfileItem from "./ProfileItem";

const Profiles = () => {
  const dispatch = useDispatch();

  const [profiles, setProfiles] = useState([]);
  const { all: allProfiles, loading } = useSelector(state => state.profile);

  useEffect(() => {
    dispatch(loadAllProfiles());
  }, [dispatch]);

  useEffect(() => {
    if (allProfiles) {
      setProfiles(allProfiles);
    }
  }, [allProfiles]);

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : profiles?.length > 0 ? (
        // Profiles
        <div className="profiles">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h1 className="display-4 text-center">Developer Profiles</h1>
                <p className="lead text-center">Browse and connect with developers</p>

                {profiles.map(profile => (
                  <ProfileItem key={profile._id} profile={profile} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h4 className="display-6 mb-2">
            There are no profiles be the first <Link to="/login">one</Link>
          </h4>
        </div>
      )}
    </div>
  );
};

export default Profiles;
