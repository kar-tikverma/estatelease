const express = require("express");
const rentalController = require("../controllers/rental");
const router = express.Router({ mergeParams: true });

router
    .route("/")
    .get(rentalController.rentNow)
    .post(rentalController.processDetails);

router.post("/confirm", rentalController.confirmRental);

module.exports = router;
