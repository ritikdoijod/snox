import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
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
    workspace: {
      type: mongoose.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  {
    timestamps: true,
  },
);

const Project = mongoose.model("Project", projectSchema);

export { Project };
