import express from "express";
import {
  registerUser,
  updateUserName,
  userLogin,
  userLogout,
  verifyUserCookies,
} from "../controller/user.controller.js";
import { userCookieAuth } from "../middleware/user-cookie-auth.middleware.js";

const router = express.Router();
router.post("/login", userLogin);
router.post("/logout", userLogout);
router.post("/register", registerUser);
router.patch("/update-username", userCookieAuth, updateUserName);
router.get("/verify", userCookieAuth, verifyUserCookies);
// router.post('/profile', userCookieAuth, getUserProfile);

export default router;
