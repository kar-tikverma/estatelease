const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        return next(new ExpressError(400, error));
    }
    return next();
};
