const express = require("express");
const {
  getBookings,
  addBooking,
  getBooking,
} = require("../controllers/bookings");
const router = express.Router();

router.route("/").get(getBookings).post(addBooking);
router.route("/:id").get(getBooking);
module.exports = router;
