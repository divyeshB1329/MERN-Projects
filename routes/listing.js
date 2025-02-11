const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const listingController = require("../controllers/listings.js");

router
  .route("/")
  // Index Route: List all listings
  .get(wrapAsync(listingController.index))
  // Create Route: Save a new listing to the database
    .post(
      isLoggedIn,
      upload.single("listing[image]"),
      validateListing,
      wrapAsync(listingController.createListing)
    );

// New Route: Render form for creating a new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  // Show Route: Display details of a single listing
  .get(wrapAsync(listingController.showListing))
  // Update Route: Update an existing listing in the database
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  // Delete Route: Delete an existing listing from the database
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Route: Render form to edit an existing listing
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
