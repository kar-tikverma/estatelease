const mongoose = require("mongoose");
const { Schema } = mongoose;

const rentalSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
    },
    tenant: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    rentalDate: {
        type: Date,
    },
    status: {
        type: Number,
    },
});

const Rental = mongoose.model("Rental", rentalSchema);

module.exports = Rental;
