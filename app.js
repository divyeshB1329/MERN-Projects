const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js")

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

// ----------------------------- Database Connection ---------------------------- //

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    console.log("Connected to DB");
}

main().catch(err => console.log("Database Connection Error:", err));

// ----------------------------- Routes ----------------------------------------- //

// Root Route
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}

// Index Route: List all listings
app.get(
    "/listings",
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        res.render("./listings/index.ejs", { allListings });
    })
);

// New Route: Render form for creating a new listing
app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs");
});

// Create Route: Save a new listing to the database
app.post(
    "/listings",
    validateListing,
    wrapAsync(async (req, res, next) => {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    })
);

// Show Route: Display details of a single listing
app.get(
    "/listings/:id",
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("./listings/show.ejs", { listing });
    })
);

// Edit Route: Render form to edit an existing listing
app.get(
    "/listings/:id/edit",
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("./listings/edit.ejs", { listing });
    })
);

// Update Route: Update an existing listing in the database
app.put(
    "/listings/:id",
    validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        res.redirect("/listings");
    })
);

// Delete Route: Delete an existing listing from the database
app.delete(
    "/listings/:id",
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        await Listing.findByIdAndDelete(id);
        res.redirect("/listings");
    })
);

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
