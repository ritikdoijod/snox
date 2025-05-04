import mongoose from "mongoose";
import { Permissions } from "@/enums/permission";

const memberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    permissions: [
      {
        type: String,
        enum: Object.values(Permissions),
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Member = mongoose.model("Member", memberSchema);

export { Member };
