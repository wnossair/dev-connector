const isEmpty = value =>
  value == undefined ||
  value == null ||
  (typeof value == "object" && Object.keys(value).length === 0) ||
  (typeof value == "str" && value.trim().length === 0);

  module.exports = isEmpty;
