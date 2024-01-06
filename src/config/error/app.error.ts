import { IAppErrorConstant } from "../constant/app.error.contant.js";

export class AppError extends Error {
  public statusCode: number;
  public errorCode: string;

  constructor(appError: IAppErrorConstant) {
    super(appError.message);
    this.statusCode = appError.statusCode;
    this.errorCode = appError.errorCode;
  }
}
