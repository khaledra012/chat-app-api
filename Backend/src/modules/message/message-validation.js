const Joi = require("joi");

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

class MessageValidation {
  sendMessageSchema = Joi.object({
    receiverId: Joi.string().pattern(mongoIdPattern).required().messages({
      "string.pattern.base": "رقم المستلم غير صحيح يا هندسة",
      "any.required": "لازم تبعت رقم المستلم",
    }),
    message: Joi.string().min(1).max(1000).required().messages({
      "string.empty": "ماتبعتش رسالة فاضية!",
      "string.max": "الرسالة طويلة أوي، اختصر شوية",
      "any.required": "محتوى الرسالة مطلوب",
    }),
  });

  getChatSchema = Joi.object({
    contactId: Joi.string().pattern(mongoIdPattern).required().messages({
      "string.pattern.base": "رقم الشخص اللي بتكلمه غير صحيح",
    }),
  });
}

module.exports = new MessageValidation();
