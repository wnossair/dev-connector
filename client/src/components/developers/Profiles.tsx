import { useEffect, useState } from "react";
import { useProfileStore } from "../../stores/useProfileStore";
import { Spinner } from "../common/Feedback";
import { Link } from "react-router-dom";
import ProfileItem from "./ProfileItem";
import type { Profile } from "../../types";

const Profiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const allProfiles = useProfileStore(state => state.all);
  const loading = useProfileStore(state => state.loading);
  const loadAllProfiles = useProfileStore(state => state.loadAllProfiles);

  useEffect(() => {
    loadAllProfiles();
  }, [loadAllProfiles]);

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
