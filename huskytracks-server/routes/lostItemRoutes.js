import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import LostItem from "../models/LostItem.js";

const router = express.Router();

// ✅ MULTER CONFIG
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });


// ✅ 1. POST /api/lost-items → student reports lost item
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, locationName, submittedBy } = req.body;
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const newItem = new LostItem({
      title,
      description,
      locationName,
      submittedBy,
      imageUrl,
      status: "Pending",
    });

    await newItem.save();
    res.status(201).json({ message: "Lost item reported!", item: newItem });
  } catch (error) {
    console.error("❌ Error saving lost item:", error);
    res.status(500).json({ message: "Failed to save lost item", error });
  }
});


// ✅ 2. GET /api/lost-items?email=... → for student dashboard
router.get("/", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const items = await LostItem.find({ submittedBy: email }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch lost items", error });
  }
});


// ✅ 3. GET /api/lost-items/supervisor?location=Snell Library
router.get("/supervisor", async (req, res) => {
  const { location } = req.query;
  if (!location) {
    return res.status(400).json({ message: "Location is required" });
  }

  try {
    const items = await LostItem.find({ locationName: location }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error("❌ Error fetching supervisor items:", error);
    res.status(500).json({ message: "Failed to fetch items", error });
  }
});


// ✅ 4. PATCH /api/lost-items/:id → supervisor updates status
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Pending", "Matched", "Returned", "Transferred to NUPD"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const item = await LostItem.findByIdAndUpdate(id, { status }, { new: true });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Status updated", item });
  } catch (error) {
    console.error("❌ Failed to update item status:", error);
    res.status(500).json({ message: "Error updating item", error });
  }
});

export default router;
