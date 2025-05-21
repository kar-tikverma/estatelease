if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main();

mongoose.connect(process.env.ATLASDB_URL);

initDB()
    .then(async () => {
        await mongoose.connection.close();
    })
    .catch(async () => {
        await mongoose.connection.close();
    });

async function initDB() {
    await Listing.deleteMany({});
    initData = initData.map((obj) => ({
        ...obj,
        owner: "6779544555048dfddc09cb27",
        isRented: false,
    }));
    await Listing.insertMany(initData);
}
