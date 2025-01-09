const Listing = require("../models/listing.js");

module.exports = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You're not authorized to edit this listing!");
        return res.redirect(`/listings`);
    }

    return next();
};
