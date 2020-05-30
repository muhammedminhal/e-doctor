var express = require('express');
var mongoose = require('mongoose');
var router = express.Router(); 
var AdminModel = mongoose.model('newdoctor');
var passport = require('passport');

var AdminogModel = mongoose.model('admin');

//signup route

router.get('/signup', function(req, res, next) {
    var messages = req.flash('error');
    res.render('admin/signup', { messages: messages, hasErrors: messages.length > 0});
  });
  
  router.post('/signup', (req,res)=>{
    var Admin = new AdminogModel();
    Admin.email = req.body.email;
    Admin.password = req.body.password;
    Admin.save((err,doc)=>{
      if(!err){
        res.redirect('/admin/signin')
      }
      else{
        console.log('error'+err);
      }
    });
  });

  //signin route

  router.get('/signin', function(req, res, next){
    var messages = req.flash('error');
    res.render('admin/signin',{messages: messages, hasErrors: messages.length > 0});
  });
  
  router.post('/signin', passport.authenticate('local.asignin',{
    failureRedirect: '/admin/signin',
    failureFlash: true
  }),  function(req, res, next) {

    if (req.flash('error') != null){
      AdminogModel.findOne({'email' : req.body.email}, function(err, admin) {
        res.render('admin/profile',{admin : admin});
      })
    }
  });




  // profile route

  router.get('/profile',isAuthenticated, (req, res)=>{
    var messages = req.flash('error');
    res.render('admin/profile',{ messages: messages, hasErrors: messages.length > 0})
});

router.post('/profile', (req, res)=>{
    var admin = new AdminModel();
    admin.name = req.body.fullname;
    admin.email =req.body.email;
    admin.mobile =req.body.mobile;
    admin.city =req.body.city;
    admin.blood =req.body.blood;
    admin.specialized =req.body.specified;
    admin.save((err ,doc)=>{
        if(!err)
        {
            res.send('success')
        }
        else
        {
            res.send('Error occured');
        }
    })
});


// doctor list route

router.get('/list',isAuthenticated,(req, res)=>{
AdminModel.find((err, docs)=>{
    if(!err){
        res.render('admin/list',{data : docs})
    }
    else{
        res.send('error')
    }
});
});




    // authentication funtion to authenticate

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/admin/signin');
}

  // logout route
  router.get('/logout',(req, res,)=>{
    req.logout();
    req.session.destroy();
    res.redirect('/');
  });
  
  
  module.exports = router;



