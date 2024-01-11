import Joi from "joi";

export const addCommentRequestValidator = Joi.object({
  content: Joi.string().min(1).max(10000).required(),
}).unknown(false);

export const commentPageNumberValidator = Joi.object({
  pageNumber: Joi.number().integer().min(1).max(41).required(),
}).unknown(false);
