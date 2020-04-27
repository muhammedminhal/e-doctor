var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var schema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type:String, required: true},
    mobile: {type: String, required: true},
    city: {type: String, required: true},
    blood: {type: String, required: true},
    specialized: {type: String, required: true},
});
schema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};
schema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('doctor', schema);