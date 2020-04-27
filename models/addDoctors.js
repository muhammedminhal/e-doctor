var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DoctorSchema = new mongoose.Schema({
    fullname : {
        type : String,
        required:"Required"
    },
    courseId : {
        type : String,
    
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