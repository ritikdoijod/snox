import mongoose from "mongoose";
import { config } from "./app";
// import { logger } from "./logger.config.js";

const connectToDB = async () => {
  try {
    mongoose.set("strict", false);

    await mongoose.connect(config.MONGO_URI);
    // logger.info("Database connected.");
  } catch (error) {
    // logger.fatal("Database connection failed");
    // logger.fatal("ERROR: " + error);
    process.exit(1);
  }
};

export { connectToDB };
