import { User } from "../config/mongoose/models/user.model.js";
import { NextFunction, Request, Response } from "express";
import { userLoginValidator } from "./validator/user-register.validator.js";
import { generateSalt, hashPassword } from "./services/user-password.service.js";
import jwt from "jsonwebtoken";
import { usernameValidator } from "./validator/user-name.validator.js";
import { AppError } from "../config/error/app.error.js";
import { UserEmailOccupied, IncorrectUserEmailOrPassword, InvalidUserEmailOrPassword, InvalidUsername, UserNotFound } from "../config/constant/app.error.contant.js";
import "dotenv/config";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = userLoginValidator.validate(req.body);
    if (error) {
      throw new AppError(InvalidUserEmailOrPassword);
    }

    const exitingUser = await User.findOne({email: value.email});
    if (exitingUser !== null ) {
      throw new AppError(UserEmailOccupied);
    }
    const newUser = new User(value);
    const salt = generateSalt();
    const encryptedPassword = hashPassword(newUser.password, salt);
    newUser.password = encryptedPassword;
    newUser.salt = salt;

    await newUser.save();
    res.status(201).send(newUser);
  } catch (err) {
    next(err);
  }
};

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = userLoginValidator.validate(req.body);
    if (error) {
      throw new AppError(InvalidUserEmailOrPassword);
    }

    const user = await User.findOne({ email: value.email});
    if (!user) {
      throw new AppError(IncorrectUserEmailOrPassword);
    }

    const inputHash = await hashPassword(value.password, user.salt);
    if (inputHash !== user.password) {
      throw new AppError(IncorrectUserEmailOrPassword);
    }
    
    const token = jwt.sign(user.toObject(), `${process.env.COOKIE_KEY}`, { expiresIn: "365d"});
    res.cookie("token", token, {httpOnly: true, secure: false});

    res.status(200).send('login');
  } catch (err) {
    next(err);
  }
};

export const updateUserName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = usernameValidator.validate(req.body);
    if (error) {
      throw new AppError(InvalidUsername);
    }

    const user = await User.findOneAndUpdate({email: req.user.email});
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
}