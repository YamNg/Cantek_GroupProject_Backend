import express from "express";
import {
  addTopic,
  updateTopic,
  deactivateTopic,
  getTopics,
} from "../controller/topic.controller.js";

const router = express.Router();

// add a Section
router.post("/", addTopic);
// get Sections
router.get("/", getTopics);
// update a Section
router.put("/:id", updateTopic);
// deactivate a Section
router.delete("/:id", deactivateTopic);

export default router;
