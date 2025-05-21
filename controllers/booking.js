const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");

module.exports.rentNow = async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    if (listing.isRented) {
        //
    }

    res.render("bookings/rentForm.ejs", { listing });
};

module.exports.processDetails = async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    if (listing.isRented) {
        //
    }

    const details = {
        date: req.body.date,
        time: req.body.time,
    };

    res.render("bookings/confirmDetails.ejs", { listing, details });
};

module.exports.confirmBooking = async (req, res) => {
    const bookingDetails = {
        listing: req.params.id,
        tenant: req.user._id,
        bookingDate: new Date(),
        status: 1,
    };

    await new Booking(bookingDetails).save();

    req.flash("success", "Booking Confirmed!");
    res.redirect("/listings");
};
