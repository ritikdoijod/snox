import mongoose from "mongoose";

const appEventSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Types.ObjectId,
      refPath: "subjectType",
      required: true,
    },
    subjectType: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

const AppEvent = mongoose.model("AppEvent", appEventSchema);

export { AppEvent };