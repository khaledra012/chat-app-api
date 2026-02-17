const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

class AuthMiddleware {
  constructor(userService) {
    this.userService = userService;
  }

  protect = async (req, res, next) => {
    try {
      let token;
      if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
        return next(new AppError("يا ريت تسجل دخول الأول عشان نعرف إنت مين", 401));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const currentUser = await this.userService.getUserById(decoded.id);

      if (!currentUser) {
        return next(new AppError("صاحب التوكن ده مابقاش موجود في السيستم", 401));
      }

      req.user = currentUser;
      next();
    } catch (err) {
      return next(new AppError("التوكن باظ أو خلصت مدته، سجل دخول تاني", 401));
    }
  };
}

module.exports = AuthMiddleware;
