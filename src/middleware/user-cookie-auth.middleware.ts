import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";

export const userCookieAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("cookies:" + req.cookies);
    const token = req.cookies.token;
    const user = jwt.verify(token, "secret key stored in somewhere");
    // the user is converted into plain javascript object, no longer a mongoose document
    req.user = user;
    next();
  } catch (err) {
    res.clearCookie("token");
    return res.redirect('/');
  }
}
