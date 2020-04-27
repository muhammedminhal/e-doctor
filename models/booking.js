var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BookingSchema = new mongoose.Schema({
    specified :{
        type: String,
        required:"Required"
    },
    doctor :{
        type: String,
        required:"Required"
    },
    date :{
        type: String,
        required:"Required"
    },
    time :{
        type: String,
        required:"Required"
    }
});

module.exports = mongoose.model("Booking",BookingSchema);