import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";

export const userCookieAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    const user = jwt.verify(token, `${process.env.COOKIE_KEY}`);
    // the user is converted into plain javascript object, no longer a mongoose document
    req.user = user;
    next();
  } catch (err) {
    res.clearCookie("token");
    res.status(401).json({ error: "Cookie timed out or wrong" });
  }
}
