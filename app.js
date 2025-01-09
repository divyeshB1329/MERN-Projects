const express = require("express")
const app = express()
const mongoose = require('mongoose')
const Listing = require("./models/listing.js")
const path = require('path');
var methodOverride = require('method-override')

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Set the views directory (optional, default is './views')
app.set('views', path.join(__dirname, 'views'));

// Middleware to serve static files (e.g., CSS, JS, Images)
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({extended:true}))

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

main()
    .then(() => {
        console.log("connected to DB")
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

app.get("/", (req, res) => {
    res.send("hello")
})


// Index Route
app.get("/listings", async (req, res)=>{
     let allListing = await Listing.find({})
    res.render("./listings/index.ejs", {allListing})
})

// New Route
app.get("/listings/new",(req, res)=>{
    res.render('./listings/new.ejs')
})

// Create Route
app.post("/listings",async (req, res)=>{
const newListing = new Listing(req.body.listing)
await newListing.save()
res.redirect('/listings')
})

//Show Route
app.get("/listings/:id", async (req, res)=>{
    let {id} = req.params
    let listing = await Listing.findById(id)
    res.render('./listings/show.ejs', {listing})
})

// Edit Route
app.get("/listings/:id/edit",async (req, res)=>{
    let {id} = req.params
    let listing = await Listing.findById(id)
    res.render('./listings/edit.ejs', {listing})
})


//Update Route
app.put("/listings/:id",async (req, res)=>{
    let {id} = req.params
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect("/listings")
})

//Delete Route
app.delete("/listings/:id",async (req, res)=>{
    let {id} = req.params
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings")
})


// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My New villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Chalangute, Goa",
//         country: "India"
//     })
//     await sampleListing.save()
//     console.log("sample was saved")
//     res.send("successful testing")
// })

app.listen(8080, () => {
    console.log("server is listening to port 8080")
})