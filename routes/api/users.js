const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load local modules
const User = require("../../models/User.js");
const keys = require("../../config/keys.js");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    }

    const avatar = gravatar.url(req.body.email, {
      s: "200",
      r: "pg",
      d: "mm",
    });

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      avatar: avatar,
      password: req.body.password,
    });

    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;

      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;

        newUser.password = hash;
        newUser
          .save()
          .then(user => res.json(user))
          .catch(err => console.log(err));
      });
    });
  });
});

// @route   POST api/users/login
// @desc    Login user / returning JWT Token
// @access  Public
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Find User
  User.findOne({ email })
    .then(user => {
      // Check for user
      if (!user) {
        errors.email = "User not found";
        return res.status(404).json(errors);
      }

      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // res.json({ msg: "Success" });
          // User Matched
          const payload = { id: user.id, name: user.name, avatar: user.avatar };

          //Sign Token
          jwt.sign(payload, keys.secretOrKey, { expiresIn: "60m" }, (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          });
        } else {
          errors.password = "Password incorrect";
          return res.status(400).json(errors);
        }
      });
    })
    .catch(err => console.log(err));
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar,
  });
});

module.exports = router;
