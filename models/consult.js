var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var consultSchema = new Schema({
    email:{
        type:String,
        required:true

    },
    medicine:{
        type:String,
        required:true

    },
    comments:{
        type:String,
      
    },
    consultid:{
        type:String
    },
    cancelStatus:{
        type:Boolean,  
     }
})

module.exports = mongoose.model('consult',consultSchema)