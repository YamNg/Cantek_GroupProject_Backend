import express from "express";
import {
  addThread,
  getThread,
  getThreadsByTopic,
} from "../controller/thread.controller.js";

const router = express.Router();

// add a Thread
router.post("/", addThread);

// get Thread by topicId
// query parameters:
// - pageSize > controlling pagination size
// - lastId > last threadId of last page loaded
router.get("/all/topic/:topicId", getThreadsByTopic);

// getting plain Thread object, without comment preloaded
router.get("/:threadId", getThread);

export default router;
