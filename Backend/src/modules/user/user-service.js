const User = require("./user-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../../shared/utils/AppError");

class UserService {
  async register(userData) {
    const { username, email, password } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("هذا البريد مسجل بالفعل", 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    return await user.save();
  }

  async login(email, password) {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new AppError("بيانات الدخول غير صحيحه", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("بيانات الدخول غير صحيحه", 400);
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    };
  }

  async getAllUsers(currentUserId) {
    return await User.find({ _id: { $ne: currentUserId } }).select("-password");
  }

  async getUserById(id) {
    return await User.findById(id);
  }
}

module.exports = new UserService();
