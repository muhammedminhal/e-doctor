var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var consultSchema = new Schema({
    email:{
        type:String,
      

    },
    medicine:{
        type:String,
      

    },
    comments:{
        type:String,
      
    },
    removestatus:{
        type:Boolean,
        default:false
    },
})

module.exports = mongoose.model('consult',consultSchema)