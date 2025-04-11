const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const LostItem = require("../models/LostItem");

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb("Error: Only JPEG, JPG, and PNG images are allowed!");
    }
  },
});

// Path to default image
const DEFAULT_IMAGE_PATH = path.join(__dirname, "../uploads/defaults/default-item.png");

// GET all lost items
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    let items;

    if (email) {
      items = await LostItem.find({ submittedBy: email });
    } else {
      items = await LostItem.find();
    }

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET lost items by location (for supervisors)
router.get("/supervisor", async (req, res) => {
  try {
    const { location } = req.query;
    const items = await LostItem.find({ locationName: location });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new lost item
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, locationName, submittedBy, category } = req.body;
    
    let imageUrl;
    
    // If an image was uploaded, use it
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } 
    // Otherwise, use the default image
    else {
      // Create a copy of the default in the uploads folder with unique name
      const uniqueFilename = `default-${Date.now()}.png`;
      const destinationPath = path.join(__dirname, "../uploads", uniqueFilename);
      
      // Check if defaults directory exists, create it if it doesn't
      const defaultsDir = path.dirname(DEFAULT_IMAGE_PATH);
      if (!fs.existsSync(defaultsDir)) {
        fs.mkdirSync(defaultsDir, { recursive: true });
      }
      
      // If default image doesn't exist yet, create a placeholder
      if (!fs.existsSync(DEFAULT_IMAGE_PATH)) {
        // Create basic placeholder image directory
        console.log("Default image not found, using system placeholder");
        // You could implement a fallback here if needed
        imageUrl = "/uploads/placeholder.png"; // This should be a pre-existing file in your system
      } else {
        // Copy the default image
        fs.copyFileSync(DEFAULT_IMAGE_PATH, destinationPath);
        imageUrl = `/uploads/${uniqueFilename}`;
      }
    }

    const newLostItem = new LostItem({
      title,
      description,
      locationName,
      imageUrl,
      submittedBy,
      category,
      status: "Pending", // Default status
    });

    const savedItem = await newLostItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH (update) a lost item status
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedItem = await LostItem.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;