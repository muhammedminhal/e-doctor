var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var BookingModel = mongoose.model('Booking');
var PatientModel = mongoose.model('patient');
var passport = require('passport');
var Patient = require('../models/patient');
var Booking = require('../models/booking');
var doctor = mongoose.model('doctor')
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment')

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


//signin route

router.get('/signin',function(req, res, next){
  var messages = req.flash('error');
  res.render('patient/signin', {messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.psignin'), function(req, res, next) {
  if (req.flash('error') != null){
    Patient.findOne({'email' : req.body.email}, function(err, patient) {
      req.session.loginpatient=patient.email
      res.redirect('/patient/profile');
    })
  }else{
    res.redirect("/patient/signin")
  }
});

/* get profile route */


router.get('/profile',(req,res)=>{
  var email=req.body.email
  Patient.findOne({"email":req.session.loginpatient},(err,patient)=>{
    if(err){
      res.send("error:"+err)
    }
    doctor.find({"":email},(err,result)=>{
      if(err){
        res.send('error:'+err)
      }
        res.render('patient/profile',{doctor:result,patient: patient})
    })
  })
});


// router.get('/profile',(req,res)=>{

// })
// // !!!!!
// // router.get('/profile',(req, res,)=>{
//   id=req.session.loginpatient
//   Patient.findOne({"_id":id},(err,patient)=>{
//     if(!err){
//       res.render('patient/profile',{patient: patient});
//     console.log("data:"+patient)
//     }else{
//       send("error:"+err)
//     }
//   })
 
// });

router.post("/profile",(req,res)=>{
  
  var booking = new BookingModel({
    email:req.body.email,
    name:req.body.name,
    age:req.body.age,
    specified : req.body.specified,
    doctor  : req.body.doctor ,
    date : moment(req.body.date).format("DD/MMM/YYYY"),
    mobile:req.body.mobile,
  
  
});

  booking.save((err ,doc)=>{
    console.log("ddoc"+req.body.age)
    
    if(!err)
    {
        res.redirect('/patient/list');
    }
    else
    {
        res.send('Error occured in insertion'+err);
    }
})
});



// booking list route

router.get('/list',(req, res)=>{
  var mobile = req.session.loginpatient
  BookingModel.find({"email":mobile})
  .then((docs)=>{
  
    res.render('patient/list',{data :docs});
  })
  .catch((err)=>{
    console.log(err)
  });
  });

  

// patient list route 

// router.get('/prlist',(req, res)=>{
//   PatientModel.find((err, docs)=>{
//       if(!err){
//           res.render('patient/prlist',{data : docs})
//       }
//       else{
//           res.send('error')
//       }
//   });
//   });
  


  

  //my details route byone

  router.get("/myprofile",(req,res)=>{
   var mobile = req.session.loginpatient
    Patient.findOne({'email' :mobile},((err, result)=>{
      if(!err){
          res.render('patient/myprofile',{binjo: result})  
      }else{
          res.send('error')
      }
      console.log()
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