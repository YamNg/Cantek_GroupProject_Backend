import express from "express";
import adminSectionRoutes from "./admin-section-routes.js";
import adminTopicRoutes from "./admin-topic-routes.js";

const router = express.Router();

router.use("/admin/section", adminSectionRoutes);
router.use("/admin/topic", adminTopicRoutes);

// /thread /comment

export default router;
