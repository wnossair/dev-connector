const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

const { check, validationResult } = require("express-validator");

// Load Models
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// Load Input Validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

const router = express.Router();

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

// @route   GET api/profile
// @desc    Get current user's profile
// @access  Private
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.profile = "There is no profile for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(500).json(err));
});

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  check("handle", "Handle is required").notEmpty(),
  check("status", "Status is required").notEmpty(),
  check("skills", "Skills is required").notEmpty(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;

    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    if (typeof req.body.skills != undefined) {
      profileFields.skills = req.body.skills.split(",");
    }

    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists";
            return res.status(400).json(errors);
          } else {
            // Save Profile
            new Profile(profileFields).save().then(profile => res.json(profile));
          }
        });
      }
    });
  }
);

// @route   GET api/profile/handle/:handle
// @desc    Get user profile by handle
// @access  Public
router.get("/handle/:handle", (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.profile = "There is no profile for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/user/:user_id
// @desc    Get user profile by user_id
// @access  Public
router.get("/user/:user_id", (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.profile = "There is no profile for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json({ profile: "There is no profile for this user" }));
});

// @route   GET api/profile/all
// @desc    Get all user profiles
// @access  Public
router.get("/all", (req, res) => {
  const errors = {};

  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.profile = "There are no profiles";
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(() => res.status(404).json({ profile: "There are no profiles" }));
});

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post("/experience", passport.authenticate("jwt", { session: false }), (req, res) => {
  const { errors, isValid } = validateExperienceInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        errors.profile = "No profile for user";
        return res.status(404).json(errors);
      }

      const newExperience = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };

      // Add to experience array
      profile.experience.unshift(newExperience);
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => res.status(404).json(err));
    })
    .catch(err => res.status(404).json(err));
});

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post("/education", passport.authenticate("jwt", { session: false }), (req, res) => {
  const { errors, isValid } = validateEducationInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        errors.profile = "No profile for user";
        return res.status(404).json(errors);
      }

      const newEducation = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };

      // Add to experience array
      profile.education.unshift(newEducation);
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => res.status(404).json(err));
    })
    .catch(err => res.status(404).json(err));
});

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience entry from profile
// @access  Private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.profile = "No profile for user";
          return res.status(404).json(errors);
        }

        // Get remove index, splice index, and save
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        if (removeIndex == -1) {
          errors.experience = "No experience entry for this exp_id ";
          return res.status(404).json(errors);
        }

        profile.experience.splice(removeIndex, 1);
        profile
          .save()
          .then(profile => res.json(profile))
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json({ profile: "There is no profile for this user" }));
  }
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education entry from profile
// @access  Private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          return res.status(404).json({ profile: "No profile found for this user" });
        }

        // Find the index of the education entry to remove
        const removeIndex = profile.education.findIndex(edu => edu.id === req.params.edu_id);

        if (removeIndex === -1) {
          return res.status(404).json({ education: "No education entry found for this edu_id" });
        }

        profile.education.splice(removeIndex, 1);
        profile
          .save()
          .then(profile => res.json(profile))
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    // Remove user posts
    // Remove profile
    // Remove user
    await Promise.all([
      Post.deleteMany({ user: req.user.id }),
      Profile.findOneAndDelete({ user: req.user.id }),
      User.findOneAndDelete({ _id: req.user.id }),
    ]);

    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
