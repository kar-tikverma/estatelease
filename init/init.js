const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main();

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

initDB()
    .then(() => {
        mongoose.connection.close();
    })
    .catch(() => {
        mongoose.connection.close();
    });

async function initDB() {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "6779544555048dfddc09cb27" }));
    await Listing.insertMany(initData.data);
}