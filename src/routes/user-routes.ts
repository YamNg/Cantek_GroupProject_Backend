import express from "express";
import {
  registerUser,
  updateUserName,
  userLogin,
  verifyUserCookies,
} from "../controller/user.controller.js";
import { userCookieAuth } from "../middleware/user-cookie-auth.middleware.js";

const router = express.Router();
router.post("/login", userLogin);
router.post("/register", registerUser);
router.patch("/update-username", userCookieAuth, updateUserName);
router.get("/verify", userCookieAuth, verifyUserCookies);
// router.post('/profile', userCookieAuth, getUserProfile);

export default router;
