var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/',ensureAuthentication,function(req, res){
	res.render('index');
});

function ensureAuthentication(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('error','You are not loggin');
        res.redirect('/users/login');
    }
}
module.exports = router;