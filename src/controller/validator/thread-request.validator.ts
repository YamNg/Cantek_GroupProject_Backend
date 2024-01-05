import Joi from "joi";

export const addThreadRequestValidator = Joi.object({
  topicId: Joi.string().required(),
  title: Joi.string().min(1).max(130).required(),
  content: Joi.string().min(1).max(10000).required(),
  userId: Joi.string().required(),
}).unknown(false);
