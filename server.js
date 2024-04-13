const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Route files
const campgrounds = require("./routes/campgrounds");

// Load env vars
dotenv.config({ path: "./config/config.env" });

const app = express();

// Mount routers
app.use("/api/v1/campgrounds", campgrounds);

// app.get("/", (req, res) => {
//   res.status(200).json({ success: true, data: { id: 1 } });
// });

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log("Server running in", process.env.NODE_ENV, "mode on port", PORT)
);
