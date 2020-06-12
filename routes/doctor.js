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

router.get('/signup', function(req, res) {
   
    res.render('doctor/signup');
  });


  // router.post('/signup',(req,res)=>{
  //   var doctor = new DoctorModel({
  //     name : req.body.name,
  //     email : req.body.email,
  //     password : req.body.password,
  //     mobile : req.body.mobile,
  //     city : req.body.city,
  //     specialized : req.body.specialized,
  //     blood : req.body.blood,
     
  //    });
    
  //   doctor.save((err,doc)=>{
  //     console.log('mammty'+doc);
  //     if(!err){
  //       res.redirect('/doctor/signin')
  //     }else{
  //       console.log('error'+err);
  //     }
  //   });
  // });

  router.post('/signup',(req,res)=>{
    doctor = new DoctorModel({
          name : req.body.name,
          email : req.body.email,
          password : req.body.password,
          mobile : req.body.mobile,
          city : req.body.city,
          specialized : req.body.specialized,
          blood : req.body.blood,
       
    })
    doctor.save((err,docs)=>{
      
      if(!err){
        res.redirect('/doctor/signin')
      }else{
        console.log('error'+err);
      }
    })
  })

  
 
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
  
      })
    }
  });


//appiintment list route



  router.get('/appoitments',(req,res)=>{ 

const date = moment().format("DD/MMM/YYYY")
var doctor = req.sessionloginUsers

Booking.find({"date":{$gte: date },"cancelStatus":false},(err,tommorow)=>{
  if(err){
    res.send('error:'+err)
  }
  Booking.find({"date":{$lt: date },"cancelStatus":false},(err,yesterday)=>{
    if(err){
      res.send('error:'+err)
    }
    Booking.find({"date":{$eq : date },"cancelStatus":false,},(err,today)=>{
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
  }).sort({date:-1})
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
  var consultid = req.session.conbook
    Booking.findOne({"email":email},(err,result)=>{
      req.session.conbook=result.email
        if(err){
          res.send('error'+err)
        }
        consult.find({"email":consultid,"removestatus":false},(err,doc)=>{
          if(err){
            res.send("error"+err)
          } 
          res.render('doctor/consult',{hell:result,data:doc})
        
      }) 
})
})
// consult post route

router.post('/consult',(req,res)=>{
  var doctorConsult = new consult({
    email:req.body.email,
    medicine:req.body.medicine,
    // comments:req.body.comments,
    // consultid : Math.ceil(Math.random()*250)+''
  })
  doctorConsult.save((err,result)=>{
    console.log(result)
    if(!err){
      res.redirect("/doctor/consult?id="+result.email)
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

// medicine remove

router.get("/remove/:id",(req,res)=>{
  
  consult.findById(req.params.id,(err,doc)=>{
    if(!err){
      doc.removestatus= true;
      doc.save()
      res.redirect('/doctor/consult?id='+doc.email)

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
// finished route
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

