var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BookingSchema = new mongoose.Schema({
   email:{
        type:String
    },
   
    name:{
        type:String
    },
    age:{
        type:String,
    
    },
    specified :{
        type: String,
        required:true
    },
    doctor :{
        type: String,
        required:true
       
    },
    date :{
        type: String,
        default:Date.now,
        required:true
       
    },
   
    mobile :{
        type: String,
        required:"Required",
        
    },
    cancelStatus:{
       type:Boolean,
       default:false
    },
    bookingStatus:{
        type:Boolean,
        default:false
    },
});

module.exports = mongoose.model("Booking",BookingSchema);