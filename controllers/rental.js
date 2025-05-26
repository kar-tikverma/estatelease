const Listing = require("../models/listing.js");
const Rental = require("../models/rental.js");

module.exports.rentNow = async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    if (listing.isRented) {
        //
    }

    res.render("rentals/rentForm.ejs", { listing });
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

    res.render("rentals/confirmDetails.ejs", { listing, details });
};

module.exports.confirmRental = async (req, res) => {
    const rentalDetails = {
        listing: req.params.id,
        tenant: req.user._id,
        rentalDate: new Date(),
        status: 1,
    };

    await new Rental(rentalDetails).save();

    req.flash("success", "Rental Confirmed!");
    res.redirect("/listings");
};
