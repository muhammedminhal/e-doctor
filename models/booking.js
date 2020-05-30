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
        required:"Required"
    },
    doctor :{
        type: String,
        required:"Required"
    },
    date :{
        type: String,
        default:Date.now,
        required:"Required",
       
    },
    time :{
        type: String,
        required:"Required",
      
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