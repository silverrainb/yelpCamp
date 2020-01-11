let mongoose = require('mongoose');

// SCHEMA SETUP
let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    // reference to the comments
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

// compile the schema into a model
module.exports = mongoose.model("Campground", campgroundSchema);
