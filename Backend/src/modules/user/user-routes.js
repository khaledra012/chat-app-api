const express = require("express");
const router = express.Router();
const userController = require("./user-controller");
const userValidation = require("./user-validation");
const validation = require("../../shared/middlewares/validate-middleware");
const authMiddleware = require("../../shared/middlewares/auth-middleware");
const userService = require("./user-service");

const authGuard = new authMiddleware(userService);

router.post(
  "/register",
  validation.validate(userValidation.signupSchema),
  userController.register,
);

router.post(
  "/login",
  validation.validate(userValidation.loginSchema),
  userController.login,
);

router.get("/", authGuard.protect, userController.getAllUsers);

module.exports = router;
