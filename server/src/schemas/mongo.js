import mongoose from "mongoose";
import z from "zod";

export const mongoObjectIdSchema = function (message) {
  return z.string().refine((value) => mongoose.isValidObjectId(value), {
    message,
  });
};
