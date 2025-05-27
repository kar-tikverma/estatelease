const mongoose = require("mongoose");
const { Schema } = mongoose;

const rentalSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true,
    },
    tenant: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amountPaid: {
        type: Number,
        required: true,
    },
    rentalDate: {
        type: Date,
        required: true,
    },
    status: {
        type: Number,
    },
});

const Rental = mongoose.model("Rental", rentalSchema);

module.exports = Rental;
