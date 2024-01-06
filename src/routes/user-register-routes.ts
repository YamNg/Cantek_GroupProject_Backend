import express from "express";
import { registerUser, updateUserName } from "../controller/user.controller.js";
import { userCookieAuth } from "../middleware/user-cookie-auth.middleware.js";

const router = express.Router();
router.post("/", registerUser);
router.post("/update-username", userCookieAuth, updateUserName);

export default router;