const isEmpty = require("./utils");
const Validator = require("validator");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";
  // data.to = !isEmpty(data.to) ? data.to : "";
  // data.current = !isEmpty(data.current) ? data.current : "";

  if (Validator.isEmpty(data.title)) {
    errors.title = "Job title field is required";
  }

  if (Validator.isEmpty(data.company)) {
    errors.company = "Company field is required";
  }

  // if (Validator.isDate(data.from)) {
  //   errors.from = "From date field is not valid";
  // }

  if (Validator.isEmpty(data.from)) {
    errors.from = "From Date field is required";
  }

  // if (Validator.isDate(data.to)) {
  //   errors.to = "To Date field is not valid";
  // }

  // if (!Validator.isBoolean(data.current)) {
  //   errors.current = "Current field is not valid";
  // }

  // if (
  //   (errors.to && errors.current) ||
  //   (Validator.isEmpty(data.to) && Validator.isEmpty(data.current))
  // ) {
  //   errors.to = "Either to date or current needs to be set";
  //   errors.current = "Either to date or current needs to be set";
  // }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
