import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { GenericResponseDto } from "../controller/dto/generic-response.dto.js";
import { AppError } from "../config/error/app.error.js";
import {
  MissingToken,
  TokenVerificationError,
} from "../config/constant/app.error.contant.js";
import { UserDto } from "../controller/dto/user.dto.js";
import { CookieConstants } from "../config/constant/user.constant.js";

export const userCookieAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (accessToken == null || refreshToken == null) {
      throw new AppError(MissingToken);
    }

    let user;
    try {
      user = jwt.verify(accessToken, `${process.env.ACCESS_TOKEN_SECRET}`);
    } catch (err) {
      // only refresh if token is expired, if there is other error, they are all malicious, so throw
      if (err instanceof jwt.TokenExpiredError) {
        user = jwt.verify(
          refreshToken,
          `${process.env.REFRESH_TOKEN_SECRET}`
        ) as UserDto;
        const newAccessToken = jwt.sign(
          { _id: user.userId, username: user.username, userNo: user.userNo },
          `${process.env.ACCESS_TOKEN_SECRET}`,
          { expiresIn: CookieConstants.ACCESS_TOKEN }
        );
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: false,
        });
      } else {
        throw new AppError(TokenVerificationError);
      }
    }
    // the user is converted into plain javascript object, no longer a mongoose document
    req.user = new UserDto(user);
    next();
  } catch (err) {
    // res.clearCookie("accessToken");
    // res.clearCookie("refreshToken");
    if (err instanceof AppError) {
      res.status(err.statusCode).send(
        new GenericResponseDto({
          isSuccess: false,
          errorCode: err.errorCode,
          errorMsg: err.message,
        })
      );
    } else if (err instanceof jwt.JsonWebTokenError) {
      new GenericResponseDto({
        isSuccess: false,
        errorCode: "400",
        errorMsg: err.message,
      });
    } else {
      console.log(err);
      res.status(400).send(
        new GenericResponseDto({
          isSuccess: false,
          errorCode: "400",
          errorMsg: "unknown error",
        })
      );
    }
  }
};
