import { body, check } from "express-validator";

export const registerValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name field is required")
    .isLength({ min: 2, max: 30 })
    .withMessage("Name must be between 2 and 30 characters"),
  body("email")
    .notEmpty()
    .withMessage("Email field is required")
    .isEmail()
    .withMessage("Email is invalid"),
  body("password")
    .notEmpty()
    .withMessage("Password field is required")
    .isLength({ min: 6, max: 30 })
    .withMessage("Password must be between 6 and 30 characters"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Password confirmation field is required")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords must match"),
];

export const loginValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email field is required")
    .isEmail()
    .withMessage("Email is invalid"),
  body("password").notEmpty().withMessage("Password field is required"),
];

export const profileValidation = [
  body("handle")
    .notEmpty()
    .withMessage("Profile handle is required")
    .isLength({ min: 2, max: 40 })
    .withMessage("Handle must be between 2 and 40 characters"),
  body("status").notEmpty().withMessage("Status field is required"),
  body("skills").notEmpty().withMessage("Skills field is required"),
  body("website").optional({ checkFalsy: true }).isURL().withMessage("Not a valid URL"),
  body("youtube").optional({ checkFalsy: true }).isURL().withMessage("Not a valid URL"),
  body("twitter").optional({ checkFalsy: true }).isURL().withMessage("Not a valid URL"),
  body("facebook").optional({ checkFalsy: true }).isURL().withMessage("Not a valid URL"),
  body("linkedin").optional({ checkFalsy: true }).isURL().withMessage("Not a valid URL"),
  body("instagram").optional({ checkFalsy: true }).isURL().withMessage("Not a valid URL"),
];

export const postValidation = [
  body("text")
    .notEmpty()
    .withMessage("Text field is required")
    .isLength({ min: 10, max: 300 })
    .withMessage("Posts must be between 10 and 300 characters"),
];

export const experienceValidation = [
  body("title").notEmpty().withMessage("Job title field is required"),
  body("company").notEmpty().withMessage("Company field is required"),
  body("from")
    .notEmpty()
    .withMessage("From date field is required")
    .isDate()
    .withMessage("Not a valid date"),
  body("to")
    .optional({ checkFalsy: true })
    .isDate()
    .withMessage("Not a valid date")
    .custom((value, { req }) => {
      if (value && new Date(value) < new Date(req.body.from)) {
        throw new Error("To date must be after from date");
      }
      return true;
    }),
  body("current").optional().isBoolean().withMessage("Current must be a boolean"),
];

export const educationValidation = [
  body("school").notEmpty().withMessage("School field is required"),
  body("degree").notEmpty().withMessage("Degree field is required"),
  body("fieldOfStudy").notEmpty().withMessage("Field of study is required"),
  body("from")
    .notEmpty()
    .withMessage("From date is required")
    .isDate()
    .withMessage("Not a valid date"),
  body("to")
    .optional({ checkFalsy: true })
    .isDate()
    .withMessage("Not a valid date")
    .custom((value, { req }) => {
      if (value && new Date(value) < new Date(req.body.from)) {
        throw new Error("To date must be after from date");
      }
      return true;
    }),
  body("current").optional().isBoolean().withMessage("Current must be a boolean"),
];
