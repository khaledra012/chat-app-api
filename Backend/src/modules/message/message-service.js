const Message = require("./message-model");
const userService = require("../user/user-service");
const AppError = require("../../shared/utils/AppError");

class MessageService {
  async sendMessage(senderId, receiverId, messageText) {
    const receiver = await userService.getUserById(receiverId);

    if (!receiver) {
      throw new AppError("المستلم غير موجود يا هندسة!", 404);
    }

    if (senderId.toString() === receiverId.toString()) {
      throw new AppError("متحاولش تشيت مع نفسك، ابعت لحد تاني!", 400);
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message: messageText,
    });

    return newMessage;
  }

  async getChatHistory(userId, contactId) {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: contactId },
        { sender: contactId, receiver: userId },
      ],
    })
      .sort({ createdAt: 1 }) 
      .populate("sender", "username email")
      .populate("receiver", "username email");

    return messages;
  }
}

module.exports = new MessageService();
