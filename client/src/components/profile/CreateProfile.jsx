import { useState } from "react";
import { useSelector } from "react-redux";

import TextFieldGroup from "../common/TextFieldGroup";

const CreateProfile = () => {
  const profile = useSelector(state => state.profile);
  const appError = useSelector(state => state.errors);

  const [displaySocialInputs, setDisplaySocialInputs] = useState(false);
  const [handle, setHandle] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [skills, setSkills] = useState("");
  const [githubusername, setGithubusername] = useState("");
  const [bio, setBio] = useState("");
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [youtube, setYoutube] = useState("");
  const [instagram, setInstagram] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  return (
    <div className="create-profile">
      <div className="container">
        <div className='"row'>
          <div className="col-md-8 m-auto">
            <div className="display-4 text-center">Create Your Profile</div>
            <p className="lead text-center">
              Let's get some information to make your profile stand out
            </p>
            <small className="d-block p-3">* = required fields</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
