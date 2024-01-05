import express from "express";
import {
  upvoteComment,
  downvoteComment,
} from "../controller/comment.controller.js";

const router = express.Router();

// Vote Comment Function
router.post("/:commentId/upvote", upvoteComment);
router.post("/:commentId/downvote", downvoteComment);

export default router;
