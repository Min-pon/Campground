const Booking = require("../models/Booking");
const Campground = require("../models/Campground");

const isValidDate = (bookings, currentDate) => {
  if (!bookings) {
    return true;
  }

  const allDates = bookings.map((booking) => booking.bookingDate);

  // Check if currentDate is already booked
  const currentDateObj = new Date(currentDate);
  for (let i = 0; i < allDates.length; i++) {
    if (allDates[i].getTime() === currentDateObj.getTime()) {
      return false;
    }
  }
  // Check if currentDate is adjacent to any booked dates
  for (const bookedDate of allDates) {
    const diffTime = Math.abs(currentDateObj - bookedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 2) {
      return false;
    }
  }

  return true;
};

//@desc     Get all bookings
//@route    GET /api/v1/bookings
//@access   Public
exports.getBookings = async (req, res, next) => {
  let query;
  //General users can see only their appointments!
  if (req.user.role !== "admin") {
    query = Booking.find({ user: req.user.id }).populate({
      path: "campground",
      select: "name province tel",
    });
  } else {
    query = Booking.find().populate({
      path: "campground",
      select: "name province tel",
    });
  }

  try {
    const bookings = await query;

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    console.log(err.stack);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Booking" });
  }
};

//@desc     Get single booking
//@route    GET /api/v1/bookings/:id
//@access   Public
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: "campground",
      select: "name description tel",
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Booking" });
  }
};

//@desc     Add single booking
//@route    POST /api/v1/campgrounds/:campgroundId/bookings/
//@access   Private
exports.addBooking = async (req, res, next) => {
  try {
    req.body.campground = req.params.campgroundId;

    const campground = await Campground.findById(
      req.params.campgroundId
    ).populate("bookings");

    if (!campground) {
      return res.status(404).json({
        success: false,
        message: `No campground with the id ${req.params.campgroundId}`,
      });
    }

    //add user Id to req.body
    req.body.user = req.user.id;
    //Check for existed booking
    const existedBookings = await Booking.find({ user: req.user.id });
    //If the user is not an admin, they can only create 3 bookings.
    if (existedBookings.length >= 3 && req.user.role != "admin") {
      return res.status(400).json({
        success: false,
        message: `The user with ID ${req.user.id} has already made 3 bookings`,
      });
    }

    if (campground.bookings.length >= 10) {
      return res.status(400).json({
        success: false,
        message: `The campground with ID ${campground._id} can't have more than 10 bookings`,
      });
    }

    if (!isValidDate(existedBookings, req.body.bookingDate)) {
      return res.status(400).json({
        success: false,
        message: `The required date ${req.body.bookingDate} is already booked or adjacent to any booked date`,
      });
    }
    const booking = await Booking.create(req.body);

    console.log(booking);

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    console.log(err.stack);
    return res
      .status(500)
      .json({ success: false, message: "Cannot create Booking" });
  }
};

//@desc     Update single booking
//@route    PUT /api/v1/hospitals/bookings/:id
//@access   Private
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with id ${req.params.id}`,
      });
    }

    //Make sure user is the booking owner
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this booking`,
      });
    }

    if (req.body.campground) {
      const campground = await Campground.findById(
        req.body.campground
      ).populate("bookings");
      if (campground.bookings.length >= 10) {
        return res.status(400).json({
          success: false,
          message: `The campground with ID ${campground._id} can't have more than 10 bookings`,
        });
      }
    }

    const existedBookings = await Booking.find({
      user: booking.user.toString(),
    });
    if (!isValidDate(existedBookings, req.body.bookingDate)) {
      return res.status(400).json({
        success: false,
        message: `The required date ${req.body.bookingDate} is already booked or adjacent to any booked date`,
      });
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Cannot update Booking" });
  }
};

//@desc     Delete single booking
//@route    DELETE /api/v1/campgrounds/bookings/:id
//@access   Private
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No bookings with id ${req.params.id}`,
      });
    }

    //Make sure user is the booking owner
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this booking`,
      });
    }

    await booking.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Cannot delete Booking" });
  }
};
