import Joi from "joi";

export const userLoginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).unknown(false);