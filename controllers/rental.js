const Listing = require("../models/listing.js");
const Rental = require("../models/rental.js");

module.exports.rentNow = async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing.isAvailable) {
        req.flash("error", "Already Booked!");
        return res.redirect("/");
    }

    res.render("rentals/rentForm.ejs", { listing });
};

module.exports.processDetails = async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing.isAvailable) {
        req.flash("error", "Already Booked!");
        return res.redirect("/");
    }

    const details = {
        date: req.body.date,
        time: req.body.time,
    };

    res.render("rentals/confirmDetails.ejs", { listing, details });
};

module.exports.confirmRental = async (req, res) => {
    try {
        const listingId = req.params.id;

        const updatedListing = await Listing.findOneAndUpdate(
            { _id: listingId, isAvailable: true },
            { isAvailable: false },
            { new: true }
        );

        if (!updatedListing) {
            req.flash("error", "Rental failed. Listing may already be booked.");
            return res.redirect("/listings");
        }

        const rentalDetails = {
            listing: listingId,
            tenant: req.user._id,
            amountPaid: updatedListing.price,
            rentalDate: new Date(),
            status: 1,
        };

        await new Rental(rentalDetails).save();

        req.flash("success", "Rental Confirmed!");
        res.redirect("/listings");
    } catch (err) {
        console.error("Rental error:", err);
        req.flash("error", "Something went wrong. Try again.");
        res.redirect("/listings");
    }
};
