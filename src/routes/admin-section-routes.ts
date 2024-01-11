import express from "express";
import {
  addSection,
  updateSection,
  deactivateSection,
} from "../controller/section.controller.js";
import { userCookieAuth } from "../middleware/user-cookie-auth.middleware.js";

const router = express.Router();

// add a Section
router.post("/", userCookieAuth, addSection);
// update a Section
router.put("/:id", userCookieAuth, updateSection);
// deactivate a Section
router.delete("/:id", userCookieAuth, deactivateSection);

export default router;
