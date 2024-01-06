import { User } from "../config/mongoose/models/user.model.js";
import { Request, Response } from "express";
import { userLoginValidator } from "./validator/user-register.validator.js";
import { generateSalt, hashPassword } from "./services/user-password.service.js";
import jwt from "jsonwebtoken";
import { usernameValidator } from "./validator/user-name.validator.js";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { error, value } = userLoginValidator.validate(req.body);
    if (error) {
      return res.status(400).send(error);
    }

    const exitingUser = await User.findOne({email: value.email});
    if (exitingUser !== null ) {
      return res.status(400).send("email is already registered");
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
    if (inputHash !== user.password) {
      return res.status(400).send('Invalid password');
    }
    
    const token = jwt.sign(user.toObject(), "secret key stored in somewhere", { expiresIn: "365d"});
    res.cookie("token", token, {httpOnly: true, secure: false});

    res.status(200).send('login');
    // return res.redirect("/all/topic");
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

export const updateUserName = async (req: Request, res: Response) => {
  try {
    const { error, value } = usernameValidator.validate(req.body);
    if (error) {
      return res.status(400).send(error);
    }

    const user = await User.findOneAndUpdate({email: req.user.email});
    res.status(200).send(user);
  } catch (err) {

  }
}


export const saveThread = async (req: Request, res: Response) => {
  try {
    
  } catch (err) {

  }
}

