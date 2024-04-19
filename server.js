const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Route files
const campgrounds = require("./routes/campgrounds");
const bookings = require("./routes/bookings");

// Load env vars
dotenv.config({ path: "./config/config.env" });

const app = express();

// app.get("/", (req, res) => {
//   res.status(200).json({ success: true, data: { id: 1 } });
// });

// Connect to database
connectDB();

// Body parser
app.use(express.json());

// Mount routers
app.use("/api/v1/campgrounds", campgrounds);
app.use("/api/v1/bookings", bookings);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log("Server running in", process.env.NODE_ENV, "mode on port", PORT)
);

//Handle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
