const express = require("express");
const {
  getBookings,
  addBooking,
  getBooking,
} = require("../controllers/bookings");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router
  .route("/")
  .get(protect, getBookings)
  .post(protect, authorize("admin", "user"), addBooking);
router.route("/:id").get(getBooking);
module.exports = router;
