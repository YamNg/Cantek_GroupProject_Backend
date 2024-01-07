import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectToMongo } from "./config/mongoose/mongoose.js";
import routes from "./routes/index.js";
import cookieParser from 'cookie-parser';
import errorHandlerMiddleware from "./middleware/error-handler.middleware.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use('/', routes);

const port = process.env.PORT || 3000;

try {
  await connectToMongo();
  app.listen(port, () => {
    console.log(`server is running on port ${port}`);
  });
} catch (err) {
  console.log("err", err);
  throw err;
}
