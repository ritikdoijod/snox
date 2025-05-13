import mongoose from "mongoose";
import { config } from "./app";
import { logger } from "./logger";

mongoose.set("strict", false);

const connectToDB = async () => {
  try {

    await mongoose.connect(config.MONGO_URI);
    logger.info("Database connected.");
  } catch (error) {
    logger.fatal("Database connection failed");
    logger.fatal("ERROR: " + error);
    process.exit(1);
  }
};

export { connectToDB };
