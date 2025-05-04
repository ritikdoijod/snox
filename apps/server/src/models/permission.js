import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {},
  {
    timestamps: true,
  }
);

const Member = mongoose.model("Member", memberSchema);

export { Member };
