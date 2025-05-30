if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const Rental = require("../models/rental.js");

mongoose.connect(process.env.ATLASDB_URL);

initDB()
    .then(() => mongoose.connection.close())
    .catch((err) => {
        console.error("Error initializing DB:", err);
        mongoose.connection.close();
    });

async function initDB() {
    await Listing.updateMany({}, { $set: { isAvailable: true } });
    await Rental.deleteMany({});
    console.log("All listings updated to isAvailable: true");
}
