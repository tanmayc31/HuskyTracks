import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import LostItem from "../models/LostItem.js";

const router = express.Router();

// ✅ MULTER CONFIG (Put this FIRST!)
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

// ✅ POST route (MUST come after upload is defined)
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

// ✅ GET route (optional, for dashboard)
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

export default router;
