import express from "express";
import { addUser } from "../controller/user.controller.js";

const router = express.Router();

// add a User
router.post("/", addUser);

export default router;
