import express from "express";
import User from "../models/User.js";
import LostItem from "../models/LostItem.js";

const router = express.Router();

// GET all users for Admin Dashboard
// GET supervisors and admins only
router.get("/users", async (req, res) => {
    try {
      const users = await User.find({ role: { $in: ["supervisor", "admin"] } });
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch users", error: err });
    }
  });
  
// PATCH: Update a user's role or location
router.patch("/users/:id", async (req, res) => {
    try {
      const { role, location } = req.body;
      const user = await User.findByIdAndUpdate(req.params.id, { role, location }, { new: true });
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Update failed", error: err });
    }
  });

  import moment from "moment";

  router.get("/analytics", async (req, res) => {
    try {
      const totalItems = await LostItem.countDocuments();
  
      const byStatus = await LostItem.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]);
  
      const byLocation = await LostItem.aggregate([
        { $group: { _id: "$locationName", count: { $sum: 1 } } }
      ]);
  
      const usersByRole = await User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } }
      ]).then(data => data.map(item => ({ role: item._id, count: item.count })));
  
      // Weekly trend (last 7 days)
      const past7 = [...Array(7)].map((_, i) =>
        moment().subtract(6 - i, "days").format("YYYY-MM-DD")
      );
  
      const allItems = await LostItem.find({
        createdAt: { $gte: moment().subtract(7, "days").startOf("day").toDate() }
      });
  
      const trends = past7.map(date => ({
        date,
        count: allItems.filter(item => moment(item.createdAt).format("YYYY-MM-DD") === date).length
      }));
  
      res.json({
        totalItems,
        byStatus,
        byLocation,
        usersByRole,
        weeklyTrends: trends
      });
    } catch (err) {
      res.status(500).json({ message: "Error fetching analytics", error: err });
    }
  });
  
  
  
  
  // DELETE: Remove a user
  router.delete("/users/:id", async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: "User deleted" });
    } catch (err) {
      res.status(500).json({ message: "Delete failed", error: err });
    }
  });
  // POST /api/admin/create-user
router.post("/create-user", async (req, res) => {
    const { email, password, role, location } = req.body;
  
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password, and role are required." });
    }
  
    if (!email.endsWith("@northeastern.edu")) {
      return res.status(400).json({ message: "Only Northeastern emails are allowed." });
    }
  
    try {
      const existing = await User.findOne({ email });
      if (existing) return res.status(409).json({ message: "User already exists." });
  
      const newUser = new User({
        email,
        password,
        role,
        location: role === "supervisor" ? location : "", // Only supervisors need a location
      });
  
      await newUser.save();
      res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error: error.message });
    }
  });


// GET /api/admin/all-lost-items
router.get("/all-lost-items", async (req, res) => {
  try {
    const items = await LostItem.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch lost items", error: error.message });
  }
});

  
  

export default router;
