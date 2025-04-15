import mongoose from "mongoose";

const lostItemSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(v) {
          return v.length === 2 && 
                 v[0] >= -180 && v[0] <= 180 && 
                 v[1] >= -90 && v[1] <= 90;
        },
        message: props => `${props.value} is not a valid coordinate pair!`
      }
    },
    imageUrl: String,
    status: {
      type: String,
      enum: ["Pending", "Matched", "Returned", "Transferred to NUPD"],
      default: "Pending"
    },      
    submittedBy: String,
  },
  { timestamps: true }
);

export default mongoose.model("LostItem", lostItemSchema);
