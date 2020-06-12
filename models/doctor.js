var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var schema = new Schema({
    name: 
    {
        type: String,
        
        },
    email:
     {type: String,
        
        },
    password:
     {type:String,
        
        },
    mobile:
     {type: String,
        
        },
    city: 
    {type: String,
        
        },
    blood: 
    {type: String, 
       
    },
    specialized: 
    {type: String, 
       
    },
});
schema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};
schema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('doctor', schema);