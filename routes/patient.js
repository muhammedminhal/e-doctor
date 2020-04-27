var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var BookingModel = mongoose.model('Booking');
var PatientModel = mongoose.model('patient');
var passport = require('passport');
var Patient = require('../models/patient');
var bcrypt = require('bcrypt-nodejs');

//sisnup route

router.get('/signup', function(req, res, next) {
  var messages = req.flash('error');
    res.render('patient/signup',{ messages: messages, hasErrors: messages.length > 0});
  });
  
  router.post('/signup', function(req, res, next) {
    var Patient = new PatientModel();
    Patient.name = req.body.name;
    Patient.email = req.body.email;
    Patient.password = req.body.password;
    Patient.mobile = req.body.mobile;
    Patient.city = req.body.city;
    Patient.blood = req.body.blood;
    Patient.save((err ,doc)=>{
      if(!err)
      {
          res.redirect('/patient/signin')
      }
      else
      {
         console.log('errr:'+err);
      }
  });
});

// patient list route 

router.get('/prlist',(req, res)=>{
  PatientModel.find((err, docs)=>{
      if(!err){
          res.render('patient/prlist',{data : docs})
      }
      else{
          res.send('error')
      }
  });
  });
  
/* get profile route */

  router.get('/profile',isAuthenticated ,(req, res,)=>{
    res.render('patient/profile');
  });

  router.post("/profile",(req,res)=>{

    var booking = new BookingModel();
    booking.specified = req.body.specified;
    booking.doctor  = req.body.doctor ;
    booking.date = req.body.date;
    booking.time = req.body.time;
    booking.save((err ,doc)=>{
      if(!err)
      {
          res.redirect('/patient/list')
      }
      else
      {
          res.send('Error occured');
      }
  })
});

// booking list route

router.get('/list',(req, res)=>{
  BookingModel.find((err, docs)=>{
      if(!err){
          res.render('patient/list',{data : docs})
      }
      else{
          res.send('error')
      }
  });
  });
  

  //signin route

  router.get('/signin', function(req, res, next){
    var messages = req.flash('error');
    res.render('patient/signin', {messages: messages, hasErrors: messages.length > 0});
  });
  
  router.post('/signin', passport.authenticate('local.psignin',{
    failureRedirect: '/patient/signin',
    failureFlash: true
  }), function(req, res, next) {

    
    if (req.flash('error') != null){
      Patient.findOne({'email' : req.body.email}, function(err, patient) {
        res.render('patient/profile',{patient : patient});
      })
    }
  });

  //my details route byone

  router.get("/myprofile",(req,res)=>{
   var email = req.query.id
    Patient.findOne({'email' :email},((err, patient)=>{
      if(!err){
          res.render('patient/myprofile',{patient : patient})  
      }
      else{
          res.send('error')
      }
  }));
  });
  

// authentication funtion to authenticate

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/patient/signin');
}

//logout route
router.get('/logout',(req, res,)=>{
  req.logout();
  req.session.destroy();
  res.redirect('/');
});



  module.exports = router;