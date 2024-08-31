const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const itemRoutes = require("./routes/itemRoutes");

dotenv.config({ path: "./.env" });

const app = express();

app.use(cors());
app.use(express.json());

// Database Connection
const dbURI = process.env.MONGO_DB_URI;
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

// Serve static files from the uploads folder
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/items", itemRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
