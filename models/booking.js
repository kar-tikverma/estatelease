const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookingSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
    },
    tenant: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    bookingDate: {
        type: Date,
    },
    status: {
        type: Number,
    },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
