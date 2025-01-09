const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    }
    return next();
};
