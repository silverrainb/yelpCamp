const express       = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    Campground      = require("./models/campground"),
    SeedDB          = require("./seeds");
    Comment         = require("./models/comment"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    User            = require("./models/user")


//connect mongoose
mongoose.connect("mongodb://localhost:27017/yelpcamp", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}), express.static(__dirname + "/public"));
app.set("view engine", "ejs");
SeedDB();


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"Once again.... SECRET!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//currentUser: req.user
app.use((req,res,next) => {
    res.locals.currentUser = req.user
    next()
})

app.get("/", (req, res) => {
    res.render('landing')
});

// INDEX - SHOW ALL CAMPGROUNDS
app.get("/campgrounds", (req, res) =>
    // get all campgrounds from DB
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err)
        } else {
            // Render that file, This replaces the campgrounds global variable, which is used in index.ejs.
            res.render('campgrounds/index', {campgrounds: allCampgrounds, currentUser: req.user})
        }
    })
    );

// CREATE - ADD NEW CAMP TO DB
app.post("/campgrounds", (req, res) => {
    // res.send("You hit the post route")
    // add data from form and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let newCampground = {name: name, image: image, description: description};
    //Create a new campground and save to DB
    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) {
            console.log(err)
        } else {
            // redirect back to campgrounds page
            res.redirect("/campgrounds")
        }
    })
});

// NEW - SHOW FORM TO CREATE NEW CAMPGROUND
app.get("/campgrounds/new", (req, res) => {
    res.render('campgrounds/new');
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

// ========================================================================
// COMMENTS ROUTES
// ========================================================================
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render('comments/new', {campground: campground});
        }
    })
});

app.post("/campgrounds/:id/comments", (req,res) => {
    // lookup campground using ID
    Campground.findById(req.params.id, (err,campground) => {
        if(err) {
            console.log(err)
            res.redirect("/campgrounds")
        } else {
            // create new comment
            Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    console.log(err)
                } else {
                    // associate comment to the campground
                    campground.comments.push(comment)
                    campground.save()
                    // redirect campground show page
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })
})

// =================================
// AUTH ROUTES
// =================================
app.get("/register", (req,res) => {
    // res.send("HELLO THIS IS REGISTER PAGE")
    res.render('register')
})

//handle sign up logic
app.post("/register", (req,res) => {
    let newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err)
            return res.render('register')
        }
        passport.authenticate("local")(req, res, () => (res.redirect("/campgrounds")))
    })
})

// show login form
app.get("/login", (req,res) => {res.render('login')})

// handling login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req, res)=>{
});

// logic route
app.get("/logout", (req,res) => {
    req.logout()
    res.redirect("/campgrounds")
})

//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

// =================================
app.listen(1234, () => (
    console.log("======================================== SERVER IS LISTENING ========================================")
));