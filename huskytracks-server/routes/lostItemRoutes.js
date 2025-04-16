import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import LostItem from "../models/LostItem.js";

const router = express.Router();

// ✅ Multer config
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

// ✅ 1. Student reports lost item
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, coordinates, submittedBy, category, locationName } = req.body;
    const imageUrl = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : null;

    // Parse coordinates from string to array
    let parsedCoordinates;
    try {
      parsedCoordinates = JSON.parse(coordinates);
      if (!Array.isArray(parsedCoordinates) || parsedCoordinates.length !== 2) {
        throw new Error('Invalid coordinates format');
      }
    } catch (error) {
      return res.status(400).json({ message: "Invalid coordinates format" });
    }

    const newItem = new LostItem({
      title,
      description,
      coordinates: parsedCoordinates,
      submittedBy,
      imageUrl,
      status: "Pending",
      category,
      locationName
    });

    await newItem.save();
    res.status(201).json({ message: "Lost item reported!", item: newItem });
  } catch (error) {
    console.error("❌ Error saving lost item:", error);
    res.status(500).json({ message: "Failed to save lost item", error });
  }
});

// ✅ 2. Get lost items by student
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

// ✅ 3. Get lost items for supervisor
router.get("/supervisor", async (req, res) => {
  const { location } = req.query;
  
  try {
    // Find all items, but prioritize those in the supervisor's location
    const items = await LostItem.find().sort({ createdAt: -1 });
    
    // Add a field to indicate if the item is in the supervisor's location
    // (This is used for highlighting/filtering on the frontend)
    const itemsWithLocationMatch = items.map(item => {
      const isInSupervisorLocation = item.locationName === location;
      return {
        ...item.toObject(),
        isInSupervisorLocation
      };
    });
    
    res.json(itemsWithLocationMatch);
  } catch (error) {
    console.error("❌ Error fetching supervisor items:", error);
    res.status(500).json({ message: "Failed to fetch items", error });
  }
});

// ✅ 4. Update status
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
