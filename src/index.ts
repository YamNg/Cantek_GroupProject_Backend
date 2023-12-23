import express from "express"
import "dotenv/config";
import cors from "cors";
import { connectToMongo } from "./config/mongoose/mongoose.js";
import routes from "./routes/index.js";
import { startConsumer } from "./proofConcept/KafkaComsumer.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use('/', routes);

const port = process.env.PORT || 3000;

try{
    await connectToMongo();
    await startConsumer();
    app.listen(port, () => {
        console.log(`server is running on port ${port}`)
    });
} catch (err){
    console.log("err", err);
    throw err;
}