const express = require("express");
const bookingController = require("../controllers/booking");
const router = express.Router({ mergeParams: true });

router
    .route("/")
    .get(bookingController.rentNow)
    .post(bookingController.processDetails);

router.post("/confirm", bookingController.confirmBooking);

module.exports = router;
