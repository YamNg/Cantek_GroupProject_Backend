import Joi from "joi";

export const usernameValidator = Joi.object({
  username: Joi.string().min(3).max(15).required(),
}).unknown(false);