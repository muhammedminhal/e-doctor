var passport = require('passport');
var Admin = require('../models/admin');
var Doctor = require('../models/doctor');
var Patient = require('../models/patient');
var bcrypt = require('bcrypt-nodejs');


var LocalStrategy = require('passport-local').Strategy;

const docuse = Admin ||  Patient || Doctor

passport.serializeUser(function(user, done) {
   done(null, user.id);
});

passport.deserializeUser(function(id, done) {
   Admin.findById(id, function(err, user){
       if(err)done(err);
       if(user){
           done(null,user);
       }else{      
       }
    })
   Patient.findById(id, function(err, user) {
       if(err) done(err);
       if(user){
           done(null, user);
       }else{
           Doctor.findById(id, function(err, user){
               if(err)done(err);
               if(user)
               done(null,user);
            
           })
       }
   });
});



passport.use('local.asignin', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
    }, function(req, email, password, done) {
        req.checkBody('email','Invalid email').notEmpty().isEmail();
        req.checkBody('password','Invalid password').notEmpty();
        var error = req.validationErrors();
        if (error) {
            var message = [];
            error.forEach(function(error) {
                message.push(error.msg);
            });
            return done(null, false, req.flash('error', messages));
        }
        Admin.findOne({'email' : email}, function(err, admin) {
            if (err){
                return done(err);
            }
            if (!admin){
                return done(null, false, {message: 'NO user fOUND'});
            }
  
     if (password == admin.password){
         return done(null, admin); 
     } else{
         return done(null, false, { message: 'Email Id or Password incorrect' });
     }
           
        });
  }));

  





passport.use('local.dsignin', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
    }, function(req, email, password, done) {
        req.checkBody('email','Invalid email').notEmpty().isEmail();
        req.checkBody('password','Invalid password').notEmpty();
        var error = req.validationErrors();
        if (error) {
            var message = [];
            error.forEach(function(error) {
                message.push(error.msg);
            });
            return done(null, false, req.flash('error', messages));
        }
        Doctor.findOne({'email' : email}, function(err, doctor) {
            if (err){
                return done(err);
            }
            if (!doctor){
                return done(null, false, {message: 'NO user fOUND'});
            }
  
     if (password == doctor.password){
         return done(null, doctor); 
     } else{
         return done(null, false, { message: 'Email Id or Password incorrect' });
     }
           
        });
  }));



  passport.use('local.psignin', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
    }, function(req, email, password, done) {
        req.checkBody('email','Invalid email').notEmpty().isEmail();
        req.checkBody('password','Invalid password').notEmpty();
        var error = req.validationErrors();
        if (error) {
            var message = [];
            error.forEach(function(error) {
                message.push(error.msg);
            });
            return done(null, false, req.flash('error', messages));
        }
        Patient.findOne({'email' : email}, function(err, patient) {
            if (err){
                return done(err);
            }
            if (!patient){
                return done(null, false, {message: 'NO user fOUND'});
            }

     if (password == patient.password){
         return done(null, patient); 
     } else{
         return done(null, false, { message: 'Email Id or Password incorrect' });
     }
           
        });
  }));

  


