import express from "express";
import {
  addThread,
  getThreadDetailByPage,
  getThreadsByTopic,
  addCommentToThread,
  addReplyCommentToThread,
  getLatestThreads,
} from "../controller/thread.controller.js";
import { userCookieAuth } from "../middleware/user-cookie-auth.middleware.js";

const router = express.Router();

// add a Thread
router.post("/", userCookieAuth, addThread);

// get Thread by topicId
// query parameters:
// - lastId > last threadId of last page loaded
router.get("/all/topic/:topicId", getThreadsByTopic);
router.get("/all", getLatestThreads);

router.get("/:threadId/page/:pageNumber", getThreadDetailByPage);

router.post("/:threadId/comment", userCookieAuth, addCommentToThread);
router.post(
  "/:threadId/comment/:commentId/reply",
  userCookieAuth,
  addReplyCommentToThread
);

export default router;
