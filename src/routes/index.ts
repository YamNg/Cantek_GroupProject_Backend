import express from 'express';

const router = express.Router();

router.use('/', function(req, res) {
    res.send("Hello World");
});


export default router;