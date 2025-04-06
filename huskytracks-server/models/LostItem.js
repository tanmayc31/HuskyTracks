import mongoose from "mongoose";

const lostItemSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    locationName: String,
    imageUrl: String,
    status: {
      type: String,
      enum: ["Pending", "Matched", "Returned"],
      default: "Pending",
    },
    submittedBy: String,
  },
  { timestamps: true }
);

export default mongoose.model("LostItem", lostItemSchema);
