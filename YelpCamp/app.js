const express = require("express")
const app = express()
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended: true}))

app.set("view engine", "ejs")
app.get("/", (req,res) => (
    res.render("landing")
))

let campgrounds = [
    {name: "campsite 1", "image": "https://pixabay.com/get/57e1dd4a4350a514f6da8c7dda793f7f1636dfe2564c704c72277adc9744c25e_340.jpg"},
    {name: "campsite 2", "image": "https://pixabay.com/get/57e8d1454b56ae14f6da8c7dda793f7f1636dfe2564c704c72277adc9744c25e_340.jpg"},
    {name: "campsite 3", "image": "https://pixabay.com/get/52e5d7414355ac14f6da8c7dda793f7f1636dfe2564c704c72277adc9744c25e_340.jpg"},

    {name: "campsite 1", "image": "https://pixabay.com/get/57e1dd4a4350a514f6da8c7dda793f7f1636dfe2564c704c72277adc9744c25e_340.jpg"},
    {name: "campsite 2", "image": "https://pixabay.com/get/57e8d1454b56ae14f6da8c7dda793f7f1636dfe2564c704c72277adc9744c25e_340.jpg"},
    {name: "campsite 3", "image": "https://pixabay.com/get/52e5d7414355ac14f6da8c7dda793f7f1636dfe2564c704c72277adc9744c25e_340.jpg"},

    {name: "campsite 1", "image": "https://pixabay.com/get/57e1dd4a4350a514f6da8c7dda793f7f1636dfe2564c704c72277adc9744c25e_340.jpg"},
    {name: "campsite 2", "image": "https://pixabay.com/get/57e8d1454b56ae14f6da8c7dda793f7f1636dfe2564c704c72277adc9744c25e_340.jpg"},
    {name: "campsite 3", "image": "https://pixabay.com/get/52e5d7414355ac14f6da8c7dda793f7f1636dfe2564c704c72277adc9744c25e_340.jpg"},

    {name: "campsite 1", "image": "https://pixabay.com/get/57e1dd4a4350a514f6da8c7dda793f7f1636dfe2564c704c72277adc9744c25e_340.jpg"},
    {name: "campsite 2", "image": "https://pixabay.com/get/57e8d1454b56ae14f6da8c7dda793f7f1636dfe2564c704c72277adc9744c25e_340.jpg"},
    {name: "campsite 3", "image": "https://pixabay.com/get/52e5d7414355ac14f6da8c7dda793f7f1636dfe2564c704c72277adc9744c25e_340.jpg"}
]

app.get("/campgrounds", (req,res) => {
    res.render("campgrounds", {campgrounds: campgrounds})

})

app.post("/campgrounds", (req,res) => {
    // res.send("You hit the post route")
    // add data from form and add to campgrounds array
    let name = req.body.name
    let image = req.body.image
    let newCampground = {name:name, image:image}
    campgrounds.push(newCampground)
    // redirect back to campgrounds page
    res.redirect("/campgrounds")
})

app.get("/campgrounds/new", (req,res) => {
    res.render("new.ejs")
})

app.listen(3000, () => (
    console.log("======================================== SERVER IS LISTENING ========================================")
))