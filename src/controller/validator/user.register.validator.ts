import Joi from "joi";

export const userLoginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
}).unknown(false);