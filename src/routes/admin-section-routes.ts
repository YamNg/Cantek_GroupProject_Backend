import express from "express";
import {
  addSection,
  updateSection,
  deactivateSection,
  getSections,
} from "../controller/section.controller.js";

const router = express.Router();

// add a Section
router.post("/", addSection);
// get Sections
router.get("/", getSections);
// update a Section
router.put("/:id", updateSection);
// deactivate a Section
router.delete("/:id", deactivateSection);

export default router;
