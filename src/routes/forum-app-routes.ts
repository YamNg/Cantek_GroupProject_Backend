import express from "express";
import {
    addComment,
    lookupCommentParent
} from "../controller/forum-app.controller.js";

const router = express.Router();

router.post("/comments", addComment);
router.get("/comments/:commentId/parents", lookupCommentParent);

export default router;