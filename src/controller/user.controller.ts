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
  UserIdOccupied,
  IncorrectUserEmailOrPassword,
  InvalidUserEmailOrPassword,
  InvalidUsername,
  UserNotFound,
  UserMultipleLogin,
} from "../config/constant/app.error.contant.js";
import "dotenv/config";
import { VerificationCodeTable } from "../config/mongoose/models/verification-code-table.model.js";
import { GenericResponseDto } from "./dto/generic-response.dto.js";
import {
  CookieConstants,
  UserStatus,
} from "../config/constant/user.constant.js";
import { UserDto } from "./dto/user.dto.js";
import { EnvironmentConstants } from "../config/constant/environment.constant.js";

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
    const existingUser = await User.findOne({
      $or: [{ email: value.email }, { username: value.username }],
    });
    if (existingUser) {
      throw new AppError(UserIdOccupied);
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

    // if (user.status == UserStatus.LOGIN) {
    //   throw new AppError(UserMultipleLogin);
    // }

    const inputHash = hashPassword(value.password, user.salt);
    if (inputHash !== user.password) {
      throw new AppError(IncorrectUserEmailOrPassword);
    }

    await User.findOneAndUpdate(
      { _id: user._id },
      { status: UserStatus.LOGIN }
    );

    const accessToken = jwt.sign(
      { _id: user._id, username: user.username, userNo: user.userNo },
      `${process.env.ACCESS_TOKEN_SECRET}`,
      { expiresIn: CookieConstants.ACCESS_TOKEN }
    );
    const refreshToken = jwt.sign(
      { _id: user._id, username: user.username, userNo: user.userNo },
      `${process.env.REFRESH_TOKEN_SECRET}`,
      { expiresIn: CookieConstants.REFRESH_TOKEN }
    );

    // set secure to true in production so only https can connect
    // secure: false, both http, https can connect
    if (
      process.env.ENVIRONMENT &&
      process.env.ENVIRONMENT === EnvironmentConstants.DEV
    ) {
      res.cookie("accessToken", accessToken, { httpOnly: true, secure: false });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
      });
    } else {
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
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

export const userLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user.userId },
      { status: UserStatus.LOGOUT },
      { new: true }
    );

    if (!user) {
      throw new AppError(UserNotFound);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).send(
      new GenericResponseDto({
        isSuccess: true,
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

// export const verifyUserEmail = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//   } catch (err) {}
// };

export const verifyUserCookies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).send(
      new GenericResponseDto({
        isSuccess: true,
        body: new UserDto({
          _id: req.user.userId,
          username: req.user.username,
          userNo: req.user.userNo,
        }),
      })
    );
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
