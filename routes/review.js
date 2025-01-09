const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const validateReview = require("../middlewares/validateReview.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middlewares/redirectUrl.js");
const isReviewAuthor = require("../middlewares/isReviewAuthor.js");

const reviewController = require("../controllers/review.js");

async function verifyListing(req, res, next) {
    const listing = await Listing.findById(req.params.id).populate("reviews");
    if (!listing) {
        req.flash(
            "error",
            "The listing you are trying to access either does not exist or was deleted!"
        );
        return res.redirect("/listings");
    }

    req.listing = listing;
    return next();
}

// post
router.post(
    "/",
    verifyListing,
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);

// delete
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    verifyListing,
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;
