if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js")
const reviewRoter = require("./routes/review.js")
const session = require("express-session");
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User =require("./models/user.js")
const userRouter = require("./routes/user.js")


const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}

// ----------------------------- Configuration ---------------------------------- //

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Set the views directory (optional, default is './views')
app.set("views", path.join(__dirname, "views"));

// Middleware to serve static files (e.g., CSS, JS, Images)
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));

// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

// Use EJS-Mate for layouts
app.engine("ejs", ejsMate);

// app.use((req, res, next)=>{
//     res.locals.message = req.flash()
// })

// ----------------------------- Database Connection ---------------------------- //

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    console.log("Connected to DB");
}

main().catch(err => console.log("Database Connection Error:", err));

// Root Route
// app.get("/", (req, res) => {
//     res.send("Hello, World!");
// });

app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user;
    next()
})

// app.get("/demouser", async (req, res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username: "delta-student"
//     })

//     let registeredUser = await User.register(fakeUser, "helloworld")
//     res.send(registeredUser)
// })

app.use("/listings", listingRouter)
app.use("/listings/:id/reviews", reviewRoter)
app.use("/", userRouter)

// ----------------------------- Error Handling --------------------------------- //

// Handle undefined routes
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Global Error-Handling Middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message })
    // res.status(statusCode).send(message);
});

// ----------------------------- Server ----------------------------------------- //

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
