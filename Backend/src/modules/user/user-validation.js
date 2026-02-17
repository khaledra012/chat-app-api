const Joi = require("joi");
const AppError = require("../../shared/utils/AppError");


class UserValidation {
  get signupSchema() {
    return Joi.object({
      username: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required()
    });
  }

  get loginSchema() {
    return Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    });
  }
}

module.exports = new UserValidation();