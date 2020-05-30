var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var DoctorModel = mongoose.model('doctor')
var passport = require('passport');
var Doctor = require('../models/doctor')
var Booking = mongoose.model('Booking')
var Patient = mongoose.model('patient')
var consult = mongoose.model('consult')
var moment = require('moment')


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
      }else{
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
    failureFlash: true,

  }), function(req, res, next) {

    if (req.flash('error') != null){
      DoctorModel.findOne({'email' : req.body.email}, function(err, doctor) {
        console.log(doctor._id)
        req.session.loginUser=doctor.email
        req.session.loginUsers=doctor.name
        res.redirect('/doctor/appoitments')
      //  res.render('doctor/profile',{data: doctor});
      })
    }
  });


//appiintment list route



  router.get('/appoitments',(req,res)=>{ 

const date = moment().format("DD/MMM/YYYY")
var doctor = req.sessionloginUsers

Booking.find({"date":{$gt: date },"cancelStatus":false},(err,tommorow)=>{
  if(err){
    res.send('error:'+err)
  }
  Booking.find({"date":{$lt: date },"cancelStatus":false},(err,yesterday)=>{
    if(err){
      res.send('error:'+err)
    }
    
    Booking.find({"date":{$eq : date },"cancelStatus":false,"bookingStatus": false},(err,today)=>{
      if(err){
        res.send('error:'+err)
      }
      Booking.find({"cancelStatus":true},(err,canclled)=>{
        if(err){
          res.send('error:'+err)
        }
  res.render('doctor/appoitments',{data:yesterday,dum:tommorow,today:today,canclled:canclled}) 
       })
    })
})
  })
})

// view single patient route

router.get('/views',(req,res)=>{

var mail  = req.query.id
Booking.find({"email": mail},(err,single)=>{
    console.log("singl"+single)
    if(!err){
      res.render('doctor/views',{single:single})
    }else{
       res.send(err)
      }
   })
})

// consult route

router.get('/consult',(req,res)=>{

  var email = req.query.id
 
    Booking.findOne({"email":email},(err,result)=>{
    
      req.session.conbook=result.email
        if(!err){
          res.render('doctor/consult',{hell:result})
        }else{
    res.send('error'+err)
        }
      }) 
})

// consult post route

router.post('/consult',(req,res)=>{
  var doctorConsult = new consult({
    email:req.body.email,
    medicine:req.body.medicine,
    comments:req.body.comments,
    consultid : Math.ceil(Math.random()*250)+''
  })
  doctorConsult.save((err,result)=>{
    if(!err){
      res.redirect("/doctor/prescrption")
    }else{
      res.send('error'+err)
    }
  })
})

// prescription find route

router.get("/prescrption",(req,res)=>{
  var consultid = req.session.conbook
consult.find({"email":consultid},(err,result)=>{
  console.log("chad"+consultid)
  if(!err){
    res.render('doctor/prescrption',{cons:result})
  }else{
    res.send('error'+err)
  }
})
})


// // dellete
router.get("/delete/:id",(req,res)=>{
  
    Booking.findById(req.params.id,(err,doc)=>{
      if(!err){
        doc.cancelStatus= true;
        doc.save()
        res.redirect('/doctor/appoitments')

      }else{
        res.send('error'+err)
      }     
  })
})


// done route
router.get("/done/:id",(req,res)=>{
  Booking.findById(req.params.id,(err,doc)=>{
    if(!err){
      doc.bookingStatus= true;
      doc.save()
      res.redirect('/doctor/appoitments')
    }else{
      res.send(err)
    }
  })
})

router.get("/finished",(req,res)=>{
  Booking.find({"bookingStatus":true},(err,data)=>{
    if(!err){
      res.render("doctor/finished",{finished:data})
    }else{
      res.send("error"+err)
    }
  })
})

  // patient list route
  router.get("/patient",(req,res)=>{
 
Patient.find((err,patient)=>{
  if(!err){
    res.render("doctor/patient",{data:patient})
  }
})
})



//patiant my profile


  router.get('/profile',(req,res)=>{
    var id = req.session.loginUser
    console.log("session id:"+id)
    Doctor.findOne({'email':id},((err,result)=>{
if(!err){
  res.render('doctor/profile',{doctor:result})
  console.log("pp"+result)
}else{
  res.send("err:"+err)
}
    }));
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

