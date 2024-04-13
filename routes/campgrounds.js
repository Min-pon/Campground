const express = require("express");
const router = express.Router();

const app = express();

router.get("/", (req, res) => {
  res.status(200).json({ success: true, msg: "Show all campgrounds" });
});

router.get("/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Show campground ${req.params.id}` });
});

router.post("/", (req, res) => {
  res.status(200).json({ success: true, msg: "Create new campground" });
});

router.put("/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Update campground ${req.params.id}` });
});

router.delete("/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete campground ${req.params.id}` });
});

module.exports = router;
