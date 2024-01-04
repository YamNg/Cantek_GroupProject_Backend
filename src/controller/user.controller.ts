import { User } from "../config/mongoose/models/user.model.js";
import { Request, Response } from "express";

export const addUser = async (req: Request, res: Response) => {
  try {
    // create new Topic
    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).send();
  } catch (err) {
    res.status(400).send(err);
  }
};
