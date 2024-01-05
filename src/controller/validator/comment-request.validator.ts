import Joi from "joi";

export const addCommentRequestValidator = Joi.object({
  content: Joi.string().min(1).max(10000).required(),
  userId: Joi.string().required(),
}).unknown(false);
