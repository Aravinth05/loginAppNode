var express = require('express');
var router = express.Router();
var passport=require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User=require('../models/user');
// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});


// Register post
router.post('/register', function(req, res){
	var name=req.body.name;
    var email=req.body.email;
    var username= req.body.username;
    var password=req.body.password;
    var password2= req.body.password2;
    
    //validation
    
    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('email','Wrong email').isEmail();
    req.checkBody('username','user Name is required').notEmpty();
    req.checkBody('password','Wrong Password').notEmpty();
    req.checkBody('password','Not same').equals(req.body.password);
    
    var errors=req.validationErrors();
    if(errors){
       res.render('register',{
           errors:errors
       });
    }else{
        var newUser= new User({
            name:name,
            email:email,
            username:username,
            password :password
        });
        
        User.createUser(newUser,function(err,user){
            if(err)throw err;
            console.log(user);
        });
        req.flash('success_msg','You are registerd and U can login');
        res.redirect('/users/login');
    }
});


/*passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username,function(err,user){
       if(err)throw err;
       if(!user){
           return done(null,false,{message:'Unknown UserName'});
    }
       
       User.comparePassword(password,user.password,function(err,isMatch){
           if(err)throw err;
           if(isMatch){
               return done(null,user);
           }
           else{
               return done(null,false,{message:'Invalid password'});
           }
       });
   });
      
  }));*/
passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));
router.post('/login', passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/users/login'
}),function (req, res) {
    res.redirect('/');

});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.get('/logout',function(req,res){

    req.logout();
    req.flash('success_msg','You are Logout');
    res.redirect('/users/login');
});

module.exports=router;