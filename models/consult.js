var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var consultSchema = new Schema({
    email:{
        $type:String,
      

    },
    medicines:[{
        $type: String,

    }],
    comments:{
        $type:String,

    },
    consulted:{
        $type:Boolean,
        default:false
    },
    date :{
        $type: String,
        default:Date.now,
    },
}, { typeKey: '$type' });

module.exports = mongoose.model('consult',consultSchema)