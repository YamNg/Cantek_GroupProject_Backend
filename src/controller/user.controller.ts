import { User } from "../config/mongoose/models/user.model.js";
import { Request, Response } from "express";
import { userLoginValidator } from "./validator/user.register.validator.js";
import { generateSalt, hashPassword } from "./services/user-password.service.js";
import { SortValues } from "mongoose";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { error, value } = userLoginValidator.validate(req.body);
    if (error) {
      return res.status(400).send(error);
    }

    const newUser = new User(value);
    const salt = generateSalt();
    const encryptedPassword = hashPassword(newUser.password, salt);
    newUser.password = encryptedPassword;
    newUser.salt = salt;

    await newUser.save();
    res.status(201).send(newUser);
  } catch (err) {
    res.status(400).send(err);
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { error, value } = userLoginValidator.validate(req.body);
    if (error) {
      return res.status(400).send(error);
    }

    const user = await User.findOne({ email: value.email});
    if (!user) {
      return res.status(400).send('Invalid email');
    }

    const inputHash = await hashPassword(value.password, user.salt);
    if (inputHash !== user.salt) {
      return res.status(400).send('Invalid password');
    }
    res.status(200).send('login');
  } catch (err) {

  }
};


