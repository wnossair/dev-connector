import { useState } from "react";
import { useSelector } from "react-redux";

import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import SelectListGroup from "../common/SelectListGroup";
import InputGroup from "../common/InputGroup";

const CreateProfile = () => {
  const profile = useSelector(state => state.profile);
  const appError = useSelector(state => state.errors);

  // Select Options for Status
  const options = [
    { label: "* Select Professional Status", value: 0 },
    { label: "Developer", value: "Developer" },
    { label: "Junior Developer", value: "Junior Developer" },
    { label: "Senior Developer", value: "Senior Developer" },
    { label: "Manager", value: "Manager" },
    { label: "Student or Learning", value: "Student" },
    { label: "Instructor or Teacher", value: "Instructor" },
    { label: "Intern", value: "Intern" },
    { label: "Other", value: "Other" },
  ];

  // Social Inputs
  const SocialInputs = () => {
    return (
      <>
        <InputGroup
          name="twitter"
          value={formData.twitter}
          placeholder="Twitter Profile URL"
          id="twitter"
          icon="bi bi-twitter"
          onChange={onChange}
          error={fieldErrors.twitter}
        />
        <InputGroup
          name="facebook"
          value={formData.facebook}
          placeholder="Facebook Profile URL"
          id="facebook"
          icon="bi bi-facebook"
          onChange={onChange}
          error={fieldErrors.facebook}
        />
        <InputGroup
          name="linkedin"
          value={formData.linkedin}
          placeholder="Linkedin Profile URL"
          id="linkedin"
          icon="bi bi-linkedin"
          onChange={onChange}
          error={fieldErrors.linkedin}
        />
        <InputGroup
          name="youtube"
          value={formData.youtube}
          placeholder="Youtube Profile URL"
          id="youtube"
          icon="bi bi-youtube"
          onChange={onChange}
          error={fieldErrors.youtube}
        />
        <InputGroup
          name="instagram"
          value={formData.instagram}
          placeholder="Instagram Profile URL"
          id="instagram"
          icon="bi bi-instagram"
          onChange={onChange}
          error={fieldErrors.instagram}
        />
      </>
    );
  };

  // Use State Hooks
  const [formData, setFormData] = useState({
    displaySocialInputs: false,
    handle: "",
    company: "",
    website: "",
    location: "",
    status: "",
    skills: "",
    githubusername: "",
    bio: "",
    twitter: "",
    facebook: "",
    linkedin: "",
    youtube: "",
    instagram: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});

  // Event Handlers
  const toggleSocialInputs = () => {
    setFormData(prev => ({
      ...prev,
      displaySocialInputs: !prev.displaySocialInputs,
    }));
  };

  const onChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
  };

  // Component
  return (
    <div className="create-profile">
      <div className="container">
        <div className='"row'>
          <div className="col-lg-8 m-auto">
            <div className="display-4 text-center">Create Your Profile</div>
            <p className="lead text-center">
              Let's get some information to make your profile stand out
            </p>
            <small className="d-block p-3">* = required fields</small>
            <form onSubmit={onSubmit}>
              {/* Handle Field */}
              <TextFieldGroup
                name="handle"
                value={formData.handle}
                type="text"
                placeholder="* Profile Handle"
                id="handle"
                error={fieldErrors.handle}
                onChange={onChange}
                info="A unique handle for your profile URL. Your full name, company name, nickname, etc"
              />

              {/* Professional Status Field */}
              <SelectListGroup
                name="status"
                value={formData.status}
                placeholder="Status"
                id="status"
                options={options}
                error={fieldErrors.status}
                onChange={onChange}
                info="Give us an idea of where you are at in your career"
              />

              {/* Company Field */}
              <TextFieldGroup
                name="company"
                value={formData.company}
                type="text"
                placeholder="Company"
                id="company"
                error={fieldErrors.company}
                onChange={onChange}
                info="Could be your own company or one you work for"
              />
              {/* Website Field */}
              <TextFieldGroup
                name="website"
                value={formData.website}
                type="text"
                placeholder="Website"
                id="website"
                error={fieldErrors.website}
                onChange={onChange}
                info="Could be your own or a company website"
              />
              {/* Location Field */}
              <TextFieldGroup
                name="location"
                value={formData.location}
                type="text"
                placeholder="Location"
                id="location"
                error={fieldErrors.location}
                onChange={onChange}
                info="City & state suggested (eg. Boston, MA)"
              />
              {/* Skills Field */}
              <TextFieldGroup
                name="skills"
                value={formData.skills}
                type="text"
                placeholder="Skills"
                id="skills"
                error={fieldErrors.skills}
                onChange={onChange}
                info="Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)"
              />
              {/* Github Username Field */}
              <TextFieldGroup
                name="githubusername"
                value={formData.githubusername}
                type="text"
                placeholder="Github Username"
                id="githubusername"
                error={fieldErrors.githubusername}
                onChange={onChange}
                info="If you want your latest repos and a Github link, include your username"
              />

              {/* Bio Field */}
              <TextAreaFieldGroup
                name="bio"
                value={formData.bio}
                type="text"
                placeholder="Short Bio"
                id="bio"
                error={fieldErrors.bio}
                onChange={onChange}
                info="Tell us a little about yourself"
              />

              <div className="mb-3">
                <button
                  onClick={toggleSocialInputs}
                  className={`btn btn-outline-secondary btn-light ${
                    formData.displaySocialInputs ? "active" : ""
                  }`}
                  aria-pressed={formData.displaySocialInputs}
                >
                  Add Social Networks
                </button>
                <span className="text-muted ms-2">(Optional)</span>
              </div>
              {formData.displaySocialInputs && <SocialInputs />}
              <input type="submit" value="Submit" className="btn btn-info btn-block mt-4" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
