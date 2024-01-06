import express from "express";
import forumRoutes from "./forum-app-routes.js";
import userRoutes from "./user-routes.js";

const router = express.Router();

router.use("/forum", forumRoutes);
router.use("/user", userRoutes);

router.use("/", function (req, res) {
  res.send("Hello World");
});

export default router;
