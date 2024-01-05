import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { CustomError } from "../config/error/custom.error.js";

const errorHandlerMiddleware: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("reach errorHandlerMiddleware");
  if (err instanceof CustomError) {
    console.log("reach CustomError");
    // Handle custom errors
    res.status(err.statusCode).send();
  } else {
    console.log("reach OtherError");
    // Handle other types of errors (log them if needed)
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default errorHandlerMiddleware;
