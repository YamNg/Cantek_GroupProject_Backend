import express from "express";
import { getTopics } from "../controller/topic.controller.js";

const router = express.Router();

// get Sections
router.get("/", getTopics);

export default router;
