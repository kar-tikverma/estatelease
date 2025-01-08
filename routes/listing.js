const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const validateListing = require("../middlewares/validateListing.js");
const { isLoggedIn } = require("../middlewares/redirectUrl.js");
const isOwner = require("../middlewares/isOwner.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
    .route("/")
    .get(listingController.index)
    // New Listing
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing)
    );

// New Listing form
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
    .route("/:id")
    // Show Route
    .get(wrapAsync(listingController.showListing))
    // Edit Route
    .patch(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Form
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);

module.exports = router;
