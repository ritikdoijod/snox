import { PRIORITY, STATUS } from "@/utils/constants";
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
    project: {
      type: mongoose.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: Object.values(STATUS.TASK),
    },
    priority: {
      type: String,
      required: true,
      default: PRIORITY.LOW,
      enum: Object.values(PRIORITY),
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    asignee: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Task = mongoose.model("Task", taskSchema);
