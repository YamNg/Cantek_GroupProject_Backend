import { Thread } from "../config/mongoose/models/thread.model.js";
import { Comment } from "../config/mongoose/models/comment.model.js";
import { Request, Response } from "express";
import { addThreadRequestValidator } from "./validator/thread.request.validator.js";

export const addThread = async (req: Request, res: Response) => {
  try {
    // create new Section
    const { error, value } = addThreadRequestValidator.validate(req.body);
    if (error) {
      return res.status(400).send(error);
    }
    // const newThread = new Thread(req.body);

    res.status(201).send();
  } catch (err) {
    res.status(400).send(err);
  }
};
