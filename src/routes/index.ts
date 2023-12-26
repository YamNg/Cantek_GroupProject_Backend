import express from 'express';
import forumRoutes from "./forum-app-routes.js";

const router = express.Router();

router.use("/forum", forumRoutes);

router.use('/', function(req, res) {
    res.send("Hello World");
});


export default router;