const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Item = require("../models/Item");
const router = express.Router();

//use multer to upload images to the server
//using multer because less time to implement aws s3
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../frontend/src/images")); // Save images in frontend folder
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

//  Create a new item
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const newItem = new Item({
      title: req.body.title,
      description: req.body.description,
      image: req.file ? req.file.filename : null, // Save image path in database
    });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Retrieve all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//  Update an item by id
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (req.file) {
      // If there's an old image, delete it
      if (item.image) {
        const oldImagePath = path.join(
          __dirname,
          "../../frontend/src/images",
          item.image
        );
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Failed to delete old image:", err);
        });
      }
      // Update with new image
      item.image = req.file.filename;
    }

    item.title = req.body.title;
    item.description = req.body.description;

    const updatedItem = await item.save();
    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Delete an item by ID
router.delete("/:id", async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    // Delete image from server
    if (item.image) {
      const imagePath = path.join(
        __dirname,
        "../../frontend/src/images",
        item.image
      );
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Failed to delete image:", err);
      });
    }
    res.status(204).json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
