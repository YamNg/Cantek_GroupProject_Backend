import { UserDto } from "../../controller/dto/user.dto.js";

declare module "express-serve-static-core" {
  interface Request {
    user: UserDto;
  }
}