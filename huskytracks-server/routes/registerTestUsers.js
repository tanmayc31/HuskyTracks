import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/register-test-users", async (req, res) => {
  console.log("🔐 Register test users endpoint hit");

  try {
    const users = [
      // Students (no location needed)
      { email: "alice@northeastern.edu", password: "alice123", role: "student", location: "" },
      { email: "bob@northeastern.edu", password: "bob123", role: "student", location: "" },
      { email: "charlie@northeastern.edu", password: "charlie123", role: "student", location: "" },

      // Admins (with locations)
      { email: "admin@northeastern.edu", password: "admin123", role: "admin", location: "Snell Library" },
      { email: "curry-admin@northeastern.edu", password: "curry123", role: "admin", location: "Curry Student Center" },
      { email: "isec-admin@northeastern.edu", password: "isec123", role: "admin", location: "ISEC" },

      // Supervisors (with locations)
      { email: "supervisor@northeastern.edu", password: "super123", role: "supervisor", location: "Snell Library" },
      { email: "curry-supervisor@northeastern.edu", password: "curry123", role: "supervisor", location: "Curry Student Center" },
      { email: "isec-supervisor@northeastern.edu", password: "isec123", role: "supervisor", location: "ISEC" },
    ];

    for (let userData of users) {
      const exists = await User.findOne({ email: userData.email });
      if (!exists) {
        const user = new User(userData);
        await user.save();
      }
    }

    res.status(201).json({ message: "Test users registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error registering test users", error });
  }
});

export default router;
