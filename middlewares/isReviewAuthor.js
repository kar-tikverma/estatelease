const Review = require("../models/review.js");

module.exports = async (req, res, next) => {
    const review = await Review.findById(req.params.reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You're not authorized to edit/delete this review!");
        return res.redirect(`/listings`);
    }

    return next();
};
