import express from "express";
import {
  upvoteComment,
  downvoteComment,
} from "../controller/comment.controller.js";
import { userCookieAuth } from "../middleware/user-cookie-auth.middleware.js";

const router = express.Router();

// Vote Comment Function
router.post("/:commentId/upvote", userCookieAuth, upvoteComment);
router.post("/:commentId/downvote", userCookieAuth, downvoteComment);

export default router;
