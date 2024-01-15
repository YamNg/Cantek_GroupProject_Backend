import express from "express";
import {
  addTopic,
  updateTopic,
  deactivateTopic,
  getTopics,
} from "../controller/topic.controller.js";
import { userCookieAuth } from "../middleware/user-cookie-auth.middleware.js";

const router = express.Router();

// add a Section
router.post("/", userCookieAuth, addTopic);
// get Sections
router.get("/", userCookieAuth, getTopics);
// update a Section
router.put("/:id", userCookieAuth, updateTopic);
// deactivate a Section
router.delete("/:id", userCookieAuth ,deactivateTopic);

export default router;
