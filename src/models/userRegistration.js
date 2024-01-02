const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userMobileNo : {
        type : String,
        required : true
    },
    userPassword : {
        type : String,
        required : true
    },
    userConfirmPassword : {
        type : String,
        required : true
    }
});

const UserRegister = new mongoose.model("UserRegistration", userSchema);
module.exports = UserRegister;