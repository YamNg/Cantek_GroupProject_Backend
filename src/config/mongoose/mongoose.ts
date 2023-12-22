import mongoose from "mongoose";
import "dotenv/config";

export const connectToMongo = async () => {
    try {
        const mongoUrl = process.env.MONGO_URL;
        if (!mongoUrl) {
            throw new Error("MONGO_URL is not defined in the environment variables");
        }
        await mongoose.connect(mongoUrl);
        console.log("Successfully connected to mongo");
    } catch (err) {
      console.log("err", err);
      throw err;
    }
  };