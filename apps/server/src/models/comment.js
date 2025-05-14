import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    task: {
      type: String,
      required: false,
    },
    createdBy: {
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