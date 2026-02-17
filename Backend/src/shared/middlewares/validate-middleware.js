const AppError = require("../utils/AppError");

class ValidationMiddleware {
  validate(schema, source = "body") {
    return (req, res, next) => {
      const { error } = schema.validate(req[source], { abortEarly: false });

      if (error) {
        const errorMessage = error.details.map((el) => el.message).join(", ");
        return next(new AppError(errorMessage, 400));
      }
      next();
    };
  }
}

module.exports = new ValidationMiddleware();
