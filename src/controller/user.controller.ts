import { User } from "../config/mongoose/models/user.model.js";
import { NextFunction, Request, Response } from "express";
import {
  userLoginValidator,
  userRegisterValidator,
} from "./validator/user-register.validator.js";
import {
  generateSalt,
  generateVerificationCode,
  hashPassword,
} from "./services/user.service.js";
import jwt from "jsonwebtoken";
import { usernameValidator } from "./validator/user-name.validator.js";
import { AppError } from "../config/error/app.error.js";
import {
  UserEmailOccupied,
  IncorrectUserEmailOrPassword,
  InvalidUserEmailOrPassword,
  InvalidUsername,
  UserNotFound,
} from "../config/constant/app.error.contant.js";
import "dotenv/config";
import { VerificationCodeTable } from "../config/mongoose/models/verification-code-table.model.js";
import { GenericResponseDto } from "./dto/generic-response.dto.js";
import { CookieConstants } from "../config/constant/user.constant.js";
import { UserDto } from "./dto/user.dto.js";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error, value } = userRegisterValidator.validate(req.body);
    if (error) {
      throw error;
    }

    const exitingUser = await User.findOne({ email: value.email });
    if (exitingUser !== null) {
      throw new AppError(UserEmailOccupied);
    }
    const newUser = new User(value);
    const newCode = new VerificationCodeTable({
      user: newUser,
      code: generateVerificationCode(),
    });
    const salt = generateSalt();
    const encryptedPassword = hashPassword(newUser.password, salt);
    newUser.password = encryptedPassword;
    newUser.salt = salt;

    await newUser.save();
    res.status(201).send(
      new GenericResponseDto({
        isSuccess: true,
        body: new UserDto(newUser),
      })
    );
  } catch (err) {
    next(err);
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error, value } = userLoginValidator.validate(req.body);
    if (error) {
      throw new AppError(InvalidUserEmailOrPassword);
    }

    const user = await User.findOne({ email: value.email });
    if (!user) {
      throw new AppError(IncorrectUserEmailOrPassword);
    }

    const inputHash = hashPassword(value.password, user.salt);
    if (inputHash !== user.password) {
      throw new AppError(IncorrectUserEmailOrPassword);
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      `${process.env.ACCESS_TOKEN_SECRET}`,
      { expiresIn: CookieConstants.ACCESS_TOKEN }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      `${process.env.REFRESH_TOKEN_SECRET}`,
      { expiresIn: CookieConstants.REFRESH_TOKEN }
    );

    // set secure to true in production so only https can connect
    // secure: false, both http, https can connect
    res.cookie("accessToken", accessToken, { httpOnly: true, secure: false });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false });
    res.status(200).send(
      new GenericResponseDto({
        isSuccess: true,
        body: new UserDto(user),
      })
    );
  } catch (err) {
    next(err);
  }
};

// let frontend handle access token expired
// currently not in use, backend handled access token expired
export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return next({ status: 401, message: "Unauthorized" });
    }

    const user = jwt.verify(
      refreshToken,
      `${process.env.REFRESH_TOKEN_SECRET}`
    );
    const newAccessToken = jwt.sign(
      user,
      `${process.env.ACCESS_TOKEN_SECRET}`,
      { expiresIn: CookieConstants.ACCESS_TOKEN }
    );
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
    });

    req.user = new UserDto(user);
    next();
  } catch (err) {
    return next(err);
  }
};

export const verifyUserEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (err) {}
};

export const updateUserName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error, value } = usernameValidator.validate(req.body);
    if (error) {
      throw new AppError(InvalidUsername);
    }

    const user = await User.findOneAndUpdate(
      { _id: req.user.userId },
      { username: req.body.username },
      { new: true }
    );
    if (!user) {
      throw new AppError(IncorrectUserEmailOrPassword);
    }

    res.status(200).send(
      new GenericResponseDto({
        isSuccess: true,
        body: new UserDto(user),
      })
    );
  } catch (err) {
    next(err);
  }
};
