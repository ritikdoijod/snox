import { PRIORITY, STATUS } from "@/utils/constants";
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
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
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(STATUS.TASK)
    },
    priority: {
        type: String,
        required: true,
        default: PRIORITY.LOW,
        enum: Object.values(PRIORITY)
    }
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

export { Project };
