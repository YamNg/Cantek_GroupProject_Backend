import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { GenericResponseDto } from "../controller/dto/generic-response.dto.js";
import { AppError } from "../config/error/app.error.js";
import {
  MissingToken,
  TokenVerificationError,
} from "../config/constant/app.error.contant.js";
import { UserDto } from "../controller/dto/user.dto.js";

export const userCookieAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      throw new AppError(MissingToken);
    }

    let user;
    try {
      user = jwt.verify(accessToken, `${process.env.ACCESS_TOKEN_SECRET}`);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        user = jwt.verify(refreshToken, `${process.env.REFRESH_TOKEN_SECRET}`);
        const newAccessToken = jwt.sign(
          user,
          `${process.env.ACCESS_TOKEN_SECRET}`,
          { expiresIn: "15m" }
        );
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: false,
        });

        res.status(200).send(
          new GenericResponseDto({
            isSuccess: true,
            body: { accessToken: newAccessToken },
          })
        );
      } else {
        throw new AppError(TokenVerificationError);
      }
    }

    // the user is converted into plain javascript object, no longer a mongoose document
    req.user = new UserDto(user);
    next();
  } catch (err) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(400).send(
      new GenericResponseDto({
        isSuccess: false,
        errorCode: MissingToken.errorCode,
        errorMsg: MissingToken.message,
      })
    );
  }
};
