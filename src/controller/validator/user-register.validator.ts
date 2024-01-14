import Joi from "joi";

export const userRegisterValidator = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  reconfirmPassword: Joi.string().required().valid(Joi.ref("password")),
}).unknown(false);

export const userLoginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).unknown(false);
