import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";

export const userCookieAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      return next({ status: 401, message: "Unauthorized" });
    }

    let user;
    try {
      user = jwt.verify(accessToken, `${process.env.ACCESS_TOKEN_SECRET}`);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        user = jwt.verify(refreshToken, `${process.env.REFRESH_TOKEN_SECRET}`);
        const newAccessToken = jwt.sign(user, `${process.env.ACCESS_TOKEN_SECRET}`, { expiresIn: "15m"});
        res.cookie("accessToken", newAccessToken, {httpOnly: true, secure: false});

        // to be deleted
        res.status(200).send("refresh access token");
      } else {
        return next(err);
      }
    }
    
    // the user is converted into plain javascript object, no longer a mongoose document
    req.user = user;
    next();
  } catch (err) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return next({ status: 401, message: "Cookie timed out or wrong" });
  }
}