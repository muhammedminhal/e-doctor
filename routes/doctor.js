var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var DoctorModel = mongoose.model('doctor')
var passport = require('passport');
var Doctor = require('../models/doctor')


//signup route
router.get('/signup', function(req, res, next) {
    var messages = req.flash('error');
    res.render('doctor/signup', { messages: messages, hasErrors: messages.length > 0});
  });
  
  router.post('/signup',(req,res)=>{
    var Doctor = new DoctorModel();
    Doctor.name = req.body.name;
    Doctor.specialized = req.body.specialized;
    Doctor.blood = req.body.blood;
    Doctor.mobile = req.body.mobile;
    Doctor.city = req.body.city;
    Doctor.email = req.body.email;
    Doctor.password = req.body.password;
    Doctor.save((err,doc)=>{
      if(!err){
        res.redirect('/doctor/signin')
      }
      else{
        console.log('error'+err);
      }
    });
  });

  
 
// signin route


  router.get('/signin', function(req, res, next){
    var messages = req.flash('error');
    res.render('doctor/signin', { messages: messages, hasErrors: messages.length > 0});
  });
  
  router.post('/signin', passport.authenticate('local.dsignin',{
    failureRedirect: '/doctor/signin',
    failureFlash: true
  }), function(req, res, next) {

    if (req.flash('error') != null){
      Doctor.findOne({'email' : req.body.email}, function(err, doctor) {
        res.render('doctor/profile',{doctor : doctor});
      })
    }
  });
//profile route

  router.get('/profile',isAuthenticated,(req, res,)=>{
    res.render('doctor/profile');
  });
  


  // authentication funtion to authenticate

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/doctor/signin');
}

  //logout route

  router.get('/logout',(req, res,)=>{
    req.logout();
    req.session.destroy();
    res.redirect('/');
  });
  

module.exports = router;

