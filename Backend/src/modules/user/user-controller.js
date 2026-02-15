const userService = require('./user-service');

class UserController {
  async register(req, res, next) {
    try {
      const user = await userService.register(req.body);
      res.status(201).json({
        status: 'success',
        message: 'تم إنشاء الحساب بنجاح',
        data: { user }
      });
    } catch (error) {
      next(error); 
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await userService.login(email, password);
      
      res.status(200).json({
        status: 'success',
        message: 'تم تسجيل الدخول بنجاح',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const currentUserId = req.user?.id; 
      const users = await userService.getAllUsers(currentUserId);
      
      res.status(200).json({
        status: 'success',
        data: { users }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();