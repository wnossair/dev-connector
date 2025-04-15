import React, { useEffect, useState } from "react";
import { loadAllProfiles } from "../../features/profile/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../common/Feedback";
import { Link } from "react-router-dom";

const Profiles = () => {
  const dispatch = useDispatch();

  const [profiles, setProfiles] = useState([]);
  const { all: allProfiles, loading } = useSelector(state => state.profile);

  useEffect(() => {
    dispatch(loadAllProfiles());
  }, []);

  useEffect(() => {
    if (profiles) {
      setProfiles(allProfiles);
    }
  }, [allProfiles]);

  return (
    <div>
      {!profiles || loading ? (
        <Spinner />
      ) : profiles.length > 0 ? (
        // Profiles
        <div class="profiles">
          <div class="container">
            <div class="row">
              <div class="col-md-12">
                <h1 class="display-4 text-center">Developer Profiles</h1>
                <p class="lead text-center">Browse and connect with developers</p>

                {/* TODO: Profile Item */}
                <div class="card card-body bg-light mb-3">
                  <div class="row">
                    <div class="col-2">
                      <img
                        class="rounded-circle"
                        src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200"
                        alt=""
                      />
                    </div>
                    <div class="col-lg-6 col-md-4 col-8">
                      <h3>John Doe</h3>
                      <p>Developer at Microsoft</p>
                      <p>Seattle, WA</p>
                      <a href="profile.html" class="btn btn-info">
                        View Profile
                      </a>
                    </div>
                    <div class="col-md-4 d-none d-lg-block">
                      <h4>Skill Set</h4>
                      <ul class="list-group">
                        <li class="list-group-item">
                          <i class="fa fa-check pr-1"></i>HTML
                        </li>
                        <li class="list-group-item">
                          <i class="fa fa-check pr-1"></i>CSS
                        </li>
                        <li class="list-group-item">
                          <i class="fa fa-check pr-1"></i>JavaScript
                        </li>
                        <li class="list-group-item">
                          <i class="fa fa-check pr-1"></i>Python
                        </li>
                        <li class="list-group-item">
                          <i class="fa fa-check pr-1"></i>C#
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div class="card card-body bg-light mb-3">
                  <div class="row">
                    <div class="col-2">
                      <img
                        class="rounded-circle"
                        src="https://www.gravatar.com/avatar/anything?s=200&d=mm"
                        alt=""
                      />
                    </div>
                    <div class="col-lg-6 col-md-4 col-8">
                      <h3>John Doe</h3>
                      <p>Developer at Microsoft</p>
                      <p>Seattle, WA</p>
                      <a href="profile.html" class="btn btn-info">
                        View Profile
                      </a>
                    </div>
                    <div class="col-md-4 d-none d-lg-block">
                      <h4>Skill Set</h4>
                      <ul class="list-group">
                        <li class="list-group-item">
                          <i class="fa fa-check pr-1"></i>HTML
                        </li>
                        <li class="list-group-item">
                          <i class="fa fa-check pr-1"></i>CSS
                        </li>
                        <li class="list-group-item">
                          <i class="fa fa-check pr-1"></i>PHP
                        </li>
                        <li class="list-group-item">
                          <i class="fa fa-check pr-1"></i>MySQL
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
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
