import express from "express";
import adminSectionRoutes from "./admin-section-routes.js";
import adminTopicRoutes from "./admin-topic-routes.js";
import sectionRoutes from "./forum-section-routes.js";
import topicRoutes from "./forum-topic-routes.js";
import threadRoutes from "./forum-thread-routes.js";
import commentRoutes from "./forum-comment-routes.js";

const router = express.Router();

router.use("/admin/section", adminSectionRoutes);
router.use("/admin/topic", adminTopicRoutes);

router.use("/section", sectionRoutes);
router.use("/topic", topicRoutes);
router.use("/thread", threadRoutes);
router.use("/comment", commentRoutes);

export default router;
