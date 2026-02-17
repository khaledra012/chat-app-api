const messageService = require("./message-service");
const AppError = require("../../shared/utils/AppError");
const socketService = require('../../shared/services/socket-service'); // تأكد من المسار
class MessageController {
  sendMessage = async (req, res, next) => {
    try {
      const { receiverId, message } = req.body;

      const senderId = req.user.id;

      if (!message || message.trim() === "") {
        return next(new AppError("مقدرش أبعت رسالة فاضية يا هندسة!", 400));
      }

      const newMessage = await messageService.sendMessage(
        senderId,
        receiverId,
        message,
      );

      socketService.sendToUser(receiverId, "new_message", {
        _id: newMessage._id,
        senderId: senderId,
        text: message,
        createdAt: newMessage.createdAt,
      });

      res.status(201).json({
        status: "success",
        data: { message: newMessage },
      });
    } catch (err) {
      next(err);
    }
  };

  getChat = async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const userId = req.user.id;

      const history = await messageService.getChatHistory(userId, contactId);

      res.status(200).json({
        status: "success",
        results: history.length,
        data: { history },
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new MessageController();
