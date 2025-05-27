if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { isLoggedIn } = require("./middlewares/redirectUrl.js");

const listingRouter = require("./routes/listing.js");
const rentalRouter = require("./routes/rental.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

mongoose.connect(process.env.ATLASDB_URL);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use("/users", userRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/rentals", isLoggedIn, rentalRouter);
app.use("/listings/:id/reviews", reviewRouter);

app.all("*", (req, res) => {
    throw new ExpressError(404, "Page Not Found!");
});

// Error Handling Middlewares
app.use((err, req, res, next) => {
    let { status = 500, message } = err;
    res.status(status).send(message);
});

// Server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`listening on port ${port}...`);
});

process.on("SIGINT", async () => {
    await mongoose.connection.close();
    server.close();
    process.exit(0);
});
