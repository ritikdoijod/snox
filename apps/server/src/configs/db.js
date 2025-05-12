import mongoose from "mongoose";
import { config } from "./app";
import { logger } from "./logger";

mongoose.set("strict", false);

mongoose.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret?.__v;
    delete ret?.password;
    return ret;
  }
})

mongoose.set("toObject", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
})

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
