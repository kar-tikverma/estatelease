const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({ isAvailable: true });
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs", { listing: false });
};

module.exports.createListing = async (req, res) => {
    const response = await geocodingClient
        .forwardGeocode({
            query: `${req.body.listing.location}, ${req.body.listing.country}`,
            limit: 1,
        })
        .send();

    const { path, filename } = req.file;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url: path, filename };
    newListing.geometry = response.body.features[0].geometry;
    newListing.isAvailable = true;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.showListing = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if (!listing) {
        req.flash(
            "error",
            "The listing you are trying to access either does not exist or was deleted!"
        );
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash(
            "error",
            "The listing you are trying to access either does not exist or was deleted!"
        );
        return res.redirect("/listings");
    }

    listing.image.url = listing.image.url.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const { listing } = req.body;

    const response = await geocodingClient
        .forwardGeocode({
            query: `${req.body.listing.location}, ${req.body.listing.country}`,
            limit: 1,
        })
        .send();

    listing.geometry = response.body.features[0].geometry;

    if (typeof req.file !== "undefined") {
        const { path, filename } = req.file;
        listing.image = { url: path, filename };
    }

    await Listing.findByIdAndUpdate(id, listing);

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};
