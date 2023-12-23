import express from 'express';
import { produceMessages } from '../proofConcept/KafkaProducer.js';

const router = express.Router();

router.use('/test-kafka', async function(req, res) {
    await produceMessages();
    res.send("executed");
});


router.use('/', function(req, res) {
    res.send("Hello World");
});


export default router;