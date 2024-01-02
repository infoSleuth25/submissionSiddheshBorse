const mongoose = require("mongoose");

// Define the note schema
const noteSchema = new mongoose.Schema({
    userMobileNo : {
        type : String,
        required : true
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: String
    },
    updatedAt: {
        type: String
    }
});


// Define the note model
const Notes = mongoose.model("Notes", noteSchema);

module.exports = Notes;