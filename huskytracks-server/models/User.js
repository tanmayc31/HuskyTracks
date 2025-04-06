import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// models/User.js
const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^[\w\.\-]+@northeastern\.edu$/, "Only NEU emails allowed"]
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "supervisor", "admin"],
      default: "student"
    },
    location: {
      type: String,
      default: "" // e.g., "Snell Library" for supervisors
    }
  });
  
  

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", userSchema);
