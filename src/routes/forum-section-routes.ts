import express from "express";
import { getSections } from "../controller/section.controller.js";

const router = express.Router();

// get Sections
router.get("/", getSections);

export default router;
