const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
    saveRedirectUrl,
    isLoggedIn,
} = require("../middlewares/redirectUrl.js");

const userController = require("../controllers/user.js");

router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(userController.signup);

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        userController.login
    );

router.get("/logout", userController.logout);

router
    .route("/profile")
    .get(isLoggedIn, userController.showProfile)
    .post(isLoggedIn, userController.updateProfile);

router.get("/profile/edit", userController.editProfile);

router.get("/rental-history", userController.showRentalHistory);

module.exports = router;
