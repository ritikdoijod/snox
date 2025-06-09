import mongoose from "mongoose";
import { Roles } from "@/enums/role";

const memberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workspace: {
      type: mongoose.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(Roles),
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Member = mongoose.model("Member", memberSchema);

export { Member };
