var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DoctorSchema = new mongoose.Schema({
    fullname : {
        type : String,
        required:"Required"
    },
    email : {
        type : String,
        required:"Required"
    },
    mobile : {
        type: String,
    },
    city: {
        type: String,
    },
    specified : {
        type: String,
    }
});



module.exports = mongoose.model("newdoctor",DoctorSchema); 