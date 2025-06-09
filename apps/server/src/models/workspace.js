import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
    avatar: {
      type: String,
      required: false,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

workspaceSchema.index({ name: 1 });
workspaceSchema.index({ description: 1 });

const Workspace = mongoose.model("Workspace", workspaceSchema);

export { Workspace };
