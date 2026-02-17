const express = require("express");
const router = express.Router();
const messageController = require("./message-controller");
const validation = require("../../shared/middlewares/validate-middleware");
const messageValidation = require("./message-validation");
const userService = require("../user/user-service");

const AuthMiddleware = require("../../shared/middlewares/auth-middleware");

const authGuard = new AuthMiddleware(userService);

router.use(authGuard.protect);

router.post(
  "/send",
  validation.validate(messageValidation.sendMessageSchema),
  messageController.sendMessage,
);
router.get(
  "/history/:contactId",
  validation.validate(messageValidation.getChatSchema, "params"),
  messageController.getChat,
);

module.exports = router;
